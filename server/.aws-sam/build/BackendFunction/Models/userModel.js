const mongoose = require("mongoose");
const { MAX_USER_NAME_LENGTH } = require("../config");

const authSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      required: false,
      trim: true,
      maxlength: MAX_USER_NAME_LENGTH,
    },
    email: {
      type: String,
      required: true,
      index: true,
      lowercase: true,
      trim: true,
    },
    hashedPassword: { type: String, required: true },
    role: { type: String, required: true },
    storeId: {
      required: true,
      type: mongoose.Schema.Types.ObjectId,
      ref: "Store",
    },
  },
  { timestamps: true },
);

module.exports =
  mongoose.models.User || mongoose.model("User", authSchema, "users");
