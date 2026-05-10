const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });

const mongoose = require("mongoose");
const connectToMongo = require("./db");
const Store = require("../Models/storeModel");
const StoreTimeSlot = require("../Models/storeTimeSlotsModel");
const { storeNames, servicesData, announcements } = require("./seedData");

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomItem(array) {
  return array[getRandomInt(0, array.length - 1)];
}

async function createStores(count = 3) {
  console.log(`Creating ${count} stores...`);
  const stores = [];
  let firstStore = await Store.findOne({ storeSlug: "demo-store" });
  if (!firstStore) {
    firstStore = new Store({
      storeName: "demo-store",
      storeSlug: "demo-store",
      storePhoneNumber: "123-456-7890",
      storeCoordinates: "40.7128,-74.0060",
      storeNote: "this is demonstration store",
      announcement: "Best fades in town!",
      services: servicesData,
    });
    await firstStore.save();

    console.log("Created 'demo-store'");
  } else {
    console.log("Store 'demo-store' already exists, reusing it.");
  }
  stores.push(firstStore);
  for (let i = 1; i < count; i++) {
    const name = getRandomItem(storeNames);
    const slug =
      name.toLowerCase().replace(/[^a-z0-9]+/g, "-") + "-" + Date.now() + i;
    const store = new Store({
      storeName: name,
      storeSlug: slug,
      storePhoneNumber: `555-010${i}`,
      storeNote: "Providing the best cuts.",
      announcement: getRandomItem(announcements),
      services: servicesData.slice(0, getRandomInt(5, servicesData.length)),
    });
    await store.save();
    stores.push(store);
  }
  return stores;
}

async function createAppointments(stores) {
  console.log(
    "Generating alot of empty time slots (this might take a few seconds)...",
  );

  const referenceDate = new Date("2026-05-06T00:00:00Z");

  const startDate = new Date(referenceDate);
  startDate.setMonth(startDate.getMonth() - 1);

  const endDate = new Date(referenceDate);
  endDate.setMonth(endDate.getMonth() + 6);

  let totalSlots = 0;

  for (let store of stores) {
    // Generate random schedule days for this store
    for (
      let d = new Date(startDate);
      d <= endDate;
      d.setDate(d.getDate() + 1)
    ) {
      // 70% chance a day is open for the store
      if (Math.random() > 0.7) continue;

      for (let hour = 9; hour < 17; hour++) {
        if (Math.random() > 0.8) continue;

        const slotDate = new Date(d);
        slotDate.setUTCHours(hour, 0, 0, 0);

        try {
          const timeSlot = new StoreTimeSlot({
            date: slotDate,
            storeId: store._id,
            takenBy: null,
            userName: null,
          });
          await timeSlot.save();
          totalSlots++;
        } catch (error) {
          if (error.code !== 11000) {
            console.error(
              "Error creating timeslot/appointment:",
              error.message,
            );
          }
        }
      }
    }
  }

  console.log(`Successfully generated ${totalSlots} empty time slots.`);
}

async function seedDatabase() {
  try {
    process.env.MONGO_URI_PARAM = process.env.SEED_URL;
    await connectToMongo();
    console.log("Connected to database for massive seeding...");
    //create stores
    const stores = await createStores(3);
    //create empty appointments
    await createAppointments(stores);
    console.log("Database seeded successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Error while seeding database:", error);
    process.exit(1);
  }
}

seedDatabase();
