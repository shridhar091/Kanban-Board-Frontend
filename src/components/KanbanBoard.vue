<script setup>
import { ref, onMounted } from "vue";
import { getSections, createSection, updateTask } from "../services/api";
import SectionColumn from "./SectionColumn.vue";
import AddSectionModal from "./AddSectionModal.vue";

const sections = ref([]);
const showModal = ref(false);

const fetchSections = async () => {
  const res = await getSections();
  sections.value = res.data;
};

const addNewSection = async (title) => {
  await createSection({ title });
  showModal.value = false;
  fetchSections();
};

onMounted(async () => {
  try {
    const res = await getSections();
    sections.value = res.data;
  } catch (err) {
    console.error("Failed to load sections", err);
  }
});

const handleTaskDropped = async ({ taskId, fromSectionId, toSectionId }) => {
  const from = sections.value.find(
    (s) => String(s._id) === String(fromSectionId)
  );
  const to = sections.value.find((s) => String(s._id) === String(toSectionId));
  if (!from || !to) return;
  const taskIndex = from.taskIds.findIndex(
    (t) => String(t._id) === String(taskId)
  );
  if (taskIndex === -1) return;

  const taskObj = from.taskIds[taskIndex];

  const payload = {
    title: taskObj.title ?? "",
    description: taskObj.description ?? "",
    dueDate: taskObj.dueDate ?? null,
    assignee: taskObj.assignee ?? null,
    sectionId: to._id, // new section id
  };

  from.taskIds.splice(taskIndex, 1);
  const movedTask = { ...taskObj, sectionId: to._id };
  to.taskIds.push(movedTask);

  try {
    const res = await updateTask(taskId, payload);
    const updatedTask = res.data;
    const newIdx = to.taskIds.findIndex(
      (t) => String(t._id) === String(taskId)
    );
    if (newIdx !== -1) {
      to.taskIds.splice(newIdx, 1, updatedTask);
    }
  } catch (err) {
    console.error("Failed to update task on server, rolling back", err);
    const idxInTo = to.taskIds.findIndex(
      (t) => String(t._id) === String(taskId)
    );
    if (idxInTo !== -1) to.taskIds.splice(idxInTo, 1);
    from.taskIds.push(taskObj);
  }
};
</script>

<template>
  <link
    rel="stylesheet"
    href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
  />
  <div class="header">
    <img
      width="160px"
      src="https://www.sketchmonk.com/assets/general/logoo.svg"
    />
    <div class="search-container">
      <input type="text" placeholder="Search" class="search-input" />

      <div class="icon-group">
        <button class="icon-btn">
          <i class="fas fa-share"></i>
        </button>
        <button class="icon-btn">
          <i class="fas fa-cog"></i>
        </button>
      </div>
    </div>
  </div>

  <div class="kanban-board">
    <div style="display: flex; flex-direction: row; gap: 16px">
      <SectionColumn
        v-for="section in sections"
        :key="section._id"
        :section="section"
        @taskDropped="handleTaskDropped"
        @sectionDeleted="sections = sections.filter((s) => s._id !== $event)"
      />
    </div>
    <div>
      <button class="add-button" @click="showModal = true">
        + Add Section
      </button>
    </div>
  </div>

  <AddSectionModal
    v-if="showModal"
    @submit="addNewSection"
    @close="showModal = false"
  />
</template>

<style scoped>
.header {
  display: flex;
  justify-content: space-between;
}

.kanban-board {
  display: flex;
  gap: 16px;
  padding: 16px;
  overflow-x: auto;
  justify-content: space-between;
}

.add-button {
  margin: 16px;
  background: none;
  color: rgb(157, 153, 153);
  padding: 8px 14px;
  border: none;
  border-radius: 6px;
  font-weight: bold;
  cursor: pointer;
}

.search-container {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-right: 16px;
}

.search-input {
  flex: 1;
  padding: 6px 10px;
  border-radius: 8px;
  border: 1px solid #ddd;
  font-size: 14px;
  outline: none;
}

.icon-group {
  display: flex;
  gap: 6px;
}

.icon-btn {
  background: none;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 6px;
  cursor: pointer;
  color: #9ca3af;
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon-btn:hover {
  background-color: #f3f4f6;
}
</style>
