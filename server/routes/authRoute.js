//server interaction
const express = require("express");
const auth = require("../Models/authModel.js");
const dotenv = require("dotenv").config();
const router = express.Router();
const jwt = require("jsonwebtoken"); //token creation and auth
const bcrypt = require("bcrypt"); //password hashing

//signup request post
router.post("/signup", async (req, res) => {
  try {
    if (await auth.findOne({ email: req.body.email })) {
      throw new Error("email already exists");
    }
    const { email, password } = req.body;
    const saltrounds = 10; // move this into params file
    hashedPassword = await bcrypt.hash(password, saltrounds);
    const signupData = new auth({ email, hashedPassword });
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

router.post("/login", async (req, res) => {
  try {
    email = req.body.email;
    password = req.body.password;
    const userData = await auth.findOne({ email: req.body.email });
    if (!userData) {
      throw new Error("no user found");
    }
    const secretKey = process.env.SECRET_HASH_PASSWORD;
    const token = jwt.sign({ userId: userData._id }, secretKey, {
      expiresIn: "12h",
    });
    res
      .status(200)
      .json({
        token: token,
        userId: userData._id,
        message: "logged in successfully",
      }); //return the object that was saved as it appears in the db
  } catch (err) {
    /**console.log(
      "after serilize in authRoute in logIn in server:",
      serilizeResponse(err)
    );
    **/
    res.status(400).json(serilizeResponse(err));
  }
});

function serilizeResponse(error) {
  return {
    message: error.message,
    details: error.details,
    stack: error.stack,
  };
}
module.exports = router;
