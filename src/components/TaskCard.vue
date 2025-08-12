<script setup>
import { ref, computed } from "vue";
import { toast } from "vue3-toastify";
import { deleteTask,updateTask } from "../services/api";
import AddTaskModal from "./AddTaskModal.vue";

const props = defineProps({
  task: {
    type: Object,
    required: true,
  },
});
const emit = defineEmits(["onDeleted", "onUpdated"]);

const showDropdown = ref(false);
const showEditModal = ref(false);

const handleDelete = async () => {
  if (!confirm("Are you sure you want to delete this Task?")) return;
  try {
    await deleteTask(props.task._id);
    toast.success("Task deleted successfully!");
    emit("onDeleted", props.task._id);
  } catch (err) {
    console.error("Delete failed", err);
  }
};

const handleTaskEdit = () => {
  showEditModal.value = true;
};

const handleTaskEditSubmit = async (updatedTask) => {
  try {
    await updateTask(updatedTask._id, updatedTask);
    emit("onUpdated", updatedTask);
    showEditModal.value = false;
    showDropdown.value = false;
  } catch (err) {
    console.error("Update failed", err);
  }
};

const dateLabel = computed(() => {
  if (!props.task.dueDate) {
    return { text: "", color: "#555" };
  }

  const dueDate = new Date(props.task.dueDate);
  if (isNaN(dueDate)) {
    return { text: props.task.dueDate, color: "#555" };
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const dueTime = new Date(dueDate).setHours(0, 0, 0, 0);
  const diffTime = dueTime - today.getTime();
  const oneDay = 24 * 60 * 60 * 1000;

  if (diffTime === 0) {
    return { text: "Today", color: "black" };
  } else if (diffTime === -oneDay) {
    return { text: "Yesterday", color: "red" };
  } else if (diffTime === oneDay) {
    return { text: "Tomorrow", color: "blue" };
  } else {
  const day = dueDate.getDate().toString().padStart(2, "0");
  const month = dueDate.toLocaleString("en-US", { month: "short" }); // Aug
  return { text: `${day} ${month}`, color: "rgb(109, 106, 106)" };
}
});

const onDragStart = (event) => {
  event.dataTransfer.setData("taskId", props.task._id);
  event.dataTransfer.setData(
    "fromSectionId",
    String(props.task.sectionId ?? "")
  );
  event.dataTransfer.effectAllowed = "move";
};
</script>

<template>
  <div class="task-card" draggable="true" @dragstart="onDragStart">
    <div class="card-header">
      <h4 class="title">{{ task.title }}</h4>
      <div class="menu">
        <button class="dots" @click="showDropdown = !showDropdown">⋮</button>
        <div v-if="showDropdown" class="dropdown">
          <button @click="handleTaskEdit">Edit</button>
          <button @click="handleDelete">Delete</button>
        </div>
      </div>
    </div>

    <div class="meta-row">
      <div style="display: flex; align-items: center; gap: 6px;">
        <img
          class="avatar"
          src="https://testingbot.com/free-online-tools/random-avatar/300"
          alt="User"
        />
        <small :style="{ color: dateLabel.color }" class="date-text">
          <b>{{ dateLabel.text }}</b>
        </small>
      </div>
      <div>
        <span class="tag">{{ task.description }}</span>
      </div>
    </div>
     <AddTaskModal
      v-if="showEditModal"
      mode="edit"
      :initialData="task"
      :sectionId="task.sectionId"
      @submit="handleTaskEditSubmit"
      @close="showEditModal = false"
    />
  </div>
</template>


<style scoped>

.task-card {
  background: #fff;
  padding: 10px 14px;
  border-radius: 10px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
  gap: 6px;
  transition: box-shadow 0.2s ease;
  width: 220px;
  max-width: 100%;
}

.task-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.card-header {
  display: flex;
  justify-content: space-between;
}

.title {
  font-size: 15px;
  font-weight: 500;
  margin: 0;
  color: #222;
  white-space: normal;
  word-break: break-word; 
}

.menu {
  position: relative;
  display: flex;
  align-items: center;
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

.meta-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.avatar {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  object-fit: cover;
}

.date-text {
  font-size: 13px;
}

.tag {
  background: #f1f1f1;
  border-radius: 50px;
  padding: 3px 10px;
  font-size: 12px;
  color: #555;
}
</style>
