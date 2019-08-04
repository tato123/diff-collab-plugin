require("dotenv").config();

const dbInstance = require("./db");
dbInstance();

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();

app.use(cors({ origin: true }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  res.status(200).send("ok");
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log("Listening on port", port);
});
