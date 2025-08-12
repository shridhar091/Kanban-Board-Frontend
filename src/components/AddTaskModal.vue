<script setup>
import { ref, watch } from "vue";
import "../assets/module.css";

const props = defineProps({
  sectionId: String,
  mode: { type: String, default: "add" },
  initialData: { type: Object, default: () => ({}) },
});
const emit = defineEmits(["submit", "close"]);

const title = ref("");
const description = ref("");
const assignee = ref("");
const dueDate = ref("");

const errors = ref({ title: "", description: "", assignee: "", dueDate: "" });

const descriptionOptions = [
  "Bug Fix",
  "Programming",
  "UI Update",
  "Backend Integration",
  "Testing",
];

const assigneeOptions = ["Nishan", "Yashika", "Shridhar"];

// Watch for initial data changes (for edit mode)
watch(
  () => props.initialData,
  (val) => {
    if (props.mode === "edit" && val) {
      title.value = val.title || "";
      description.value = val.description || "";
      assignee.value = val.assignee || "";
      dueDate.value = val.dueDate ? val.dueDate.split("T")[0] : "";
    }
  },
  { immediate: true }
);

const validateForm = () => {
  let valid = true;
  errors.value = { title: "", description: "", assignee: "", dueDate: "" };

  if (!title.value.trim()) {
    errors.value.title = "Title is required";
    valid = false;
  }
  if (!description.value.trim()) {
    errors.value.description = "Description is required";
    valid = false;
  }
  if (!assignee.value.trim()) {
    errors.value.assignee = "Assignee is required";
    valid = false;
  }
  if (!dueDate.value) {
    errors.value.dueDate = "Due date is required";
    valid = false;
  }

  return valid;
};

const handleSubmit = () => {
  if (!validateForm()) return;

  const payload = {
    title: title.value,
    description: description.value,
    assignee: assignee.value,
    dueDate: dueDate.value,
    sectionId: props.sectionId,
  };

  // For edit mode, include task id
  if (props.mode === "edit" && props.initialData._id) {
    payload._id = props.initialData._id;
  }

  emit("submit", payload);
};
</script>

<template>
  <div class="modal-overlay">
    <div class="modal">
      <h3 style="text-align: center">
        {{ mode === "edit" ? "Edit Task" : "Add Task" }}
      </h3>
      <hr />

      <div>
        <input v-model="title" placeholder="Title" />
        <p v-if="errors.title" style="color: red">{{ errors.title }}</p>
      </div>

      <div>
        <select v-model="description">
          <option value="" disabled>Select Description</option>
          <option v-for="desc in descriptionOptions" :key="desc" :value="desc">
            {{ desc }}
          </option>
        </select>
        <p v-if="errors.description" style="color: red">
          {{ errors.description }}
        </p>
      </div>

      <div>
        <select v-model="assignee">
          <option value="" disabled>Select Assignee</option>
          <option
            v-for="person in assigneeOptions"
            :key="person"
            :value="person"
          >
            {{ person }}
          </option>
        </select>
        <p v-if="errors.assignee" style="color: red">{{ errors.assignee }}</p>
      </div>

      <div>
        <input type="date" v-model="dueDate" />
        <p v-if="errors.dueDate" style="color: red">{{ errors.dueDate }}</p>
      </div>

      <div class="modal-buttons">
        <button class="btn-primary" @click="handleSubmit">
          {{ mode === "edit" ? "Update" : "Add" }}
        </button>
        <button class="btn-secondary" @click="$emit('close')">Cancel</button>
      </div>
    </div>
  </div>
</template>
