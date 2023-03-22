const express = require("express");
const cors = require("cors");
const connectToMongo = require("./db");

connectToMongo();
const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

// Available routes
app.use("/api/items", require("./routes/items"));
app.use("/api/customer", require("./routes/customer"));
app.use("/api/onlineCart", require("./routes/onlineItems"));
app.use("/api/feedback", require("./routes/feedback"));
app.use("/api/bill", require("./routes/billing"));
app.use("/api/testing", require("./routes/test"));
app.use("/api/specialItems", require("./routes/specialItem"));
app.use("/api/storekeeper", require("./routes/storekeeper"));

app.listen(port, () => {
  console.log(`Backend listening at http://localhost:${port}`);
});
