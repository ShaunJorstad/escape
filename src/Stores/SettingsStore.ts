import { emit } from "@tauri-apps/api/event";
import { defineStore } from "pinia";
import { computed, reactive, ref, watch, watchEffect } from "vue";
import router from "../Router";
import { appDataDir } from "@tauri-apps/api/path";
import { path, fs } from "@tauri-apps/api";

async function getConfigPath() {
  const appDataDirPath = await appDataDir();
  return path.join(appDataDirPath, "config.json");
}

async function readSettings() {
  const configPath = await getConfigPath();
  const exists = await fs.exists(configPath);
  if (exists) {
    const data = await fs.readTextFile(configPath);
    return JSON.parse(data);
  }
}

async function writeSettings(data: object) {
  let path = router.currentRoute.value.path;
  if (path != "/primary") {
    return;
  }
  const base = await appDataDir();
  const configPath = await getConfigPath();
  let appDirExists = await fs.exists(base);
  if (!appDirExists) {
    console.log("Creating appdata directory");
    await fs.createDir(base);
  }
  fs.writeTextFile(configPath, JSON.stringify(data));
  console.log(configPath);
}

let defaultSettings = {
  title: "",
  startHours: 0,
  startMinutes: 0,
  enableHints: false,
  hints: [],
};

// Non-idiomatic, but we only need one store instance
// for the entire app
const createStore = defineStore("store", () => {
  // State
  const settings = reactive(defaultSettings);
  const timerIsActive = ref(false);
  const monitorView = ref("");
  const monitorIsOpen = ref(false);

  // Getters

  // Actions
  function setSetting(key: string, value: any) {
    // Only set valid settings
    if (!Object.keys(settings).includes(key)) {
      return;
    }
    // @ts-ignore
    settings[key] = value;
  }

  function toggle() {
    emit("clock", {
      status: timerIsActive.value ? "pause" : "play",
    });

    timerIsActive.value = !timerIsActive.value;
  }

  function increment(size: number) {
    if (size > 59) {
      return;
    }
    let totalMinutes = settings.startHours * 60 + settings.startMinutes;
    if (size < 0 && -1 * size >= totalMinutes) {
      settings.startHours = 0;
      settings.startMinutes = 0;
      return;
    }
    settings.startMinutes += size;
    // overflow
    if (settings.startMinutes > 59) {
      settings.startHours++;
      settings.startMinutes -= 59;
    }
    // underflow
    if (settings.startMinutes < 0) {
      settings.startHours -= 1;
      settings.startMinutes = 59;
    }
  }

  function consumeBroadcast(data: any) {
    Object.keys(data.settings).forEach((key) => {
      // @ts-ignore
      settings[key] = data.settings[key];
    });
  }

  const dataForBroadcast = computed(() => {
    let data = {
      settings: JSON.parse(JSON.stringify(settings)),
    };
    writeSettings(data);
    return data;
  });

  /**
   * Read settings saved locally if they exist
   */
  async function init() {
    const data = await readSettings();
    console.log(data, "Initializing data");
    consumeBroadcast(data);
  }

  function incrementHints(inc: boolean) {
    if (inc) {
      // @ts-ignore
      settings.hints?.push(true);
    } else {
      if (settings.hints?.length === 0) {
        return;
      }
      settings.hints?.pop();
    }
  }

  function toggleHint(index: number) {
    if (index > settings.hints.length) {
      return;
    }
    // @ts-ignore
    settings.hints[index] = !settings.hints[index];
  }

  return {
    toggleHint,
    incrementHints,
    settings,
    monitorView,
    monitorIsOpen,
    timerIsActive,
    increment,
    toggle,
    setSetting,
    dataForBroadcast,
    consumeBroadcast,
    init,
  };
});

let instance: any;
function useSettingsStore() {
  if (!instance) {
    instance = createStore();
    instance.init();
  }
  return instance;
}

export { useSettingsStore };
