<script setup>
import { ref, watch } from "vue";
import "../assets/module.css";

const props = defineProps({
  mode: {
    type: String,
    default: "add",
  },
  initialTitle: {
    type: String,
    default: "",
  },
});

const emit = defineEmits(["submit", "close"]);

const title = ref(props.initialTitle);
const error = ref("");

// Sync prop updates (important for edit mode)
watch(
  () => props.initialTitle,
  (newVal) => {
    title.value = newVal;
  }
);

const handleSubmit = () => {
  if (!title.value.trim()) {
    error.value = "Title cannot be empty";
    return;
  }
  emit("submit", title.value.trim());
  title.value = "";
  error.value = "";
};
</script>

<template>
  <div class="modal-overlay">
    <div class="modal">
      <h3>{{ mode === "edit" ? "Edit Section" : "Add New Section" }}</h3>
      <input v-model="title" placeholder="Section title" />
      <p style="color: red">{{ error }}</p>
      <div class="modal-buttons">
        <button class="btn-primary" @click="handleSubmit">
          {{ mode === "edit" ? "Update" : "Submit" }}
        </button>
        <button class="btn-secondary" @click="$emit('close')">Cancel</button>
      </div>
    </div>
  </div>
</template>
