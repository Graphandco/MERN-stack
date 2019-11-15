const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = function(req, res, next) {
  //Récupère token du header
  const token = req.header('x-auth-token');

  //Vérifie si pas de token
  if (!token) {
    return res.status(401).json({ msg: 'Pas de token, autorisation refusée' });
  }

  //Vérifie token
  try {
    const decoded = jwt.verify(token, config.get('jwtSecret'));

    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token non valide' });
  }
};
