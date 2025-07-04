//server interaction
const express = require("express");
const Appointment = require("../Models/appointmentModel.js");
const authenticateToken = require("../tokenauth/authenticateToken.js");

const router = express.Router();

router.post("/new", authenticateToken, async (req, res) => {
  try {
    //add validation check errors
    const newAppointment = new Appointment(req.body); //recieves the data sent and set it as
    const savedAppointment = await newAppointment.save(); //saves the data to database
    res.status(201);
    res.json(savedAppointment); //return the object that was saved as it appears in the db
  } catch (err) {
    if (err.name === "ValidationError") {
      //throw error incase db schema mismatch
      res.status(400);
      return res.json({ error: "Validation Error", details: err.errors });
    } else {
      res.status(400);
      res.json({ error: err.message });
    }
  }
});

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

module.exports = router;
