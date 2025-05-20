require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./MongodbConnect.js");
const scrapeEvents = require("./Scraper/scraperEvent.js");
const Event = require("./Models/Event.js");
const cron = require("node-cron");

const app = express();
app.use(cors({
  origin: "http://localhost:5173",
  methods: ["GET", "POST"],
  credentials: true
}));

app.use(express.json());

connectDB();

// Routes
app.use("/api/events", require("./routes/event.js"));
app.use("/api/subscribe", require("./routes/subscribeEvent.js"));

app.get('/', (req, res) => {
  res.send("Backend is running ✅");
});


app.get("/api/test-scrape", async (req, res) => {
  try {
    const events = await scrapeEvents();
    await Event.deleteMany({});
    await Event.insertMany(events);
    res.json({ message: "Scrape complete", count: events.length });
  } catch (err) {
    console.error("Scraping error:", err);
    res.status(500).json({ message: "Internal server error", error: err.message });
  }
});


app.get('/', () => {
  console.log("backend is running");
})


// Scheduled job: scrape every 6 hours
cron.schedule("0 */6 * * *", async () => {
  console.log("Running scheduled scrape...");
  try {
    const events = await scrapeEvents();
    await Event.deleteMany({});
    await Event.insertMany(events);
    console.log("Events updated");
  } catch (err) {
    console.error("Error scraping events", err);
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
