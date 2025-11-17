const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const { sendRejectedResponse } = require("../utils/responseHandler.js");
const User = require("../Models/userModel.js");

function authenticateToken(req, res, next) {
  const token = req.cookies.loginToken;
  if (!token) {
    return res.status(401).json(
      sendRejectedResponse({
        type: "loginRequired",
        message: "User is not logged in",
        code: "AUTH_REQUIRED",
      })
    );
  }
  try {
    const secretKey = process.env.SECRET_HASH_PASSWORD;
    if (!secretKey) {
      return res
        .status(500)
        .json(
          sendRejectedResponse({ message: "JWT secret key not configured" })
        );
    }
    const decoded = jwt.verify(token, secretKey);
    req.user = decoded;
    next(); // Authenticated successfully -continue
  } catch (error) {
    console.error("user not authenticated");
    return res
      .status(403)
      .json(sendRejectedResponse({ message: "Invalid token" }));
  }
}

async function requireAdmin(req, res, next) {
  try {
    const { userId, role, storeId } = req.user;
    //check if role in cookie fits to prevent db lookup(for less overhead access to database and performance)
    if (role === "user") {
      throw new Error("invalid auth");
    }
    //for security(incase user gets demoted before token expires) we cross check with database
    const userData = await User.findById(userId);
    if (!userData) {
      throw new Error("user Does not exist");
    }
    const userRole = userData.role;
    if (userRole !== "admin" && userRole !== "superAdmin") {
      throw new Error("invalid auth");
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

//function to handle requests made when db isnt connected
//this function is very lightweight... it might run on every event but its negligible
function isDatabaseConnected(req, res, next) {
  if (mongoose.connection.readyState !== 1) {
    // 1 = connected
    return res
      .status(503)
      .json(sendRejectedResponse({ message: "Database not ready yet" }));
  }
  next();
}

module.exports = { authenticateToken, requireAdmin, isDatabaseConnected };
