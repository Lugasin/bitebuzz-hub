import crypto from 'crypto';
import config from './config';

interface JwtPayload {
  [key: string]: any;
  exp?: number;
  iat?: number;
  sub?: string; // Subject (user ID)
  iss?: string; // Issuer
  aud?: string; // Audience
  jti?: string; // JWT ID for revocation
}

class JwtService {
  private readonly secret: string;
  private readonly algorithm = 'HS256';
  private readonly expiresIn: string;
  private readonly issuer: string;
  private readonly audience: string;
  private readonly revokedTokens: Set<string> = new Set();
  private readonly tokenRotationInterval: number;

  constructor() {
    // These should come from backend environment variables
    this.secret = process.env.JWT_SECRET || '';
    this.expiresIn = process.env.JWT_EXPIRES_IN || '15m';
    this.issuer = process.env.JWT_ISSUER || 'e-eats';
    this.audience = process.env.JWT_AUDIENCE || 'e-eats-users';
    this.tokenRotationInterval = parseInt(process.env.TOKEN_ROTATION_INTERVAL || '3600', 10); // 1 hour in seconds

    if (!this.secret) {
      throw new Error('JWT secret is not configured');
    }
  }

  private base64UrlEncode(str: string): string {
    return Buffer.from(str)
      .toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '');
  }

  private base64UrlDecode(str: string): string {
    str = str.replace(/-/g, '+').replace(/_/g, '/');
    const padding = str.length % 4;
    if (padding) {
      str += '='.repeat(4 - padding);
    }
    return Buffer.from(str, 'base64').toString();
  }

  private createSignature(header: string, payload: string): string {
    const hmac = crypto.createHmac('sha256', this.secret);
    hmac.update(`${header}.${payload}`);
    return this.base64UrlEncode(hmac.digest('base64'));
  }

  private parseExpiresIn(expiresIn: string): number {
    const unit = expiresIn.slice(-1);
    const value = parseInt(expiresIn.slice(0, -1), 10);

    switch (unit) {
      case 's': return value * 1000;
      case 'm': return value * 60 * 1000;
      case 'h': return value * 60 * 60 * 1000;
      case 'd': return value * 24 * 60 * 60 * 1000;
      default: return 24 * 60 * 60 * 1000; // Default to 24 hours
    }
  }

  private generateJti(): string {
    return crypto.randomBytes(16).toString('hex');
  }

  revokeToken(jti: string): void {
    this.revokedTokens.add(jti);
  }

  isTokenRevoked(jti: string): boolean {
    return this.revokedTokens.has(jti);
  }

  shouldRotateToken(iat: number): boolean {
    const now = Math.floor(Date.now() / 1000);
    return (now - iat) >= this.tokenRotationInterval;
  }

  generateToken(payload: JwtPayload, expiresIn: string = this.expiresIn): string {
    const header = {
      alg: this.algorithm,
      typ: 'JWT'
    };

    const now = Date.now();
    const exp = now + this.parseExpiresIn(expiresIn);
    const jti = this.generateJti();

    const tokenPayload = {
      ...payload,
      iat: Math.floor(now / 1000),
      exp: Math.floor(exp / 1000),
      iss: this.issuer,
      aud: this.audience,
      jti
    };

    const encodedHeader = this.base64UrlEncode(JSON.stringify(header));
    const encodedPayload = this.base64UrlEncode(JSON.stringify(tokenPayload));
    const signature = this.createSignature(encodedHeader, encodedPayload);

    return `${encodedHeader}.${encodedPayload}.${signature}`;
  }

  verifyToken(token: string): { isValid: boolean; payload?: JwtPayload; error?: string } {
    try {
      const [encodedHeader, encodedPayload, signature] = token.split('.');
      
      if (!encodedHeader || !encodedPayload || !signature) {
        return { isValid: false, error: 'Invalid token format' };
      }

      const expectedSignature = this.createSignature(encodedHeader, encodedPayload);
      if (signature !== expectedSignature) {
        return { isValid: false, error: 'Invalid signature' };
      }

      const payload = JSON.parse(this.base64UrlDecode(encodedPayload));
      
      // Check if token is revoked
      if (payload.jti && this.isTokenRevoked(payload.jti)) {
        return { isValid: false, error: 'Token has been revoked' };
      }

      // Verify token claims
      if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
        return { isValid: false, error: 'Token expired' };
      }

      if (payload.iss !== this.issuer) {
        return { isValid: false, error: 'Invalid issuer' };
      }

      if (payload.aud !== this.audience) {
        return { isValid: false, error: 'Invalid audience' };
      }

      // Check if token needs rotation
      if (payload.iat && this.shouldRotateToken(payload.iat)) {
        return { 
          isValid: true, 
          payload,
          error: 'Token needs rotation'
        };
      }

      return { isValid: true, payload };
    } catch (error) {
      return { isValid: false, error: 'Invalid token' };
    }
  }

  decodeToken(token: string): JwtPayload | null {
    try {
      const [, encodedPayload] = token.split('.');
      if (!encodedPayload) return null;
      
      return JSON.parse(this.base64UrlDecode(encodedPayload));
    } catch (error) {
      return null;
    }
  }
}

export const jwtService = new JwtService(); 