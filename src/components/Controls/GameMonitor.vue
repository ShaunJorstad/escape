<script setup lang="ts">
import { useSettingsStore } from "../../Stores/SettingsStore";
import PrimaryButton from "./PrimaryButton.vue";
import { WebviewWindow } from "@tauri-apps/api/window";
import { emit } from "@tauri-apps/api/event";
import Timer from "../../Timer.vue";
import {
  ArrowsPointingOutIcon,
  ArrowsPointingInIcon,
} from "@heroicons/vue/20/solid";
import { ref } from "vue";
const settingsStore = useSettingsStore();
const expand = ref(false);

function emitChangeNavigation(index: number) {
  if (index >= 10) {
    return;
  }
  emit("change-navigation");
  setTimeout(() => {
    emitChangeNavigation(index + 1);
  }, 200);
}

function openGameMonitor() {
  const mainWindow = WebviewWindow.getByLabel("timer");
  if (mainWindow) return;
  const webview = new WebviewWindow("timer", {
    url: "index.html",
  });
  webview.once("tauri://created", function () {
    // webview window successfully created
    settingsStore.monitorIsOpen = true;

    emitChangeNavigation(0);
  });
}

function toggle() {
  expand.value = !expand.value;
}

function closeGameMonitor() {
  const timerWindow = WebviewWindow.getByLabel("timer");
  if (timerWindow) {
    timerWindow.close();
    settingsStore.monitorIsOpen = false;
  }
}
</script>
<template>
  <div
    class="h-96 mt-4 drop-shadow-md bg-primary-light-gray rounded-xl relative"
    :class="{ expand }"
  >
    <div class="absolute w-full h-full">
      <!-- Timer -->
      <Timer
        class="absolute"
        :class="{
          small: !expand,
          large: expand,
        }"
      />
    </div>
  </div>
</template>

<style>
.small {
  /* These styles started getting overriden without any code changes when they were tailwind. 😭 */
  transform: scale(0.5);
  height: 200% !important;
  width: 200% !important;
  left: -50%;
  top: -50%;
}
.large {
  transform: scale(0.75) !important;
  height: 125% !important;
  width: 125% !important;
  top: -12.5%;
  left: -12.5%;
}
.expand {
  position: absolute !important;
  top: 10vh;
  left: 10vw;
  width: 80vw !important;
  height: 80vh !important;
  z-index: 400;
}
</style>
