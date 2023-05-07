<script setup lang="ts">
import { computed, ref } from "vue";
import NumberInput from "./NumberInput.vue";
import Router from "../../Router";
import { useSettingsStore } from "../../Stores/SettingsStore";
import { emit } from "@tauri-apps/api/event";
import {
  PlusIcon,
  MinusIcon,
  PauseIcon,
  PlayIcon,
} from "@heroicons/vue/20/solid";

const hours = ref(0);
const minutes = ref(0);
const hasStarted = ref(false);
const settingsStore = useSettingsStore();

const duration = computed(() => {
  return `${settingsStore.settings.startHours || 0}h ${
    settingsStore.settings.startMinutes || 0
  }m`;
});

function startTimer() {
  settingsStore.timerIsActive = true;
  hasStarted.value = true;
  emit("clock", {
    status: "start",
  });
}
</script>
<template>
  <div class="bg-white shadow sm:rounded-lg h-80 mt-4">
    <div class="px-4 py-5 sm:p-6 flex flex-col justify-between h-full">
      <h3 class="text-base text-xl font-semibold leading-6 text-gray-900">
        Timer
      </h3>
      <template v-if="!hasStarted">
        <div class="grid grid-cols-2">
          <span>Hours:</span>
          <span>Minutes:</span>
          <NumberInput
            :max="5"
            @change="
              (h) => {
                settingsStore.settings.startHours = Number(h);
              }
            "
          />
          <NumberInput
            :max="60"
            @change="
              (m) => {
                settingsStore.settings.startMinutes = Number(m);
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
            @click="startTimer"
          >
            Start
          </button>
        </div>
      </template>
      <template v-else>
        <div>
          <dl
            class="mt-5 grid grid-cols-1 divide-y divide-gray-200 overflow-hidden rounded-lg bg-white shadow md:grid-cols-2 md:divide-x md:divide-y-0"
          >
            <div class="px-4 py-5 sm:p-6">
              <dt class="text-base font-normal text-gray-700">Game Duration</dt>
              <dd
                class="mt-1 flex items-baseline justify-between md:block lg:flex"
              >
                <div
                  class="flex items-baseline text-2xl font-semibold text-indigo-600"
                >
                  {{ duration }}
                </div>
              </dd>
            </div>
            <div class="px-4 py-5 sm:p-6">
              <dt class="text-base font-normal text-gray-700">Controls</dt>
              <dd
                class="mt-1 flex items-baseline justify-between md:block lg:flex"
              >
                <div
                  class="flex items-baseline text-2xl font-semibold text-indigo-600"
                >
                  <span class="isolate inline-flex rounded-md shadow-sm">
                    <button
                      type="button"
                      class="relative inline-flex items-center rounded-l-md bg-white px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-10"
                      @click="settingsStore.increment(-1)"
                    >
                      <span class="sr-only">Previous</span>
                      <MinusIcon class="h-5 w-5" aria-hidden="true" />
                    </button>
                    <button
                      type="button"
                      class="relative -ml-px inline-flex items-center bg-white px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-10"
                      @click="settingsStore.toggle()"
                    >
                      <PauseIcon
                        class="h-5 w-5"
                        aria-hidden="true"
                        v-if="settingsStore.timerIsActive"
                      />
                      <PlayIcon class="h-5 w-5" aria-hidden="true" v-else />
                    </button>
                    <button
                      type="button"
                      class="relative -ml-px inline-flex items-center rounded-r-md bg-white px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-10"
                      @click="settingsStore.increment(1)"
                    >
                      <PlusIcon class="h-5 w-5" aria-hidden="true" />
                    </button>
                  </span>
                </div>
              </dd>
            </div>
          </dl>
        </div>
      </template>
    </div>
  </div>
</template>
