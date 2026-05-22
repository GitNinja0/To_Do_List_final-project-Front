<template>
  <div class="user-stats-card">
    <div class="user-header">
      <div class="user-avatar">
        {{ userInitials }}
      </div>
      <div class="user-info">
        <h3 class="user-name">{{ user.fullname || user.username }}</h3>
        <span class="user-username">@{{ user.username }}</span>
      </div>
    </div>

    <div v-if="loading" class="stats-loading">
      Cargando estadísticas...
    </div>
    <div v-else-if="error" class="stats-error">
      No se pudieron cargar las estadísticas.
    </div>
    <div v-else-if="stats" class="stats-content">
      <div class="progress-section">
        <div class="progress-header">
          <span>Progreso de Tareas</span>
          <span class="progress-text">{{ stats.completedTasks }} de {{ stats.totalTasks }}</span>
        </div>
        <div class="progress-bar-bg">
          <div class="progress-bar-fill" :style="{ width: progressPercentage + '%' }"></div>
        </div>
      </div>

      <div class="stats-mini-grid">
        <div class="mini-stat">
          <span class="mini-stat-value" :class="{ 'text-red': stats.overdueTasks > 0 }">
            {{ stats.overdueTasks }}
          </span>
          <span class="mini-stat-label">Atrasadas</span>
        </div>
        <div class="mini-stat">
          <span class="mini-stat-value">{{ stats.pendingTasks }}</span>
          <span class="mini-stat-label">Pendientes</span>
        </div>
        <div class="mini-stat">
          <span class="mini-stat-value text-green">{{ stats.completedTasks }}</span>
          <span class="mini-stat-label">Completadas</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { dashboardService } from '@/services/dashboardService'

const props = defineProps<{
  user: any
}>()

const authStore = useAuthStore()
const stats = ref<any>(null)
const loading = ref(true)
const error = ref(false)

const userInitials = computed(() => {
  const name = props.user.fullname || props.user.username || 'U'
  return name.substring(0, 2).toUpperCase()
})

const progressPercentage = computed(() => {
  if (!stats.value || stats.value.totalTasks === 0) return 0
  return Math.round((stats.value.completedTasks / stats.value.totalTasks) * 100)
})

const fetchStats = async () => {
  if (!authStore.authHeader) return
  loading.value = true
  error.value = false
  try {
    const response = await dashboardService.getDashboardStats(authStore.authHeader, props.user.username)
    stats.value = response.data
  } catch (err) {
    console.error('Error fetching stats for user', props.user.username, err)
    error.value = true
  } finally {
    loading.value = false
  }
}

onMounted(fetchStats)
</script>

<style scoped>
.user-stats-card {
  background-color: #1a1a1c;
  border: 1px solid #2c2c2e;
  border-radius: 12px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  transition: transform 0.2s, box-shadow 0.2s;
}

.user-stats-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.4);
  border-color: #3a3a3c;
}

.user-header {
  display: flex;
  align-items: center;
  gap: 12px;
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, #8b5cf6, #ec4899);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 16px;
  flex-shrink: 0;
}

.user-info {
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.user-name {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #e4e4e7;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.user-username {
  font-size: 13px;
  color: #a1a1aa;
}

.stats-loading, .stats-error {
  font-size: 13px;
  color: #71717a;
  text-align: center;
  padding: 20px 0;
}

.stats-error {
  color: #f87171;
}

.stats-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.progress-section {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.progress-header {
  display: flex;
  justify-content: space-between;
  font-size: 13px;
  font-weight: 500;
  color: #e4e4e7;
}

.progress-text {
  color: #a1a1aa;
}

.progress-bar-bg {
  height: 8px;
  background-color: #2c2c2e;
  border-radius: 4px;
  overflow: hidden;
}

.progress-bar-fill {
  height: 100%;
  background: linear-gradient(90deg, #8b5cf6, #a855f7);
  border-radius: 4px;
  transition: width 0.5s ease-out;
}

.stats-mini-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  border-top: 1px solid #2c2c2e;
  padding-top: 16px;
}

.mini-stat {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.mini-stat-value {
  font-size: 20px;
  font-weight: 700;
  color: #e4e4e7;
}

.mini-stat-label {
  font-size: 12px;
  color: #71717a;
  margin-top: 4px;
}

.text-red {
  color: #f43f5e;
}

.text-green {
  color: #34d399;
}
</style>
