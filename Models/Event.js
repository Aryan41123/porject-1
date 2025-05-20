const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  title: String,
  date: String,
  time: String,
  location: String,
  description: String,
  image: String,
  url: String,
});

// Fix: Prevent OverwriteModelError
module.exports = mongoose.models.Event || mongoose.model("Event", eventSchema);
