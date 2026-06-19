import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'villageshare_secret_key_12345';

export const authMiddleware = (req, res, next) => {
  // Get token from headers
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // Contains id, username, name
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};
