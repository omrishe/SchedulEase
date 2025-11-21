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
const allowedOrigins = [
  "https://localhost:5173", // development npm run dev
  "http://localhost:4173", // development npm run preview
  "https://d4finm2krx1ce.cloudfront.net", // production -cloudfront
];

app.use(
  cors({
    origin: (origin, callback) => {
      // allow requests with no origin (non browser requests)
      if (!origin) {
        return callback(null, true);
      }
      if (allowedOrigins.includes(origin)) {
        // origin is in allowed origins list
        callback(null, true);
      } else {
        callback(new Error("origin not allowed in the allowed list"));
      }
    },
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

module.exports = app;
