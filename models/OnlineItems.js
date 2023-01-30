const mongoose = require("mongoose");
const { Schema } = mongoose;

const OnlineItemsSchema = new Schema({
  email: {
    type: String,
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
    },
  ],
});

const OnlineItems = mongoose.model("onlineItems", OnlineItemsSchema);
module.exports = OnlineItems;
