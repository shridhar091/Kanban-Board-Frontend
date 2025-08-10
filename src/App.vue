<script setup>
import { ref, onMounted } from "vue";
import "@fontsource/inter";
import "@fontsource/inter/400.css";
import KanbanBoard from "./components/KanbanBoard.vue";
import { getSections, createSection } from "./services/api";

const sections = ref([]);

const handleGetStarted = async () => {
  const defaultSections = ["To Do", "In Progress", "Done"];
  for (const name of defaultSections) {
    await createSection({ title: name });
  }

  const updated = await getSections();
  sections.value = updated.data;
};

onMounted(async () => {
  const data = await getSections();
  sections.value = data.data;
});


</script>

<template>
  <div class="app">
    <!-- Landing Page -->
    <!-- <div v-if="sections.length === 0" class="landing">
      <h1>Welcome to KanbanBoard</h1>
      <button @click="handleGetStarted">Get Started</button>
    </div> -->

    <!-- Kanban Board -->
    <!-- <KanbanBoard v-else /> -->
     <KanbanBoard/>
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
