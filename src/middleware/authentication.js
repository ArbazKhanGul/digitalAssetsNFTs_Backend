const jwt = require('jsonwebtoken');
const User = require('../database/user'); // Adjust the path as necessary

// Middleware to authenticate user based on JWT
exports.authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  console.log("🚀 ~ exports.authenticate= ~ authHeader:", authHeader)
  if (authHeader) {
    const token = authHeader.split(' ')[1];

    try {
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
      console.log("🚀 ~ exports.authenticate= ~ decodedToken:", decodedToken)
      const user = await User.findById(decodedToken._id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      console.log("🚀 ~ exports.authenticate= ~ user:", user)
       
      req.user = user;
      req.session.user=user;
      next();
    } catch (error) {
      return res.status(403).json({ message: 'Invalid token' });
    }
  } else {
    return res.status(401).json({ message: 'Not authorized' });
  }
};

// Middleware to authenticate admin based on JWT
exports.adminAuthenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(' ')[1];

    try {
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decodedToken._id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      if (user.role === 'admin') {
        req.user = user;
        req.session.user=user;
        next();
      } else {
        return res.status(403).json({ message: 'Not authorized as admin' });
      }
    } catch (error) {
      return res.status(403).json({ message: 'Invalid token' });
    }
  } else {
    return res.status(401).json({ message: 'Not authorized' });
  }
};
