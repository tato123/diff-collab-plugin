var AccessToken = require("twilio").jwt.AccessToken;
var VideoGrant = AccessToken.VideoGrant;
var SyncGrant = AccessToken.SyncGrant;

const express = require("express");
const router = express.Router();

// Endpoint to generate access token
router.get("/token", function(request, response) {
  var identity = Math.floor(Math.random() * 10000) + "-tester";

  // Create an access token which we will sign and return to the client,
  // containing the grant we just created
  var token = new AccessToken(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_API_KEY,
    process.env.TWILIO_API_SECRET
  );

  // Assign the generated identity to the token
  token.identity = identity;

  const videoGrant = new VideoGrant();

  // Grant token access to the Video API features
  token.addGrant(videoGrant);

  const syncGrant = new SyncGrant({
    serviceSid: process.env.TWILIO_SYNC_SERVICE_SID || "default"
  });
  token.addGrant(syncGrant);

  // Serialize the token to a JWT string and include it in a JSON response
  response.send({
    identity: identity,
    token: token.toJwt()
  });
});

module.exports = router;
