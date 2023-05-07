import { emit } from "@tauri-apps/api/event";
import { defineStore } from "pinia";
import { computed, reactive, ref, watch, watchEffect } from "vue";

const defaultSettings = {
  title: "",
  startHours: 0,
  startMinutes: 0,
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
      settings.startMinutes = 0;
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
    return data;
  });

  return {
    settings,
    monitorView,
    monitorIsOpen,
    timerIsActive,
    increment,
    toggle,
    setSetting,
    dataForBroadcast,
    consumeBroadcast,
  };
});

let instance: any;
function useSettingsStore() {
  if (!instance) {
    instance = createStore();
  }
  return instance;
}

export { useSettingsStore };
