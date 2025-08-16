const mongoose = require("mongoose");

const storeTimeSlotSchema = new mongoose.Schema(
  {
    date: { type: Date, required: true },
    storeID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "store",
      required: true,
    },
  },
  { timestamps: true }
);
//sets indexes for faster searches
storeTimeSlotSchema.index({ storeID: 1, date: 1 }, { unique: true });

module.exports =
  mongoose.models.StoreTimeSlot ||
  mongoose.model("StoreTimeSlot", storeTimeSlotSchema);
