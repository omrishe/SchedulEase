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
    username: { type: String, required: false },
    hashedPassword: { type: String, required: true },
    role: { type: String, required: true },
  },
  { timestamps: true }
);

const users = mongoose.model("user", authSchema);
module.exports = users;
