<script setup lang="ts">
import Route from "./components/Route.vue";
import Title from "./components/Controls/Title.vue";
import Timer from "./components/Controls/Timer.vue";
import Hints from "./components/Controls/Hints.vue";
import Messages from "./components/Controls/Messages.vue";
import GameMonitor from "./components/Controls/GameMonitor.vue";
import { onMounted, onUnmounted, watchEffect } from "vue";
import { useSettingsStore } from "./Stores/SettingsStore";
import { emit, listen } from "@tauri-apps/api/event";
import SavedMessages from "./components/SavedMessages.vue";

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
    <SavedMessages />
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
