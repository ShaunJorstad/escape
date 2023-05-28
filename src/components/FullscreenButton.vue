<script setup lang="ts">
import { WebviewWindow, getCurrent } from "@tauri-apps/api/window";
import PrimaryButton from "./Controls/PrimaryButton.vue";
import { onUnmounted, ref } from "vue";

const isFullscreen = ref(false);
let timeoutID: any;

function EnterFullscreen() {
  getCurrent()?.setFullscreen(true);
}

const resizeListener = getCurrent()?.onResized(async (event) => {
  clearTimeout(timeoutID);
  timeoutID = setTimeout(async () => {
    // isFullscreen is not garanteed to be acurate when this event fires
    let value = await getCurrent()?.isFullscreen();
    console.log(value);
    isFullscreen.value = value;
  }, 1500);
});

onUnmounted(async () => {
  (await resizeListener)();
});
</script>
<template>
  <div ref="el" class="absolute top-0 left-0 z-50 pl-8 pt-8">
    <PrimaryButton
      v-if="!isFullscreen"
      :text="'Go Fullscreen'"
      @click="EnterFullscreen"
    />
  </div>
</template>
