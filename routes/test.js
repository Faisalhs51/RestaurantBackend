const express = require("express");
const router = express.Router();
// const mongoose = require('mongoose');
const multer = require("multer");
const path = require("path");
const fs = require("fs").promises;
const Items = require("../models/Items");

// Connect to MongoDB
// mongoose.connect('mongodb://localhost/test', { useNewUrlParser: true });

// // Define a schema for the image
// const imageSchema = new mongoose.Schema({
//   name: String,
//   data: Buffer,
//   contentType: String,
//   integerValue: Number
// });

// // Create a model for the image
// const Image = mongoose.model('Image', imageSchema);

// Set up multer for handling file uploads
const upload = multer({ dest: path.join(__dirname, "uploads") });

// Create an Express.js app
// const app = express();

// POST method for uploading an image
router.post("/images", upload.single("image"), async (req, res) => {
  try {
    // Read the image file
    const data = await fs.readFile(req.file.path);

    // Create a new image document
    const newItem = new Items({
      name: req.body.name,
      category: req.body.category,
      data: data,
      contentType: req.file.mimetype,
      price: req.body.price,
      est: req.body.est,
      likes: 0,
    });

    // Save the image to the database
    const it = await newItem.save();
    console.log(it);
    console.log("Image saved to the database");
    res.status(200).json({ message: "Image uploaded successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to upload image" });
  }
});

// Start the Express.js app
// app.listen(3000, () => {
//   console.log("Express.js app listening on port 3000");
// });

module.exports = router;
