const express = require("express");
const cors = require("cors"); //for testing purposes allows the requests of local frontend from the same computer
const mongoose = require("mongoose");
const appointmentRoute = require("./routes/appointmentRoute");
const connectToMongo = require("./database/db");
const app = express();
const PORT = 5000;

app.use(cors()); //sets to allow all origins add origin: "http://localhost:5173"
app.use(express.json());

async function startDatabase() {
  try {
    await connectToMongo(); // wait for DB connection
    console.log("Database connected, starting server...");

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
    app.use("/api/appointments", appointmentRoute);
  } catch (err) {
    console.error("Failed to start server:", err);
  }
}
startDatabase();
