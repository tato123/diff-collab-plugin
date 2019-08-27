const exportArtboards = require("./export");
const firstTime = require("./firsttime");
const getRoomOptions = require("./room/options");
const { error } = require("./lib/dialogs.js");

const displayFallbackError = () => {
  return error(
    "Synchronization Failed",
    "Failed to synchronize all your artboards with our server.",
    "Steps you can take:",
    "* Check your network connection",
    "* Try again in a few minutes",
    "If this problem continues, you can receive help by contacting support@getdiff.app"
  );
};

const handleCreateWhiteboard = async (selection, documentRoot) => {
  try {
    await firstTime();
    // start by getting a unique id or asking the user to select an account
    const { roomId, didCancel } = await getRoomOptions(documentRoot);

    if (!didCancel) {
      await exportArtboards(selection, documentRoot, roomId);
    }
  } catch (err) {
    console.error("[Diff][error]", error);
    await displayFallbackError();
  }
};

module.exports = {
  commands: {
    createWhiteboard: handleCreateWhiteboard
  }
};
