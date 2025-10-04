//server interaction
const express = require("express");
const Users = require("../Models/userModel.js");
const dotenv = require("dotenv").config(); //do not remove!,loads .env and sets it in process.env
const router = express.Router();
const jwt = require("jsonwebtoken"); //token creation and auth
const bcrypt = require("bcrypt"); //password hashing
const { authenticateToken } = require("../middlewares/middlewares.js");
const store = require("../Models/storeModel.js");
const {
  sendSucessResponse,
  sendRejectedResponse,
} = require("../utils/responseHandler.js");

//signup request post
router.post("/signup", async (req, res) => {
  try {
    const { email, password, storeSlug, ...otherData } = req.body;
    //fetch storeId based on url
    const fetchedStore = await store.findOne({ storeSlug: storeSlug });
    storeId = fetchedStore._id;
    if (await Users.findOne({ email: email, _id: storeId })) {
      throw new Error("email already exists");
    }
    otherData.role = "user";
    const saltrounds = 10; // move this into params file
    hashedPassword = await bcrypt.hash(password, saltrounds);
    const signupData = new Users({
      email,
      storeId: storeId,
      hashedPassword,
      ...otherData,
    });
    await signupData.save(); //if the file failed saving it jumps to catch cause it threw an error
    res
      .status(201)
      .json(sendSucessResponse({ message: "created Successfully" }));
    //return the object that was saved as it appears in the db
  } catch (error) {
    res.status(400);
    console.error("an error has occured", error);
    if (error.message === "email already exists") {
      return res.json(
        sendRejectedResponse({ message: "email already exists" })
      );
    }
    if (error.name === "ValidationError") {
      return res.json(
        sendRejectedResponse({ message: "couldnt save document to database" })
      );
    }
    return res.json(sendRejectedResponse());
  }
});

//first authenticate token then continue
router.post("/login", async (req, res) => {
  try {
    const password = req.body.password;
    const storeData = await store.findOne({ storeSlug: req.body.slug });
    if (!storeData) {
      throw new Error("no store found");
    }
    const userData = await Users.findOne({
      email: req.body.email,
      storeId: storeData._id,
    });
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
      samesite: "None",
      maxAge: 12 * 60 * 60 * 1000, //12 hours life of token cookie
    });
    const { _id, name, createdAt, updatedAt, hashedPassword, __v, ...data } =
      userData.toObject();
    return res.status(200).json(
      sendSucessResponse({
        message: "logged in successfully",
        otherData: {
          userId: _id,
          userName: name,
          ...data,
        },
      })
    );
  } catch (error) {
    console.error(error);
    res.status(400);
    if (error.message === "no store found") {
      return res.json(sendRejectedResponse({ message: "no store found" }));
    }
    if (error.message === "no user found") {
      return res.json(sendRejectedResponse({ message: "no user found" }));
    }
    if (error.message === "wrong password") {
      return res.json(sendRejectedResponse({ message: "wrong password" }));
    }
    return res.json(sendRejectedResponse());
  }
});

/**
 * function for routing for validating token
 */
router.get("/validateToken", authenticateToken, async (req, res) => {
  res
    .status(200)
    .json(sendSucessResponse({ message: "logged in successfully" }));
});

router.post("/logout", async (req, res) => {
  res.clearCookie("loginToken", { path: "/" });
  res.status(200).json(sendSucessResponse({ message: "Logged out" }));
});

module.exports = router;
