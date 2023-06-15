<script setup lang="ts">
import { emit, listen } from "@tauri-apps/api/event";
import { useSettingsStore } from "./Stores/SettingsStore";
import { onMounted, onUnmounted } from "vue";
import router from "./Router";
import Clock from "./components/Clock.vue";
import { LockClosedIcon, LockOpenIcon } from "@heroicons/vue/24/solid";
import FullscreenButton from "./components/FullscreenButton.vue";

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
      <div class="grow flex flex-col justify-around">
        <div class="">
          <div
            class="mx-10 p-8 px-10 text-3xl rounded-xl drop-shadow-lg"
            :class="{
              'text-slate-500':
                index != settingsStore.visibleMessages?.length - 1,
              'text-slate-700 bg-white':
                index == settingsStore.visibleMessages?.length - 1,
            }"
            v-for="(message, index) in settingsStore.visibleMessages"
          >
            {{ message.text }}
          </div>
        </div>
      </div>
    </div>
    <div><!-- spacer --></div>
  </div>
</template>
