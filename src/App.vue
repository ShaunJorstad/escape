<script setup lang="ts">
import Home from "./Home.vue";
import { listen } from "@tauri-apps/api/event";
import { emit } from "@tauri-apps/api/event";
import { checkUpdate, installUpdate } from "@tauri-apps/api/updater";
import { onUpdaterEvent } from "@tauri-apps/api/updater";

console.log("listening to updates");
const unlisten = listen<string>("tauri://update", (event) => {
  console.log("UPDATE!");
  console.log(event);
});
listen<string>("tauri://update-download-progress", (event) => {
  console.log("Update progress!");
  console.log(event);
});
listen<string>("tauri://update-install", (event) => {
  console.log("Update install!");
  console.log(event);
});
onUpdaterEvent(({ error, status }) => {
  console.log("Updater event", error, status);
});

async function updateNow() {
  // await emit("tauri://update");
  const update = await checkUpdate();
  if (update.shouldUpdate) {
    console.log(
      `Installing update ${update.manifest?.version}, ${update.manifest?.date}, ${update.manifest?.body}`
    );
    let res = await installUpdate();
    console.log(res);
  }
}
</script>

<template>
  <main class="bg-primary-light-gray h-screen w-screen flex flex-col">
    <div data-tauri-drag-region class="w-full h-8"></div>
    <div class="flex-grow">
      <Home />
      <button @click="updateNow">check for update</button>
    </div>
  </main>
</template>

<style scoped></style>
