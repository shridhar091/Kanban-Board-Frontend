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

<style scoped>
.landing {
  text-align: center;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.landing h1 {
  font-size: 2rem;
  margin-bottom: 1rem;
}

.landing button {
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  cursor: pointer;
  background-color: #3b82f6;
  color: white;
  border: none;
  border-radius: 8px;
  transition: background-color 0.3s;
}

.landing button:hover {
  background-color: #2563eb;
}
</style>
