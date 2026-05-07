const storeNames = [
  "The Fade Lounge",
  "Classic Cuts",
  "Urban Grooming",
  "Gentleman's Club Barber",
  "The Shave Cave",
  "Sharp Style Barbers",
];

const servicesData = [
  { name: "Haircut", price: "25", serviceNote: "Standard haircut" },
  { name: "Beard Trim", price: "15", serviceNote: "Quick trim" },
  { name: "Haircut & Beard", price: "35", serviceNote: "Full service" },
  { name: "Hot Towel Shave", price: "20", serviceNote: "Relaxing shave" },
  { name: "Kids Haircut", price: "18", serviceNote: "For children under 12" },
  { name: "Buzz Cut", price: "15", serviceNote: "Simple machine cut" },
  { name: "Skin Fade", price: "30", serviceNote: "Zero fade on the sides" },
  { name: "Line Up", price: "10", serviceNote: "Crisp edges and neck cleanup" },
  { name: "Eyebrow Trim", price: "5", serviceNote: "Quick eyebrow shape up" },
  { name: "Coloring / Dye", price: "45", serviceNote: "Hair or beard coloring" },
  { name: "Shampoo & Wash", price: "10", serviceNote: "Refreshing wash before cut" },
  { name: "VIP Package", price: "60", serviceNote: "Cut, shave, wash, and styling" },
];

const userNames = [
  "John Doe", "Jane Smith", "Alex Johnson", "Mike Brown", "Sarah Davis",
  "Emily Wilson", "Chris Lee", "David Miller", "James Taylor", "Linda Anderson",
  "Robert Thomas", "Michael Jackson", "William White", "David Harris", "Richard Martin",
  "Charles Thompson", "Joseph Garcia", "Thomas Martinez", "Christopher Robinson", "Daniel Clark"
];

const notes = [
  "First time customer", 
  "Looking for a fade", 
  "Regular cut", 
  "", 
  "Please be gentle", 
  "Need a quick trim",
  "Short on top, fade on sides",
  "Just a cleanup",
  "Beard needs a lot of work"
];

const announcements = [
  "Grand opening!",
  "Welcome to our new booking system.",
  "Check out our new beard care products.",
  "Holiday discounts available!",
  ""
];

module.exports = {
  storeNames,
  servicesData,
  userNames,
  notes,
  announcements,
};
