const jwt = require("jsonwebtoken");

function auth(req, res, next) {
  const jwtToken = req.cookies[process.env.JWT_NAME];
  if (!jwtToken) {
    return res
      .status(401)
      .json({ message: "Non autorisé", authenticated: false });
  }
  jwt.verify(jwtToken, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res
        .status(401)
        .json({ message: "Non autorisé", authenticated: false });
    }
    const decodedToken = decoded;
    const userId = decodedToken.userId;
    req.auth = { userId };
    next();
  });
}

module.exports = auth;
