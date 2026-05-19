<template>
  <div class="layout">
    <Sidebar />
    <main class="main-content">
      <div class="content-container">
        <PageHeader title="Todas las Tareas" subtitle="Gestiona, filtra y organiza tu trabajo.">
          <template #actions>
            <button class="btn-primary" @click="openCreateModal">
              <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none"
                stroke-linecap="round" stroke-linejoin="round">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
              Nueva Tarea
            </button>
          </template>
        </PageHeader>

        <TaskFiltersBar v-model="searchQuery" placeholder="Buscar tareas..." @update:modelValue="debouncedSearch">
          <template #filters>
            <button class="dropdown-btn">
              <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>
              Categoría
              <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2" fill="none"><polyline points="6 9 12 15 18 9"></polyline></svg>
            </button>
            <button class="dropdown-btn">
              <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path><line x1="7" y1="7" x2="7.01" y2="7"></line></svg>
              Etiquetas
              <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2" fill="none"><polyline points="6 9 12 15 18 9"></polyline></svg>
            </button>
            <button class="dropdown-btn">
              <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none"><polyline points="9 11 12 14 22 4"></polyline><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path></svg>
              Estado
              <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2" fill="none"><polyline points="6 9 12 15 18 9"></polyline></svg>
            </button>
          </template>
        </TaskFiltersBar>

        <div class="tasks-list" v-if="tasks.length > 0">
          <TaskRow
            v-for="task in tasks"
            :key="task.id"
            :task="task"
            @edit="openEditModal"
            @toggle="toggleTaskStatus"
          />
        </div>

        <EmptyState v-else message="No se encontraron tareas." />

        <TaskModal :isOpen="isModalOpen" :task="selectedTask" @close="closeModal" @saved="fetchTasks" />
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import Sidebar from '@/components/Sidebar.vue'
import TaskModal from '@/components/TaskModal.vue'
import PageHeader from '@/components/shared/PageHeader.vue'
import EmptyState from '@/components/shared/EmptyState.vue'
import TaskRow from '@/components/tasks/TaskRow.vue'
import TaskFiltersBar from '@/components/tasks/TaskFiltersBar.vue'
import { useAuthStore } from '@/stores/auth'
import { taskService } from '@/services/taskService'

const authStore = useAuthStore()
const tasks = ref<any[]>([])
const searchQuery = ref('')
const isModalOpen = ref(false)
const selectedTask = ref<any>(null)

const openCreateModal = () => { selectedTask.value = null; isModalOpen.value = true }
const openEditModal = (task: any) => { selectedTask.value = task; isModalOpen.value = true }
const closeModal = () => { isModalOpen.value = false; selectedTask.value = null }

const fetchTasks = async () => {
  try {
    if (authStore.authHeader) {
      const response = searchQuery.value.trim()
        ? await taskService.searchTasks(authStore.authHeader, { title: searchQuery.value })
        : await taskService.getAllTasks(authStore.authHeader)
      tasks.value = response.data
    }
  } catch (error) {
    console.error('Error fetching tasks:', error)
  }
}

let timeoutId: number
const debouncedSearch = () => {
  clearTimeout(timeoutId)
  timeoutId = setTimeout(fetchTasks, 300) as unknown as number
}

const toggleTaskStatus = async (task: any) => {
  try {
    if (authStore.authHeader) {
      const dto = {
        title: task.title, description: task.description,
        priority: task.priority, estimateHours: task.estimateHours,
        deadline: task.deadline || task.expirationDate,
        completed: !task.completed, categoryId: task.category?.id || null
      }
      await taskService.updateTask(authStore.authHeader, task.id, dto)
      task.completed = !task.completed
    }
  } catch (error) {
    console.error('Error toggling task status:', error)
  }
}

onMounted(fetchTasks)
</script>

<style scoped>
.tasks-list {
  display: flex;
  flex-direction: column;
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
  height: 44px;
  font-size: 14px;
  cursor: pointer;
}
.dropdown-btn:hover { background-color: #27272a; color: #e4e4e7; }

@media (max-width: 520px) {
  .dropdown-btn { padding: 0 12px; justify-content: center; width: 100%; }
}
</style>
