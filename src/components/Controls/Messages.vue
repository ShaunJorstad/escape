<script setup lang="ts">
import { ref } from "vue";
import Compose from "./Compose.vue";
import { Switch } from "@headlessui/vue";

const enabled = ref(false);

const messages = ref(["Formerly sent message"]);
</script>
<template>
  <div class="bg-white shadow sm:rounded-lg mt-4">
    <div class="px-4 py-5 sm:p-6 h-full">
      <h3 class="text-base text-xl font-semibold leading-6 text-gray-900">
        Messages
      </h3>
      <div class="min-h-[27rem] py-4">
        <div
          class="flex justify-between text-lg font-lato-regular text-slate-400 mb-2"
        >
          <h3>Message</h3>
          <h3>Visible</h3>
        </div>
        <!-- Messages -->
        <div class="flex justify-between" v-for="message in messages">
          <p class="font-lato-light text-lg">
            {{ message }}
          </p>
          <Switch
            v-model="enabled"
            :class="[
              enabled ? 'bg-indigo-600' : 'bg-gray-200',
              'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2',
            ]"
          >
            <span class="sr-only">Use setting</span>
            <span
              aria-hidden="true"
              :class="[
                enabled ? 'translate-x-5' : 'translate-x-0',
                'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out',
              ]"
            />
          </Switch>
        </div>
      </div>
      <Compose />
    </div>
  </div>
</template>
