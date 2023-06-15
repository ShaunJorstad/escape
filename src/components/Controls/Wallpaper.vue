<script setup lang="ts">
import { onMounted, ref } from "vue";
import { appDataDir } from "@tauri-apps/api/path";
import { useSettingsStore } from "../../Stores/SettingsStore";
import SavedImage from "./SavedImage.vue";

const props = defineProps(["label", "setting"]);
const baseDir = ref(null);
const store = useSettingsStore();

function processFile(event: any) {
  let reader = new FileReader();
  reader.onload = (e) => {
    let res = e?.target?.result;
    store.settings[props.setting] = res;
  };
  reader.readAsDataURL(event.target.files[0]);
}

onMounted(async () => {
  // @ts-ignore
  baseDir.value = await appDataDir();
});
</script>
<template>
  <div class="grid grid-cols-2 m-1">
    <div>
      <h1>{{ props.label }}</h1>
      <input
        type="file"
        class="rounded bg-white px-2 py-1 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 w-52"
        accept="image/jpg"
        @change="processFile"
      />
    </div>
    <SavedImage :setting="props.setting" />
  </div>
</template>
