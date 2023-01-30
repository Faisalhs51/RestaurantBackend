const mongoose = require("mongoose");
const { Schema } = mongoose;

const FeedbackSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  desc: {
    type: String,
    required: true,
  },
});

const Feedback = mongoose.model("feedback", FeedbackSchema);
module.exports = Feedback;
