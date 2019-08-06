require("dotenv").config();

const dbInstance = require("./db");
dbInstance();

const express = require("express");

const upload = require("./upload");
const twilio = require("./twilio");
const room = require("./room");
const cors = require("cors");
const bodyParser = require("body-parser");
const socket = require("./socket");
const socketio = require("socket.io");
const fs = require("fs");

const app = express();
const server = require("http").Server(app);

const io = socketio.listen(server, {
  log: true,
  origins: "*:*"
});

if (process.env.NODE_ENV === "stage" || process.env.NODE_ENV === "production") {
  let redisServer = "localhost";

  if (
    process.env.NODE_ENV === "production" ||
    process.env.NODE_ENV === "stage"
  ) {
    const data = fs.readFileSync("/var/nodelist", "UTF8", function(err) {
      if (err) throw err;
    });

    const nodeList = [];
    if (data) {
      var lines = data.split("\n");
      for (var i = 0; i < lines.length; i++) {
        if (lines[i].length > 0) {
          nodeList.push(lines[i]);
        }
      }
    }

    if (nodeList.length === 0) {
      console.error("No  elasticache nodes present!!");
      throw new Error("Elasticache list empty");
    }

    redisServer = nodeList[0].split(":")[0];
  }

  console.log("[Socket.io] loading socket.io-redis adapter");
  console.log("[Socket.io] redis host is", redisServer);
  const redisAdapter = require("socket.io-redis");
  io.adapter(redisAdapter({ host: redisServer, port: 6379 }));
}

app.use(cors({ origin: true }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  res.status(200).send("ok");
});

socket(io);

const port = process.env.PORT || 8001;

app.use("/media", upload);
app.use("/twilio", twilio);
app.use("/room", room);

server.listen(port, () => {
  console.log("Listening on port", port);
});
