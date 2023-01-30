const mongoose = require("mongoose");

const mongoURI = "mongodb://localhost/restaurant";

const connectToMongo = () => {
  mongoose.connect(mongoURI, () => {
    console.log("Connected to DB Successfully");
  });
};

module.exports = connectToMongo;
