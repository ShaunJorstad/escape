<script setup lang="ts">
import Placeholder from "./components/Placeholder.vue";
import Route from "./components/Route.vue";
import Title from "./components/Controls/Title.vue";
import Timer from "./components/Controls/Timer.vue";
import BreadCrumbs from "./components/BreadCrumbs.vue";
import Hints from "./components/Controls/Hints.vue";
import Messages from "./components/Controls/Messages.vue";
</script>
<template>
  <Route>
    <div class="grid grid-cols-2 gap-4 w-full h-full">
      <div class="">
        <Title />
        <Timer />
        <div class="h-96">
          <Placeholder :text="`Game Monitor Preview.`" />
        </div>
      </div>
      <div class="">
        <Hints />
        <Messages />
      </div>
    </div>
  </Route>
</template>
