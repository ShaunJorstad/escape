<script setup lang="ts">
import { ref } from "vue";
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  TransitionChild,
  TransitionRoot,
} from "@headlessui/vue";
import { CheckIcon } from "@heroicons/vue/24/outline";
import { useSettingsStore } from "../Stores/SettingsStore";

const store = useSettingsStore();
</script>
<template>
  <TransitionRoot as="template" :show="store.settings.openSavedMessages">
    <Dialog
      as="div"
      class="relative z-10"
      @close="store.settings.openSavedMessages = false"
    >
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
              class="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all w-[800px]"
            >
              <div>
                <div class="mt-3 text-center sm:mt-5">
                  <DialogTitle
                    as="h3"
                    class="text-lg font-semibold leading-6 text-gray-900"
                    >Saved Messages</DialogTitle
                  >
                  <div class="mt-2">
                    <div
                      class="text-sm text-gray-500 border-slate-100 border-2 mb-2 rounded-md p-4 flex"
                      v-for="(text, index) in store.settings.savedMessages"
                    >
                      <textarea
                        class="w-full"
                        v-model="store.settings.savedMessages[index]"
                      />
                      <button
                        type="button"
                        class="rounded bg-white px-2 py-1 text-sm font-semibold text-red-500 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 mx-2"
                        @click="
                          () => {
                            store.deleteMessage(index);
                          }
                        "
                      >
                        Delete
                      </button>

                      <button
                        type="button"
                        class="rounded bg-indigo-600 px-2 py-1 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        @click="
                          () => {
                            store.message(text);
                          }
                        "
                      >
                        Send
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div class="mt-5 sm:mt-6 grid grid-cols-2">
                <button
                  type="button"
                  class="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-red-500 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                  @click="
                    () => {
                      store.settings.openSavedMessages = false;
                    }
                  "
                >
                  Exit
                </button>
                <button
                  type="button"
                  class="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  @click="store.newSavedMessage"
                >
                  New Saved Message
                </button>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>
