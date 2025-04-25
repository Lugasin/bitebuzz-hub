import config from './config';
import * as Sentry from '@sentry/react';
import { v4 as uuidv4 } from 'uuid';

interface RateLimitState {
  count: number;
  resetTime: number;
}

class SecurityService {
  private rateLimitMap: Map<string, RateLimitState> = new Map();

  constructor() {
    // Initialize Sentry
    if (config.monitoring.sentryDsn) {
      Sentry.init({
        dsn: config.monitoring.sentryDsn,
        environment: import.meta.env.MODE,
        tracesSampleRate: 1.0,
      });
    }
  }

  // Input validation
  validateInput(data: any, schema: Record<string, any>): { isValid: boolean; errors?: string[] } {
    const errors: string[] = [];

    for (const [key, rules] of Object.entries(schema)) {
      if (rules.required && !data[key]) {
        errors.push(`${key} is required`);
        continue;
      }

      if (data[key]) {
        if (rules.type && typeof data[key] !== rules.type) {
          errors.push(`${key} must be of type ${rules.type}`);
        }

        if (rules.pattern && !rules.pattern.test(data[key])) {
          errors.push(`${key} does not match the required pattern`);
        }

        if (rules.minLength && data[key].length < rules.minLength) {
          errors.push(`${key} must be at least ${rules.minLength} characters`);
        }

        if (rules.maxLength && data[key].length > rules.maxLength) {
          errors.push(`${key} must not exceed ${rules.maxLength} characters`);
        }
      }
    }

    return {
      isValid: errors.length === 0,
      errors: errors.length > 0 ? errors : undefined
    };
  }

  // Rate limiting
  checkRateLimit(identifier: string): { allowed: boolean; remaining: number; resetTime: number } {
    const now = Date.now();
    const state = this.rateLimitMap.get(identifier) || {
      count: 0,
      resetTime: now + config.security.rateLimit.windowMs
    };

    if (now > state.resetTime) {
      state.count = 0;
      state.resetTime = now + config.security.rateLimit.windowMs;
    }

    state.count++;

    this.rateLimitMap.set(identifier, state);

    return {
      allowed: state.count <= config.security.rateLimit.maxRequests,
      remaining: Math.max(0, config.security.rateLimit.maxRequests - state.count),
      resetTime: state.resetTime
    };
  }

  // Logging
  log(level: 'debug' | 'info' | 'warn' | 'error', message: string, data?: any) {
    const logLevel = config.monitoring.loggingLevel;
    const levels = ['debug', 'info', 'warn', 'error'];
    
    if (levels.indexOf(level) >= levels.indexOf(logLevel)) {
      const logEntry = {
        timestamp: new Date().toISOString(),
        level,
        message,
        data,
        traceId: uuidv4()
      };

      // Console logging
      console[level](JSON.stringify(logEntry, null, 2));

      // Sentry logging for errors
      if (level === 'error' && config.monitoring.sentryDsn) {
        Sentry.captureException(new Error(message), {
          extra: data
        });
      }
    }
  }

  // Request tracking
  trackRequest(req: any, res: any, next: () => void) {
    const startTime = Date.now();
    const requestId = uuidv4();

    // Log request start
    this.log('info', 'Request started', {
      requestId,
      method: req.method,
      path: req.path,
      ip: req.ip
    });

    // Add request ID to response
    res.setHeader('X-Request-ID', requestId);

    // Track response time
    res.on('finish', () => {
      const duration = Date.now() - startTime;
      this.log('info', 'Request completed', {
        requestId,
        status: res.statusCode,
        duration
      });
    });

    next();
  }

  // Error handling
  handleError(error: Error, context?: string) {
    this.log('error', error.message, {
      context,
      stack: error.stack
    });

    if (config.monitoring.sentryDsn) {
      Sentry.captureException(error, {
        tags: { context }
      });
    }
  }
}

export const securityService = new SecurityService(); 