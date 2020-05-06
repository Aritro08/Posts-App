const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    //token is sent as 'Bearer <token>'
    const token = req.headers.auth.split(' ')[1];
    const decodedToken = jwt.verify(token, 'secret');
    req.userData = { email: decodedToken.email, userId: decodedToken.id };
    next();
  } catch (error) {
    res.status(401).json({
      message: 'Auth failed'
    });
  }
}
