const connectToMongo = require("../database/db");

exports.database = async () => {
  try {
    await connectToMongo();
    console.log(" Test function finished");
  } catch (err) {
    console.error(" Test function failed", err);
  }
};
