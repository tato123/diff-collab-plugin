const express = require("express");
const router = express.Router();
const Room = require("./db/Room");
const Media = require("./db/Media");
const short = require("short-uuid");

// Endpoint to generate access token
router.get("/id", async (req, res) => {
  try {
    console.log("getting new room id");
    const id = short.generate();
    const created = Date.now();
    const room = new Room({ id: id, created });
    await room.save();
    console.log("Room generated with id", id);
    res.status(200).send(id);
  } catch (err) {
    console.error(err);
    res.status(401).send(err.message);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const media = await Media.get(req.params.id);
    res.status(200).send(media);
  } catch (err) {
    res.status(404).send();
  }
});

router.get("/:id/media", async (req, res) => {
  try {
    const roomId = req.params.id;
    if (!roomId) {
      res.status(400).send("No room defined");
    }

    const room = await Media.scan("roomId")
      .eq(roomId)
      .exec();
    res.status(200).json(room);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

module.exports = router;
