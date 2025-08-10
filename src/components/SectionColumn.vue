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
const tasks = ref(props.section.taskIds);
const showTaskModal = ref(false);

const addTaskToSection = async (taskData) => {
  try {
    await createTask(taskData);
    tasks.value.push(taskData);
    showTaskModal.value = false;
    window.location.reload();
  } catch (err) {
    console.error("Failed to add task", err);
  }
};

const handleTaskDelete = (id) => {
  tasks.value = tasks.value.filter((task) => task._id !== id);
  window.location.reload();
};

const emit = defineEmits(["taskDropped"]);

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
    <div
      style="display: flex; justify-content: space-between; margin-right: 18px"
    >
      <h3 class="section-title">{{ section.title }}</h3>
      <h3 @click="showTaskModal = true" style="cursor: pointer"><b>+</b></h3>
    </div>
    <div class="kanban-column" @drop="onDrop" @dragover.prevent="allowDrop">
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
.tasks-list{
    display: flex;
    flex-direction: column;
    gap:8px;
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
</style>
