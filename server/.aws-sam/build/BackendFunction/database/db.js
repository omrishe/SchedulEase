const mongoose = require("mongoose");

const mongoUri = process.env.MONGO_URI;
async function connectToMongo() {
  try {
    await mongoose.connect(mongoUri, {
      // dbName is not a must but makes code look better
      dbName: "appointmentManagement",
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 5000,
    });
    console.log("Connected to database");
  } catch (error) {
    console.log(" Failed to connect to MongoDB:", error);
    throw error;
  }
}

module.exports = connectToMongo;
