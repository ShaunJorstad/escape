<script setup lang="ts">
import { emit, listen } from "@tauri-apps/api/event";
import { useSettingsStore } from "./Stores/SettingsStore";
import { onMounted, onUnmounted } from "vue";
import router from "./Router";
import Clock from "./components/Clock.vue";
import { LockClosedIcon, LockOpenIcon } from "@heroicons/vue/24/solid";

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
      <div class="grow pl-40 pt-20">
        <Clock />
        <div
          class="w-[522px] ml-10 mt-4 p-4 flex justify-around"
          v-if="settingsStore.settings.enableHints"
        >
          <div class="w-[200px] flex justify-around">
            <template v-for="(hint, index) in settingsStore.settings?.hints">
              <LockClosedIcon class="w-8 h-8 text-slate-600" v-if="hint" />
              <LockOpenIcon class="w-8 h-8 text-slate-600" v-else />
            </template>
          </div>
        </div>
      </div>
      <div class="grow"></div>
    </div>
    <div><!-- spacer --></div>
  </div>
</template>
