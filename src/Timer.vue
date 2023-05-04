<script setup lang="ts">
import { emit, listen } from "@tauri-apps/api/event";
import { useSettingsStore } from "./Stores/SettingsStore";
import { onMounted, onUnmounted } from "vue";
import router from "./Router";
import Clock from "./components/Clock.vue";

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
  <div class="h-full w-full overflow-hidden">
    <h1 class="font-lato-bold text-stone-600 text-2xl text-center mt-8">
      {{ settingsStore.settings.title }}
    </h1>
    <div class="flex">
      <div class="grow">
        <Clock />
      </div>
      <div class="grow"></div>
    </div>
    <div><!-- spacer --></div>
  </div>
</template>
