const express = require("express");
const cors = require("cors"); //for testing purposes allows the requests of local frontend from the same computer
const app = express();
const PORT = 5000;
app.use(cors());//sets to allow all origins add origin: "http://localhost:5173" 
app.use(express.json());

app.post("/api/appointments", (req, res) => {
  console.log(req.body);
  res.json({ message: "Appointment received" });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

