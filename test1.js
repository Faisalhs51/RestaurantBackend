const express = require("express");
const app = express();
// const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const multer = require("multer");
const cors = require("cors");
const port = 5000;
const fs = require("fs");
const path = require('path');
// const imageModel = require("./mod");
const Item = require("./models/Items");
app.use(cors());

// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(bodyParser.json());

mongoose
  .connect("mongodb://localhost/testing1", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("DB connected successfully"))
  .catch((err) => console.log("DB has an error", err));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

// const storage = multer.memoryStorage();
// const upload = multer({ storage: storage });

const upload = multer({ storage: storage });

app.post("/", upload.single("testImage"), (req, res) => {
  const saveImage = Item({
    name: req.body.name,
    image: {
      data: fs.readFileSync("uploads/" + req.file.filename),
      contentType: "image/png", 
    },
    // image:req.file.buffer,
    category: req.body.category,
    price: req.body.price,
    est: req.body.est,
    likes: 0,
  });
  saveImage
    .save()
    .then((res) => {
      console.log("image is saved");
      const uploadsFolder = path.join(__dirname, 'uploads');
      fs.unlink(path.join(uploadsFolder, req.file.filename), (err) => {
        if (err) {
          console.error(err);
        }
      });
    })
    .catch((err) => {
      console.log(err, "error has occur");
    });
  res.send("image is saved");
});

app.get("/", async (req, res) => {
  const allData = await Item.find();
  res.json(allData);
});

app.listen(port, () => {
  console.log("server running successfully");
});
