<script setup lang="ts">
import { computed, onUnmounted, ref, watchEffect } from "vue";
import NumberInput from "./NumberInput.vue";
import Router from "../../Router";
import PrimaryButton from "./PrimaryButton.vue";
import { useSettingsStore } from "../../Stores/SettingsStore";
import { emit, listen } from "@tauri-apps/api/event";
import { WebviewWindow } from "@tauri-apps/api/window";
import {
  PlusIcon,
  MinusIcon,
  PauseIcon,
  PlayIcon,
  ClockIcon,
} from "@heroicons/vue/20/solid";
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  TransitionChild,
  TransitionRoot,
} from "@headlessui/vue";
import { watch } from "fs";

const incOptions = [
  {
    15: "15s",
    30: "30s",
    45: "45s",
    60: "1m",
  },
  {
    300: "5m",
    600: "10m",
    900: "15m",
  },
];

const hasStarted = ref(false);
const remainingSeconds = ref(0);
const settingsStore = useSettingsStore();
const canDecrement = ref(true);
const finished = ref(false);
const open = ref(false);
const selectedInc = ref("60");

const duration = computed(() => {
  return `${settingsStore.settings.startHours || 0}h ${
    settingsStore.settings.startMinutes || 0
  }m ${settingsStore.settings.startSeconds || 0}s`;
});

function startTimer() {
  settingsStore.timerIsActive = true;
  hasStarted.value = true;
  emit("clock", {
    status: "start",
  });
}

function reset() {
  settingsStore.settings.messages = [];
  settingsStore.timerIsActive = false;
  hasStarted.value = false;
  finished.value = false;
  emit("clock", {
    status: "reset",
  });
}

const unlisten = listen("timeNotice", (event) => {
  // @ts-ignore
  const { remaining } = event.payload;
  remainingSeconds.value = remaining;
  finished.value = remaining === 0;
  if (remaining === 0) {
    open.value = true;
    settingsStore.timerIsActive = false;
  }
});

function emitChangeNavigation(index: number) {
  if (index >= 10) {
    return;
  }
  emit("change-navigation");
  setTimeout(() => {
    emitChangeNavigation(index + 1);
  }, 200);
}

function openGameMonitor() {
  const mainWindow = WebviewWindow.getByLabel("timer");
  if (mainWindow) return;
  const webview = new WebviewWindow("timer", {
    url: "index.html",
  });
  webview.once("tauri://created", function () {
    // webview window successfully created
    settingsStore.monitorIsOpen = true;

    emitChangeNavigation(0);
  });
}

function closeGameMonitor() {
  const timerWindow = WebviewWindow.getByLabel("timer");
  if (timerWindow) {
    timerWindow.close();
    settingsStore.monitorIsOpen = false;
  }
}

watchEffect(() => {
  canDecrement.value = remainingSeconds.value >= Number(selectedInc.value);
});

onUnmounted(async () => {
  (await unlisten)();
});
watchEffect(() => {});
</script>
<template>
  <div class="bg-white shadow sm:rounded-lg h-80 mt-4">
    <TransitionRoot as="template" :show="open">
      <Dialog as="div" class="relative z-10" @close="open = false">
        <TransitionChild
          as="template"
          enter="ease-out duration-300"
          enter-from="opacity-0"
          enter-to="opacity-100"
          leave="ease-in duration-200"
          leave-from="opacity-100"
          leave-to="opacity-0"
        >
          <div
            class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          />
        </TransitionChild>

        <div class="fixed inset-0 z-10 overflow-y-auto">
          <div
            class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0"
          >
            <TransitionChild
              as="template"
              enter="ease-out duration-300"
              enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enter-to="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leave-from="opacity-100 translate-y-0 sm:scale-100"
              leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <DialogPanel
                class="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-sm sm:p-6"
              >
                <div>
                  <div
                    class="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100"
                  >
                    <ClockIcon
                      class="h-6 w-6 text-green-600"
                      aria-hidden="true"
                    />
                  </div>
                  <div class="mt-3 text-center sm:mt-5">
                    <DialogTitle
                      as="h3"
                      class="text-base font-semibold leading-6 text-gray-900"
                      >Time Ran Out!</DialogTitle
                    >
                    <div class="mt-2">
                      <p class="text-sm text-gray-500">
                        There is no time left on the game clock. If more time is
                        needed: add time to the clock and click resume.
                      </p>
                    </div>
                  </div>
                </div>
                <div class="mt-5 sm:mt-6">
                  <button
                    type="button"
                    class="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    @click="open = false"
                  >
                    Go back to dashboard
                  </button>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>
    <div class="px-4 py-5 sm:p-6 flex flex-col justify-between h-full">
      <h3 class="text-base text-xl font-semibold leading-6 text-gray-900">
        Timer
      </h3>
      <PrimaryButton
        @click="openGameMonitor"
        :text="'Open Game Monitor'"
        v-if="!settingsStore.monitorIsOpen"
      />
      <PrimaryButton
        @click="closeGameMonitor"
        :outline="true"
        :text="'Close Game Monitor'"
        v-else
      />
      <template v-if="!hasStarted">
        <div class="grid grid-cols-2">
          <span>Hours:</span>
          <span>Minutes:</span>
          <NumberInput
            :max="5"
            :selected="settingsStore.settings.startHours"
            @change="
              (h) => {
                if (h !== settingsStore.settings.startHours) {
                  settingsStore.settings.startHours = Number(h);
                }
              }
            "
          />
          <NumberInput
            :max="60"
            :selected="settingsStore.settings.startMinutes"
            @change="
              (m) => {
                if (settingsStore.settings.startMinutes != m) {
                  settingsStore.settings.startMinutes = Number(m);
                }
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
              <!-- Increment selector -->
              <template v-for="options in incOptions">
                <span
                  class="isolate inline-flex -space-x-px rounded-md shadow-sm"
                >
                  <button
                    v-for="(seconds, index) in Object.keys(options)"
                    type="button"
                    class="relative inline-flex items-center bg-white px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-10"
                    :class="{
                      'rounded-l-md': index === 0,
                      'rounded-r-md': index === Object.keys(options).length - 1,
                      'ring-2 ring-inset ring-indigo-500':
                        seconds === selectedInc,
                      '-ml-px': index > 0,
                    }"
                    @click="
                      () => {
                        selectedInc = seconds;
                      }
                    "
                  >
                    {{
                      //@ts-ignore;
                      options[seconds]
                    }}
                  </button>
                </span>
              </template>
              <dd
                class="mt-1 flex items-baseline justify-between md:block lg:flex"
              >
                <div
                  class="flex justify-between text-2xl font-semibold text-indigo-600"
                >
                  <span class="isolate inline-flex rounded-md shadow-sm">
                    <button
                      type="button"
                      class="relative inline-flex items-center rounded-l-md bg-white px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-10"
                      @click="
                        canDecrement &&
                          settingsStore.increment(-1 * Number(selectedInc))
                      "
                    >
                      <span class="sr-only">Previous</span>
                      <MinusIcon class="h-5 w-5" aria-hidden="true" />
                    </button>
                    <button
                      type="button"
                      class="relative -ml-px inline-flex items-center bg-white px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-10"
                      @click="!finished && settingsStore.toggle()"
                    >
                      <PauseIcon
                        class="h-5 w-5"
                        aria-hidden="true"
                        v-if="settingsStore.timerIsActive && !finished"
                      />
                      <PlayIcon class="h-5 w-5" aria-hidden="true" v-else />
                    </button>
                    <button
                      type="button"
                      class="relative -ml-px inline-flex items-center rounded-r-md bg-white px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-10"
                      @click="settingsStore.increment(Number(selectedInc))"
                    >
                      <PlusIcon class="h-5 w-5" aria-hidden="true" />
                    </button>
                  </span>

                  <button
                    type="button"
                    class="inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-red-500 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                    @click="reset"
                    v-if="!(settingsStore.timerIsActive && !finished)"
                  >
                    Reset
                  </button>
                </div>
              </dd>
            </div>
          </dl>
        </div>
      </template>
    </div>
  </div>
</template>
