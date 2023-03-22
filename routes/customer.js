const express = require("express");
const router = express.Router();
const Customer = require("../models/Customer");

router.get("/getUser/:email", async (req, res) => {
  try {
    let customer = await Customer.findOne({ email: req.params.email });
    if (customer) {
      res.json(customer);
    } else {
      res.json();
    }
  } catch (err) {
    console.log(err);
    res.send("Error " + err);
  } 
});

router.post("/createUser", async (req, res) => {
  try {
    // console.log(req.body);
    let customer = await Customer.findOne({ email: req.body.email });
    if (customer === null) {
      const user = new Customer({
        email: req.body.email,
        name: req.body.name,
        coins: 0,
      });
      const it = await user.save();
      res.json(it);
    } else {
      res.json();
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
