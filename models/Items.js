const mongoose = require("mongoose");
const { Schema } = mongoose;

const ItemsSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  image: {
    data: Buffer,
    contentType: String,
  },
  price: {
    type: Number,
    required: true,
  },
  est: {
    type: Number,
    required: true,
  },
  likes: {
    type: Number,
  },
});

const Items = mongoose.model("items", ItemsSchema);
module.exports = Items;
