<script setup lang="ts">
import Compose from "./Compose.vue";
import { Switch } from "@headlessui/vue";
import { useSettingsStore } from "../../Stores/SettingsStore";
import { nextTick, ref, watch, watchEffect } from "vue";

const store = useSettingsStore();
const bottom = ref(null);

watchEffect(async () => {
  let length = store.settings.messages.length;
  await nextTick();
  // @ts-ignore
  bottom.value.scrollIntoView();
});
</script>
<template>
  <div class="bg-white shadow sm:rounded-lg mt-4">
    <div class="px-4 py-5 sm:p-6 h-full">
      <div class="flex justify-between">
        <h3 class="text-base text-xl font-semibold leading-6 text-gray-900">
          Messages
        </h3>

        <button
          type="button"
          class="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-red-500 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
          @click="
            () => {
              store.settings.messages = [];
            }
          "
        >
          Delete All Messages
        </button>
      </div>
      <div
        class="min-h-[27rem] max-h-[27rem] overflow-x-hidden overflow-y-scroll py-4"
      >
        <div
          class="flex justify-between text-lg font-lato-regular text-slate-400 mb-2"
        >
          <h3>Message</h3>
          <h3>Visible</h3>
        </div>
        <!-- Messages -->
        <div
          class="flex justify-between"
          v-for="(message, index) in store.settings.messages"
        >
          <p class="font-lato-light text-lg">
            {{ message.text }}
          </p>
          <Switch
            v-model="message.visible"
            :class="[
              message.visible ? 'bg-indigo-600' : 'bg-gray-200',
              'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2',
            ]"
          >
            <span class="sr-only">Use setting</span>
            <span
              aria-hidden="true"
              :class="[
                message.visible ? 'translate-x-5' : 'translate-x-0',
                'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out',
              ]"
            />
          </Switch>
        </div>
        <span ref="bottom"></span>
      </div>
      <Compose />
    </div>
  </div>
</template>
