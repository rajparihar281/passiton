import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

export const authMiddleware = async (req, res, next) => {
  try {
    console.log('🔐 Auth middleware called');
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      console.log('❌ No token provided');
      return res.status(401).json({
        success: false,
        error: 'Authentication required',
      });
    }

    console.log('🔑 Token found, verifying...');
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    console.log('✅ User authenticated:', decoded.id);
    next();
  } catch (error) {
    console.log('❌ Auth error:', error.message);
    return res.status(401).json({
      success: false,
      error: 'Invalid or expired token',
    });
  }
};
