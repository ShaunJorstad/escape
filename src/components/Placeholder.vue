<script setup lang="ts">
const props = defineProps(["text"]);
</script>

<template>
  <div
    class="w-100 h-full m-2 border-2 border-slate-200 border-dashed rounded-md text-center"
  >
    <p>{{ props.text }}</p>
  </div>
</template>
