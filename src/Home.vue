<script setup lang="ts">
import VersionLabel from "./VersionLabel.vue";
import Route from "./components/Route.vue";
import { Cog6ToothIcon } from "@heroicons/vue/24/solid";
import LargeLink from "./components/LargeLink.vue";
</script>
<template>
  <Route>
    <div class="flex flex-col h-full">
      <div class="flex justify-between align-middle">
        <span class="font-lato-black text-4xl text-stone-800">Escape</span>
        <div class="flex align-middle pt-4">
          <Suspense>
            <VersionLabel />
          </Suspense>
          <Cog6ToothIcon class="w-6 h-6 text-stone-800 cursor-pointer" />
        </div>
      </div>
      <div class="grow flex justify-center items-center">
        <LargeLink />
        <div class="w-20">
          <!-- spacer -->
        </div>
        <LargeLink />
      </div>
    </div>
  </Route>
</template>
