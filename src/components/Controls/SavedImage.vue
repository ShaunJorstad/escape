<script setup lang="ts">
import { computed } from "vue";
import { useSettingsStore } from "../../Stores/SettingsStore";

const props = defineProps(["setting"]);
const store = useSettingsStore();
const imageExists = computed(() => {
  return !!store.settings[props.setting];
});
</script>
<template>
  <div v-if="imageExists">
    <img :src="store.settings[props.setting]" />
  </div>
  <div v-else>Image not found</div>
</template>
