const fs = require("uxp").storage.localFileSystem;

const UserPreferences = require("./preferences");

let ourDialog;
function showOurDialog() {
  if (!ourDialog) {
    ourDialog = document.createElement("dialog");
    ourDialog.innerHTML = `
<style>
    form {
        width: 360px;
    }
    .h1 {
        align-items: center;
        display: flex;
    }
    .icon {
        border-radius: 4px;
        width: 24px;
        height: 24px;
        overflow: hidden;
        display: inline;
         align-items: center;
        margin-right: 8px;
      
    }

    .help {
        justify-content: flex-end;
    align-items: flex-end;
    align-self: center;
    display: flex;
    justify-self: flex-end;
    flex: 1 auto;
    }

    .layout {
        display: flex;
        flex: 1 auto;
        flex-direction: row;
        line-height: 1;
    }
</style>
        <form method="dialog">
            <div class="layout">
                <h1 class="h1">
                    <img class="icon" src="./images/icon@2x.png" /> 
                    <span>Get Started</span>
                </h1>
                <a href="${process.env.WEB_URL}/help" class="help">Help</a>
            </div>

            
            <hr />
            <p>How to use this plugin</p>
        
        
            <footer>
                <button id="ok" type="submit" uxp-variant="cta">Get Started</button>
            </footer>
        </form>

        `;
    document.body.appendChild(ourDialog);
  }

  const [dialog, form, ok] = [`dialog`, `form`, "#ok"].map(s =>
    document.querySelector(s)
  );

  // Handle ok button click
  ok.addEventListener("click", e => handleSubmit(e, dialog));
  // Handle form submit via return key
  form.onsubmit = e => handleSubmit(e, dialog);

  return ourDialog.showModal();
}

function handleSubmit(e, dialog, name) {
  console.log("handling submit");
  // Close the dialog, passing back data
  dialog.close("done 123");
  // Prevent further automatic close handlers
  e.preventDefault();
}

const firstTimeCheck = async () => {
  const preferences = await UserPreferences.createFromSettings();
  console.log("Current preferences", preferences);
  if (!preferences.firstTimeSeen) {
    const result = await showOurDialog();
    console.log("executing final step, result is:", result);
    preferences.firstTimeSeen = true;
  } else {
    console.log("[Diff] Dialog already seen");
  }

  return "done";
};

module.exports = firstTimeCheck;
