const express = require("express");
const router = express.Router();
const Room = require("./db/Room");
const short = require("short-uuid");

// Endpoint to generate access token
router.get("/id", async (req, res) => {
  try {
    const id = short.generate();
    const room = new Room({ id: id });
    await room.save();
    res.status(200).send(id);
  } catch (err) {
    res.status(401).send(err.message);
  }
});

router.get("/:id/media", async (req, res) => {
  try {
    const roomId = req.params.id;
    if (!roomId) {
      res.status(400).send("No room defined");
    }

    const room = await Room.get({ id: roomId });
    res.status(200).json(room.media);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

module.exports = router;
