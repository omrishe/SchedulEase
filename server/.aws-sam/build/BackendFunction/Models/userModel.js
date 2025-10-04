const mongoose = require("mongoose");

const authSchema = new mongoose.Schema(
  {
    userName: { type: String, required: false, trim: true },
    email: {
      type: String,
      required: true,
      index: true,
      lowercase: true,
      trim: true,
    },
    userName: { type: String, required: true },
    hashedPassword: { type: String, required: true },
    role: { type: String, required: true },
    storeId: {
      required: true,
      type: mongoose.Schema.Types.ObjectId,
      ref: "Store",
    },
  },
  { timestamps: true }
);

module.exports =
  mongoose.models.User || mongoose.model("User", authSchema, "users");
