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

router.get("/:email", async (req, res) => {
  try {
    const itemsList = await OnlineItems.findOne({ email: req.params.email });
    if (itemsList) res.json(itemsList);
    else res.status(204).json();
  } catch (err) {
    res.send("Error " + err);
  }
});

router.post("/showItem/:email", async (req, res) => {
  try {
    await OnlineItems.updateMany(
      { email: req.params.email }, // filter to match the desired documents
      { $set: { "cart.$[].show": false } },
      (err) => {
        if (err) {
          // handle error
          console.log(err);
        } else {
          res.json();
        }
      }
    ).clone();
  } catch (error) {
    console.log(error);
  }
});

router.post("/", async (req, res) => {
  // console.log(req.body)
  let item = await OnlineItems.findOne({ email: req.body.email });
  let cart1 = [];
  for (let i in req.body.cart) {
    cart1[i] = req.body.cart[i];
    cart1[i].show = true;
  }
  // console.log(!item)
  if (!item) {
    const newItem = new OnlineItems({
      email: req.body.email,
      cart: cart1,
      tableno: req.body.tableno,
      show: req.body.show,
    });
    try {
      const it = await newItem.save();
      res.json(it);
    } catch (err) {
      res.send("Error");
      console.log(err);
    }
  } else {
    const item1 = await OnlineItems.findByIdAndUpdate(
      item._id,
      { $push: { cart: cart1 } },
      //   { allowDiskUse: true },
      { new: true }
    );
    const item2 = await OnlineItems.findByIdAndUpdate(
      item._id,
      { show: true },
      //   { allowDiskUse: true },
      { new: true }
    );
    res.json({ item2 });
  }
});

router.delete("/:email", async (req, res) => {
  try {
    const item = await OnlineItems.findOne({ email: req.params.email });
    const it = await item.delete();
    res.json(it);
  } catch (err) {
    res.send("Error");
  }
});

module.exports = router;
