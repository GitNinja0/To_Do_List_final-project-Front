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
            <div class="filter-dropdown">
              <CustomSelect v-model="filterCategory" :options="categoryOptions" />
            </div>
            <div class="filter-dropdown">
              <CustomSelect v-model="filterTag" :options="tagOptions" />
            </div>
            <div class="filter-dropdown">
              <CustomSelect v-model="filterStatus" :options="statusOptions" />
            </div>
          </template>
        </TaskFiltersBar>

        <div class="tasks-list" v-if="filteredTasks.length > 0">
          <TaskRow
            v-for="task in filteredTasks"
            :key="task.id"
            :task="task"
            @edit="openEditModal"
            @toggle="toggleTaskStatus"
          />
        </div>

        <EmptyState v-else message="No se encontraron tareas con los filtros seleccionados." />

        <TaskModal :isOpen="isModalOpen" :task="selectedTask" @close="closeModal" @saved="fetchTasks" />
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import Sidebar from '@/components/Sidebar.vue'
import TaskModal from '@/components/TaskModal.vue'
import PageHeader from '@/components/shared/PageHeader.vue'
import EmptyState from '@/components/shared/EmptyState.vue'
import TaskRow from '@/components/tasks/TaskRow.vue'
import TaskFiltersBar from '@/components/tasks/TaskFiltersBar.vue'
import CustomSelect from '@/components/shared/CustomSelect.vue'
import { useAuthStore } from '@/stores/auth'
import { taskService } from '@/services/taskService'
import { tagService } from '@/services/tagService'
import axios from 'axios'

const authStore = useAuthStore()
const tasks = ref<any[]>([])
const searchQuery = ref('')
const isModalOpen = ref(false)
const selectedTask = ref<any>(null)

// Filtros
const filterCategory = ref<number | 'all' | 'none'>('all')
const filterTag = ref<number | 'all'>('all')
const filterStatus = ref<string>('all')

const categories = ref<any[]>([])
const tags = ref<any[]>([])

const categoryOptions = computed(() => [
  { value: 'all', label: 'Todas las Categorías' },
  { value: 'none', label: 'Sin Categoría' },
  ...categories.value.map(c => ({ value: c.id, label: c.name }))
])

const tagOptions = computed(() => [
  { value: 'all', label: 'Todas las Etiquetas' },
  ...tags.value.map(t => ({ value: t.id, label: t.name }))
])

const statusOptions = [
  { value: 'all', label: 'Todos los Estados' },
  { value: 'pending', label: 'Pendiente' },
  { value: 'completed', label: 'Completado' }
]

const filteredTasks = computed(() => {
  return tasks.value.filter(task => {
    let matchCat = true
    if (filterCategory.value === 'none') {
      matchCat = !task.category
    } else if (filterCategory.value !== 'all') {
      matchCat = task.category?.id === filterCategory.value
    }
    
    let matchTag = true
    if (filterTag.value !== 'all') {
      matchTag = task.tags && task.tags.some((t: any) => t.id === filterTag.value)
    }
    
    let matchStatus = true
    if (filterStatus.value === 'pending') matchStatus = !task.completed
    if (filterStatus.value === 'completed') matchStatus = task.completed
    
    return matchCat && matchTag && matchStatus
  })
})

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

const fetchFilters = async () => {
  try {
    if (!authStore.authHeader) return
    const apiUrl = import.meta.env.VITE_API_ENDPOINT || 'http://localhost:8080/to-do-list'
    const [catRes, tagRes] = await Promise.all([
      axios.get(`${apiUrl}/categories`, { headers: { Authorization: authStore.authHeader } }),
      tagService.getAllTags(authStore.authHeader)
    ])
    categories.value = catRes.data
    tags.value = tagRes.data
  } catch (e) {
    console.error('Error fetching filters data:', e)
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

onMounted(() => {
  fetchTasks()
  fetchFilters()
})
</script>

<style scoped>
.tasks-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.filter-dropdown {
  min-width: 170px;
}

@media (max-width: 520px) {
  .filter-dropdown {
    width: 100%;
  }
}
</style>
