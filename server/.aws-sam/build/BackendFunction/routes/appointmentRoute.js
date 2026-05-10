//server interaction
const express = require("express");
const Appointment = require("../Models/appointmentModel.js");
const StoreTimeSlots = require("../Models/storeTimeSlotsModel.js");
const Store = require("../Models/storeModel.js");
const User = require("../Models/userModel.js");
const {
  authenticateToken,
  requireAdmin,
} = require("../middlewares/middlewares.js");
const {
  sendSucessResponse,
  sendRejectedResponse,
} = require("../utils/responseHandler.js");
const { normalizeDate } = require("../utils/dateHandlers.js");
const router = express.Router();

router.post("/new-appointment", authenticateToken, async (req, res) => {
  try {
    const { appointmentInfo: appointmentData } = req.body;
    if (
      !appointmentData ||
      !appointmentData.date ||
      !appointmentData.storeId ||
      !appointmentData.service
    ) {
      throw new Error("Missing required appointment data");
    }
    const userId = req.user.userId; //get the userId by the cookies (authenticateToken passes userId)
    const { email, userName } =
      (await User.findById(userId, { email: 1, userName: 1, _id: 0 })) || {};
    if (!email || !userName) {
      throw new Error("User does not exist");
    }
    appointmentData.userName = userName;
    appointmentData.email = email;
    appointmentData.userId = userId;
    if (
      !appointmentData.date ||
      isNaN(new Date(appointmentData.date).getTime())
    ) {
      throw new Error("Invalid appointmentData date format");
    }
    appointmentData.date = new Date(appointmentData.date);
    appointmentData.date.setSeconds(0, 0);
    const newAppointment = new Appointment(appointmentData); //recieves the data sent and create an appointment doc
    const result = await StoreTimeSlots.findOneAndUpdate(
      {
        storeId: appointmentData.storeId,
        date: appointmentData.date,
        takenBy: null,
      },
      { takenBy: userId, userName: userName },
      { new: true },
    );
    if (!result) {
      throw new Error("Time slot not available or already taken");
    }
    await newAppointment.save();
    return res.status(201).json(
      sendSucessResponse({
        message: "added appointment successfully",
      }),
    );
  } catch (error) {
    console.error(error);
    if (error.code === 11000) {
      return res.status(409).json(
        sendRejectedResponse({
          code: "APPOINTMENT_DUPLICATE",
          message: "invalid appointment please refresh page",
        }),
      );
    }
    if (error.message === "Missing required appointment data") {
      return res.status(400).json(
        sendRejectedResponse({
          code: "APPOINTMENT_MISSING_DATA",
          message: error.message,
        }),
      );
    }
    if (error.message === "User does not exist") {
      return res.status(404).json(
        sendRejectedResponse({
          code: "USER_NOT_FOUND",
          message: error.message,
        }),
      );
    }
    if (error.message === "Invalid appointmentData date format") {
      return res.status(400).json(
        sendRejectedResponse({
          code: "APPOINTMENT_INVALID_DATE",
          message: error.message,
        }),
      );
    }
    if (error.message === "Time slot not available or already taken") {
      return res.status(409).json(
        sendRejectedResponse({
          code: "SLOT_UNAVAILABLE",
          message: error.message,
        }),
      );
    }
    return res.status(500).json(
      sendRejectedResponse({
        code: "INTERNAL_ERROR",
        message:
          "an error has occured while creating appointment please try again later",
      }),
    );
  }
});

router.get(
  "/get-available-appointment-dates",
  authenticateToken,
  async (req, res) => {
    try {
      const {
        storeId,
        storeSlug,
        startDate: startTimeStamp,
        endDate: endTimeStamp,
      } = req.query;
      if (isNaN(Number(startTimeStamp)) || isNaN(Number(endTimeStamp))) {
        throw new Error("Invalid date format");
      }
      let startDate = new Date(Number(startTimeStamp));
      const endDate = new Date(Number(endTimeStamp));
      if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        throw new Error("Invalid date");
      }
      // Non-admins cannot query past slots — clamp startDate to today's midnight
      if (!req.user || req.user.role !== "admin") {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const normalizeStartDate = normalizeDate(startDate);
        if (normalizeStartDate < today) {
          throw new Error(
            `Cannot query past dates start Date is:${normalizeStartDate} today is:${today}`,
          );
        }
      }
      //js Date automatically moves to next month if day of month<{daySet}
      //sets is so its exactly 1 day
      let store;
      if (storeId) {
        //reduntant database access but kept it incase in the future we'll need the store object
        store = await Store.findById(storeId);
      } else if (storeSlug) {
        store = await Store.findOne({ storeSlug: storeSlug });
      } else {
        throw new Error("Store identifier missing");
      }
      if (!store) {
        throw new Error("Store not found");
      }
      let availableSlots = await StoreTimeSlots.find(
        {
          storeId: store._id,
          takenBy: null,
          date: { $gte: startDate, $lt: endDate },
        },
        { date: 1, _id: 0 },
      ).sort({ date: 1 });
      //availableSlots is an array of object containing dates,this line transforms it into array of dates
      const availableSlotsArr = availableSlots.map((slot) => slot.date);
      return res.json(
        sendSucessResponse({
          message: "successfully fetched appointments",
          otherData: availableSlotsArr,
        }),
      );
    } catch (error) {
      console.error("an error occured see below for details:\n", error);
      if (error.message === "Store not found") {
        return res
          .status(404)
          .json(sendRejectedResponse({ code: "STORE_NOT_FOUND", message: "Store not found" }));
      }
      if (error.message === "Store identifier missing") {
        return res
          .status(400)
          .json(sendRejectedResponse({ code: "STORE_IDENTIFIER_MISSING", message: "Store identifier missing" }));
      }
      if (error.message.startsWith("Cannot query past dates")) {
        return res
          .status(403)
          .json(sendRejectedResponse({ code: "APPOINTMENTS_PAST_DATE", message: "Cannot query past dates" }));
      }
      if (error.message === "Invalid date format" || error.message === "Invalid date") {
        return res
          .status(400)
          .json(sendRejectedResponse({ code: "INVALID_DATE_FORMAT", message: error.message }));
      }
      return res.status(500).json(sendRejectedResponse({ code: "INTERNAL_ERROR" }));
    }
  },
);

/*admin role required
/get all appointments in specific dates
**/
router.get(
  "/get-all-store-appointments",
  authenticateToken,
  requireAdmin,
  async (req, res) => {
    try {
      let { startDate, endDate } = req.query;
      const storeId = req.user.storeId;
      if (!(startDate && endDate)) {
        throw new Error("invalid arguments");
      }
      startDate = new Date(Number(startDate));
      endDate = new Date(Number(endDate));
      if (isNaN(Number(startDate)) || isNaN(Number(endDate))) {
        throw new Error("Invalid date format");
      }
      startDate = new Date(Number(startDate));
      endDate = new Date(Number(endDate));
      if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        throw new Error("Invalid date");
      }
      //query db to get all appointments data
      const allAppointmentsData = await StoreTimeSlots.find(
        {
          storeId: storeId,
          date: { $gte: startDate, $lt: endDate },
        },
        null,
        { lean: true }, //makes mongoose return plain js object its like toobject
      );
      const filteredAppointmentsData = allAppointmentsData.map(
        ({ _id, __v, createdAt, updatedAt, ...otherData }) => {
          otherData.appointmentId = _id;
          return otherData;
        },
      );
      return res.json(
        sendSucessResponse({
          message: "successfully fetched appointments",
          otherData: filteredAppointmentsData,
        }),
      );
    } catch (err) {
      console.error("Error fetching appointments:", err);
      return res.status(500).json(
        sendRejectedResponse({
          code: "APPOINTMENTS_FETCH_ERROR",
          message: "Error fetching appointments",
        }),
      );
    }
  },
);
/*
/get all user appointments in specific dates
**/

router.get("/get-user-booking-info", authenticateToken, async (req, res) => {
  try {
    let { startDate, endDate } = req.query;
    const storeId = req.user.storeId;
    const userId = req.user.userId;
    if (!(startDate && endDate)) {
      throw new Error("invalid arguments");
    }
    startDate = new Date(Number(startDate));
    endDate = new Date(Number(endDate));
    if (isNaN(Number(startDate)) || isNaN(Number(endDate))) {
      throw new Error("Invalid date format");
    }
    startDate = new Date(Number(startDate));
    endDate = new Date(Number(endDate));
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      throw new Error("Invalid date");
    }
    //query db to get all appointments data
    const allAppointmentsData = await StoreTimeSlots.find(
      {
        storeId: storeId,
        takenBy: userId,
        date: { $gte: startDate, $lt: endDate },
      },
      null,
      { lean: true }, //makes mongoose return plain js object its like toobject
    );
    const filteredAppointmentsData = allAppointmentsData.map(
      ({ _id, __v, createdAt, updatedAt, ...otherData }) => {
        otherData.appointmentId = _id;
        return otherData;
      },
    );
    return res.json(
      sendSucessResponse({
        message: "successfully fetched appointments",
        otherData: filteredAppointmentsData,
      }),
    );
  } catch (err) {
    console.error("Error fetching appointments:", err);
    return res.status(500).json(
      sendRejectedResponse({
        code: "APPOINTMENTS_FETCH_ERROR",
        message: "Error fetching appointments",
      }),
    );
  }
});

router.get(
  "/get-appointments-info",
  authenticateToken,
  requireAdmin,
  async (req, res) => {
    try {
      let query = {}; //sets it so query is any empty object
      const getAppointmentByEmail = await Appointment.find(query); //get appointment data associated with the email if it exists else it returns all
      res.status(200);
      res.json(
        sendSucessResponse({
          message: "successfully fetched appointments",
          otherData: getAppointmentByEmail,
        }),
      ); //return appointmenet data
    } catch (err) {
      return res.status(500).json(
        sendRejectedResponse({
          code: "APPOINTMENTS_FETCH_ERROR",
          message: "Error fetching appointments",
        }),
      );
    }
  },
);

/** 

function validateData(email) {
  //checks if email exists and valid
  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (email && emailPattern.test(email)) return true;
  else return false;
}
*/
module.exports = router;
