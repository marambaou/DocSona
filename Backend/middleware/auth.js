import jwt from 'jsonwebtoken';
import Doctor from '../models/Doctor.js';

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || '5673452715uiehyfsibheygdikabtye6');
    const doctor = await Doctor.findById(decoded.id).select('-password');
    
    if (!doctor) {
      return res.status(401).json({ message: 'Token is not valid' });
    }

    req.doctor = doctor;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

export default authMiddleware;