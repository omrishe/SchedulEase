const mongoose = require("mongoose");

const authSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    username: { type: String, required: false },
    hashedPassword: { type: String, required: true },
  },
  { timestamps: true }
);

const users = mongoose.model("user", authSchema);
module.exports = users;
