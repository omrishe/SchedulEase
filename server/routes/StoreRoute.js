const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const store = require("../Models/storeModel.js");
const {
  authenticateToken,
  requireAdmin,
} = require("../middlewares/middlewares.js");
const StoreTimeSlot = require("../Models/storeTimeSlotsModel.js");
const user = require("../Models/userModel.js");
const Store = require("../Models/storeModel.js");
const {
  sendSucessResponse,
  sendRejectedResponse,
} = require("../utils/responseHandler.js");

router.get("/getStoreInfo", authenticateToken, async (req, res) => {
  try {
    const StoreData = await store.findById(req.user.storeId);
    if (!StoreData) {
      throw new Error("no such store exists");
    }
    return res.status(200).json(
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

router.post(
  "/new-store-time-slots",
  authenticateToken,
  requireAdmin,
  async (req, res) => {
    try {
      const dates = req.body.dates;
      if (!Array.isArray(dates) || dates.length === 0) {
        throw new Error("Invalid dates array");
      }
      dates.forEach((date) => {
        if (isNaN(new Date(date).getTime())) {
          throw new Error("Invalid date format");
        }
      });
      const storeId = req.user.storeId;
      const slotsArr = dates
        .filter((slot) => !isNaN(new Date(slot).getTime()))
        .map((slot) => ({
          date: new Date(slot),
          storeId: storeId,
        }));
      try {
        const savedTimeSlots = await StoreTimeSlot.insertMany(slotsArr, {
          ordered: false,
        });
      } catch (error) {
        console.error("error occured:\n", error);
        if (error.code !== 11000) {
          //error code 11000 is duplicate document (it will just not save that specific doc),so we ignore it and let the code keep running
          throw error;
        }
      }
      res.status(200);
      res.json(sendSucessResponse({ message: "added successfully" }));
    } catch (error) {
      console.error("an error has occured,see logs for more info", error);
      res.status(400);
      res.json(
        sendRejectedResponse({
          message: "an error has occured,see logs for more info\n",
        })
      );
    }
  }
);

router.post(
  "/set-new-store-services",
  authenticateToken,
  requireAdmin,
  async (req, res) => {
    try {
      const { authData, formData } = req.body;
      const userData = await user.findById(authData.userId);
      //makes sure the user is admin
      if (!userData) {
        throw new Error("User not found");
      }
      if (userData.role !== "admin") {
        throw new Error("invalid auth");
      }
      const storeToUpdate = await store.findById(userData.storeId);
      if (!storeToUpdate) {
        throw new Error("store does not exist");
      }
      const storeExistingServices = storeToUpdate.services;
      //filter empty and duplicate services names that already exist in the services at the store --basically prevent duplicates
      const filteredServices = formData.filter(
        (formDataService) =>
          !storeExistingServices.some(
            (existingService) =>
              existingService.name === formDataService.name ||
              formDataService.name === "" ||
              !formDataService.name ||
              formDataService.price === "" ||
              !formDataService.price
          )
      );
      storeToUpdate.services.push(
        ...filteredServices.map((svc) => storeToUpdate.services.create(svc))
      );
      //saves the new services to the store service schema
      await storeToUpdate.save();
      res
        .status(200)
        .json(sendSucessResponse({ message: "added successfully" }));
    } catch (error) {
      console.error(
        "error while trying to save store time slots see log",
        error
      );
      res.status(400);
      res.json(
        sendRejectedResponse({
          message: "an error has occured,see logs for more info",
        })
      );
    }
  }
);

router.get("/getServices", async (req, res) => {
  try {
    const { storeId, storeSlug } = req.query;
    let fetchedStore;
    if (storeId) {
      fetchedStore = await Store.findById(storeId, { services: 1, _id: 0 });
    } else if (storeSlug) {
      fetchedStore = await Store.findOne(
        { storeSlug: storeSlug },
        { services: 1, _id: 0 }
      );
    } else {
      throw new Error("Store identifier missing");
    }
    if (!fetchedStore) {
      throw new Error("Store not found");
    }
    const servicesToSend = fetchedStore.services.map((service) => ({
      name: service.name,
      price: service.price,
      serviceNote: service.serviceNote,
      srvId: service._id,
    }));
    return res.json(
      sendSucessResponse({
        message: "successfully fetched services",
        otherData: servicesToSend,
      })
    );
  } catch (error) {
    console.error("an error occured see below for details:\n", error);
    if (error.message === "Store not found") {
      return res
        .status(400)
        .json(sendRejectedResponse({ message: "Store not found" }));
    }
    if (error.message === "Store identifier missing") {
      return res
        .status(400)
        .json(sendRejectedResponse({ message: "Store identifier missing" }));
    }
    return res.status(400).json(sendRejectedResponse());
  }
});

router.delete(
  "/delete-services",
  authenticateToken,
  requireAdmin,
  async (req, res) => {
    try {
      const { serviceId, storeId } = req.query;
      const store = await Store.findByIdAndUpdate(
        storeId,
        {
          $pull: { services: { _id: serviceId } },
        },
        { new: true }
      );
      if (!store) {
        throw new Error("Store not found");
      }
      const servicesToSend = store.services.map((service) => ({
        name: service.name,
        price: service.price,
        serviceNote: service.serviceNote,
        srvId: service._id,
      }));
      res.status(200);
      res.json(
        sendSucessResponse({
          message: "service successfully deleted",
          otherData: servicesToSend,
        })
      );
    } catch (error) {
      console.error("an error occured while trying to alter store data", error);
      res.status(400);
      res.json(
        sendRejectedResponse({
          message: "an error occured while trying to alter store data",
        })
      );
    }
  }
);

module.exports = router;
