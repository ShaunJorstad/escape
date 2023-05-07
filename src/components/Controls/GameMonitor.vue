<script setup lang="ts">
import { useSettingsStore } from "../../Stores/SettingsStore";
import PrimaryButton from "./PrimaryButton.vue";
import { WebviewWindow } from "@tauri-apps/api/window";
import { emit } from "@tauri-apps/api/event";
import Timer from "../../Timer.vue";
const settingsStore = useSettingsStore();

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
</script>
<template>
  <div
    class="h-96 mt-4 drop-shadow-md bg-primary-light-gray rounded-xl relative"
  >
    <div class="absolute w-full h-full">
      <!-- Timer -->
      <Timer class="scale-50 absolute fix" />
    </div>
    <div
      class="absolute w-full h-full flex justify-center items-center opacity-0 hover:opacity-100"
    >
      <PrimaryButton
        @click="openGameMonitor"
        :text="'Open Game Monitor'"
        v-if="!settingsStore.monitorIsOpen"
      />
    </div>
  </div>
</template>

<style>
.fix {
  /* These styles started getting overriden without any code changes when they were tailwind. 😭 */
  height: 200% !important;
  width: 200% !important;
  left: -50%;
  top: -50%;
}
</style>
