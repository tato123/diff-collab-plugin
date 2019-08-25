const application = require("application");
const fs = require("uxp").storage.localFileSystem;
const shell = require("uxp").shell;
const Axios = require("axios");
const scenegraph = require("scenegraph");

/**
 * Handle creating file entries for our entire document
 * @param {*} documentRoot
 */
async function createRenditionSettings(documentRoot) {
  const folder = await fs.getTemporaryFolder();

  // Get all
  let artboardList = [];

  await documentRoot.children.forEach(e => {
    artboardList.push(e);
  });

  const artboardChildren = artboardList.filter(node => {
    return node instanceof scenegraph.Artboard;
  });

  const arr = artboardChildren.map(async item => {
    const file = await folder.createFile(`${item.guid}.png`, {
      overwrite: true
    });

    const settings = {
      node: item,
      outputFile: file,
      type: "png",
      scale: 1
    };

    return settings;
  });

  return Promise.all(arr);
}

/**
 * Handler for the export operation
 * @param {*} selection
 * @param {*} documentRoot
 */
async function exportRendition(selection, documentRoot, roomId) {
  try {
    console.log("[Diff] exporting artboards");
    const renditions = await createRenditionSettings(documentRoot);

    // Create the rendition(s)
    const results = await application.createRenditions(renditions);

    const images = results.map(result => result.outputFile);

    const imageUploads = images.map((image, idx) => {
      const data = new FormData();
      data.append("image", image, image.name);

      const gb = renditions[idx].node.globalBounds;
      const artboardGuid = renditions[idx].node.guid;

      const roomUploadRes = Axios.post(
        `${process.env.API_SERVER}/media/${roomId}/media`,
        data,
        {
          headers: { "Content-Type": "multipart/form-data" },
          params: {
            x: gb.x,
            y: gb.y,
            w: gb.width,
            h: gb.height,
            guid: artboardGuid
          }
        }
      );
      console.log(renditions[idx].node.name, gb.x, gb.y);
      return roomUploadRes;
    });
    await Promise.all(imageUploads);

    shell.openExternal(`${process.env.WEB_URL}/room/${roomId}`);
  } catch (err) {
    // Exit if there's an error rendering.
    return console.log("Something went wrong. Let the user know.", err);
  }
}

module.exports = exportRendition;
