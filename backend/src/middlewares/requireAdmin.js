
function requireAdmin(req, res, next) {
  if (!req.user || req.user.role !== 'ADMIN') {
    return res.status(403).json({
      message: 'Accès réservé aux administrateurs.',
    });
  }

  next();
}

module.exports = { requireAdmin };
