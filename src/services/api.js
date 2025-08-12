// src/services/api.js
import axios from 'axios'

const API = axios.create({
  baseURL: 'https://kanban-board-backend-one.vercel.app/api'
})

// Sections
export const getSections = () => API.get('/sections')
export const createSection = (data) => API.post('/sections', data)
export const deleteSection = (id) => API.delete(`/sections/${id}`)
export const updateSection = (data) => API.put(`/sections/${id}`,data)

// Tasks
export const createTask = (data) => API.post('/tasks', data)
export const updateTask = (id, data) => API.put(`/tasks/${id}`, data)
export const deleteTask = (id) => API.delete(`/tasks/${id}`)

export default API
