const allowedOrigins = [
  "https://localhost:5173", // development npm run dev
  "http://localhost:4173", // development npm run preview
  "https://localhost:4173",
  "https://d4finm2krx1ce.cloudfront.net", // production -cloudfront
];

module.exports = allowedOrigins;
