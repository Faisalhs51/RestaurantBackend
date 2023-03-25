const express = require("express");
const router = express.Router();
require("dotenv").config();
const OnlineItems = require("../models/OnlineItems");
const nodemailer = require("nodemailer");
const Customer = require("../models/Customer");

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

router.get("/:email", async (req, res) => {
  try {
    // const itemsList = await OnlineItems.find({ _id: req.params.id });
    const itemsList = await OnlineItems.findOne({ email: req.params.email });
    // console.log(itemsList)
    if (itemsList) {
      let total = 0;
      for (let i of itemsList.cart) {
        total += i.price * i.qty;
      }
      res.json(total);
    } else {
      res.json();
    }
  } catch (err) {
    res.send("Error " + err);
  }
});

const calculateOrderAmount = async (email) => {
  // Replace this constant with a calculation of the order's amount
  // Calculate the order total on the server to prevent
  // people from directly manipulating the amount on the client
  try {
    const itemsList = await OnlineItems.findOne({ email });
    // console.log(itemsList);
    if (itemsList) {
      let total = 0;
      for (let i of itemsList.cart) {
        total += i.price * i.qty;
      }
      return (total + 100) * 100;
    } else {
      // res.json();
      return 0;
    }
  } catch (err) {
    console.log("Error " + err);
  }
};

// router.post("/create-checkout-session", async (req, res) => {
//   const session = await stripe.checkout.sessions.create({
//     line_items: [
//       {
//         // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
//         price: 'price_1MigckSChO663qU84N0sxhpl',
//         quantity: 1,
//       },
//     ],
//     mode: "payment",
//     success_url: `${YOUR_DOMAIN}?success=true`,
//     cancel_url: `${YOUR_DOMAIN}?canceled=true`,
//   });

//   res.redirect(303, session.url);
// });

// router.post("/payment/create", async (req, res) => {
//   const total = req.body.amount;
//   console.log("Payment Request recieved for this ruppess", total);

//   const payment = await stripe.paymentIntents.create({
//     amount: total * 100,
//     currency: "inr",
//   });

//   res.status(201).send({
//     clientSecret: payment.client_secret,
//   });
// });

router.post("/create-payment-intent", async (req, res) => {
  const email = req.body.email;
  // let m = (await calculateOrderAmount(email)) - 520 * 10;
  // console.log(m);
  // console.log("hi");
  // Create a PaymentIntent with the order amount and currency
  // A PaymentIntent tracks the customer’s payment lifecycle, keeping track of any failed payment attempts and ensuring the customer is only charged once.
  try {
    let am = (await calculateOrderAmount(email)) - req.body.coin * 10;
    const paymentIntent = await stripe.paymentIntents.create({
      amount: am <= 100 ? 100 : am,
      // (await calculateOrderAmount(email)) - req.body.coin * 10 < 0 ? 100 : ,
      currency: "inr",
      automatic_payment_methods: {
        enabled: true,
      },
    });

    res.send({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
});

const sendMail = async (receiver, items, total) => {
  //   const content = `
  // <h3>Thank you for coming<h3>

  // <p>This is receipt for your recent order:</p>
  // <p>
  // ${items}
  // </p>
  // <br>
  // <p>Total Bill: </p><strong>&#8377;${total}</strong>
  // <br>
  // Regards,<br>
  // Mannat Hotel.`;
  const content = `<!DOCTYPE html>
<html>
<head>
	<meta charset="UTF-8">
	<title>Food Order Receipt</title>
	<style type="text/css">
		body {
			font-family: Arial, Helvetica, sans-serif;
			font-size: 16px;
			color: #333333;
			background-color: #f5f5f5;
			margin: 0;
			padding: 0;
		}
		h1, h2, h3 {
			color: #333333;
			margin: 0;
		}
		a {
			color: #f7941d;
			text-decoration: none;
		}
		.container {
			max-width: 600px;
			margin: 0 auto;
			padding: 20px;
			background-color: #ffffff;
			border-radius: 5px;
			box-shadow: 0px 5px 20px rgba(0,0,0,0.1);
		}
		.header {
			background-color: #f7941d;
			color: #ffffff;
			padding: 20px;
			border-radius: 5px 5px 0 0;
			text-align: center;
			margin-bottom: 20px;
		}
		.header h1 {
			font-size: 32px;
			margin: 0;
		}
		.table {
			width: 100%;
			border-collapse: collapse;
			margin-bottom: 20px;
			font-size: 16px;
			color: #333333;
			background-color: #ffffff;
			border-radius: 5px;
			box-shadow: 0px 5px 20px rgba(0,0,0,0.1);
		}
		.table th, .table td {
			padding: 15px;
			text-align: center;
			border-bottom: 1px solid #dddddd;
      text-transform: capitalize;
		}
		.table th {
			background-color: #f7941d;
			color: #ffffff;
			border-radius: 5px 5px 0 0;
		}
		.table tfoot th {
			text-align: center;
		}
		.footer {
			background-color: #f5f5f5;
			color: #333333;
			padding: 20px;
			border-radius: 0 0 5px 5px;
			text-align: center;
		}
		.footer p {
			margin: 0;
		}
    .regards{
      color: #333333;
      font-weight: bold;
      font-size: 14px;
    }
	</style>
</head>
<body>
	<div class="container">
		<div class="header">
			<h1>Food Order Receipt</h1>
		</div>

		<table class="table">
			<thead>
				<tr>
					<th>Item</th>
					<th>Quantity</th>
					<th>Price</th>
				</tr>
			</thead>
			<tbody>
      ${items}
      <tr>
        <td colspan="2" style="text-align:center;">Service Charge</td>
        <td>100</td>
      </tr>
			</tbody>
			<tfoot>
				<tr>
					<th colspan="2">Total</th>
					<td>${total}</td>
				</tr>
			</tfoot>
		</table>

    <div class="footer">
		<p>Thank you for your order!</p>
	</div>
  <div class="regards">
  <p>
  Regards,<br>
  Hotel Mannat.
  </p>
  </div>
</div>`;
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "faisalcom6119027@gmail.com",
      // pass: "faisal786",
      pass: "mxvsowbefmhstnbk",
    },
  });

  let mailOptions = {
    from: "faisalcom6119027@gmail.com",
    to: receiver,
    subject: "Mannat Hotel | Order Receipt",
    text: "You hotel mannat receipt",
    html: content,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
};

router.post("/billing/sendmail/", async (req, res) => {
  try {
    const email = req.body.email;
    const coin = req.body.coin;
    let items = "";
    let am = await calculateOrderAmount(email);
    let total = am - coin * 10;
    if (total <= 100) {
      total = 100;
    }

    let customer = await Customer.findOne({ email: req.body.email });
    let c = customer.coins;
    if (am / 10 < coin) {
      c = Math.abs(am / 100 - coin / 10);
      c += (am / 100) * 0.08;
    } else if (coin === 0) {
      c += (am / 100) * 0.08;
    } else {
      c = (am / 100) * 0.08;
    }
    // console.log(c);

    customer.set({ coins: Math.floor(c) });
    await customer.save();
    // customer = await Customer.findByIdAndUpdate();

    const itemsList = await OnlineItems.findOne({ email: req.body.email });
    if (itemsList) {
      for (let i of itemsList.cart) {
        items += `<tr>
        <td style="text-align:left;">${i.name}</td>
        <td>${i.qty}</td>
        <td>${i.price * i.qty}</td>
      </tr>`;
        // items += `${i.name}  ${i.qty}  ${i.price * i.qty}<br>`;
      }
    }
    await sendMail(email, items, total / 100);
    res.json("Message sented successfully.");
  } catch (err) {
    console.log(err);
    res.status(500).send("Internal Server Error");
  }
});
module.exports = router;
