<script setup lang="ts">
import VersionLabel from "./VersionLabel.vue";
</script>
<template>
  <div>home (should have version bump ;)</div>
  <Suspense>
    <VersionLabel />
  </Suspense>
</template>
