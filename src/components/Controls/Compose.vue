<script setup lang="ts">
import { ref } from "vue";
import { useSettingsStore } from "../../Stores/SettingsStore";

const text = ref("");
const store = useSettingsStore();

function sendMessage() {
  store.message(text.value);
  text.value = "";
}
</script>
<template>
  <div
    class="border-2 p-5 rounded-lg mt-6 overflow-hidden rounded-lg border border-gray-300 shadow-sm focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500"
  >
    <textarea
      rows="2"
      name="description"
      id="description"
      class="block w-full resize-none border-0 py-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 outline-none sm:text-sm sm:leading-6"
      placeholder="Compose a message..."
      v-model="text"
    />
    <div class="flex justify-end">
      <button
        type="button"
        class="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-500 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto mr-4"
        @click="
          () => {
            store.settings.openSavedMessages = true;
          }
        "
      >
        Send Saved Message
      </button>
      <button
        type="button"
        class="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
        @click="sendMessage"
      >
        Send
      </button>
    </div>
  </div>
</template>
