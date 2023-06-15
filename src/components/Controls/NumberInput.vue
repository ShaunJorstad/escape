<script setup lang="ts">
import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from "@headlessui/vue";
import { ChevronUpDownIcon } from "@heroicons/vue/24/solid";

import { computed, onMounted, ref, watch } from "vue";
import { useSettingsStore } from "../../Stores/SettingsStore";
import { start } from "repl";

const selected = ref(0);
const props = defineProps(["max", "selected", "hours", "minutes"]);
const emit = defineEmits(["change"]);
const range = computed(() => {
  return Array.from(Array(props.max).keys());
});
const store = useSettingsStore();
function ensureChange(val: number) {
  if (
    val === 0 &&
    ((props.hours && store.settings.startMinutes === 0) ||
      (props.minutes && store.settings.startHours === 0))
  ) {
    selected.value = 0;
    window.alert("The timer value must be greater than 0 minutes.");
  } else {
    emit("change", val);
  }
}
</script>
<template>
  <Listbox v-model="selected">
    <div class="relative mt-2">
      <ListboxButton
        class="relative w-full cursor-default rounded-md bg-white py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
      >
        <span class="block truncate">{{ props.selected }}</span>
        <span
          class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2"
        >
          <ChevronUpDownIcon class="h-5 w-5 text-gray-400" aria-hidden="true" />
        </span>
      </ListboxButton>

      <transition
        leave-active-class="transition ease-in duration-100"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <ListboxOptions
          class="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
        >
          <ListboxOption
            v-for="number in range"
            :key="number"
            :value="number"
            class="cursor-pointer hover:bg-gray-300 p-1 pl-4"
            @click="
              () => {
                ensureChange(number);
              }
            "
          >
            {{ number }}
          </ListboxOption>
        </ListboxOptions>
      </transition>
    </div>
  </Listbox>
</template>
