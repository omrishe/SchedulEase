//server interaction
const express = require("express");
const auth = require("../Models/auth.js");

const router = express.Router();
const jwt = require("jsonwebtoken");

router.post("/signup", async (req, res) => {
  try {
    if (await auth.findOne({ email: req.body.email })) {
      throw new Error("email already exists");
    }
    const signupData = new auth(req.body);
    const savedDoc = await signupData.save(); //if the file failed saving it jumps to catch cause it threw an error
    const secretKey = process.env.JWT_SECRET;
    const token = jwt.sign({ userId: savedDoc.userId }, secret, {
      expiresIn: "12h",
    });
    res.status(201);
    res.json(token); //return the object that was saved as it appears in the db
  } catch (err) {
    if (err.name === "ValidationError") {
      res.status(400);
      return res.json({
        error: "couldnt save document to database-validation error",
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
    res.status(201);
    res.json(savedAppointment); //return the object that was saved as it appears in the db
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
