<script setup lang="ts">
import { onUnmounted, ref, watchEffect } from "vue";
import { useSettingsStore } from "./Stores/SettingsStore";
import { emit, listen } from "@tauri-apps/api/event";
import placeholder from "./components/Placeholder.vue";
import Wallpaper from "./components/Controls/Wallpaper.vue";
import { WebviewWindow, getCurrent } from "@tauri-apps/api/window";
import PrimaryButton from "./components/Controls/PrimaryButton.vue";
import { watch } from "fs";
import PasswordGuess from "./components/PasswordGuess.vue";
import { BlockKeys } from "./Shortcuts";

const passwordInput = ref("");
const store = useSettingsStore();
const status = ref(false);
const isFocused = ref(true);

function emitChangeNavigation(index: number) {
  if (index >= 10) {
    return;
  }
  emit("change-navigation", { guess: true });
  setTimeout(() => {
    emitChangeNavigation(index + 1);
  }, 200);
}

function openMonitor() {
  const mainWindow = WebviewWindow.getByLabel("guesser");
  if (mainWindow) return;
  status.value = false;
  const webview = new WebviewWindow("guesser", {
    url: "index.html",
  });
  webview.once("tauri://created", function () {
    emitChangeNavigation(0);
  });
}

function closeMonitor() {
  const mainWindow = WebviewWindow.getByLabel("guesser");
  mainWindow?.close();
}

function updatePassword() {
  store.settings.password = passwordInput.value;
}
watchEffect(() => {
  passwordInput.value = store.settings.password;
});

const unlisten = listen("request-broadcast", () => {
  emit("broadcast", store.dataForBroadcast);
});
const unlistenPassword = listen("passwordGuess", (event: any) => {
  const result = store.guess(event.payload.guess);
  if (result) {
    status.value = true;
  }
  emit("passwordResponse", { result });
});
const listenFocus = listen("password-focus-changed", (event: any) => {
  isFocused.value = event.payload;
});

BlockKeys();

watchEffect(() => {
  emit("broadcast", store.dataForBroadcast);
});
onUnmounted(async () => {
  (await unlisten)();
  (await unlistenPassword)();
  (await listenFocus)();
});
</script>
<template>
  <div class="h-[95vh] flex flex-col">
    <RouterLink to="/">home</RouterLink>
    <div class="mb-4 grid grid-cols-3">
      <div class="bg-white drop-shadow-md rounded-md p-4">
        <PrimaryButton @click="openMonitor" :text="'Open Password Monitor'" />
        <PrimaryButton @click="closeMonitor" :text="'Close Password Monitor'" />
        <button
          v-if="!isFocused"
          type="button"
          class="mt-4 rounded-md bg-red-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          @click="
            () => {
              WebviewWindow.getByLabel('guesser')?.setFocus();
            }
          "
        >
          Focus Password Window
        </button>
      </div>
      <div class="bg-white drop-shadow-md rounded-md p-4">
        <h1>Guess history:</h1>
        <div class="max-h-[27rem] overflow-y-scroll">
          <PasswordGuess
            v-for="(guess, index) in store.settings.guesses"
            :guess="guess"
            :index="index"
          />
        </div>
        <PrimaryButton
          text="Clear history"
          @click="
            () => {
              store.settings.guesses = [];
            }
          "
        />
      </div>
      <div class="bg-white drop-shadow-md rounded-md p-4">
        <h1>Wallpapers:</h1>
        <p>(Wallpapers must be .jpg format)</p>
        <Wallpaper label="Locked Wallpaper" setting="lockedWallpaper" />
        <Wallpaper label="Unlocked Wallpaper" setting="unlockedWallpaper" />
      </div>
      <div class="col-span-3 px-40 py-10">
        <input
          v-model="passwordInput"
          class="p-2 bg-white drop-shadow-md rounded-md"
        />
        <button
          type="button"
          class="rounded-md bg-indigo-600 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          @click="updatePassword"
        >
          Save
        </button>

        <p>Password: {{ store.settings.password }}</p>
        <span
          v-if="status"
          class="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20"
          >Password guessed!</span
        >
        <span
          v-else
          class="inline-flex items-center rounded-md bg-pink-50 px-2 py-1 text-xs font-medium text-pink-700 ring-1 ring-inset ring-pink-700/10"
          >Still guessing</span
        >
      </div>
    </div>
  </div>
</template>
