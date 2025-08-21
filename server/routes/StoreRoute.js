const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const store = require("../Models/storeModel.js");
const authenticateToken = require("../tokenauth/authenticateToken.js");
const StoreTimeSlot = require("../Models/storeTimeSlotsModel.js");
const user = require("../Models/userModel.js");
const {
  sendSucessResponse,
  sendRejectedResponse,
} = require("../utils/responseHandler.js");

router.get("/getStoreInfo", authenticateToken, async (req, res) => {
  try {
    const StoreData = await store.findById(req.body.storeID);
    if (!StoreData) {
      throw new Error("no such store exists");
    }
    res.status(200);
    return res.json(
      sendSucessResponse({
        message: "store retrieved successfully",
        otherData: StoreData,
      })
    );
  } catch (error) {
    console.error("error while trying to handle store data see log", error);
    res.status(400);
    if (error.message === "no such store exists") {
      return res.json(
        sendRejectedResponse({ message: "no such store exists" })
      );
    }
    return res.json(sendRejectedResponse({}));
  }
});

router.post("/new", authenticateToken, async (req, res) => {
  try {
    const newStore = new store(req.body);
    const savedStore = (await newStore.save()).toJSON();
    res.status(200);
    res.json(
      sendSucessResponse({
        message: "store successfully saved",
        otherData: savedStore,
      })
    );
  } catch (error) {
    console.error("an error occured while trying to save store data", error);
    res.status(400);
    res.json(
      sendRejectedResponse({
        message: "an error occured while trying to save store data",
      })
    );
  }
});

router.post("/new-store-time-slots", authenticateToken, async (req, res) => {
  try {
    const { dates, _id } = req.body;
    const slotsArr = dates.map((slot) => {
      return { date: new Date(slot), storeID: _id };
    });
    let response;
    try {
      response = await StoreTimeSlot.insertMany(slotsArr, { ordered: false });
    } catch (error) {
      if (error.code !== 11000) {
        //error code 11000 is duplicate document (it will just not save that doc),so we ignore it and let the code keep running
        throw error;
      }
    }
    res.status(200);
    res.json(sendSucessResponse({ message: "added successfully" }));
  } catch (error) {
    console.error("error while trying to save store time slots see log", error);
    res.status(400);
    res.json(
      sendRejectedResponse({
        message: "an error have occured,see logs for more info",
      })
    );
  }
});
router.post("/set-new-store-services", authenticateToken, async (req, res) => {
  try {
    const { authData, formData } = req.body;
    const userData = user.findById(authData._id);
    if (userData.role != "admin") {
      throw new Error("invalid auth");
    }
    const adminStore = store.findById(userData.storeID);
    adminStore.services.push(formData);
    await adminStore.save();
    res.status(200);
    res.json(sendSucessResponse({ message: "added successfully" }));
  } catch (error) {
    console.error("error while trying to save store time slots see log", error);
    res.status(400);
    res.json(
      sendRejectedResponse({
        message: "an error have occured,see logs for more info",
      })
    );
  }
});
module.exports = router;
