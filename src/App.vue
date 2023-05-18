<script setup lang="ts">
import { emit, listen } from "@tauri-apps/api/event";
import { onMounted, onUnmounted } from "vue";
import { useSettingsStore } from "./Stores/SettingsStore";
import Router from "./Router";
import { checkUpdate } from "@tauri-apps/api/updater";

const settingsStore = useSettingsStore();

const unlistenClose = listen("tauri://close-requested", (event) => {
  if (event.windowLabel === "timer") {
    settingsStore.monitorIsOpen = false;
  }
});

const unlistenNavigationChange = listen("change-navigation", (event) => {
  if (Router.currentRoute.value.path === "/") {
    Router.push("/timer");
  }
});

const unlistenUpdates = listen("tauri://update-status", (event) => {
  console.log(event);
});

onUnmounted(async () => {
  (await unlistenClose)();
  (await unlistenNavigationChange)();
  (await unlistenUpdates)();
});
onMounted(async () => {
  let result = await checkUpdate();
  console.log(result);
});
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
