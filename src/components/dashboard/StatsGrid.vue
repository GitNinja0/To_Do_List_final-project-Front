<template>
  <div class="stats-grid">
    <StatCard :value="stats.createdTodayTasks" label="Tareas creadas hoy" iconColor="purple">
      <template #icon>
        <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none">
          <line x1="12" y1="5" x2="12" y2="19"></line>
          <line x1="5" y1="12" x2="19" y2="12"></line>
        </svg>
      </template>
    </StatCard>

    <StatCard :value="stats.overdueTasks" label="Tareas atrasadas" iconColor="red">
      <template #icon>
        <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none">
          <line x1="12" y1="8" x2="12" y2="12"></line>
          <line x1="12" y1="16" x2="12.01" y2="16"></line>
        </svg>
      </template>
    </StatCard>

    <StatCard :value="stats.completedTasks" label="Completadas hoy" iconColor="purple-alt">
      <template #icon>
        <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
      </template>
    </StatCard>

    <StatCard :value="stats.pendingTasks" label="Pendientes / Esta semana" iconColor="orange">
      <template #icon>
        <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none">
          <circle cx="12" cy="12" r="10"></circle>
          <polyline points="12 6 12 12 16 14"></polyline>
        </svg>
      </template>
    </StatCard>
  </div>
</template>

<script setup lang="ts">
import StatCard from './StatCard.vue'

defineProps<{
  stats: {
    createdTodayTasks: number
    overdueTasks: number
    completedTasks: number
    pendingTasks: number
  }
}>()
</script>

<style scoped>
.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
  margin-bottom: 32px;
}

@media (max-width: 1024px) {
  .stats-grid { grid-template-columns: repeat(2, 1fr); gap: 16px; }
}

@media (max-width: 480px) {
  .stats-grid { grid-template-columns: 1fr; gap: 12px; }
}
</style>
