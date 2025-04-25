import AuthService from '../services/authService.js';

export const authenticate = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'Authentication token required' });
    }

    const decoded = await AuthService.verifyToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};

export const authorize = (requiredPermission) => {
  return async (req, res, next) => {
    try {
      const hasPermission = await AuthService.checkPermission(
        req.user.userId,
        requiredPermission
      );

      if (!hasPermission) {
        return res.status(403).json({ error: 'Insufficient permissions' });
      }

      next();
    } catch (error) {
      return res.status(403).json({ error: 'Permission check failed' });
    }
  };
};

export const logActivity = async (req, res, next) => {
  try {
    const action = `${req.method} ${req.path}`;
    const details = JSON.stringify({
      params: req.params,
      query: req.query,
      body: req.body
    });
    const ipAddress = req.ip;

    await AuthService.logActivity(
      req.user?.userId,
      action,
      details,
      ipAddress
    );

    next();
  } catch (error) {
    console.error('Error logging activity:', error);
    next();
  }
}; 