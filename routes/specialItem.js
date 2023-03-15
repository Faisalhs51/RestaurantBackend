const express = require("express");
const router = express.Router();
const SpecialItem = require("../models/SpecialItem");
const Items = require("../models/Items");

router.get("/", async (req, res) => {
  try {
    const itemList = await SpecialItem.find();
    let items = [];
    for (let i of itemList) {
      //   console.log(i.id);
      let item = await Items.findById(i.id);
      items.push(item);
    }
    res.json(items);
  } catch (err) {
    res.send("Error " + err);
  }
});

router.post("/:id", async (req, res) => {
  try {
    let item = await SpecialItem.findOne({ id: req.params.id });
    if (item === null) {
      const specialtem = new SpecialItem({
        id: req.params.id,
      });

      const it = await specialtem.save();
      res.json(it);
    } else {
      res.json();
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

router.delete("/:id", async (req, res) => {
  try {
    let item = await SpecialItem.findOne({ id: req.params.id });
    const it = await item.delete();
    res.json(it);
  } catch (err) {
    res.send("Error");
  }
});

module.exports = router;
