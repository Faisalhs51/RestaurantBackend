const mongoose = require("mongoose");
const { Schema } = mongoose;

const OnlineItemsSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  tableno: {
    type: Number,
    required: true,
  },
  show: {
    type: Boolean,
    required: true,
  },
  cart: [
    {
      name: {
        type: String,
        required: true,
      },
      price: {
        type: Number,
        required: true,
      },
      qty: {
        type: Number,
      },
      show: {
        type: Boolean,
      },
    },
  ],
});

const OnlineItems = mongoose.model("onlineItems", OnlineItemsSchema);
module.exports = OnlineItems;
