//schema creation
const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema(
  {
    userName: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    date: { type: Date, required: true },
    note: { type: String, default: "", trim: true },
    storeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "store",
      required: true,
    },
  },
  { timestamps: true }
);
//sets indexes for faster searches
appointmentSchema.index({ storeID: 1, date: 1 }, { unique: true });
module.exports =
  mongoose.models.Appointment ||
  mongoose.model("Appointment", appointmentSchema, "appointments");
