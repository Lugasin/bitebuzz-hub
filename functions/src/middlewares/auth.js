const { auth } = require('../config/firebase');

const verifyToken = async (req, res, next) => {
  console.log('verifyToken middleware called');
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    console.log('No token found');
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const token = authHeader.split('Bearer ')[1];

  try {
    console.log('Verifying token');
    const decodedToken = await auth.verifyIdToken(token);
    console.log('Token verified');
    req.decodedToken = decodedToken;
    next();
  } catch (error) {
    console.log('Token verification failed:', error);
    return res.status(401).json({ message: 'Unauthorized' });
  }
};

module.exports = verifyToken;