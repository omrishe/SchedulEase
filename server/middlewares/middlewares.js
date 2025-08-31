const jwt = require("jsonwebtoken");
const { sendRejectedResponse } = require("../utils/responseHandler.js");
const User = require("../Models/userModel.js");

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

async function requireAdmin(req, res, next) {
  try {
    const userId = req.user.userId;
    const userData = await User.findById(userId);
    if (!userData) {
      throw new Error(sendRejectedResponse({ message: "user Does not exist" }));
    }
    const userRole = userData.role;
    console.log("userRole is\n", userRole);
    if (userRole !== "admin" && userRole !== "superAdmin") {
      throw new Error(sendRejectedResponse({ message: "invalid auth" }));
    }
    next(); //user is authorized, move to next handler
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json(
        sendRejectedResponse({ message: "Server error in auth middleware" })
      );
  }
}

module.exports = { authenticateToken, requireAdmin };
