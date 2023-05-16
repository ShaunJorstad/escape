<script setup lang="ts">
import { computed, onMounted, ref, watchEffect } from "vue";
import { useSettingsStore } from "../../Stores/SettingsStore";

const store = useSettingsStore();
const draftTitle = ref("");

const hasChange = computed(() => {
  return draftTitle.value != store.settings.title;
});

function submit() {
  // store.setSetting("title", draftTitle.value);
  store.settings.title = draftTitle.value;
}

watchEffect(() => {
  draftTitle.value = store.settings.title;
});
onMounted(() => {
  // draftTitle.value = store.settings.title;
});
</script>
<template>
  <div class="bg-white shadow sm:rounded-lg">
    <div class="px-4 py-5 sm:p-6">
      <h3 class="text-base text-xl font-semibold leading-6 text-gray-900">
        Title
      </h3>
      <div class="mt-2 sm:flex sm:items-start sm:justify-between">
        <input
          name="title"
          id="title"
          class="block w-full rounded-md border-0 p-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          placeholder="Title can be left blank"
          v-model="draftTitle"
          @keypress.enter="submit"
        />
        <div
          class="mt-5 sm:ml-6 sm:mt-0 sm:flex sm:flex-shrink-0 sm:items-center"
        >
          <button
            type="button"
            class="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
            @click="submit"
          >
            Update title
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
