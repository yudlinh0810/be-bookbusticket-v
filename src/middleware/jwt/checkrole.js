const jwt = require('jsonwebtoken');

const checkRole = (requiredRole) => (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(403).json({ message: 'No token provide' });
  }
  const token = authHeader.split(' ')[1];

  jwt.verify(token, process.env.ACCESS_TOKEN, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token' });
    }

    if (user.role !== requiredRole) {
      return res.status(403).json({ message: 'Permission denied' });
    }

    req.user = user;
    next();
  });
};
module.exports = { checkRole };
