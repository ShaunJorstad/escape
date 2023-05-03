<script setup lang="ts">
import { emit, listen } from "@tauri-apps/api/event";
import { useSettingsStore } from "./Stores/SettingsStore";
import { onMounted, onUnmounted } from "vue";
import router from "./Router";

const settingsStore = useSettingsStore();
const isPrimary = router.currentRoute.value.path === "/primary";

let unlistenBroadcast: any = null;

if (!isPrimary) {
  unlistenBroadcast = listen("broadcast", (data) => {
    settingsStore.consumeBroadcast(data.payload);
  });
}

onMounted(() => {
  if (!isPrimary) {
    emit("request-broadcast");
  }
});

onUnmounted(async () => {
  if (unlistenBroadcast) {
    (await unlistenBroadcast)();
  }
});
</script>
<template>
  <div>timer - {{ settingsStore.settings.title }}</div>
</template>
