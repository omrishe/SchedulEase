const mongoose = require("mongoose");
const router = express.Router();
const storeModel = require("../Models/StoreModel.js");
const authenticateToken = require("../tokenauth/authenticateToken.js");

router.get("/getStoreInfo", authenticateToken, async (req, res) => {
  try {
    const StoreData = await storeModel.findById(req.storeId);
    if (!StoreData) {
      throw new Error("no Such Store exists");
    }
    res.status(200);
    return res.json(StoreData);
  } catch (err) {
    console.error("error while trying to handle store data see log", err);
    res.status(400);
    res.json("error while trying to handle store data see log", err);
  }
});
