<script setup lang="ts">
import { WebviewWindow, getCurrent } from "@tauri-apps/api/window";
import PrimaryButton from "./Controls/PrimaryButton.vue";
import { onMounted, onUnmounted, ref } from "vue";

const props = defineProps(["windowLabel"]);
const isFullscreen = ref(false);
let timeoutID: any;
let resizeListener: any;

function EnterFullscreen() {
  if (!resizeListener) {
    resizeListener = WebviewWindow.getByLabel(props.windowLabel)?.onResized(
      async (event) => {
        clearTimeout(timeoutID);
        timeoutID = setTimeout(async () => {
          // isFullscreen is not garanteed to be acurate when this event fires
          let value = await WebviewWindow.getByLabel(
            props.windowLabel
          )?.isFullscreen();
          isFullscreen.value = !!value;
        }, 1500);
      }
    );
  }
  WebviewWindow.getByLabel(props.windowLabel)?.setFullscreen(
    !isFullscreen.value
  );
}

onUnmounted(async () => {
  if (resizeListener) {
    (await resizeListener)();
  }
});
</script>
<template>
  <div>
    <PrimaryButton
      :outline="isFullscreen"
      :text="isFullscreen ? 'Disable Fullscreen' : 'Go Fullscreen'"
      @click="EnterFullscreen"
    />
  </div>
</template>
