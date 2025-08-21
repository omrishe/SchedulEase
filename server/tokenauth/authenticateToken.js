const jwt = require("jsonwebtoken");
const { sendRejectedResponse } = require("../utils/responseHandler.js");

function authenticateToken(req, res, next) {
  const token = req.cookies.loginToken;
  if (!token) {
    return res.status(401).json(
      sendRejectedResponse({
        message: "No token provided",
      })
    );
  }
  try {
    const secretKey = process.env.SECRET_HASH_PASSWORD;
    const decoded = jwt.verify(token, secretKey);
    req.user = decoded; // adds user field which is the decoded token=userID
    next(); // Authenticated successfully -continue
  } catch (error) {
    return res
      .status(403)
      .json(sendRejectedResponse({ message: "Invalid token" }));
  }
}
module.exports = authenticateToken;
