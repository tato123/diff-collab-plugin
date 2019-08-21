const exportArtboards = require("./export");
const firstTime = require("./firsttime");

const handleCreateWhiteboard = async (selection, documentRoot) => {
  await firstTime();
  await exportArtboards(selection, documentRoot);
};

module.exports = {
  commands: {
    createWhiteboard: handleCreateWhiteboard
  }
};
