const jwt = require("jsonwebtoken");

function authenticateToken(req, res, next) {
  const token = req.cookies.loginToken;
  if (!token) {
    return res.status(401).json({ error: "No token provided" });
  }

  try {
    const secretKey = process.env.SECRET_HASH_PASSWORD;
    const decoded = jwt.verify(token, secretKey);
    req.user = decoded; // adds user field which is the decoded token=userID
    next(); // Authenticated successfully -continue
  } catch (err) {
    return res.status(403).json({ error: "Invalid token" });
  }
}
module.exports = authenticateToken;
