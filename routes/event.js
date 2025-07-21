const express = require("express");
const Event = require("../Models/Event.js");

const router = express.Router();


router.get("/", async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 6;
  const skip = (page - 1) * limit;

  try {
    const events = await Event.find({}).skip(skip).limit(limit);
    const total = await Event.countDocuments();

    res.json({
      events,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
    });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});


module.exports = router;
