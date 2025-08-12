<script setup>
import { toast } from "vue3-toastify";
import TaskCard from "./TaskCard.vue";
import AddTaskModal from "./AddTaskModal.vue";
import AddSectionModal from "./AddSectionModal.vue";
import { ref, onMounted, onBeforeUnmount } from "vue";
import { createTask, deleteSection, updateSection } from "../services/api";

const props = defineProps({
  section: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(["taskDropped", "sectionDeleted", "sectionUpdated"]);

const showDropdown = ref(false);
const dropdownRef = ref(null);
const showTaskModal = ref(false);

const showSectionModal = ref(false);
const editMode = ref(false);
const sectionTitleToEdit = ref("");

// Toggle dropdown
const toggleDropdown = () => {
  showDropdown.value = !showDropdown.value;
};

// Close dropdown
const closeDropdown = () => {
  showDropdown.value = false;
};

// Detect click outside
const handleClickOutside = (event) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target)) {
    closeDropdown();
  }
};

onMounted(() => {
  document.addEventListener("click", handleClickOutside);
});

onBeforeUnmount(() => {
  document.removeEventListener("click", handleClickOutside);
});

const addTaskToSection = async (taskData) => {
  try {
    const res = await createTask(taskData);
    props.section.taskIds.push(res.data);
    showTaskModal.value = false;
  } catch (err) {
    console.error("Failed to add task", err);
  }
};

const handleTaskDelete = (id) => {
  props.section.taskIds = props.section.taskIds.filter(
    (task) => task._id !== id
  );
};

const handleSectionDelete = async () => {
  if (!confirm("Are you sure you want to delete this section?")) return;
  try {
    await deleteSection(props.section._id);
    toast.success("Section deleted successfully!");
    emit("sectionDeleted", props.section._id);
  } catch (err) {
    console.error("Failed to delete section", err);
  }
  closeDropdown();
};

// Open edit modal
const handleSectionEdit = () => {
  editMode.value = true;
  sectionTitleToEdit.value = props.section.title;
  showSectionModal.value = true;
  closeDropdown();
};

// Submit edit
const handleSectionEditSubmit = async (newTitle) => {
  try {
    await updateSection(props.section._id, { title: newTitle });
    props.section.title = newTitle;
    emit("sectionUpdated", { id: props.section._id, title: newTitle });
    showSectionModal.value = false;
    editMode.value = false;
  } catch (err) {
    console.error("Failed to update section", err);
  }
};

const handleTaskUpdate = (updatedTask) => {
  const index = props.section.taskIds.findIndex(
    (t) => t._id === updatedTask._id
  );
  if (index !== -1) {
    props.section.taskIds[index] = {
      ...props.section.taskIds[index],
      ...updatedTask,
    };
  }
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
    <div
      style="display: flex; justify-content: space-between; margin-right: 18px"
    >
      <h3 class="section-title">{{ section.title }}</h3>
      <div class="menu">
        <button class="dots" @click="showTaskModal = true">
          <i class="fa-sharp fa-thin fa-plus"></i>
        </button>
        <div class="dropdown-wrapper">
          <button ref="dropdownRef" class="dots" @click="toggleDropdown">
            <i class="fa-solid fa-ellipsis"></i>
          </button>
          <div v-if="showDropdown" class="dropdown">
            <button @click="handleSectionEdit">Edit</button>
            <button @click="handleSectionDelete">Delete</button>
          </div>
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
          @on-updated="handleTaskUpdate"
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

  <AddSectionModal
    v-if="showSectionModal"
    :mode="editMode ? 'edit' : 'add'"
    :initialTitle="sectionTitleToEdit"
    @submit="handleSectionEditSubmit"
    @close="showSectionModal = false"
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
  height: 75vh;
  overflow-y: auto;
  transition: background-color 0.3s;

  overflow-x: hidden;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.kanban-column::-webkit-scrollbar {
  display: none;
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

.dropdown-wrapper {
  position: relative;
  display: inline-block;
}

.menu {
  position: relative;
  display: flex;
  align-items: center;
  text-decoration: solid;
  gap: 8px;
}

.dots {
  background: none;
  color: rgb(109, 106, 106);
  border: none;
  font-size: 18px;
  cursor: pointer;
  /* padding: 4px; */
  border-radius: 50%;
  transition: background-color 0.2s ease;

  display: flex;
  align-items: center;
  justify-content: center;

  /* width: 28px;
  height: 28px;
  line-height: 0; */
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
