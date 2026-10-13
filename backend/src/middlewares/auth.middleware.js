const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
const authHeader = req.headers.authorization;

if (!authHeader || !authHeader.startsWith('Bearer ')) {
return res.status(401).json({
message: 'Authentification requise.',
});
}

const token = authHeader.slice(7);

try {
const decoded = jwt.verify(token, process.env.JWT_SECRET);


req.user = {
  id: decoded.userId,
  role: decoded.role,
};

next();


} catch (error) {
return res.status(401).json({
message: 'Token invalide ou expiré.',
});
}
}

module.exports = { authenticateToken };
