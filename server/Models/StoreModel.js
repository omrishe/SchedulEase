const mongoose = require("mongoose");
const {
  MAX_SERVICE_NAME_LENGTH,
  MAX_PRICE,
  MAX_SERVICE_NOTE_LENGTH,
} = require("../config.js");

//embeded service schema as array- since most of them will be less than 50 its better for understandability and querying
//other options that got used(in users schema) is ref, which is better for large amount of users 1000< and stores
const servicesSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: MAX_SERVICE_NAME_LENGTH,
    },
    price: {
      type: String,
      required: true,
      index: true,
      lowercase: true,
      trim: true,
      validate: [
        {
          validator: function (v) {
            return !isNaN(Number(v));
          },
          message: `Price set: ${props.value} must be a valid number`,
        },
        {
          validator: function (v) {
            return Number(v) <= Number(MAX_PRICE);
          },
          message: (props) =>
            `Price set: ${props.value} cannot exceed ${MAX_PRICE}`,
        },
      ],
    },
    serviceNote: {
      type: String,
      required: false,
      maxlength: MAX_SERVICE_NOTE_LENGTH,
    },
  },
  { timestamps: true },
);

const storeSchema = new mongoose.Schema(
  {
    storeName: { type: String, required: true, trim: true },
    services: [servicesSchema],
    storeNote: { type: String, required: false },
    storePhoneNumber: { type: String, required: false },
    storeCoordinates: { type: String, required: false },
    storeSlug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    announcement: { type: String, required: false },
  },
  { timestamps: true },
);
/** 
servicesSchema.pre("save", function validateName(next) {
  const document = this;
  const parent = this.ownerDocument();
  const duplicateDocument = parent.services.some(
    (service) => service.name === document.name
  );
  if (duplicateDocument) {
    return new Error("service already exists");
  }
  next();
});
*/
module.exports =
  mongoose.models.Store || mongoose.model("Store", storeSchema, "stores");
