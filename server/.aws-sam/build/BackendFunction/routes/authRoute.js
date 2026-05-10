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
    if (!email || !password || !storeSlug) {
      throw new Error("Missing required fields");
    }
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      throw new Error("Invalid email format");
    }
    if (
      password.length < 7 ||
      !/[A-Z]/.test(password) ||
      !/\d/.test(password)
    ) {
      throw new Error("invalid password format");
    }
    //fetch storeId based on url
    const fetchedStore = await store.findOne({ storeSlug: storeSlug });
    if (!fetchedStore) {
      throw new Error("Store not found");
    }
    const storeId = fetchedStore._id;
    if (await Users.findOne({ email: email, storeId: storeId })) {
      throw new Error("email already exists");
    }
    otherData.role = "user";
    const saltrounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltrounds);
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
    if (error.message === "Missing required fields") {
      return res.json(
        sendRejectedResponse({
          code: "AUTH_MISSING_FIELDS",
          message: "Please fill in all required fields.",
        }),
      );
    }
    if (error.message === "Invalid email format") {
      return res.json(
        sendRejectedResponse({
          code: "AUTH_INVALID_EMAIL_FORMAT",
          message: "The email address format is invalid.",
        }),
      );
    }
    if (
      error.message === "email already exists" ||
      error.message === "invalid password format"
    ) {
      return res.json(
        sendRejectedResponse({
          code: "AUTH_INVALID_CREDENTIALS",
          message:
            "The information you entered is incorrect. Please try again.",
        }),
      );
    }
    if (error.message === "Store not found") {
      return res.json(
        sendRejectedResponse({
          code: "STORE_NOT_FOUND",
          message: "Store not found.",
        }),
      );
    }
    if (error.name === "ValidationError") {
      return res.json(
        sendRejectedResponse({
          code: "AUTH_VALIDATION_ERROR",
          message:
            "Could not create account. Please check your details and try again.",
        }),
      );
    }
    return res.json(sendRejectedResponse({ code: "INTERNAL_ERROR" }));
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
    const secretKey = process.env.SECRET_HASH_PASSWORD_PARAM;
    //checking correct password
    if (!(await bcrypt.compare(password, userData.hashedPassword))) {
      throw new Error("wrong password");
    }
    const token = jwt.sign(
      { userId: userData._id, role: userData.role, storeId: userData.storeId },
      secretKey,
      {
        expiresIn: "12h",
      },
    );
    res.cookie("loginToken", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 12 * 60 * 60 * 1000, //12 hours life of token cookie
      partitioned: true,
    });
    const { _id, createdAt, updatedAt, hashedPassword, __v, ...data } =
      userData.toObject();
    return res.status(200).json(
      sendSucessResponse({
        message: "logged in successfully",
        otherData: {
          userId: _id,
          ...data,
        },
      }),
    );
  } catch (error) {
    console.error(error);
    res.status(400);
    if (error.message === "no store found") {
      return res.json(
        sendRejectedResponse({
          code: "STORE_NOT_FOUND",
          message: "Store not found.",
        }),
      );
    }
    if (
      error.message === "no user found" ||
      error.message === "wrong password"
    ) {
      return res.json(
        sendRejectedResponse({
          code: "AUTH_INVALID_CREDENTIALS",
          message:
            "The email or password you entered is incorrect. Please try again.",
        }),
      );
    }
    return res.json(sendRejectedResponse({ code: "INTERNAL_ERROR" }));
  }
});

/**
 * function for routing for validating token
 */
router.get("/validate-token", authenticateToken, async (req, res) => {
  res
    .status(200)
    .json(sendSucessResponse({ message: "validated token successfully" }));
});

router.post("/logout", async (req, res) => {
  res.clearCookie("loginToken", { path: "/" });
  res.status(200).json(sendSucessResponse({ message: "Logged out" }));
});

module.exports = router;
