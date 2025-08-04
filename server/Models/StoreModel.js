const mongoose = require("mongoose");

const servicesSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    price: {
      type: String,
      required: true,
      index: true,
      lowercase: true,
      trim: true,
    },
    serviceNote: { type: String, required: false },
  },
  { timestamps: true }
);

const storeSchema = new mongoose.Schema(
  {
    storeName: { type: String, required: true, trim: true },
    services: [servicesSchema],
    storeNote: { type: String, required: false },
    announcement: { type: String, required: false },
  },
  { timestamps: true }
);
const stores = mongoose.model("store", storeSchema);
module.exports = stores;
