const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const PDFDocument = require("pdfkit");
const moment = require("moment");
const path = require("path");

const Listing = require("./models/listing.js");
const User = require("./models/user.js");

const app = express();
const port = process.env.PORT || 8000;

// Connect to MongoDB
const mongoURI = process.env.MONGODB_URI || "mongodb://localhost:27017/Event";
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", (error) => console.error("MongoDB connection error:", error));
db.once("open", () => {
  console.log("Connected to MongoDB");

  // Middleware
  app.use(cors());
  app.use(express.json());

  // ✅ Login Route
  app.post("/api/login", async (req, res) => {
    const { email, password } = req.body;
    try {
      const user = await User.findOne({ email: email.trim() });
      if (!user || user.password.trim() !== password.trim()) {
        return res.status(401).json({ message: "Invalid email or password" });
      }
      res.json({ token: "mock-jwt-token" });
    } catch (err) {
      res.status(500).json({ message: "Login failed", error: err.message });
    }
  });

  // ✅ Signup Route
  app.post("/api/signup", async (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    try {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(409).json({ message: "Email already exists" });
      }

      const newUser = new User({ username, email, password });
      await newUser.save();

      res.status(201).json({ message: "Signup successful" });
    } catch (err) {
      console.error("Signup error:", err);
      res.status(500).json({ message: "Server error during signup" });
    }
  });

  // POST /api/events - Add new event
  app.post("/api/events", async (req, res) => {
    try {
      const event = new Listing(req.body);
      await event.save();
      res.status(201).json({ message: "Event saved successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to save event", error });
    }
  });

  // GET /api/reports/download - Generate PDF or Excel report
  app.get("/api/reports/download", async (req, res) => {
    try {
      const { range, format } = req.query;
      let startDate, endDate;

      const today = moment();
      switch (range) {
        case "week":
          startDate = today.clone().startOf("week").format("YYYY-MM-DD");
          endDate = today.clone().endOf("week").format("YYYY-MM-DD");
          break;
        case "month":
          startDate = today.clone().startOf("month").format("YYYY-MM-DD");
          endDate = today.clone().endOf("month").format("YYYY-MM-DD");
          break;
        case "year":
          startDate = today.clone().startOf("year").format("YYYY-MM-DD");
          endDate = today.clone().endOf("year").format("YYYY-MM-DD");
          break;
        default:
          try {
            const rangeObj = JSON.parse(range);
            startDate = moment(rangeObj.start).format("YYYY-MM-DD");
            endDate = moment(rangeObj.end).format("YYYY-MM-DD");
          } catch {
            startDate = today.format("YYYY-MM-DD");
            endDate = today.format("YYYY-MM-DD");
          }
      }

      const listings = await Listing.find({
        date: { $gte: startDate, $lte: endDate },
      });

      if (format === "excel") {
        // Generate Excel report
        const XLSX = require("xlsx");
        const data = listings.map((listing) => ({
          Title: listing.title,
          Organizer: listing.organizer,
          Date: listing.date,
          Time: listing.time,
          Location: listing.location,
          Description: listing.description,
        }));

        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Events");

        const buffer = XLSX.write(workbook, { bookType: "xlsx", type: "buffer" });

        res.setHeader("Content-Disposition", "attachment; filename=event-report.xlsx");
        res.setHeader(
          "Content-Type",
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );
        return res.send(buffer);
      } else {
        // Generate PDF report
        const pdfDoc = new PDFDocument();
        res.setHeader("Content-Disposition", `attachment; filename=event-report.pdf`);
        res.setHeader("Content-Type", "application/pdf");

        pdfDoc.pipe(res);
        pdfDoc.fontSize(24).text("Event Report", 100, 80);

        listings.forEach((listing, index) => {
          pdfDoc.moveDown();
          pdfDoc.fontSize(16).text(`Event #${index + 1}`);
          pdfDoc.fontSize(12).text(`Title: ${listing.title}`);
          pdfDoc.text(`Organizer: ${listing.organizer}`);
          pdfDoc.text(`Date: ${listing.date}`);
          pdfDoc.text(`Time: ${listing.time}`);
          pdfDoc.text(`Location: ${listing.location}`);
          pdfDoc.text(`Description: ${listing.description}`);
        });

        pdfDoc.end();
      }
    } catch (error) {
      console.error(error);
      res.status(500).send("Error generating report");
    }
  });

  // GET /api/events - Get all events
  app.get("/api/events", async (req, res) => {
    try {
      const events = await Listing.find({});
      res.json(events);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch events", error });
    }
  });

  // Serve frontend static files (React build)
  app.use(express.static(path.join(__dirname, "../Frontend/segment/build")));

  // Handle all other routes with React index.html (after API routes)
  app.get(/^\/(?!api).*/, (req, res) => {
    res.sendFile(path.join(__dirname, "../Frontend/segment/build/index.html"));
  });

  // Start server
  app.listen(port, () => {
    console.log(`Backend server is running on http://localhost:${port}`);
  });
});