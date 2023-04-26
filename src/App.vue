<script setup lang="ts">
import Home from "./Home.vue";
</script>

<template>
  <main class="bg-primary-light-gray h-screen w-screen flex flex-col">
    <div data-tauri-drag-region class="w-full h-8"></div>
    <div class="flex-grow">
      <Home />
    </div>
  </main>
</template>

<style scoped></style>
