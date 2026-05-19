<template>
  <div class="selected-day-panel mobile-only" v-if="selectedDate">
    <h3 class="panel-title">Tareas del {{ formattedDateText }}</h3>
    <div class="panel-tasks-list" v-if="tasks.length > 0">
      <div
        v-for="task in tasks"
        :key="task.id"
        class="panel-task-card"
        :style="{ borderLeft: `4px solid ${getBadgeColor(task.category?.name || 'General', 1)}` }"
        @click="$emit('editTask', task)"
      >
        <div class="panel-task-header">
          <span class="panel-task-title" :class="{ 'completed-text': task.completed }">{{ task.title }}</span>
          <span class="panel-task-badge"
            :style="{ backgroundColor: getBadgeColor(task.category?.name || 'General', 0.1), color: getBadgeColor(task.category?.name || 'General', 1) }">
            {{ task.category?.name || 'General' }}
          </span>
        </div>
        <div class="panel-task-meta">
          <span class="panel-task-dates">{{ formatDateRangeText(task.createdAt, task.deadline) }}</span>
          <span class="panel-task-priority" :class="task.priority?.toLowerCase()">{{ task.priority }}</span>
        </div>
      </div>
    </div>
    <div v-else class="panel-empty-state">
      No hay tareas programadas para este día.
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  selectedDate: string
  formattedDateText: string
  tasks: any[]
}>()

defineEmits<{
  (e: 'editTask', task: any): void
}>()

const colors = [
  { hex: '#8b5cf6' }, { hex: '#10b981' }, { hex: '#3b82f6' }, { hex: '#f59e0b' }, { hex: '#ec4899' },
]

const getBadgeColor = (name: string, opacity: number) => {
  if (!name) return `rgba(139, 92, 246, ${opacity})`
  let hash = 0
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash)
  const found = colors[Math.abs(hash) % colors.length]
  const hex = found ? found.hex : (colors[0]?.hex || '#8b5cf6')
  if (opacity === 1) return hex
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `rgba(${r}, ${g}, ${b}, ${opacity})`
}

const formatDateRangeText = (startStr: string, endStr: string) => {
  if (!startStr) return 'Sin fecha'
  const start = new Date(startStr + 'T00:00:00')
  if (!endStr || startStr === endStr) {
    return start.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })
  }
  const end = new Date(endStr + 'T00:00:00')
  return `${start.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })} - ${end.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}`
}
</script>

<style scoped>
.selected-day-panel {
  background-color: #1a1a1c;
  border: 1px solid #2a2a2d;
  border-radius: 12px;
  padding: 20px;
  margin-top: 20px;
}

.panel-title {
  font-size: 16px;
  font-weight: 700;
  color: #ffffff;
  margin: 0 0 16px 0;
  text-transform: capitalize;
}

.panel-tasks-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.panel-task-card {
  background-color: #121214;
  border-radius: 8px;
  padding: 12px 14px;
  cursor: pointer;
  transition: background-color 0.15s;
  border-left: 4px solid #8b5cf6;
}

.panel-task-card:hover { background-color: #1a1a1e; }

.panel-task-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 8px;
  margin-bottom: 6px;
}

.panel-task-title {
  font-size: 14px;
  font-weight: 600;
  color: #e4e4e7;
  flex: 1;
}

.panel-task-title.completed-text {
  text-decoration: line-through;
  color: #71717a;
}

.panel-task-badge {
  font-size: 11px;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 10px;
  flex-shrink: 0;
}

.panel-task-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.panel-task-dates {
  font-size: 12px;
  color: #71717a;
}

.panel-task-priority {
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.panel-task-priority.alta   { color: #f43f5e; }
.panel-task-priority.media  { color: #f59e0b; }
.panel-task-priority.baja   { color: #10b981; }

.panel-empty-state {
  text-align: center;
  color: #52525b;
  font-size: 14px;
  padding: 24px 0;
}

/* Solo visible en móvil */
.mobile-only { display: none; }

@media (max-width: 768px) {
  .mobile-only { display: block; }
}
</style>
