<template>
  <div class="calendar-card">
    <div class="weekdays-grid">
      <div v-for="day in weekdays" :key="day" class="weekday-cell">{{ day }}</div>
    </div>
    <div class="days-grid">
      <CalendarDayCell
        v-for="cell in calendarDays"
        :key="cell.formattedDate"
        :cell="cell"
        :tasks="getTasksForDay(cell.formattedDate)"
        :isSelected="selectedDate === cell.formattedDate"
        @select="$emit('selectDay', $event)"
        @editTask="$emit('editTask', $event)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import CalendarDayCell from './CalendarDayCell.vue'

const props = defineProps<{
  calendarDays: any[]
  selectedDate: string
  tasks: any[]
}>()

defineEmits<{
  (e: 'selectDay', cell: any): void
  (e: 'editTask', task: any): void
}>()

const weekdays = ['LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁB', 'DOM']

const getTasksForDay = (formattedDate: string) => {
  return props.tasks.filter(task => {
    const start = task.createdAt || task.deadline || formattedDate
    const end = task.deadline || task.createdAt || formattedDate
    return formattedDate >= start && formattedDate <= end
  })
}
</script>

<style scoped>
.calendar-card {
  background-color: #1a1a1c;
  border: 1px solid #2a2a2d;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.4);
}

.weekdays-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  background-color: #161618;
  border-bottom: 1px solid #2a2a2d;
  padding: 12px 0;
  text-align: center;
}

.weekday-cell {
  font-size: 12px;
  font-weight: 700;
  color: #71717a;
  letter-spacing: 0.05em;
}

.days-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  grid-auto-rows: minmax(110px, 1fr);
  background-color: #242426;
  gap: 1px;
}
</style>
