const express = require("express");
const { model } = require("mongoose");
const router = express.Router();
// const Items = require("../models/Items");
const OnlineItems = require("../models/OnlineItems");

router.get("/", async (req, res) => {
  try {
    const items = await OnlineItems.find();
    res.json(items);
  } catch (err) {
    res.send("Error " + err);
  }
});

router.post("/:id", async (req, res) => {
  try {
    const item = await OnlineItems.findById({ _id: req.params.id });
    if (item) {
      const item1 = await OnlineItems.findByIdAndUpdate(
        item._id,
        { show: false },
        //   { allowDiskUse: true },
        { new: true }
      );
      res.json(item1);
    } else {
      res.json();
    }
  } catch (err) {
    res.send("Error " + err);
  }
});

module.exports = router;
