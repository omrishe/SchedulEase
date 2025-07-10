//server interaction
const express = require("express");
const auth = require("../Models/authModel.js");
const dotenv = require("dotenv").config();
const router = express.Router();
const jwt = require("jsonwebtoken"); //token creation and auth
const bcrypt = require("bcrypt"); //password hashing
const authenticateToken = require("../tokenauth/authenticateToken.js");
//signup request post
router.post("/signup", async (req, res) => {
  try {
    if (await auth.findOne({ email: req.body.email })) {
      throw new Error("email already exists");
    }
    const { email, password, ...otherData } = req.body;
    const saltrounds = 10; // move this into params file
    hashedPassword = await bcrypt.hash(password, saltrounds);
    const signupData = new auth({ email, hashedPassword, ...otherData });
    const savedDoc = await signupData.save(); //if the file failed saving it jumps to catch cause it threw an error
    res.status(201);
    res.json({ message: "created Successfully" }); //return the object that was saved as it appears in the db
  } catch (err) {
    if (err.name === "ValidationError") {
      res.status(400);
      return res.json({
        message: "couldnt save document to database-validation error",
        details: err.errors,
      });
    } else {
      res.status(400);
      console.log(
        "after serilize in authRoute in signup in server:",
        serilizeResponse(err)
      );
      res.json(serilizeResponse(err));
    }
  }
});
//first authenticate token then continue
router.post("/login", async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;
    const userData = await auth.findOne({ email: req.body.email });
    console.log(userData);
    if (!userData) {
      throw new Error("no user found");
    }
    //generate a new token for that specific user
    const secretKey = process.env.SECRET_HASH_PASSWORD;
    //checking correct password
    if (!(await bcrypt.compare(password, userData.hashedPassword))) {
      throw new Error("wrong password");
    }
    const token = jwt.sign({ userId: userData._id }, secretKey, {
      expiresIn: "12h",
    });
    res.cookie("loginToken", token, {
      httpOnly: true,
      secure: true,
      samesite: "None", //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!change this when deploying the server!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
      maxAge: 12 * 60 * 60 * 1000, //12 hours life of token cookie
    });
    res.status(200).json({
      userId: userData._id,
      userName: userData.name,
      message: "logged in successfully",
    }); //return the user ID
  } catch (err) {
    res.status(400).json(serilizeResponse(err));
  }
});
/**
 * function for routing for validating token
 */
router.get("/validateToken", authenticateToken, async (req, res) => {
  res.status(200).json({ message: "logged in successfully" });
});
router.post("/logout", async (req, res) => {
  res.clearCookie("loginToken", { path: "/" });
  res.status(200).json({ message: "Logged out" });
});
//function for returning the error in same consistant pattern
function serilizeResponse(error) {
  return {
    message: error.message,
    details: error.details,
    stack: error.stack,
  };
}
module.exports = router;
