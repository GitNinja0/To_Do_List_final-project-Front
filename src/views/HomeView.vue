<template>
  <div class="layout">
    <Sidebar />
    <main class="main-content">
      <div class="content-container">
        <PageHeader title="Dashboard" subtitle="Resumen de tus tareas y productividad actuales.">
          <template #actions>
            <div class="search-box home-search">
              <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none"
                stroke-linecap="round" stroke-linejoin="round" class="search-icon">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
              <input type="text" placeholder="Buscar..." />
            </div>
            <button class="btn-primary" @click="isCreateModalOpen = true">
              <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none"
                stroke-linecap="round" stroke-linejoin="round">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
              Nueva Tarea
            </button>
          </template>
        </PageHeader>

        <StatsGrid v-if="stats" :stats="stats" />

        <div class="charts-row" v-if="stats && stats.totalTasks > 0">
          <DonutChart :tasksByCategory="computedTasksByCategory" :totalTasks="stats.totalTasks" />
          <TagsDistributionChart :tasksByTag="stats.tasksByTag" :totalTasks="stats.totalTasks" />
        </div>

        <EmptyState
          v-else-if="stats && stats.totalTasks === 0"
          message="No tienes tareas creadas todavía. ¡Empieza creando tu primera tarea!"
        />

        <TaskModal :isOpen="isCreateModalOpen" @close="isCreateModalOpen = false" @saved="loadStats" />
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
import StatsGrid from '@/components/dashboard/StatsGrid.vue'
import DonutChart from '@/components/dashboard/DonutChart.vue'
import TagsDistributionChart from '@/components/dashboard/TagsDistributionChart.vue'
import { useAuthStore } from '@/stores/auth'
import { dashboardService } from '@/services/dashboardService'

const authStore = useAuthStore()
const stats = ref<any>(null)
const isCreateModalOpen = ref(false)

const colors = ['#8b5cf6', '#a855f7', '#6366f1', '#ec4899', '#f43f5e']
const getCategoryColor = (category: string) => {
  let hash = 0
  for (let i = 0; i < category.length; i++) hash = category.charCodeAt(i) + ((hash << 5) - hash)
  return colors[Math.abs(hash) % colors.length]
}

const computedTasksByCategory = computed(() => {
  if (!stats.value) return {}
  const tasksByCategory = { ...stats.value.tasksByCategory }
  const total = stats.value.totalTasks || 0
  if (total === 0) return {}
  const categorized = Object.values(tasksByCategory).reduce((acc: number, val: any) => acc + Number(val), 0)
  const uncategorized = total - categorized
  if (uncategorized > 0) tasksByCategory['Sin Categoría'] = uncategorized
  return tasksByCategory
})

const loadStats = async () => {
  try {
    if (authStore.authHeader) {
      const response = await dashboardService.getDashboardStats(authStore.authHeader)
      stats.value = response.data
    }
  } catch (error) {
    console.error('Error fetching dashboard stats:', error)
  }
}

onMounted(loadStats)
</script>

<style scoped>
.charts-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
}

.home-search {
  display: flex;
  align-items: center;
  background-color: #1e1e20;
  border-radius: 8px;
  padding: 0 16px;
  height: 40px;
  border: 1px solid #2c2c30;
  gap: 8px;
}
.home-search input {
  background: transparent;
  border: none;
  color: white;
  outline: none;
  font-size: 14px;
  width: 160px;
}
.search-icon { color: #71717a; }
</style>
