const mongoose = require("mongoose");

//embeded service schema as array- since most of them will be less than 50 its better for understandability and querying
//other options that got used(in users schema) is ref, which is better for large amount of users 1000< and stores
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
  { timestamps: true }
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
