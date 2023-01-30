const express = require("express");
const router = express.Router();
const multer = require("multer");
const Items = require("../models/Items");

//For storing image in Uploads folder
const Storage = multer.diskStorage({
  destination: "uploads",
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

//Upload function calling multer
const upload = multer({
  storage: Storage,
}).single("testImage");

//Get request for dish items
router.get("/", async (req, res) => {
  try {
    const items = await Items.find();
    res.json(items);
  } catch (err) {
    res.send("Error " + err);
  }
});

//Add item
router.post("/", (req, res) => {
  upload(req, res, (err) => {
    if (err) {
      console.log(err);
    } else {
      const newItem = new Items({
        name: req.body.name,
        category: req.body.category,
        image: {
          data: req.file.filename,
          contentType: "image/png",
        },
        price: req.body.price,
        est: req.body.est,
        likes: 0,
      });
      try {
        const it = newItem.save();
        res.json(it);
      } catch (err) {
        res.send("Error");
      }
    }
  });
});

//Updating the item
router.put("/:id", async (req, res) => {
  const { name, category, est, price } = req.body;
  try {
    const newItem = {};
    if (name) {
      newItem.name = name;
    }
    if (category) {
      newItem.category = category;
    }
    if (est) {
      newItem.est = est;
    }
    if (price) {
      newItem.price = price;
    }

    let item = await Items.findById(req.params.id);
    if (!item) {
      return res.status(404).send("Not found");
    }

    item = await Items.findByIdAndUpdate(
      req.params.id,
      { $set: newItem },
      { new: true }
    );
    res.json({ item });
  } catch (err) {
    res.status(500).send("Error");
  }
});

// Deleting the item
router.delete("/:id", async (req, res) => {
  try {
    const item = await Items.findById(req.params.id);
    const it = await item.delete();
    res.json(it);
  } catch (err) {
    res.send("Error");
  }
});

module.exports = router;
