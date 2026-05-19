<template>
  <div class="chart-card">
    <div class="chart-header">
      <h3 class="chart-title">Distribución por Etiquetas</h3>
    </div>
    <div class="tags-list">
      <div class="tag-row" v-for="(count, tag) in tasksByTag" :key="tag">
        <div class="tag-info">
          <span class="tag-name">{{ tag }}</span>
          <span class="tag-count">{{ count }} tareas</span>
        </div>
        <div class="progress-bar">
          <div class="progress-fill" :style="{ width: `${(count / totalTasks) * 100}%` }"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  tasksByTag: Record<string, number>
  totalTasks: number
}>()
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
  transition: width 0.4s ease;
}

@media (max-width: 480px) {
  .chart-card { padding: 16px; }
}
</style>
