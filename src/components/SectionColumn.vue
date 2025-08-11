<script setup>
import TaskCard from "./TaskCard.vue";
import AddTaskModal from "./AddTaskModal.vue";
import { ref } from "vue";
import { createTask } from "../services/api";

const props = defineProps({
  section: {
    type: Object,
    required: true,
  },
});
const showDropdown = ref(false);
const showTaskModal = ref(false);
const emit = defineEmits(["taskDropped"]);

const addTaskToSection = async (taskData) => {
  try {
    const newTask = await createTask(taskData);
    props.section.taskIds.push(newTask);
    showTaskModal.value = false;
    window.location.reload()
  } catch (err) {
    console.error("Failed to add task", err);
  }
};

const handleTaskDelete = (id) => {
  props.section.taskIds = props.section.taskIds.filter(
    (task) => task._id !== id
  );
};

const isDragOver = ref(false);

const onDragOver = (e) => {
  e.dataTransfer.dropEffect = "move";
};

const onDragEnter = (e) => {
  isDragOver.value = true;
};

const onDragLeave = (e) => {
  isDragOver.value = false;
};

const onDrop = (e) => {
  isDragOver.value = false;

  const taskId = e.dataTransfer.getData("taskId");
  const fromSectionId = e.dataTransfer.getData("fromSectionId");

  if (!taskId) return;
  if (String(fromSectionId) === String(props.section._id)) {
    return;
  }

  emit("taskDropped", {
    taskId,
    fromSectionId,
    toSectionId: props.section._id,
  });
};
</script>

<template>
  <div
    class="kanban-container"
    @dragover.prevent="onDragOver"
    @dragenter.prevent="onDragEnter"
    @dragleave.prevent="onDragLeave"
    @drop.prevent="onDrop"
  >
    <div style="display: flex; justify-content: space-between; margin-right: 18px">
      <h3 class="section-title">{{ section.title }}</h3>
      <div class="menu">
        <button class="dots" @click="showTaskModal = true">+</button>
        <button class="dots" @click="showDropdown = !showDropdown"></button>
        <div v-if="showDropdown" class="dropdown">
          <button >Edit</button>
          <button >Delete</button>
        </div>
      </div>
    </div>

    <div class="kanban-column">
      <div class="tasks-list">
        <TaskCard
          v-for="task in section.taskIds"
          :key="task._id"
          :task="task"
          @on-deleted="handleTaskDelete"
        />
      </div>

      <div v-show="isDragOver">Drop here</div>

      <button class="add-task-btn" @click="showTaskModal = true">
        + Add Task
      </button>
    </div>
  </div>

  <AddTaskModal
    v-if="showTaskModal"
    :sectionId="section._id"
    @submit="addTaskToSection"
    @close="showTaskModal = false"
  />
</template>

<style scoped>
.kanban-container {
  display: flex;
  flex-direction: column;
}

.kanban-column.drag-over {
  background-color: #e1ecf4;
}

.kanban-column {
  background-color: #f3f3f3;
  padding: 12px;
  border-radius: 8px;
  width: 250px;
  min-height: 75vh;
  overflow-y: auto;
  transition: background-color 0.3s;
}

.section-title {
  color: rgb(109, 106, 106);
}

.no-data {
  display: flex;
  justify-content: center;
  color: rgb(113, 113, 113);
}

.tasks-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.add-task-btn {
  margin-top: 10px;
  width: 100%;
  padding: 8px;
  background: none;
  color: rgb(157, 153, 153);
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

.menu {
  position: relative;
  display: flex;
  align-items: center;
  text-align: center;
  text-decoration: solid;
  gap: 8px;
}

.dots {
  background: none;
  border: none;
  font-size: 18px;
  cursor: pointer;
  padding: 4px;
  border-radius: 50%;
  transition: background-color 0.2s ease;
}

.dots:hover {
  background-color: #f0f0f0;
}

.dropdown {
  position: absolute;
  top: 24px; 
  right: 0;
  background: white;
  border-radius: 8px;
  padding: 6px 0;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
  z-index: 10;
  min-width: 100px;
}

.dropdown button {
  background: none;
  border: none;
  padding: 8px 12px;
  width: 100%;
  text-align: left;
  font-size: 14px;
  cursor: pointer;
  color: #333;
  transition: background-color 0.2s ease;
}

.dropdown button:hover {
  background-color: #f5f5f5;
}
</style>
