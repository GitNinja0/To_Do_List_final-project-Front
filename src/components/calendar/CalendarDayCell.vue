<template>
  <div
    class="day-cell"
    :class="{
      'other-month': !cell.isCurrentMonth,
      'is-today': cell.isToday,
      'is-selected': isSelected
    }"
    @click="$emit('select', cell)"
  >
    <div class="day-number-container">
      <span class="day-number" :class="{ 'today-badge': cell.isToday }">
        {{ cell.dayNumber }}
      </span>
    </div>

    <!-- Desktop: task bars -->
    <div class="day-tasks-container desktop-only">
      <div
        v-for="task in tasks"
        :key="task.id"
        class="calendar-task-bar"
        :class="getTaskBarClasses(task, cell.formattedDate)"
        :style="getTaskBarStyle(task)"
        @click.stop="$emit('editTask', task)"
      >
        <span class="task-bar-text" v-if="shouldShowText(task, cell.formattedDate)">
          {{ task.title }}
        </span>
      </div>
    </div>

    <!-- Mobile: indicator dots -->
    <div class="day-indicators-container mobile-only">
      <span
        v-for="task in tasks.slice(0, 3)"
        :key="task.id"
        class="indicator-dot"
        :style="{ backgroundColor: getBadgeColor(task.category?.name || 'General', 1) }"
      ></span>
      <span v-if="tasks.length > 3" class="indicator-more">+</span>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  cell: any
  tasks: any[]
  isSelected: boolean
}>()

defineEmits<{
  (e: 'select', cell: any): void
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

const getTaskBarClasses = (task: any, formattedDate: string) => {
  const start = task.createdAt || task.deadline || formattedDate
  const end = task.deadline || task.createdAt || formattedDate
  const isStart = formattedDate === start
  const isEnd = formattedDate === end
  const isSingle = start === end
  return {
    'task-span-start': isStart && !isSingle,
    'task-span-end': isEnd && !isSingle,
    'task-span-middle': !isStart && !isEnd && !isSingle,
    'task-span-single': isSingle,
    'task-completed': task.completed
  }
}

const shouldShowText = (task: any, formattedDate: string) => {
  const start = task.createdAt || task.deadline || formattedDate
  if (formattedDate === start) return true
  return new Date(formattedDate + 'T00:00:00').getDay() === 1
}

const getTaskBarStyle = (task: any) => {
  const catName = task.category?.name || 'General'
  const colorHex = getBadgeColor(catName, 1)
  const colorBg = getBadgeColor(catName, 0.15)
  return {
    backgroundColor: colorBg,
    color: task.completed ? '#71717a' : colorHex,
    borderLeft: `3px solid ${colorHex}`
  }
}
</script>

<style scoped>
.day-cell {
  background-color: #1a1a1c;
  padding: 8px;
  cursor: pointer;
  transition: background-color 0.15s;
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-height: 110px;
  overflow: hidden;
}

.day-cell:hover { background-color: #212124; }

.day-cell.other-month { opacity: 0.35; }

.day-cell.is-today .day-number-container { }

.day-cell.is-selected { background-color: rgba(139, 92, 246, 0.08); outline: 1px solid rgba(139, 92, 246, 0.3); }

.day-number-container {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 4px;
}

.day-number {
  font-size: 13px;
  font-weight: 500;
  color: #a1a1aa;
  width: 26px;
  height: 26px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
}

.today-badge {
  background-color: #8b5cf6;
  color: #ffffff;
  font-weight: 700;
}

.day-tasks-container {
  display: flex;
  flex-direction: column;
  gap: 2px;
  overflow: hidden;
}

.calendar-task-bar {
  font-size: 11px;
  font-weight: 600;
  padding: 3px 6px;
  border-radius: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  cursor: pointer;
  transition: opacity 0.15s;
  line-height: 1.4;
}

.calendar-task-bar:hover { opacity: 0.85; }

.task-span-start { border-radius: 4px 0 0 4px; margin-right: -4px; }
.task-span-end   { border-radius: 0 4px 4px 0; margin-left: -4px; border-left: none !important; }
.task-span-middle { border-radius: 0; margin-left: -4px; margin-right: -4px; border-left: none !important; }
.task-span-single { border-radius: 4px; }
.task-completed  { opacity: 0.55; text-decoration: line-through; }

.task-bar-text {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* Indicadores móvil */
.day-indicators-container {
  display: none;
  flex-direction: row;
  gap: 3px;
  align-items: center;
  flex-wrap: wrap;
  padding: 2px 0;
}

.indicator-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  flex-shrink: 0;
}

.indicator-more {
  font-size: 10px;
  color: #71717a;
  font-weight: 700;
}

/* Responsive */
.desktop-only { display: flex; }
.mobile-only  { display: none; }

@media (max-width: 768px) {
  .desktop-only { display: none; }
  .mobile-only  { display: flex; }
  .day-cell     { min-height: 56px; padding: 6px; }
  .day-number   { font-size: 12px; width: 22px; height: 22px; }
  .day-indicators-container { display: flex; }
}
</style>
