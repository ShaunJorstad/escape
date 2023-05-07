<script setup lang="ts">
// @ts-nocheck
import {
  computed,
  nextTick,
  onMounted,
  onUnmounted,
  watch,
  watchEffect,
} from "vue";
import { useSettingsStore } from "../Stores/SettingsStore";
import { listen } from "@tauri-apps/api/event";
import { useInterval } from "@vueuse/core";
const settingsStore = useSettingsStore();
const isDev = import.meta.env.DEV;

const tickMS = isDev ? 100 : 1000;
let { counter, reset, pause, resume } = useInterval(tickMS, { controls: true });
// imediately pause the interval
pause();
reset();

const totalSeconds = computed(() => {
  let val =
    (settingsStore.settings.startHours || 0) * 60 * 60 +
    (settingsStore.settings.startMinutes || 0) * 60;
  return val;
});

const remainingSeconds = computed(() => {
  if (counter.value > totalSeconds.value) return 0;
  return totalSeconds.value - counter.value;
});

function calcRadians(total: Number) {
  if (total === 0) {
    return 0;
  }
  let percent = (counter.value / total) * 100;
  return (percent * 2) / 100;
}

const radians = computed(() => {
  return calcRadians(totalSeconds.value);
});

const hours = computed(() => {
  let h = remainingSeconds.value / 60 / 60;

  return Math.floor(Number(h));
});
const minutes = computed(() => {
  let m = (remainingSeconds.value - hours.value * 3600) / 60;

  return Math.floor(Number(m));
});
const seconds = computed(() => {
  let s =
    (remainingSeconds.value - hours.value * 3600 - minutes.value * 60) % 60;

  return Math.floor(Number(s));
});

function renderArc(color, length, width) {
  var c = document.getElementById("c");
  if (!c) {
    return;
  }
  var ctx = c.getContext("2d");
  ctx.beginPath();
  ctx.arc(522 / 2 + 6, 522 / 2 + 2, 522 / 2 - 1, 0, length * Math.PI);
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.stroke();
}

const unlisten = listen("clock", async (event) => {
  let status = event.payload.status;
  if (status === "start") {
    // start the timer
    reset();
    renderArc("#059669", 2, 6);
    resume();
  }
  if (status === "timeChange") {
    renderArc("#059669", 2, 6);
    await nextTick();
    renderArc("#ffffff", calcRadians(event.payload.time), 8);
  }
  if (status === "play") {
    resume();
  }
  if (status === "pause") {
    console.log("Clock is pausing");
    pause();
  }
});

// TODO: Watch just totalSeconds for a change. Then redraw both circles.
watch(totalSeconds, () => {
  renderArc("#059669", 2, 6);
  renderArc("#ffffff", radians.value, 8);
});

watchEffect(() => {
  if (counter.value <= totalSeconds.value) {
    renderArc("#ffffff", radians.value, 8);
  }
  if (remainingSeconds.value <= 0) {
    pause();
  }
});

onMounted(() => {
  renderArc("#059669", 2, 6);
});
onUnmounted(async () => {
  (await unlisten)();
});
</script>
<template>
  <div
    class="bg-white rounded-full w-[522px] h-[522px] drop-shadow-md border-t-2 ml-10"
    id="clock"
  >
    <canvas
      class="-rotate-90 -mt-1 -mb-[530px]"
      width="530"
      height="530"
      id="c"
    ></canvas>
    <h1
      class="text-center mt-[190px] font-lato-black text-[100px] text-slate-700"
    >
      <span v-if="hours">{{ hours }}:</span>
      <span v-if="hours || minutes"
        >{{ String(minutes).padStart(2, "0") || "00" }}:</span
      >
      <span>{{ String(seconds).padStart(2, "0") || "00" }}</span>
    </h1>
  </div>
</template>
