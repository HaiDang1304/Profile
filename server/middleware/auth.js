const jwt = require('jsonwebtoken');

function requireAdmin(req, res, next) {
  const token = req.headers.authorization?.replace(/^Bearer\s+/i, '');
  if (!token) return res.status(401).json({ error: 'Bạn chưa đăng nhập.' });
  try {
    req.admin = jwt.verify(token, process.env.JWT_SECRET || 'local-xampp-development-secret');
    return next();
  } catch {
    return res.status(401).json({ error: 'Phiên đăng nhập đã hết hạn.' });
  }
}

module.exports = { requireAdmin };
