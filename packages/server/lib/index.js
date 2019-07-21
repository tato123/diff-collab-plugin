require("dotenv").config();

const dbInstance = require("./db");
dbInstance();

const express = require("express");
const app = express();
const upload = require("./upload");
const twilio = require("./twilio");
const room = require("./room");
const cors = require("cors");

app.use(cors({ origin: true }));

const port = 8001;

app.use("/media", upload);
app.use("/twilio", twilio);
app.use("/room", room);

app.listen(port, () => {
  console.log("Listening on port", port);
});
