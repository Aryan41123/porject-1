const express = require("express");
const Subscriber = require("../models/Subscriber.js");

const router = express.Router();

router.post("/", async (req, res) => {
  const { email } = req.body;
  if (!email || !email.includes("@")) {
    return res.status(400).json({ error: "Invalid email" });
  }

  try {
    await Subscriber.create({ email });
    res.json({ message: "Subscribed successfully" });
  } catch (err) {
    res.status(400).json({ error: "Already subscribed or error occurred" });
  }
});

module.exports = router;
