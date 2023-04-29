<script setup lang="ts">
import router from "../Router";
const props = defineProps(["path", "title"]);

function navigate() {
  router.push(props.path);
}
</script>
<template>
  <div
    class="h-80 w-72 border-2 rounded-xl border-slate-300 border-dashed hover:bg-white cursor-pointer ease-in-out duration-100 hover:border-white flex flex-col justify-center items-center"
    @click="navigate"
  >
    <slot name="icon"></slot>
    <span class="text-lg font-lato-regular text-slate-800 mt-8">{{
      props.title
    }}</span>
  </div>
</template>
