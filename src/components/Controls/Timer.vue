<script setup lang="ts">
import { computed, ref } from "vue";
import NumberInput from "./NumberInput.vue";
import Router from "../../Router";

const hours = ref(0);
const minutes = ref(0);
</script>
<template>
  <div class="bg-white shadow sm:rounded-lg h-80 mt-4">
    <div class="px-4 py-5 sm:p-6 flex flex-col justify-between h-full">
      <h3 class="text-base text-xl font-semibold leading-6 text-gray-900">
        Timer
      </h3>
      <div class="grid grid-cols-2">
        <span>Hours:</span>
        <span>Minutes:</span>
        <NumberInput
          :max="5"
          @change="
            (h) => {
              hours = h;
            }
          "
        />
        <NumberInput
          :max="60"
          @change="
            (m) => {
              minutes = m;
            }
          "
        />
      </div>
      <div class="grid grid-cols-2">
        <button
          type="button"
          class="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-red-500 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
          @click="
            () => {
              Router.push('/');
            }
          "
        >
          Exit
        </button>
        <button
          type="submit"
          class="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          Save
        </button>
      </div>
    </div>
  </div>
</template>
