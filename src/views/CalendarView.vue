<template>
  <div class="layout">
    <Sidebar />
    <main class="main-content">
      <div class="content-container">
        <CalendarNavBar
          :monthLabel="monthLabel"
          @today="goToToday"
          @prev="prevMonth"
          @next="nextMonth"
          @newTask="openCreateModal(null)"
        />

        <CalendarGrid
          :calendarDays="calendarDays"
          :selectedDate="selectedDate"
          :tasks="tasks"
          @selectDay="selectDay"
          @editTask="openEditModal"
        />

        <SelectedDayPanel
          :selectedDate="selectedDate"
          :formattedDateText="formatSelectedDateText"
          :tasks="selectedDayTasks"
          @editTask="openEditModal"
        />

        <!-- Modal Crear/Editar Tarea -->
        <TaskModal
          :isOpen="isModalOpen"
          :task="selectedTask"
          :defaultDate="selectedDate"
          @close="closeModal"
          @saved="onTaskSaved"
        />
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import Sidebar from '@/components/Sidebar.vue'
import CalendarNavBar from '@/components/calendar/CalendarNavBar.vue'
import CalendarGrid from '@/components/calendar/CalendarGrid.vue'
import SelectedDayPanel from '@/components/calendar/SelectedDayPanel.vue'
import TaskModal from '@/components/TaskModal.vue'
import { useAuthStore } from '@/stores/auth'
import { taskService } from '@/services/taskService'

const authStore = useAuthStore()
const currentMonth = ref(new Date().getMonth())
const currentYear = ref(new Date().getFullYear())
const selectedDate = ref(formatDateISO(new Date()))
const tasks = ref<any[]>([])

const isModalOpen = ref(false)
const selectedTask = ref<any | null>(null)

const months = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre']
const monthLabel = computed(() => `${months[currentMonth.value]} ${currentYear.value}`)

function formatDateISO(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`
}
function isSameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()
}

const calendarDays = computed(() => {
  const days: any[] = []
  const firstDay = new Date(currentYear.value, currentMonth.value, 1)
  let startDay = firstDay.getDay() - 1
  if (startDay === -1) startDay = 6
  const prevLast = new Date(currentYear.value, currentMonth.value, 0).getDate()
  for (let i = startDay - 1; i >= 0; i--) {
    const d = new Date(currentYear.value, currentMonth.value - 1, prevLast - i)
    days.push({ date: d, dayNumber: d.getDate(), isCurrentMonth: false, isToday: isSameDay(d, new Date()), formattedDate: formatDateISO(d) })
  }
  const last = new Date(currentYear.value, currentMonth.value + 1, 0).getDate()
  for (let i = 1; i <= last; i++) {
    const d = new Date(currentYear.value, currentMonth.value, i)
    days.push({ date: d, dayNumber: i, isCurrentMonth: true, isToday: isSameDay(d, new Date()), formattedDate: formatDateISO(d) })
  }
  const remaining = 42 - days.length
  for (let i = 1; i <= remaining; i++) {
    const d = new Date(currentYear.value, currentMonth.value + 1, i)
    days.push({ date: d, dayNumber: d.getDate(), isCurrentMonth: false, isToday: isSameDay(d, new Date()), formattedDate: formatDateISO(d) })
  }
  return days
})

const prevMonth = () => { currentMonth.value--; if (currentMonth.value < 0) { currentMonth.value = 11; currentYear.value-- } }
const nextMonth = () => { currentMonth.value++; if (currentMonth.value > 11) { currentMonth.value = 0; currentYear.value++ } }
const goToToday = () => { const t = new Date(); currentMonth.value = t.getMonth(); currentYear.value = t.getFullYear(); selectedDate.value = formatDateISO(t) }

const selectDay = (cell: any) => {
  selectedDate.value = cell.formattedDate
  if (!cell.isCurrentMonth) { currentMonth.value = cell.date.getMonth(); currentYear.value = cell.date.getFullYear() }
}

const selectedDayTasks = computed(() => {
  if (!selectedDate.value) return []
  return tasks.value.filter(task => {
    const start = task.createdAt || task.deadline || selectedDate.value
    const end = task.deadline || task.createdAt || selectedDate.value
    return selectedDate.value >= start && selectedDate.value <= end
  })
})

const formatSelectedDateText = computed(() => {
  if (!selectedDate.value) return ''
  return new Date(selectedDate.value + 'T00:00:00').toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })
})

const fetchTasks = async () => {
  try {
    if (authStore.authHeader) {
      const response = await taskService.getAllTasks(authStore.authHeader)
      tasks.value = response.data
    }
  } catch (e) { console.error('Error fetching tasks for calendar:', e) }
}

const openCreateModal = (cellDate: string | null) => {
  selectedTask.value = null
  if (cellDate) {
    selectedDate.value = cellDate
  }
  isModalOpen.value = true
}

const openEditModal = (task: any) => {
  selectedTask.value = task
  isModalOpen.value = true
}

const closeModal = () => {
  isModalOpen.value = false
  selectedTask.value = null
}

const onTaskSaved = async () => {
  await fetchTasks()
}

onMounted(() => { fetchTasks() })
</script>

<style scoped>
</style>
