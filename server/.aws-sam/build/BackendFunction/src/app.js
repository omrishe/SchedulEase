const express = require("express");
const cors = require("cors"); //for testing purposes allows the requests of local frontend from the same computer
const mongoose = require("mongoose");
const appointmentRoute = require("../routes/appointmentRoute");
const authRoute = require("../routes/authRoute");
const storeRoute = require("../routes/storeRoute");
const connectToMongo = require("../database/db");
const https = require("https");
const fs = require("fs");
const cookieParser = require("cookie-parser");
const { isDatabaseConnected } = require("../middlewares/middlewares");

const app = express();
//sets to allow all origins, to add specific origin write eg:(:"http://localhost:5173")
app.use(
  cors({
    origin: "https://localhost:5173",
    credentials: true,
  })
);
//sets so the response is auto parse to json
app.use(express.json());
//cookie parser middleware
app.use(cookieParser());
//makes sure database is connected (on cold start we might get another request before database connected)
app.use(isDatabaseConnected);
//Mounts routes handlers for different API endpoints.
app.use("/api/appointments", appointmentRoute);
app.use("/api/auth", authRoute);
app.use("/api/store", storeRoute);
console.log("done\n");

module.exports = app;
