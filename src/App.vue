<script setup lang="ts">
import Home from "./Home.vue";
import { checkUpdate, installUpdate } from "@tauri-apps/api/updater";

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
      <router-view></router-view>
    </div>
  </main>
</template>

<style scoped></style>
