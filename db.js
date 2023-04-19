require("dotenv").config();
const mongoose = require("mongoose");

// const mongoURI = "mongodb://localhost/restaurant";
const mongoURI = process.env.DB_CONN_STRING;

const connectToMongo = () => {
  mongoose.connect(mongoURI, () => {
    console.log("Connected to DB Successfully");
  });
};

module.exports = connectToMongo;
