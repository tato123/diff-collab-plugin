const express = require("express");
const router = express.Router();

const Pusher = require("pusher");

const pusher = new Pusher({
  appId: "835293",
  key: "91a64093ff1be24f878a",
  secret: "08e778cb3b49d514b330",
  cluster: "us2",
  encrypted: true
});

// Endpoint to generate access token
router.post("/auth", async (req, res) => {
  console.log("Authenticating pusher user", req.body);
  const socketId = req.body.socket_id;
  const channel = req.body.channel_name;
  const presenceData = {
    user_id: "unique_user_id",
    user_info: {
      name: "Mr Channels",
      twitter_id: "@pusher"
    }
  };
  const auth = pusher.authenticate(socketId, channel, presenceData);
  res.send(auth);
});

module.exports = router;
