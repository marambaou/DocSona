const jwt = require('jsonwebtoken');
const User = require('../Models/user');

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET || '5673452715uiehyfsibheygdikabtye6');
    const user = await User.findById(decoded.userId).select('-password');
    if (!user || user.role !== 'Doctor') {
      return res.status(401).json({ message: 'Not authorized as doctor' });
    }
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

module.exports = authMiddleware;