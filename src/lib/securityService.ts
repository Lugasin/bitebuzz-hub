import { Request, Response } from 'express';
import { logger } from './logger';

interface RateLimitEntry {
  count: number;
  resetTime: number;
  blockedUntil?: number;
}

interface SecurityConfig {
  maxAttempts: number;
  windowMs: number;
  blockDuration: number;
  maxRequestsPerMinute: number;
}

export class SecurityService {
  private rateLimits: Map<string, RateLimitEntry>;
  private blockedIPs: Map<string, number>;
  private config: SecurityConfig;

  constructor() {
    this.rateLimits = new Map();
    this.blockedIPs = new Map();
    this.config = {
      maxAttempts: parseInt(process.env.MAX_LOGIN_ATTEMPTS || '5', 10),
      windowMs: parseInt(process.env.RATE_LIMIT_WINDOW || '900000', 10), // 15 minutes
      blockDuration: parseInt(process.env.IP_BLOCK_DURATION || '3600000', 10), // 1 hour
      maxRequestsPerMinute: parseInt(process.env.MAX_REQUESTS_PER_MINUTE || '60', 10)
    };
  }

  private isIPBlocked(ip: string): boolean {
    const blockedUntil = this.blockedIPs.get(ip);
    if (!blockedUntil) return false;

    if (Date.now() > blockedUntil) {
      this.blockedIPs.delete(ip);
      return false;
    }

    return true;
  }

  private blockIP(ip: string): void {
    const blockUntil = Date.now() + this.config.blockDuration;
    this.blockedIPs.set(ip, blockUntil);
    logger.warn(`IP ${ip} blocked until ${new Date(blockUntil).toISOString()}`);
  }

  checkRateLimit(ip: string): { allowed: boolean; resetTime?: number } {
    if (this.isIPBlocked(ip)) {
      return { allowed: false, resetTime: this.blockedIPs.get(ip) };
    }

    const now = Date.now();
    const entry = this.rateLimits.get(ip);

    if (!entry || now > entry.resetTime) {
      this.rateLimits.set(ip, {
        count: 1,
        resetTime: now + this.config.windowMs
      });
      return { allowed: true };
    }

    if (entry.count >= this.config.maxAttempts) {
      this.blockIP(ip);
      return { allowed: false, resetTime: entry.resetTime };
    }

    entry.count++;
    this.rateLimits.set(ip, entry);
    return { allowed: true };
  }

  handleError(error: Error, context: string): void {
    logger.error(`Security error in ${context}:`, {
      error: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString()
    });
  }

  logSecurityEvent(event: string, details: Record<string, any>): void {
    logger.info(`Security event: ${event}`, {
      ...details,
      timestamp: new Date().toISOString()
    });
  }

  validateRequest(req: Request): { valid: boolean; error?: string } {
    // Check for common attack patterns
    if (req.headers['x-forwarded-for']) {
      return { valid: false, error: 'Direct access required' };
    }

    // Validate content type for POST requests
    if (req.method === 'POST' && !req.is('application/json')) {
      return { valid: false, error: 'Invalid content type' };
    }

    // Check for suspicious headers
    const suspiciousHeaders = ['x-requested-with', 'x-csrf-token'];
    for (const header of suspiciousHeaders) {
      if (req.headers[header]) {
        return { valid: false, error: 'Suspicious header detected' };
      }
    }

    return { valid: true };
  }

  sanitizeInput(input: string): string {
    // Remove potentially dangerous characters
    return input.replace(/[<>'"]/g, '');
  }

  generateCSRFToken(): string {
    return require('crypto').randomBytes(32).toString('hex');
  }

  validateCSRFToken(req: Request, token: string): boolean {
    const csrfToken = req.headers['x-csrf-token'];
    return csrfToken === token;
  }

  cleanup(): void {
    const now = Date.now();
    
    // Clean up expired rate limits
    for (const [ip, entry] of this.rateLimits.entries()) {
      if (now > entry.resetTime) {
        this.rateLimits.delete(ip);
      }
    }

    // Clean up expired IP blocks
    for (const [ip, blockUntil] of this.blockedIPs.entries()) {
      if (now > blockUntil) {
        this.blockedIPs.delete(ip);
      }
    }
  }
}

// Initialize cleanup interval
const securityService = new SecurityService();
setInterval(() => securityService.cleanup(), 60000); // Clean up every minute

export { securityService }; 