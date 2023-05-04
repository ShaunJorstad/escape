<script setup lang="ts">
// @ts-nocheck
import { onMounted } from "vue";

function renderArc() {
  var c = document.getElementById("c");
  var ctx = c.getContext("2d");
  ctx.beginPath();
  ctx.arc(522 / 2 + 6, 522 / 2 + 2, 522 / 2 - 1, 0, 0.1 * Math.PI, true);
  ctx.strokeStyle = "#059669";
  ctx.lineWidth = 6;
  ctx.lineCap = "round";
  ctx.stroke();
}

onMounted(() => {
  renderArc();
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
      15:31
    </h1>
  </div>
</template>
