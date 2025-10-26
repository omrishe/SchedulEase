const mongoose = require("mongoose");

const storeTimeSlotSchema = new mongoose.Schema(
  {
    date: { type: Date, required: true },
    storeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "store",
      required: true,
    },
    takenBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      default: null,
    },
    userName: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);
//sets indexes for faster searches and makes them unique --cant have the same storeID and date the same values
storeTimeSlotSchema.index({ storeID: 1, date: 1 }, { unique: true });

module.exports =
  mongoose.models.StoreTimeSlot ||
  mongoose.model("StoreTimeSlot", storeTimeSlotSchema, "storeTimeSlots");
