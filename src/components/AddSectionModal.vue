<script setup>
import { ref } from 'vue'
import '../assets/module.css'
const emit = defineEmits(['submit', 'close'])

const title = ref('')
const error = ref('')

const handleSubmit = () => {
  if (!title.value.trim()) {
    error.value = 'Title cannot be empty'
    return
  }
  emit('submit', title.value.trim())
  title.value = ''
  error.value = ''
}
</script>

<template>
  <div class="modal-overlay">
    <div class="modal">
      <h3>Add New Section</h3>
      <input v-model="title" placeholder="Section title" />
      <p style="color: red">{{ error }}</p>
      <div class="modal-buttons">
        <button @click="handleSubmit">Submit</button>
        <button @click="$emit('close')">Cancel</button>
      </div>
    </div>
  </div>
</template>
