const express = require("express");
const router = express.Router();
const Feedback = require("../models/Feedback");

router.get("/", async (req, res) => {
  try {
    const feedback = await Feedback.find();
    res.json(feedback);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

router.post("/createFeed", async (req, res) => {
  try {
    const { name, email, desc } = req.body;

    const feedback = new Feedback({
      name,
      email,
      subject,
      desc,
    });

    const f = await feedback.save();

    res.json(f);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
