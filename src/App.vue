<script setup lang="ts">
import { emit, listen } from "@tauri-apps/api/event";
import { onMounted, onUnmounted } from "vue";
import { useSettingsStore } from "./Stores/SettingsStore";
import Router from "./Router";
import { checkUpdate } from "@tauri-apps/api/updater";
import { WebviewWindow } from "@tauri-apps/api/window";
import { closeAllWindows } from "./WindowManager";

const settingsStore = useSettingsStore();

const unlistenClose = listen("tauri://close-requested", (event) => {
  if (event.windowLabel === "timer") {
    settingsStore.monitorIsOpen = false;
  }
});

const unlistenNavigationChange = listen("change-navigation", (event) => {
  if (Router.currentRoute.value.path === "/") {
    // @ts-ignore
    Router.push(event?.payload?.guess ? "/guess" : "/timer");
  }
});

const unlistenUpdates = listen("tauri://update-status", (event) => {
  console.log(event);
});

const unlistenCloseWindow = listen("tauri://close-requested", (event) => {
  closeAllWindows();
});

onUnmounted(async () => {
  (await unlistenClose)();
  (await unlistenNavigationChange)();
  (await unlistenUpdates)();
  (await unlistenCloseWindow)();
});
onMounted(() => {});
</script>

<template>
  <main class="bg-primary-light-gray h-screen w-screen">
    <div data-tauri-drag-region class="w-full h-8 min-h-8"></div>
    <div class="">
      <router-view></router-view>
    </div>
  </main>
</template>

<style scoped></style>
