const mongoose = require("mongoose");

let connectionPromise = null;

async function connectToMongo(retries = 3) {
  try {
    const mongoUri = process.env.MONGO_URI_PARAM;
    if (mongoose.connection.readyState === 1) {
      return mongoose.connection;
    }
    // If in process of connecting, sleep and retry
    if (mongoose.connection.readyState === 2) {
      if (retries <= 0) {
        console.error("Database connection taking too long");
        throw new Error("Database connection taking too long");
      }
      await new Promise((res) => setTimeout(res, 500));
      return connectToMongo(retries - 1);
    }
    // incase readyState is 0 (disconnected) and 2 calls are made to try to connect to the db
    // basically prevents multiple parallel connects
    if (connectionPromise) {
      return connectionPromise;
    }

    connectionPromise = mongoose
      .connect(mongoUri, {
        dbName: "appointmentManagement",
        serverSelectionTimeoutMS: 5000,
        connectTimeoutMS: 5000,
      })
      .finally(() => {
        connectionPromise = null;
      });

    await connectionPromise;
    console.log("Connected to database");
    //makes sure 100% that the connection is ready (instead of return mongoose.connection;)
    return await mongoose.connection.asPromise();
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error);
    throw error;
  }
}

module.exports = connectToMongo;
