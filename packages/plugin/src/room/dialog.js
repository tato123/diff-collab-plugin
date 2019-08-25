const { createDialog } = require("../lib/dialogs");

const debugMode = false;
const showOurDialog = roomId => {
  return createDialog({
    title: "Whiteboard",
    template: () => `
      <style>
        .inner-container {
          text-align: left;
          display: flex;
          flex: 1 auto;
          width: 100%;
          flex-direction: column;
          justify-content: flex-start;
          margin: 0;
          align-items: flex-start;
        }

        label {
          text-align: left;
          align-items: flex-start;
          justify-content: flex-start;
          justify-self: flex-start;
          width: 97%;
          box-sizing: border-box;
        }

     
        .row {
          display: flex;
          flex: 1 auto;
          width: 100%;
          flex-direction: row;
          border: ${debugMode ? "1px dotted purple;" : "transparent;"}
        }

        .radio-container {
          border: ${debugMode ? "1px dotted cyan;" : "transparent;"}
          width: 100%;
          display: flex;
          flex-direction: column;
          margin-left: 20px;
        }

        .radiogroup {
          border: ${debugMode ? "1px dotted blue;" : "transparent;"}

          display: flex;
          flex-direction: row;
          align-items: center;
        }

        input[type="radio"] {
          width: 17px;
          margin: 0;
        }
     
        .shareLabel {
          margin-top: 2px;
          display: block;
        }

        .radio-outer {
          display: flex;
          flex-direction: column;
          margin-bottom: 16px;
        }

        .radio-outer > .help {
          margin-left: 26px;
          font-size: 12px;
          color: #666;
        }

        .radio-outer.disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
   
      </style>
      <div class="inner-container">


        <div class="row">
            <div>
              <label>
                <span class="shareLabel">Share to:</span>
              </label>
            </div>

            <div class="radio-container" >
              <div class="radio-outer ${roomId == null && "disabled"}">
                <label class="radiogroup ">
                  <input ${
                    roomId != null ? "checked" : "disabled"
                  } id="existingOption" type="radio" name="share_settings" value="existing" >
                  <span for="existingOption">Existing Whiteboard</span>
                </label>
                <span class="help">Updates existing artboards and adds any new artboards to an existing whiteboard</span>
              </div>
            

              <label class="radiogroup">
                <input ${roomId == null &&
                  "checked"} id="newOption" type="radio" name="share_settings" value="new">
                <span for="newOption">New Whiteboard</span>
              </label>
            </div>
        </div>
      </div>
    `,
    buttons: [
      { label: "Cancel", type: "reset", variant: "primary" },
      { label: "Share", type: "submit", variant: "cta" }
    ],
    formValues: true
  });
};

module.exports = showOurDialog;
