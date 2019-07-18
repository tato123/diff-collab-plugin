const express = require("express");
const router = express.Router();

// Endpoint to generate access token
router.get("/id", (req, res) => {
  res.status(200).send("01123");
});

module.exports = router;
