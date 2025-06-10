const params = require("../params.json");
const mongoose = require("mongoose");
const uri = params.uri;

async function connectToMongo() {
  try {
    await mongoose.connect(uri, {
      dbName: "appointmentManagement", // not a must but makes code look better
    });
    console.log("Connected to MongoDB with Mongoose");
  } catch (error) {
    console.error(" Failed to connect to MongoDB:", error);
    throw error;
  }
}

module.exports = connectToMongo;
