const mongoose = require("mongoose");
const { Schema } = mongoose;

const SpecialItemSchema = new Schema({
    
});

const SpecialItem = mongoose.model("specialItem", SpecialItemSchema);
module.exports = SpecialItem;
