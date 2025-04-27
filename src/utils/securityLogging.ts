import { dbPool } from '../db';
import { v4 as uuidv4 } from 'uuid';

export enum LogLevel {
  INFO = 'INFO',
  WARNING = 'WARNING',
  ERROR = 'ERROR',
  CRITICAL = 'CRITICAL',
}

export enum LogCategory {
  AUTHENTICATION = 'AUTHENTICATION',
  AUTHORIZATION = 'AUTHORIZATION',
  PAYMENT = 'PAYMENT',
  ORDER = 'ORDER',
  SYSTEM = 'SYSTEM',
  SECURITY = 'SECURITY',
}

interface LogEntry {
  id: string;
  timestamp: Date;
  level: LogLevel;
  category: LogCategory;
  userId?: string;
  action: string;
  details: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
}

class SecurityLogger {
  private static instance: SecurityLogger;
  private readonly tableName = 'security_logs';

  private constructor() {}

  static getInstance(): SecurityLogger {
    if (!SecurityLogger.instance) {
      SecurityLogger.instance = new SecurityLogger();
    }
    return SecurityLogger.instance;
  }

  async log(
    level: LogLevel,
    category: LogCategory,
    action: string,
    details: Record<string, any>,
    userId?: string,
    ipAddress?: string,
    userAgent?: string
  ): Promise<void> {
    const logEntry: LogEntry = {
      id: uuidv4(),
      timestamp: new Date(),
      level,
      category,
      userId,
      action,
      details,
      ipAddress,
      userAgent,
    };

    try {
      await dbPool.query(
        `INSERT INTO ${this.tableName} 
        (id, timestamp, level, category, user_id, action, details, ip_address, user_agent)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          logEntry.id,
          logEntry.timestamp,
          logEntry.level,
          logEntry.category,
          logEntry.userId,
          logEntry.action,
          JSON.stringify(logEntry.details),
          logEntry.ipAddress,
          logEntry.userAgent,
        ]
      );
    } catch (error) {
      console.error('Failed to write security log:', error);
      // Fallback to console logging if database write fails
      console.log('Security Log:', logEntry);
    }
  }

  async getLogs(
    filters: {
      level?: LogLevel;
      category?: LogCategory;
      userId?: string;
      startDate?: Date;
      endDate?: Date;
    } = {},
    limit = 100,
    offset = 0
  ): Promise<LogEntry[]> {
    const conditions: string[] = [];
    const params: any[] = [];

    if (filters.level) {
      conditions.push('level = ?');
      params.push(filters.level);
    }

    if (filters.category) {
      conditions.push('category = ?');
      params.push(filters.category);
    }

    if (filters.userId) {
      conditions.push('user_id = ?');
      params.push(filters.userId);
    }

    if (filters.startDate) {
      conditions.push('timestamp >= ?');
      params.push(filters.startDate);
    }

    if (filters.endDate) {
      conditions.push('timestamp <= ?');
      params.push(filters.endDate);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    const [logs] = await dbPool.query(
      `SELECT * FROM ${this.tableName} 
       ${whereClause}
       ORDER BY timestamp DESC
       LIMIT ? OFFSET ?`,
      [...params, limit, offset]
    );

    return logs.map((log: any) => ({
      ...log,
      details: JSON.parse(log.details),
    }));
  }
}

// Example usage:
/*
const logger = SecurityLogger.getInstance();

// Log a security event
await logger.log(
  LogLevel.INFO,
  LogCategory.AUTHENTICATION,
  'User login',
  { success: true },
  'user123',
  '192.168.1.1',
  'Mozilla/5.0...'
);

// Query logs
const logs = await logger.getLogs({
  category: LogCategory.AUTHENTICATION,
  startDate: new Date('2024-01-01'),
}, 50, 0);
*/ 