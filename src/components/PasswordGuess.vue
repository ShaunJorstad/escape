<script setup lang="ts">
/**
 * Simply renders the password guess text.
 * When mounted, will scroll the parent div until the new guess is visible
 */
import { onMounted, ref } from "vue";

const props = defineProps(["guess", "index"]);
const guessRef = ref(null);

onMounted(() => {
  // @ts-ignore
  guessRef.value?.scrollIntoView();
});
</script>
<template>
  <p ref="guessRef">
    {{ props.guess }}
  </p>
</template>
