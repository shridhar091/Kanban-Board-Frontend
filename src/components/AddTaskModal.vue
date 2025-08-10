<script setup>
import { ref } from 'vue'
import '../assets/module.css'

const props = defineProps(['sectionId'])
const emit = defineEmits(['submit', 'close'])

const title = ref('')
const description = ref('')
const assignee = ref('')
const dueDate = ref('')

const errors = ref({
  title: '',
  description: '',
  assignee: '',
  dueDate: ''
})

const validateForm = () => {
  let valid = true

  errors.value = { title: '', description: '', assignee: '', dueDate: '' }

  if (!title.value.trim()) {
    errors.value.title = 'Title is required'
    valid = false
  }
  if (!description.value.trim()) {
    errors.value.description = 'Description is required'
    valid = false
  }
  if (!assignee.value.trim()) {
    errors.value.assignee = 'Assignee is required'
    valid = false
  }
  if (!dueDate.value) {
    errors.value.dueDate = 'Due date is required'
    valid = false
  } 
  // else {
  //   const today = new Date()
  //   today.setHours(0, 0, 0, 0)
  //   const selectedDate = new Date(dueDate.value)
  //   if (selectedDate < today) {
  //     errors.value.dueDate = 'Due date cannot be in the past'
  //     valid = false
  //   }
  // }

  return valid
}

const handleSubmit = () => {
  if (!validateForm()) return

  const payload = {
    title: title.value,
    description: description.value,
    assignee: assignee.value,
    dueDate: dueDate.value,
    sectionId: props.sectionId
  }

  emit('submit', payload)

  // Reset form
  title.value = ''
  description.value = ''
  assignee.value = ''
  dueDate.value = ''
}
</script>

<template>
  <div class="modal-overlay">
    <div class="modal">
      <h3 style="display: flex; justify-content: center;">Add Task</h3>
      <hr />

      <div>
        <input v-model="title" placeholder="Title" />
        <p v-if="errors.title" style="color: red">{{ errors.title }}</p>
      </div>

      <div>
        <input v-model="description" placeholder="Description" />
        <p v-if="errors.description" style="color: red">{{ errors.description }}</p>
      </div>

      <div>
        <input v-model="assignee" placeholder="Assignee" />
        <p v-if="errors.assignee" style="color: red">{{ errors.assignee }}</p>
      </div>

      <div>
        <input type="date" v-model="dueDate" />
        <p v-if="errors.dueDate" style="color: red">{{ errors.dueDate }}</p>
      </div>

      <div class="modal-buttons">
        <button @click="handleSubmit">Add</button>
        <button @click="$emit('close')">Cancel</button>
      </div>
    </div>
  </div>
</template>
