const express = require("express");
const app = express();
const PORT = 5000;

app.use(express.json());

app.post("/api/appointments", (req, res) => {
  console.log(req.body);
  res.json({ message: "Appointment received" });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
