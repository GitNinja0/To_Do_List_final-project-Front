<template>
  <div class="layout">
    <Sidebar />
    <main class="main-content">
      <div class="content-container">
        <header class="header">
          <div>
            <h1 class="page-title">Todas las Tareas</h1>
            <p class="page-subtitle">Gestiona, filtra y organiza tu trabajo.</p>
          </div>
          <div class="header-actions">
            <button class="btn-primary">
              <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
              Nueva Tarea
            </button>
          </div>
        </header>

        <div class="filters-bar">
          <div class="search-box">
            <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" class="search-icon"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            <input type="text" placeholder="Buscar tareas..." v-model="searchQuery" @input="debouncedSearch" />
          </div>
          
          <div class="filters-group">
            <div class="dropdown">
              <button class="dropdown-btn">
                <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>
                Categoría
                <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2" fill="none"><polyline points="6 9 12 15 18 9"></polyline></svg>
              </button>
            </div>
            
            <div class="dropdown">
              <button class="dropdown-btn">
                <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path><line x1="7" y1="7" x2="7.01" y2="7"></line></svg>
                Etiquetas
                <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2" fill="none"><polyline points="6 9 12 15 18 9"></polyline></svg>
              </button>
            </div>

            <div class="dropdown">
              <button class="dropdown-btn">
                <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none"><polyline points="9 11 12 14 22 4"></polyline><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path></svg>
                Estado
                <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2" fill="none"><polyline points="6 9 12 15 18 9"></polyline></svg>
              </button>
            </div>
          </div>
        </div>

        <div class="tasks-list" v-if="tasks.length > 0">
          <div 
            v-for="task in tasks" 
            :key="task.id" 
            class="task-row" 
            :class="{ 'completed': task.completed }"
          >
            <div class="task-left">
              <div class="checkbox-wrapper" @click="toggleTaskStatus(task)">
                <div class="custom-checkbox" :class="{ 'checked': task.completed }">
                  <svg v-if="task.completed" viewBox="0 0 24 24" width="14" height="14" stroke="white" stroke-width="3" fill="none"><polyline points="20 6 9 17 4 12"></polyline></svg>
                </div>
              </div>
              <span class="task-title">{{ task.title }}</span>
            </div>
            
            <div class="task-right">
              <!-- Asumiendo que el task tiene tags o category -->
              <span v-if="task.category" class="task-badge" :style="{ backgroundColor: getBadgeColor(task.category.name, 0.1), color: getBadgeColor(task.category.name, 1) }">
                {{ task.category.name }}
              </span>
              <span v-else-if="task.tags && task.tags.length > 0" class="task-badge" :style="{ backgroundColor: getBadgeColor(task.tags[0].name, 0.1), color: getBadgeColor(task.tags[0].name, 1) }">
                {{ task.tags[0].name }}
              </span>
              
              <div class="task-date" :class="getDateClass(task.expirationDate)">
                <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2" fill="none"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                {{ formatDate(task.expirationDate) }}
              </div>
            </div>
          </div>
        </div>
        
        <div v-else class="empty-state">
          <p>No se encontraron tareas.</p>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import Sidebar from '@/components/Sidebar.vue'
import { useAuthStore } from '@/stores/auth'
import { taskService } from '@/services/taskService'

const authStore = useAuthStore()
const tasks = ref<any[]>([])
const searchQuery = ref('')

const fetchTasks = async () => {
  try {
    if (authStore.authHeader) {
      // Si hay busqueda, usamos search. Sino, getAllTasks
      if (searchQuery.value.trim() !== '') {
        const response = await taskService.searchTasks(authStore.authHeader, { title: searchQuery.value })
        tasks.value = response.data
      } else {
        const response = await taskService.getAllTasks(authStore.authHeader)
        tasks.value = response.data
      }
    }
  } catch (error) {
    console.error("Error fetching tasks:", error)
  }
}

let timeoutId: number
const debouncedSearch = () => {
  clearTimeout(timeoutId)
  timeoutId = setTimeout(() => {
    fetchTasks()
  }, 300) as unknown as number
}

const toggleTaskStatus = (task: any) => {
  // Aquí idealmente llamarías a un endpoint PUT para actualizar el estado
  // taskService.updateTask(...)
  task.completed = !task.completed
}

// Colores predefinidos para los badges (tags/categorías)
const colors = [
  { bg: '#8b5cf6', hex: '#8b5cf6' }, // Purple
  { bg: '#10b981', hex: '#10b981' }, // Emerald/Green
  { bg: '#3b82f6', hex: '#3b82f6' }, // Blue
  { bg: '#ec4899', hex: '#ec4899' }, // Pink
  { bg: '#f59e0b', hex: '#f59e0b' }, // Amber/Orange
]

const getBadgeColor = (name: string, opacity: number) => {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const colorIndex = Math.abs(hash) % colors.length
  const color = colors[colorIndex] || { bg: '#8b5cf6', hex: '#8b5cf6' }
  const hex = color.hex
  
  // Convert hex to rgb for rgba
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  
  return `rgba(${r}, ${g}, ${b}, ${opacity})`
}

const formatDate = (dateString: string) => {
  if (!dateString) return 'Sin fecha'
  const date = new Date(dateString)
  const today = new Date()
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)
  
  if (date.toDateString() === today.toDateString()) return 'Hoy'
  if (date.toDateString() === yesterday.toDateString()) return 'Ayer'
  if (date.toDateString() === tomorrow.toDateString()) return 'Mañana'
  
  return date.toLocaleDateString('es-ES', { month: 'short', day: 'numeric' })
}

const getDateClass = (dateString: string) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  const today = new Date()
  today.setHours(0,0,0,0)
  
  if (date < today) return 'date-overdue' // Ayer u otro día pasado
  if (date.toDateString() === today.toDateString()) return 'date-today' // Hoy
  return 'date-future' // Mañana o futuro
}

onMounted(() => {
  fetchTasks()
})
</script>

<style scoped>
.layout {
  display: flex;
  min-height: 100vh;
  background-color: #111111;
  color: #ffffff;
}

.main-content {
  margin-left: 70px;
  flex: 1;
  padding: 40px;
}

.content-container {
  max-width: 1400px;
  width: 100%;
  margin: 0 auto;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 24px;
}

.page-title {
  font-size: 28px;
  font-weight: 700;
  margin: 0 0 8px 0;
}

.page-subtitle {
  color: #a0a0a5;
  margin: 0;
  font-size: 15px;
}

.btn-primary {
  display: flex;
  align-items: center;
  gap: 8px;
  background-color: #8b5cf6;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 0 16px;
  height: 40px;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.btn-primary:hover {
  background-color: #7c3aed;
}

.filters-bar {
  display: flex;
  gap: 16px;
  margin-bottom: 32px;
}

.search-box {
  display: flex;
  align-items: center;
  background-color: #1e1e20;
  border-radius: 8px;
  padding: 0 16px;
  height: 40px;
  border: 1px solid #2c2c30;
  flex: 1;
  max-width: 400px;
}

.search-icon {
  color: #71717a;
  margin-right: 8px;
}

.search-box input {
  background: transparent;
  border: none;
  color: white;
  outline: none;
  font-size: 14px;
  width: 100%;
}

.filters-group {
  display: flex;
  gap: 12px;
}

.dropdown-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  background-color: #1e1e20;
  color: #a0a0a5;
  border: 1px solid #2c2c30;
  border-radius: 8px;
  padding: 0 16px;
  height: 40px;
  font-size: 14px;
  cursor: pointer;
}

.dropdown-btn:hover {
  background-color: #27272a;
  color: #e4e4e7;
}

.tasks-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.task-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #1e1e20;
  border-radius: 12px;
  padding: 16px 20px;
  transition: all 0.2s;
  border: 1px solid transparent;
}

.task-row:hover {
  background-color: #27272a;
}

.task-row.completed {
  opacity: 0.6;
}

.task-row.completed .task-title {
  text-decoration: line-through;
  color: #71717a;
}

.task-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.checkbox-wrapper {
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.custom-checkbox {
  width: 20px;
  height: 20px;
  border: 2px solid #52525b;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.custom-checkbox.checked {
  background-color: #8b5cf6;
  border-color: #8b5cf6;
}

.task-title {
  font-size: 15px;
  font-weight: 500;
  color: #e4e4e7;
  transition: color 0.2s;
}

.task-right {
  display: flex;
  align-items: center;
  gap: 24px;
}

.task-badge {
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
}

.task-date {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: #71717a;
}

.date-overdue {
  color: #a0a0a5; /* Color sutil para pasado */
}

.date-today {
  color: #f59e0b; /* Naranja/Ambar para hoy */
}

.date-future {
  color: #71717a;
}

.empty-state {
  text-align: center;
  padding: 60px;
  color: #a0a0a5;
  background-color: #1e1e20;
  border-radius: 16px;
}

@media (max-width: 768px) {
  .main-content {
    margin-left: 0;
    margin-bottom: 60px;
    padding: 24px 16px;
  }
  .header {
    flex-direction: column;
    align-items: stretch;
    gap: 16px;
    margin-bottom: 24px;
  }
  .header-actions {
    flex-direction: column;
    width: 100%;
    gap: 12px;
  }
  .btn-primary {
    justify-content: center;
    width: 100%;
  }
  .filters-bar {
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
    margin-bottom: 24px;
  }
  .search-box {
    max-width: none;
    width: 100%;
  }
  .filters-group {
    width: 100%;
    justify-content: space-between;
    gap: 8px;
  }
  .filters-group > * {
    flex: 1;
  }
  .dropdown-btn {
    width: 100%;
    justify-content: center;
    padding: 0 12px;
  }
}

@media (max-width: 520px) {
  .task-row {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
    padding: 14px 16px;
  }
  .task-right {
    width: 100%;
    padding-left: 36px; /* Alínea exactamente debajo del título (checkbox de 20px + gap de 16px) */
    box-sizing: border-box;
    justify-content: space-between;
    gap: 12px;
  }
  .page-title {
    font-size: 24px;
  }
}
</style>
