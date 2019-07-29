const application = require("application");
const fs = require("uxp").storage.localFileSystem;
const shell = require("uxp").shell;
const Axios = require("axios");
const scenegraph = require("scenegraph");

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

async function exportRendition(selection, documentRoot) {
  try {
    const renditions = await createRenditionSettings(documentRoot);
    console.log(
      renditions[0].node.globalBounds,
      renditions[0].node.name,
      renditions[0].node.guid
    );
    // Create the rendition(s)
    const results = await application.createRenditions(renditions);

    const images = results.map(result => result.outputFile);

    const res = await Axios.get(`${process.env.API_SERVER}/room/id`);
    const roomId = res.data;
    console.log("room is", res.data);

    // const data = new FormData();
    // for (let i = 0; i < images.length; i++) {
    //   data.append("image", images[i], images[i].name);
    // }

    // const roomUploadRes = await Axios.post(
    //   `${process.env.API_SERVER}/media/${roomId}/upload`,
    //   data,
    //   {
    //     headers: { "Content-Type": "multipart/form-data" }
    //   }
    // );
    // console.log("Completed upload");
    // shell.openExternal(`${process.env.WEB_URL}/room/${roomId}`);

    //

    images.forEach(async (image, idx) => {
      const data = new FormData();
      data.append("image", image, image.name);

      const gb = renditions[idx].node.globalBounds;
      const roomUploadRes = await Axios.post(
        `${process.env.API_SERVER}/media/${roomId}/media`,
        data,
        {
          headers: { "Content-Type": "multipart/form-data" },
          params: {
            x: gb.x,
            y: gb.y,
            w: gb.width,
            h: gb.height
          }
        }
      );
      console.log(renditions[idx].node.name, gb.x, gb.y);
    });

    shell.openExternal(`${process.env.WEB_URL}/room/${roomId}`);
  } catch (err) {
    // Exit if there's an error rendering.
    return console.log("Something went wrong. Let the user know.", err);
  }
}

function createDialog(filepath) {
  // Add your HTML to the DOM
  document.body.innerHTML = `
    <style>
    form {
        width: 400px;
    }
    </style>
    <dialog id="dialog">
        <form method="dialog">
            <h1>Redition saved</h1>
            <p>Your rendition was saved at:</p>
            <input type="text" uxp-quiet="true" value="${filepath}" readonly />
            <footer>
            <button type="submit" uxp-variant="cta" id="ok-button">OK</button>
            </footer>
        </form>
    </dialog>
  `;

  // Remove the dialog from the DOM every time it closes.
  // Note that this isn't your only option for DOM cleanup.
  // You can also leave the dialog in the DOM and reuse it.
  // See the `ui-html` sample for an example.
  const dialog = document.querySelector("#dialog");
  dialog.addEventListener("close", e => {
    dialog.remove();
  });

  return dialog;
}

module.exports = {
  commands: {
    createRectangle: exportRendition
  }
};
