const mongoose = require("mongoose");
const { Schema } = mongoose;

const SpecialItemSchema = new Schema({
    id: {
        type: String,
        required: true,
      },
});

const SpecialItem = mongoose.model("specialItem", SpecialItemSchema);
module.exports = SpecialItem;
