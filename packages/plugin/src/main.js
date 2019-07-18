const application = require("application");
const fs = require("uxp").storage.localFileSystem;
const shell = require("uxp").shell;
const Axios = require("axios");

async function exportRendition(selection) {
  // Exit if there's no selection
  // For production plugins, providing feedback to the user is expected
  if (selection.items.length === 0)
    return console.log("No selection. Guide the user on what to do.");

  // Get a folder by showing the user the system folder picker
  const folder = await fs.getTemporaryFolder();

  // Exit if user doesn't select a folder
  if (!folder) return console.log("User canceled folder picker.");

  // Create a file that will store the rendition
  const file = await folder.createFile("rendition.png", { overwrite: true });

  // Create options for rendering a PNG.
  // Other file formats have different required options.
  // See `application#createRenditions` docs for details.
  const renditionOptions = [
    {
      node: selection.items[0],
      outputFile: file,
      type: application.RenditionType.PNG,
      scale: 2
    }
  ];

  try {
    // Create the rendition(s)
    const results = await application.createRenditions(renditionOptions);
    console.log(
      `PNG rendition has been saved at ${results[0].outputFile.nativePath}`
    );

    const images = [];
    const entries = await folder.getEntries();

    entries.forEach(entry => images.push(entry));

    const data = new FormData();
    for (let i = 0; i < images.length; i++) {
      data.append("image", images[i], images[i].name);
    }

    const res = await Axios.get("http://localhost:8000/room/id");
    const roomId = res.data;
    console.log("room is", res.data);

    const roomUploadRes = await Axios.post(
      `http://localhost:8000/media/${roomId}/upload`,
      data,
      {
        headers: { "Content-Type": "multipart/form-data" }
      }
    );
    console.log("Completed upload");
    shell.openExternal(`http://localhost:3000/room/${roomId}`);
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
