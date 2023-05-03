<script setup lang="ts">
import Placeholder from "./components/Placeholder.vue";
import Route from "./components/Route.vue";
import Title from "./components/Controls/Title.vue";
import Timer from "./components/Controls/Timer.vue";
import BreadCrumbs from "./components/BreadCrumbs.vue";
import Hints from "./components/Controls/Hints.vue";
import Messages from "./components/Controls/Messages.vue";
import GameMonitor from "./components/Controls/GameMonitor.vue";
import { onMounted, onUnmounted, watchEffect } from "vue";
import { useSettingsStore } from "./Stores/SettingsStore";
import { emit, listen } from "@tauri-apps/api/event";

const settingsStore = useSettingsStore();

const unlisten = listen("request-broadcast", () => {
  emit("broadcast", settingsStore.dataForBroadcast);
});

watchEffect(() => {
  emit("broadcast", settingsStore.dataForBroadcast);
});

onMounted(() => {
  settingsStore.monitorView = "timer";
});

onUnmounted(async () => {
  (await unlisten)();
});
</script>
<template>
  <Route>
    <div class="grid grid-cols-2 gap-4 w-full h-full">
      <div class="">
        <Title />
        <Timer />
        <GameMonitor />
      </div>
      <div class="">
        <Hints />
        <Messages />
      </div>
    </div>
  </Route>
</template>
