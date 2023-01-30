const express = require("express");
const router = express.Router();
const OnlineItems = require("../models/OnlineItems");

router.get("/:id", async (req, res) => {
  try {
    const itemsList = await OnlineItems.find({ _id: req.params.id });
    let total = 0;
    for (let i of itemsList[0].cart) {
      total += i.price;
    }
    console.log(total);
    res.json(total);
  } catch (err) {
    res.send("Error " + err);
  }
});

module.exports = router;
