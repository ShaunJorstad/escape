<script setup lang="ts">
import { onMounted, onUnmounted, ref } from "vue";
import { useSettingsStore } from "./Stores/SettingsStore";
import { emit, listen } from "@tauri-apps/api/event";
import FullscreenButton from "./components/FullscreenButton.vue";
import { getCurrent } from "@tauri-apps/api/window";
import { BlockKeys } from "./Shortcuts";

const store = useSettingsStore();
const passwordInput = ref(null);
const pw = ref("");
const shake = ref(false);
const success = ref(false);

function submit() {
  emit("passwordGuess", { guess: pw.value });
}

const unlisten = listen("passwordResponse", (event) => {
  // @ts-ignore
  let res = event?.payload?.result;
  if (res) {
    success.value = true;
    return;
  }
  shake.value = true;
  setTimeout(() => {
    shake.value = false;
  }, 300);
});
const unlistenFocus = getCurrent()?.onFocusChanged((event) => {
  emit("password-focus-changed", event.payload);
});

function nope() {
  // @ts-ignore
  passwordInput?.value.focus();
}
BlockKeys();
onMounted(() => {
  nope();
  getCurrent()?.setFocus();
  emit("password-focus-changed", true);
});
onUnmounted(async () => {
  (await unlisten)();
  (await unlistenFocus)();
});
</script>
<template>
  <div class="h-screen -mt-8">
    <img
      class="absolute w-screen h-screen z-10 select-none"
      :src="
        success
          ? store.settings.unlockedWallpaper
          : store.settings.lockedWallpaper
      "
    />
    <div
      class="absolute w-screen h-screen z-30 flex justify-around items-center"
      v-if="!success"
    >
      <input
        ref="passwordInput"
        class="p-8 bg-white opacity-95 rounded-md w-[60%] h-20 nofocus"
        :class="{ shake }"
        v-model="pw"
        placeholder="password"
        @blur="nope"
        @keypress.enter="submit"
      />
    </div>
  </div>
</template>

<style>
.nofocus,
input:focus {
  outline: none !important;
}
.shake {
  animation: shake 0.82s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
}
@keyframes shake {
  10%,
  90% {
    transform: translate3d(-2px, 0, 0);
  }

  20%,
  80% {
    transform: translate3d(4px, 0, 0);
  }

  30%,
  50%,
  70% {
    transform: translate3d(-8px, 0, 0);
  }

  40%,
  60% {
    transform: translate3d(16px, 0, 0);
  }
}
</style>
