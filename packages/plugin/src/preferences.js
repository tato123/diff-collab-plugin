const fs = require("uxp").storage.localFileSystem;

const initialState = {
  firstTimeSeen: false
};

class Preferences {
  constructor(state, saveFn = Preferences.saveToSettings) {
    this.state = Object.assign({}, initialState, state);
    this._saveFn = saveFn;
  }

  setState(next, cb) {
    const prev = this.state;
    this.state = Object.assign({}, prev, next);
    if (this._saveFn) {
      this._saveFn(this.state);
    }
    cb && cb(next, prev);
  }

  set firstTimeSeen(value) {
    this.setState({
      firstTimeSeen: value
    });
  }

  get firstTimeSeen() {
    return this.state.firstTimeSeen;
  }

  static async saveToSettings(state) {
    const settingsFolder = await fs.getDataFolder();
    try {
      const settingsFile = await settingsFolder.createFile("settings.json", {
        overwrite: true
      });
      console.log("Updating settings", state);
      if (settingsFile) {
        await settingsFile.write(JSON.stringify(state));
      } else {
        console.log(
          `[DIFF  Whiteboard] Couldn't serialize settings. ${err.message}`
        );
      }
    } catch (err) {
      console.log(
        `[DIFF  Whiteboard] Couldn't serialize settings. ${err.message}`
      );
    }
  }

  static async createFromSettings() {
    const settingsFolder = await fs.getDataFolder();
    try {
      const settingsFile = await settingsFolder.getEntry("settings.json");
      if (settingsFile) {
        const data = JSON.parse(await settingsFile.read());
        return new Preferences(data);
      } else {
        return new Preferences();
      }
    } catch (err) {
      console.error(
        `[Diff Whiteboard] Could not read settings. ${err.message}`
      );
      return new Preferences();
    }
  }
}

module.exports = Preferences;
