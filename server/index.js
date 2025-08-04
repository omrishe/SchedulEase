const express = require("express");
const cors = require("cors"); //for testing purposes allows the requests of local frontend from the same computer
const mongoose = require("mongoose");
const appointmentRoute = require("./routes/appointmentRoute");
const authRoute = require("./routes/authRoute");
const connectToMongo = require("./database/db");
const https = require("https");
const fs = require("fs");
const app = express();
const cookieParser = require("cookie-parser");
const PORT = 5000;

app.use(
  cors({
    origin: "https://localhost:5173",
    credentials: true,
  })
); //sets to allow all origins, to add specific origin write eg:(:"http://localhost:5173")
app.use(express.json());
//cookie parser middleware
app.use(cookieParser());

async function startDatabase() {
  try {
    await connectToMongo(); // wait for DB connection
    console.log("Database connected, starting server...");
    app.use("/api/appointments", appointmentRoute);
    app.use("/api/auth", authRoute);
    //load certificate and key
    const sslOptions = {
      key: fs.readFileSync("./cert/localhost-key.pem"),
      cert: fs.readFileSync("./cert/localhost.pem"),
    };
    //starts https server
    https.createServer(sslOptions, app).listen(PORT, () => {
      console.log(`HTTPS Server running on https://localhost:${PORT}`);
    });
  } catch (err) {
    ``;
    console.error("Failed to start server:", err);
  }
}
startDatabase();
