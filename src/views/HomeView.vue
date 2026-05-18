<template>
  <div class="layout">
    <Sidebar />
    <main class="main-content">
      <div class="content-container">
        <header class="header">
          <div>
            <h1 class="page-title">Dashboard</h1>
            <p class="page-subtitle">Resumen de tus tareas y productividad actuales.</p>
          </div>
          <div class="header-actions">
            <div class="search-box">
              <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" class="search-icon"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
              <input type="text" placeholder="Buscar..." />
            </div>
            <button class="btn-primary">
              <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
              Nueva Tarea
            </button>
          </div>
        </header>

        <div class="stats-grid" v-if="stats">
          <div class="stat-card">
            <div class="stat-header">
              <div class="stat-icon purple"><svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg></div>
            </div>
            <div class="stat-value">{{ stats.createdTodayTasks }}</div>
            <div class="stat-label">Tareas creadas hoy</div>
          </div>
          <div class="stat-card">
            <div class="stat-header">
              <div class="stat-icon red"><svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none"><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg></div>
            </div>
            <div class="stat-value">{{ stats.overdueTasks }}</div>
            <div class="stat-label">Tareas atrasadas</div>
          </div>
          <div class="stat-card">
            <div class="stat-header">
              <div class="stat-icon purple-alt"><svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none"><polyline points="20 6 9 17 4 12"></polyline></svg></div>
            </div>
            <div class="stat-value">{{ stats.completedTasks }}</div>
            <div class="stat-label">Completadas hoy</div>
          </div>
          <div class="stat-card">
            <div class="stat-header">
              <div class="stat-icon orange"><svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg></div>
            </div>
            <div class="stat-value">{{ stats.pendingTasks }}</div>
            <div class="stat-label">Pendientes / Esta semana</div>
          </div>
        </div>

        <div class="charts-row" v-if="stats && stats.totalTasks > 0">
          <div class="chart-card">
            <div class="chart-header">
              <h3 class="chart-title">Tareas por Categoría</h3>
            </div>
            <div class="donut-container">
              <div class="donut-chart" :style="donutStyle"></div>
              <div class="donut-center">
                <span class="donut-total">{{ stats.totalTasks }}</span>
                <span class="donut-label">Total Tareas</span>
              </div>
            </div>
            <div class="chart-legend">
              <div class="legend-item" v-for="(count, category) in stats.tasksByCategory" :key="category">
                <span class="legend-color" :style="{ backgroundColor: getCategoryColor(category.toString()) }"></span>
                {{ category }} ({{ Math.round((count / stats.totalTasks) * 100) }}%)
              </div>
            </div>
          </div>

          <div class="chart-card">
            <div class="chart-header">
              <h3 class="chart-title">Distribución por Etiquetas</h3>
            </div>
            <div class="tags-list">
              <div class="tag-row" v-for="(count, tag) in stats.tasksByTag" :key="tag">
                <div class="tag-info">
                  <span class="tag-name">{{ tag }}</span>
                  <span class="tag-count">{{ count }} tareas</span>
                </div>
                <div class="progress-bar">
                  <div class="progress-fill" :style="{ width: `${(count / stats.totalTasks) * 100}%` }"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div v-else-if="stats && stats.totalTasks === 0" class="empty-state">
          <p>No tienes tareas creadas todavía. ¡Empieza creando tu primera tarea!</p>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import Sidebar from '@/components/Sidebar.vue'
import { useAuthStore } from '@/stores/auth'
import { dashboardService } from '@/services/dashboardService'

const authStore = useAuthStore()
const stats = ref<any>(null)

// Colores para el gráfico
const colors = ['#8b5cf6', '#a855f7', '#6366f1', '#ec4899', '#f43f5e']

const getCategoryColor = (category: string) => {
  // Asignar color basado en hash simple para mantener consistencia
  let hash = 0;
  for (let i = 0; i < category.length; i++) {
    hash = category.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length]
}

const donutStyle = computed(() => {
  if (!stats.value || !stats.value.tasksByCategory) return ''
  
  let gradientParts = []
  let currentPercentage = 0
  
  const entries = Object.entries(stats.value.tasksByCategory) as [string, number][]
  for (const [category, count] of entries) {
    const percentage = (count / stats.value.totalTasks) * 100
    const color = getCategoryColor(category)
    
    gradientParts.push(`${color} ${currentPercentage}% ${currentPercentage + percentage}%`)
    currentPercentage += percentage
  }
  
  return {
    background: `conic-gradient(${gradientParts.join(', ')})`
  }
})

onMounted(async () => {
  try {
    if (authStore.authHeader) {
      const response = await dashboardService.getDashboardStats(authStore.authHeader)
      stats.value = response.data
    }
  } catch (error) {
    console.error("Error fetching dashboard stats:", error)
  }
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
  margin-bottom: 40px;
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

.header-actions {
  display: flex;
  gap: 16px;
}

.search-box {
  display: flex;
  align-items: center;
  background-color: #1e1e20;
  border-radius: 8px;
  padding: 0 16px;
  height: 40px;
  border: 1px solid #2c2c30;
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

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
  margin-bottom: 32px;
}

.stat-card {
  background-color: #1e1e20;
  border-radius: 16px;
  padding: 24px;
  display: flex;
  flex-direction: column;
}

.stat-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 16px;
}

.stat-icon {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.stat-icon.purple { background-color: rgba(139, 92, 246, 0.1); color: #8b5cf6; }
.stat-icon.red { background-color: rgba(244, 63, 94, 0.1); color: #f43f5e; }
.stat-icon.purple-alt { background-color: rgba(168, 85, 247, 0.1); color: #a855f7; }
.stat-icon.orange { background-color: rgba(249, 115, 22, 0.1); color: #f97316; }

.stat-value {
  font-size: 32px;
  font-weight: 700;
  margin-bottom: 8px;
}

.stat-label {
  color: #a0a0a5;
  font-size: 14px;
}

.charts-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
}

.chart-card {
  background-color: #1e1e20;
  border-radius: 16px;
  padding: 24px;
}

.chart-header {
  margin-bottom: 32px;
}

.chart-title {
  font-size: 16px;
  font-weight: 600;
  margin: 0;
}

.donut-container {
  position: relative;
  width: 200px;
  height: 200px;
  margin: 0 auto 32px auto;
}

.donut-chart {
  width: 100%;
  height: 100%;
  border-radius: 50%;
}

.donut-center {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 150px;
  height: 150px;
  background-color: #1e1e20;
  border-radius: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.donut-total {
  font-size: 32px;
  font-weight: 700;
}

.donut-label {
  font-size: 12px;
  color: #a0a0a5;
}

.chart-legend {
  display: flex;
  justify-content: center;
  gap: 16px;
  flex-wrap: wrap;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: #a0a0a5;
}

.legend-color {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.tags-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.tag-row {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.tag-info {
  display: flex;
  justify-content: space-between;
  font-size: 13px;
}

.tag-name {
  color: #e4e4e7;
  font-weight: 500;
}

.tag-count {
  color: #a0a0a5;
}

.progress-bar {
  height: 6px;
  background-color: #2c2c30;
  border-radius: 3px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background-color: #8b5cf6;
  border-radius: 3px;
}

.empty-state {
  text-align: center;
  padding: 60px;
  color: #a0a0a5;
  background-color: #1e1e20;
  border-radius: 16px;
  margin-top: 32px;
}

@media (max-width: 1024px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
  }
  .charts-row {
    grid-template-columns: 1fr;
    gap: 20px;
  }
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
  .search-box {
    width: 100%;
  }
  .search-box input {
    width: 100%;
  }
  .btn-primary {
    justify-content: center;
    width: 100%;
  }
}

@media (max-width: 480px) {
  .stats-grid {
    grid-template-columns: 1fr;
    gap: 12px;
  }
  .page-title {
    font-size: 24px;
  }
  .stat-card {
    padding: 16px;
  }
  .chart-card {
    padding: 16px;
  }
  .donut-container {
    width: 160px;
    height: 160px;
  }
  .donut-center {
    width: 120px;
    height: 120px;
  }
  .donut-total {
    font-size: 24px;
  }
}
</style>
