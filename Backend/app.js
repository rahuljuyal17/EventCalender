const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const User = require("./models/user.js");
const permission = require("./models/permission.js");

const app = express();
const port = 8080;

// Middleware
app.use(cors()); 
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));

// MongoDB connection
const MONGO_URL = "mongodb://127.0.0.1:27017/Event";
mongoose
  .connect(MONGO_URL)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

app.get("/", async (req, res) => {
  const events = await Listing.find();
  res.json(events); 
});

// Submit event 
app.post("/api/events", async (req, res) => {
  try {
    const listing = new Listing({
      title: req.body.title,
      organizer: req.body.organizer,
      date: req.body.date,
      time: req.body.time,
      location: req.body.location,
      link: req.body.link,
      description: req.body.description,
    });
    console.log(listing);
    await listing.save();
    console.log("Event data saved");
    res.status(201).json({ message: "Event created successfully" });
  } catch (err) {
    console.error("Error saving event:", err);
    res.status(500).json({ message: "Error saving event data" });
  }
});

// Signup route
app.post("/signup", async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const found = await permission.findOne({ email });
    if (found) {
      const newUser = new User({ username, email, password });
      await newUser.save();
      res.status(201).json({ message: "Signup successful" });
    } else {
      res.status(403).json({ message: "Permission denied" });
    }
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Backend server is running on http://localhost:${port}`);
});
