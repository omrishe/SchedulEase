const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const storeModel = require("../Models/storeModel.js");
const authenticateToken = require("../tokenauth/authenticateToken.js");
const StoreTimeSlot = require("../Models/storeTimeSlotsModel.js");

router.get("/getStoreInfo", authenticateToken, async (req, res) => {
  try {
    const StoreData = await storeModel.findById(req.body.storeID);
    if (!StoreData) {
      throw new Error("no Such Store exists");
    }
    res.status(200);
    return res.json(StoreData);
  } catch (err) {
    console.error("error while trying to handle store data see log", err);
    res.status(400);
    res.json("error while trying to handle store data see log", err);
  }
});

router.post("/new", authenticateToken, async (req, res) => {
  try {
    const newStore = new storeModel(req.body);
    const savedStore = (await newStore.save()).toJSON();
    savedStore.message = "saved successfully";
    res.status(200);
    res.json(savedStore);
  } catch (err) {
    //handle error- error cant always be displayed!
    console.error("error while trying to handle store data see log", err);
    res.status(400);
    res.json(err);
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
        //error code 11000 is duplicate,so we ignore it and let the code keep running
        throw error;
      }
    }
    console.log("response is:", response);
    res.status(200);
    res.json({ message: "added successfully" });
  } catch (err) {
    //handle error- error cant always be displayed!
    console.error("error while trying to handle store data see log", err);
    res.status(400);
    res.json({ message: "an error have occured,see logs for more info" });
  }
});
module.exports = router;
