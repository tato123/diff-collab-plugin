require("dotenv").config();

const dbInstance = require("./db");
dbInstance();

const express = require("express");

const upload = require("./upload");
const twilio = require("./twilio");
const room = require("./room");
const cors = require("cors");
const pusher = require("./pusher");
const bodyParser = require("body-parser");
const socket = require("./socket");
const socketio = require("socket.io");

const app = express();
const server = require("http").Server(app);

const io = socketio.listen(server, {
  log: true,
  origins: "*:*"
});

app.use(cors({ origin: true }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

socket(io);

const port = 8001;

app.use("/media", upload);
app.use("/twilio", twilio);
app.use("/room", room);
app.use("/pusher", pusher);

server.listen(port, () => {
  console.log("Listening on port", port);
});
