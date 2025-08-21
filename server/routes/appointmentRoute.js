//server interaction
const express = require("express");
const Appointment = require("../Models/appointmentModel.js");
const authenticateToken = require("../tokenauth/authenticateToken.js");
const {
  sendSucessResponse,
  sendRejectedResponse,
} = require("../utils/responseHandler.js");
const router = express.Router();

router.post("/new", authenticateToken, async (req, res) => {
  try {
    const newAppointment = new Appointment(req.body); //recieves the data sent and create an appointment schema
    const savedAppointment = await newAppointment.save(); //saves the data to database -- mongoose automatically convert string date to js date
    const { createdAt, updatedAt, ...appointment } = savedAppointment;
    console.log("saved clean appointment is", appointment);
    //return the object that was saved as it appears in the db and appopriate message
    return res.status(201).json(
      sendSucessResponse({
        message: "added appointment successfully",
        type: "data",
        otherdata: appointment,
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
