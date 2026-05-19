<template>
  <div class="layout">
    <Sidebar />
    <main class="main-content">
      <div class="content-container">
        <PageHeader title="Estadísticas" subtitle="Visualización detallada de tareas y rendimiento.">
          <template #actions>
            <div class="statistics-filter-wrapper" v-if="isAdmin && userList.length > 0">
              <CustomSelect
                v-model="selectedUser"
                :options="userFilterOptions"
                @update:modelValue="fetchStats"
              >
                <template #trigger-icon>
                  <svg class="select-icon" viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                </template>
              </CustomSelect>
            </div>
          </template>
        </PageHeader>

        <LoadingState v-if="loading" message="Cargando estadísticas..." />

        <div v-else-if="error" class="error-state">
          <p>{{ error }}</p>
          <button @click="fetchStats" class="btn-primary">Reintentar</button>
        </div>

        <template v-else-if="stats">
          <StatsGrid :stats="stats" />
          <div class="charts-row" v-if="stats.totalTasks > 0">
            <DonutChart :tasksByCategory="computedTasksByCategory" :totalTasks="stats.totalTasks" />
            <TagsDistributionChart :tasksByTag="stats.tasksByTag" :totalTasks="stats.totalTasks" />
          </div>
          <EmptyState v-else message="No hay tareas registradas para generar estadísticas en este momento." />
        </template>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import Sidebar from '@/components/Sidebar.vue'
import PageHeader from '@/components/shared/PageHeader.vue'
import LoadingState from '@/components/shared/LoadingState.vue'
import EmptyState from '@/components/shared/EmptyState.vue'
import StatsGrid from '@/components/dashboard/StatsGrid.vue'
import DonutChart from '@/components/dashboard/DonutChart.vue'
import TagsDistributionChart from '@/components/dashboard/TagsDistributionChart.vue'
import { useAuthStore } from '@/stores/auth'
import { dashboardService } from '@/services/dashboardService'
import { userService } from '@/services/userService'
import CustomSelect from '@/components/shared/CustomSelect.vue'

const authStore = useAuthStore()
const stats = ref<any>(null)
const loading = ref(true)
const error = ref<string | null>(null)
const selectedUser = ref('all')
const userList = ref<any[]>([])

const isAdmin = computed(() => (authStore.roles || '').toUpperCase().includes('ADMIN'))

const userFilterOptions = computed(() => [
  { value: 'all', label: 'Todos los usuarios (Global)' },
  ...userList.value.map(u => ({
    value: u.username,
    label: u.fullname || u.username,
    subLabel: `(${u.username})`
  }))
])

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

const fetchStats = async () => {
  loading.value = true; error.value = null
  try {
    if (authStore.authHeader) {
      const response = await dashboardService.getDashboardStats(
        authStore.authHeader, isAdmin.value ? selectedUser.value : undefined
      )
      stats.value = response.data
    } else {
      error.value = 'No estás autenticado'
    }
  } catch (err) {
    error.value = 'No se pudieron cargar las estadísticas. Por favor, reintente.'
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  if (isAdmin.value && authStore.authHeader) {
    try {
      const r = await userService.getAllUsers(authStore.authHeader)
      userList.value = r.data
    } catch {}
  }
  await fetchStats()
})
</script>

<style scoped>
.charts-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
}

.error-state {
  text-align: center;
  padding: 60px;
  color: #f87171;
  background-color: rgba(239, 68, 68, 0.05);
  border: 1px solid rgba(239, 68, 68, 0.2);
  border-radius: 16px;
  margin-top: 32px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.statistics-filter-wrapper {
  width: 280px;
}
.select-icon {
  color: #71717a;
  flex-shrink: 0;
}

@media (max-width: 768px) {
  .statistics-filter-wrapper {
    width: 100%;
  }
}
</style>
