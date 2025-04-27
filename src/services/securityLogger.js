import logger from '../utils/logger.js';

class SecurityLogger {
  static async logSecurityEvent(userId, action, status, details = {}) {
    try {
      // Log to database
      await pool.query(
        `INSERT INTO security_logs 
        (user_id, action, ip_address, user_agent, status, details) 
        VALUES (?, ?, ?, ?, ?, ?)`,
        [
          userId,
          action,
          details.ipAddress,
          details.userAgent,
          status,
          JSON.stringify(details)
        ]
      );

      // Log to Winston
      const logMessage = `Security Event: ${action} - User: ${userId} - Status: ${status}`;
      if (status === 'success') {
        logger.info(logMessage, details);
      } else {
        logger.warn(logMessage, details);
      }
    } catch (error) {
      logger.error('Error logging security event:', error);
    }
  }

  static async logLoginAttempt(userId, success, details = {}) {
    await this.logSecurityEvent(
      userId,
      'login_attempt',
      success ? 'success' : 'failed',
      details
    );
  }

  static async logPasswordChange(userId, details = {}) {
    await this.logSecurityEvent(
      userId,
      'password_change',
      'success',
      details
    );
  }

  static async logAccountLock(userId, details = {}) {
    await this.logSecurityEvent(
      userId,
      'account_lock',
      'warning',
      details
    );
  }

  static async logTokenRefresh(userId, details = {}) {
    await this.logSecurityEvent(
      userId,
      'token_refresh',
      'success',
      details
    );
  }

  static async logSensitiveOperation(userId, operation, details = {}) {
    await this.logSecurityEvent(
      userId,
      operation,
      'info',
      details
    );
  }

  static async getSecurityLogs(userId, limit = 100) {
    try {
      const [logs] = await pool.query(
        `SELECT * FROM security_logs 
        WHERE user_id = ? 
        ORDER BY created_at DESC 
        LIMIT ?`,
        [userId, limit]
      );
      return logs;
    } catch (error) {
      logger.error('Error fetching security logs:', error);
      throw error;
    }
  }
}

export default SecurityLogger; 