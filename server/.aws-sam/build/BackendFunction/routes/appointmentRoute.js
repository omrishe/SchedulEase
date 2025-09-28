//server interaction
const express = require("express");
const Appointment = require("../Models/appointmentModel.js");
const StoreTimeSlots = require("../Models/storeTimeSlotsModel.js");
const Store = require("../Models/storeModel.js");
const User = require("../Models/userModel.js");
const { authenticateToken } = require("../middlewares/middlewares.js");
const {
  sendSucessResponse,
  sendRejectedResponse,
} = require("../utils/responseHandler.js");
const router = express.Router();

router.post("/new", authenticateToken, async (req, res) => {
  try {
    const { appointmentInfo: appointmentData } = req.body;
    console.log("req.body is:\n", req.body);
    const userId = req.user.userId; //get the userId by the token (authenticateToken passes userId)
    const { email, userName } =
      (await User.findById(userId, { email: 1, userName: 1, _id: 0 })) || {};
    if (!email || !userName) {
      throw new Error("User does not exist");
    }
    appointmentData.userName = userName;
    appointmentData.email = email;
    appointmentData.userId = userId;
    appointmentData.date = new Date(appointmentData.date);
    appointmentData.date.setMilliseconds(0);
    appointmentData.date.setSeconds(0);
    const newAppointment = new Appointment(appointmentData); //recieves the data sent and create an appointment doc
    console.log("appointment is:\n", appointmentData);
    const storeTimeSlot = await StoreTimeSlots.findOne({
      storeId: appointmentData.storeId,
      date: appointmentData.date,
    });
    if (storeTimeSlot.takenBy) {
      throw new Error("appointment already taken");
    }
    storeTimeSlot.takenBy = userId; //sets the timeSlot as taken by user
    await newAppointment.save(); //saves the data to database -- mongoose automatically convert string date to js date
    await storeTimeSlot.save(); //saves the new timeslot
    const newStoreTimeSlot = await StoreTimeSlots.findOne({
      storeId: appointmentData.storeId,
      date: appointmentData.date,
    });
    console.log("new time slot is is:\n", newStoreTimeSlot);
    return res.status(201).json(
      sendSucessResponse({
        message: "added appointment successfully",
        type: "data",
      })
    );
  } catch (error) {
    console.error(error);
    if (error.name === "E11000") {
      return res.status(401).json(
        sendRejectedResponse({
          message: "invalid appointment please refresh page",
        })
      );
    }
    return res.status(400).json(
      sendRejectedResponse({
        code: error.code,
        message:
          "an error has occured while creating appointment please try again later",
      })
    );
  }
});

router.get("/getAvailableAppointment", async (req, res) => {
  try {
    const { storeId, storeSlug, date: timeStamp } = req.query;
    const startdate = new Date(Number(timeStamp));
    //js Date automatically moves to next month if day of month<{daySet}
    const endDate = new Date(
      startdate.getFullYear(),
      startdate.getMonth(),
      startdate.getDate() + 1
    );
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
        date: { $gte: startdate, $lt: endDate },
      },
      { date: 1, _id: 0 }
    ).sort({ date: 1 });
    //availableSlots is an array of object containing dates,this line transforms it into array of dates
    const availableSlotsArr = availableSlots.map((slot) => slot.date);
    console.log("querying is :", {
      storeId: store._id,
      takenBy: null,
      date: { $gte: startdate, $lt: endDate },
    });
    console.log("availableSlots is:", availableSlots);
    console.log("date in numbers is:", timeStamp);
    console.log("end date is:", endDate);
    console.log("start date is:", startdate);
    return res.json(
      sendSucessResponse({
        message: "successfully fetched appointments",
        otherData: availableSlotsArr,
      })
    );
  } catch (error) {
    console.error("an error occured see below for details:\n", error);
    if (error === "Store not found") {
      return res
        .status(400)
        .json(sendRejectedResponse({ message: "Store not found" }));
    }
    if (error === "Store identifier missing") {
      return res
        .status(400)
        .json(sendRejectedResponse({ message: "Store identifier missing" }));
    }
    return res.status(400).json(sendRejectedResponse());
  }
});
/** 
router.get("/getAppointment", authenticateToken, async (req, res) => {
  try {
    let query = {}; //sets it so query is any empty object
    const email = req.query.email; //get email from query -{} if no query is used
    if (validateData(email)) {
      query["email"] = email;
    }
    const getAppointmentByEmail = await Appointment.find(query); //get appointment data associated with the email if it exists else it returns all
    res.status(200);
    res.json(getAppointmentByEmail); //return appointmenet data
  } catch (err) {
    res.status(500);
    res.json({ message: err.message });
  }
});

router.get("/getAllAppointments", async (req, res) => {
  try {
    const getAppointmentByEmail = await Appointment.find(); //get all appointment data
    res.status(200);
    res.json(getAppointmentByEmail); //return appointmenet data
  } catch (err) {
    console.error("Error fetching appointments:", err);
    res.status(500);
    res.json({ message: err });
  }
});

function validateData(email) {
  //checks if email exists and valid
  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (email && emailPattern.test(email)) return true;
  else return false;
}
*/
module.exports = router;
