const express = require("express");
const Event = require("../models/Event.js");

const router = express.Router();

router.get("/", async (req, res) => {
  const events = await Event.find({});
  res.json(events);
});

module.exports = router;
