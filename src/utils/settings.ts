import { chromeGet, chromeSet, isNull } from './utils';

class Settings {
  checkForUpdates: boolean | undefined;
  developerNetwork: boolean | undefined;
  projectNetwork: boolean | undefined;
  graphType:string;

  constructor() {
    this.checkForUpdates = true;
    this.developerNetwork = true;
    this.projectNetwork = true;
    this.graphType="echarts";
  }

  loadFromJson(data: { [key: string]: any; }): void {
    if ("checkForUpdates" in data) {
      this.checkForUpdates = data["checkForUpdates"];
    }
    if ("developerNetwork" in data) {
      this.developerNetwork = data["developerNetwork"];
    }
    if ("projectNetwork" in data) {
      this.projectNetwork = data["projectNetwork"];
    }
    if ("graphType" in data) {
      this.graphType = data["graphType"];
    }
  }

  toJson(): { [key: string]: any; } {
    const result: { [key: string]: any; } = {};
    result["checkForUpdates"] = this.checkForUpdates;
    result["developerNetwork"] = this.developerNetwork;
    result["projectNetwork"] = this.projectNetwork;
    result["graphType"]=this.graphType;

    return result;
  }
}

export const loadSettings = async () => {
  const settings = new Settings();
  let obj = await chromeGet("settings");
  if (isNull(obj)) {
    obj = {};
  }
  settings.loadFromJson(obj);
  return settings;
}

export const mergeSettings = async (data: { [key: string]: any; }) => {
  const settings = await loadSettings();
  if (!isNull(data)) {
    settings.loadFromJson(data);
    await chromeSet("settings", settings.toJson());
  }
  return settings;
}


export default Settings;