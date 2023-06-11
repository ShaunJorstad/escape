<script setup lang="ts">
const props = defineProps(["text", "outline"]);
</script>
<template>
  <button
    type="button"
    class="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
    :class="{
      'text-white focus-visible:outline-indigo-500 hover:bg-indigo-500':
        !props.outline,
      'text-red-400 bg-white focus-visible:outline-red-300 border border-red-200 hover:text-white hover:bg-red-300':
        props.outline,
    }"
  >
    {{ props.text }}
  </button>
</template>
