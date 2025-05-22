

const { MongoClient } = require("mongodb"); 

const uri = "";//add uri
const client = new MongoClient(uri);

let db=null;

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
module.exports=connectToMongo;