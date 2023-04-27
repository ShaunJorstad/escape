<script setup lang="ts">
import { getVersion } from "@tauri-apps/api/app";
const tauriVersion = await getVersion();
</script>
<template>
  <div>Version: {{ tauriVersion }}</div>
</template>
