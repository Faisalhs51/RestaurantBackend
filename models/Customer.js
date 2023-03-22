const mongoose = require("mongoose");
const { Schema } = mongoose;

const CustomerSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  // phone: {
  //   type: Number,
  //   required: true,
  // },
  coins: {
    type: Number,
  },
});

const Customer = mongoose.model("customer", CustomerSchema);
module.exports = Customer;
