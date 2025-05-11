import { SettingsData } from "../types";

class SettingsDto {
  private ttsVoice: string | undefined;

  constructor() {
    this.#load();
  }

  #load() {
    const data: SettingsData = JSON.parse(
      localStorage.getItem("settings") || "{}"
    );
    this.ttsVoice = data["ttsVoice"] ?? undefined;
  }

  save() {
    localStorage.setItem(
      "settings",
      JSON.stringify({ ttsVoice: this.ttsVoice })
    );
  }

  setData(data: SettingsData) {
    this.ttsVoice = data.ttsVoice;
  }

  getData(): SettingsData {
    this.#load();
    return { ttsVoice: this.ttsVoice };
  }
}

export const settingsDto = new SettingsDto();
