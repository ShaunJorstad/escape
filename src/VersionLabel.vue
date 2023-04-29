<script setup lang="ts">
import { getVersion } from "@tauri-apps/api/app";
const tauriVersion = await getVersion();
</script>
<template>
  <div class="text-slate-600">v{{ tauriVersion }}</div>
</template>
