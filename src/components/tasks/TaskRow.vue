<template>
  <div class="task-row" :class="{ 'completed': task.completed }" @click="$emit('edit', task)">
    <div class="task-left">
      <div class="checkbox-wrapper" @click.stop="$emit('toggle', task)">
        <div class="custom-checkbox" :class="{ 'checked': task.completed }">
          <svg v-if="task.completed" viewBox="0 0 24 24" width="14" height="14" stroke="white" stroke-width="3" fill="none">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        </div>
      </div>
      <span class="task-title">{{ task.title }}</span>
    </div>

    <div class="task-right">
      <span
        v-if="task.category"
        class="task-badge"
        :style="{ backgroundColor: getBadgeColor(task.category.name, 0.1), color: getBadgeColor(task.category.name, 1) }"
      >
        {{ task.category.name }}
      </span>
      <span
        v-else-if="task.tags && task.tags.length > 0"
        class="task-badge"
        :style="{ backgroundColor: getBadgeColor(task.tags[0].name, 0.1), color: getBadgeColor(task.tags[0].name, 1) }"
      >
        {{ task.tags[0].name }}
      </span>

      <div class="task-date" :class="getDateClass(task.deadline || task.expirationDate)">
        <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2" fill="none">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
          <line x1="16" y1="2" x2="16" y2="6"></line>
          <line x1="8" y1="2" x2="8" y2="6"></line>
          <line x1="3" y1="10" x2="21" y2="10"></line>
        </svg>
        {{ formatDate(task.deadline || task.expirationDate) }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{ task: any }>()
defineEmits<{
  (e: 'edit', task: any): void
  (e: 'toggle', task: any): void
}>()

const colors = [
  { hex: '#8b5cf6' }, { hex: '#10b981' }, { hex: '#3b82f6' }, { hex: '#ec4899' }, { hex: '#f59e0b' },
]

const getBadgeColor = (name: string, opacity: number) => {
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  }
  const found = colors[Math.abs(hash) % colors.length]
  const hex = found ? found.hex : (colors[0]?.hex || '#8b5cf6')
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `rgba(${r}, ${g}, ${b}, ${opacity})`
}

const formatDate = (dateString: string) => {
  if (!dateString) return 'Sin fecha'
  const date = new Date(dateString)
  const today = new Date()
  const yesterday = new Date(today); yesterday.setDate(today.getDate() - 1)
  const tomorrow = new Date(today); tomorrow.setDate(today.getDate() + 1)
  if (date.toDateString() === today.toDateString()) return 'Hoy'
  if (date.toDateString() === yesterday.toDateString()) return 'Ayer'
  if (date.toDateString() === tomorrow.toDateString()) return 'Mañana'
  return date.toLocaleDateString('es-ES', { month: 'short', day: 'numeric' })
}

const getDateClass = (dateString: string) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  const today = new Date(); today.setHours(0, 0, 0, 0)
  if (date < today) return 'date-overdue'
  if (date.toDateString() === today.toDateString()) return 'date-today'
  return 'date-future'
}
</script>

<style scoped>
.task-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #1e1e20;
  border-radius: 12px;
  padding: 16px 20px;
  transition: all 0.2s;
  border: 1px solid transparent;
  cursor: pointer;
}

.task-row:hover { background-color: #27272a; }
.task-row.completed { opacity: 0.6; }
.task-row.completed .task-title { text-decoration: line-through; color: #71717a; }

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
  flex-shrink: 0;
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

.custom-checkbox.checked { background-color: #8b5cf6; border-color: #8b5cf6; }

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
  flex-shrink: 0;
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
  white-space: nowrap;
}

.date-overdue { color: #a0a0a5; }
.date-today   { color: #f59e0b; }
.date-future  { color: #71717a; }

@media (max-width: 520px) {
  .task-row   { flex-direction: column; align-items: flex-start; gap: 12px; padding: 14px 16px; }
  .task-right { width: 100%; padding-left: 36px; box-sizing: border-box; justify-content: space-between; gap: 12px; }
}
</style>
