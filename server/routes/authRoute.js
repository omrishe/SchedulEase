//server interaction
const express = require("express");
const auth = require("../Models/authModel.js");
const dotenv = require("dotenv");
const router = express.Router();
const jwt = require("jsonwebtoken"); //token creation and auth
const bcrypt = require("bcrypt"); //password hashing

//signup request post
router.post("/signup", async (req, res) => {
  try {
    if (await auth.findOne({ email: req.body.email })) {
      throw new Error("email already exists");
    }
    console.log(req.body);
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
      res.json({ error: err.message });
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
    const secretKey = process.env.JWT_SECRET;
    const token = jwt.sign({ userId: userData._id }, secretKey, {
      expiresIn: "12h",
    });
    res.status(200);
    res.json(token); //return the object that was saved as it appears in the db
  } catch (err) {
    if (err.name === "ValidationError") {
      res.status(400);
      return res.json({ error: "Validation Error", details: err.errors });
    } else {
      res.status(400);
      res.json({ error: err.message });
    }
  }
});
module.exports = router;
