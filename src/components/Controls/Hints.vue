<script setup lang="ts">
import { ref } from "vue";
import {
  Switch,
  SwitchDescription,
  SwitchGroup,
  SwitchLabel,
} from "@headlessui/vue";
import { LockClosedIcon } from "@heroicons/vue/24/solid";
import { LockOpenIcon } from "@heroicons/vue/24/solid";

const enabled = ref(false);
</script>
<template>
  <div class="bg-white shadow sm:rounded-lg">
    <div class="px-4 py-5 sm:p-6 h-full">
      <div class="flex justify-between">
        <h3 class="text-base text-xl font-semibold leading-6 text-gray-900">
          Hints
        </h3>
        <Switch
          v-model="enabled"
          :class="[
            enabled ? 'bg-indigo-600' : 'bg-gray-200',
            'mt-1 relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2',
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
      <div class="my-2 max-w-xl text-sm text-gray-500">
        <p>
          When enabled, the game monitor will display how many unused hints are
          available to be requested.
        </p>
      </div>
      <div class="flex">
        <span class="isolate inline-flex rounded-md shadow-sm">
          <button
            type="button"
            class="relative inline-flex items-center rounded-l-md bg-white px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-10"
          >
            <span class="text-lg font-lato-bold">-</span>
          </button>
          <button
            type="button"
            class="relative -ml-px inline-flex items-center rounded-r-md bg-white px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-10"
          >
            <span class="text-lg font-lato-bold">+</span>
          </button>
        </span>
        <span class="isolate inline-flex rounded-md shadow-sm ml-4">
          <button
            type="button"
            class="relative inline-flex items-center rounded-l-md bg-white px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-10"
          >
            <LockClosedIcon class="w-4 h-4" />
          </button>
          <button
            type="button"
            class="relative -ml-px inline-flex items-center bg-white px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-10"
          >
            <LockOpenIcon class="w-4 h-4" />
          </button>
          <button
            type="button"
            class="relative -ml-px inline-flex items-center rounded-r-md bg-white px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-10"
          >
            <LockOpenIcon class="w-4 h-4" />
          </button>
        </span>
      </div>
    </div>
  </div>
</template>
