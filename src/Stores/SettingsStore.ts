import { defineStore } from "pinia";
import { computed, reactive, ref, watch, watchEffect } from "vue";

const defaultSettings = {
  title: "",
};

// Non-idiomatic, but we only need one store instance
// for the entire app
const createStore = defineStore("store", () => {
  // State
  const settings = reactive(defaultSettings);
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
