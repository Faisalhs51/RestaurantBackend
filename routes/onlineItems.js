const express = require("express");
const router = express.Router();
const OnlineItems = require("../models/OnlineItems");

router.get("/", async (req, res) => {
  try {
    const itemsList = await OnlineItems.find();
    res.json(itemsList);
  } catch (err) {
    res.send("Error " + err);
  }
});

router.post("/", async (req, res) => {
  let item = await OnlineItems.findOne({ email: req.body.email });
  let cart1 = [];
  for (let i in req.body.cart) {
    cart1[i] = req.body.cart[i];
  }
  if (!item) {
    const newItem = new OnlineItems({
      email: req.body.email,
      cart: cart1,
    });
    try {
      const it = await newItem.save();
      res.json(it);
    } catch (err) {
      res.send("Error");
    }
  } else {
    const item1 = await OnlineItems.findByIdAndUpdate(
      item._id,
      { $push: { cart: cart1 } },
      //   { allowDiskUse: true },
      { new: true }
    );
    res.json({ item1 });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const item = await OnlineItems.findById(req.params.id);
    const it = await item.delete();
    res.json(it);
  } catch (err) {
    res.send("Error");
  }
});

module.exports = router;
