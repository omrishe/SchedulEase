const { MongoClient } = require("mongodb");

const uri =
  "mongodb+srv://virvir5:<db_password>@cluster0.ubhx9bj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"; //add uri
const client = new MongoClient(uri);

let db = null;

async function connectToMongo() {
  if (!db) {
    try {
      await client.connect();
      db = client.db("appointmentManagement");
      console.log(" Connected to MongoDB");
    } catch (error) {
      console.error(" Failed to connect to MongoDB:", error);
    }
  }
  return db;
}
module.exports = connectToMongo;
