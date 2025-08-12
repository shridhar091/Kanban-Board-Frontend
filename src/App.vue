<script setup>
import { ref, onMounted } from "vue";
import "@fontsource/inter";
import "@fontsource/inter/400.css";
import KanbanBoard from "./components/KanbanBoard.vue";
import { getSections } from "./services/api";

const sections = ref([]);

onMounted(async () => {
  const data = await getSections();
  sections.value = data.data;
});

</script>

<template>
  <div class="app">
    <KanbanBoard  />
  </div>
</template>

