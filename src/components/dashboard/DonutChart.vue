<template>
  <div class="chart-card">
    <div class="chart-header">
      <h3 class="chart-title">Tareas por Categoría</h3>
    </div>
    <div class="donut-container">
      <div class="donut-chart" :style="donutStyle"></div>
      <div class="donut-center">
        <span class="donut-total">{{ totalTasks }}</span>
        <span class="donut-label">Total Tareas</span>
      </div>
    </div>
    <div class="chart-legend">
      <div class="legend-item" v-for="(count, category) in tasksByCategory" :key="category">
        <span class="legend-color" :style="{ backgroundColor: getCategoryColor(category.toString()) }"></span>
        {{ category }} ({{ Math.round((count / totalTasks) * 100) }}%)
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  tasksByCategory: Record<string, number>
  totalTasks: number
}>()

const colors = ['#8b5cf6', '#a855f7', '#6366f1', '#ec4899', '#f43f5e']

const getCategoryColor = (category: string) => {
  let hash = 0
  for (let i = 0; i < category.length; i++) {
    hash = category.charCodeAt(i) + ((hash << 5) - hash)
  }
  return colors[Math.abs(hash) % colors.length]
}

const donutStyle = computed(() => {
  if (props.totalTasks === 0) return {}
  let gradientParts: string[] = []
  let current = 0
  for (const [category, count] of Object.entries(props.tasksByCategory)) {
    const pct = (count / props.totalTasks) * 100
    gradientParts.push(`${getCategoryColor(category)} ${current}% ${current + pct}%`)
    current += pct
  }
  return { background: `conic-gradient(${gradientParts.join(', ')})` }
})
</script>

<style scoped>
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
  flex-shrink: 0;
}

@media (max-width: 480px) {
  .chart-card      { padding: 16px; }
  .donut-container { width: 160px; height: 160px; }
  .donut-center    { width: 120px; height: 120px; }
  .donut-total     { font-size: 24px; }
}
</style>
