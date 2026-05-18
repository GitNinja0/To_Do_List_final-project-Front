<template>
  <div class="layout">
    <Sidebar />
    <main class="main-content">
      <div class="content-container">
        <!-- Cabecera -->
        <header class="header">
          <div>
            <h1 class="page-title">Calendario</h1>
            <p class="page-subtitle">Líneas de tiempo y plazos de entrega de tus tareas.</p>
          </div>
          <div class="header-actions">
            <button class="btn-today" @click="goToToday">Hoy</button>
            <div class="nav-arrows">
              <button class="arrow-btn" @click="prevMonth" title="Mes anterior">
                <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none"><polyline points="15 18 9 12 15 6"></polyline></svg>
              </button>
              <span class="month-title">{{ monthLabel }}</span>
              <button class="arrow-btn" @click="nextMonth" title="Mes siguiente">
                <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none"><polyline points="9 18 15 12 9 6"></polyline></svg>
              </button>
            </div>
            <button class="btn-primary" @click="openCreateModal(null)">
              <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
              Nueva Tarea
            </button>
          </div>
        </header>

        <!-- Cuadrícula de Calendario -->
        <div class="calendar-card">
          <!-- Cabeceras de días de la semana -->
          <div class="weekdays-grid">
            <div v-for="day in weekdays" :key="day" class="weekday-cell">{{ day }}</div>
          </div>

          <!-- Cuadrícula mensual de días -->
          <div class="days-grid">
            <div 
              v-for="cell in calendarDays" 
              :key="cell.formattedDate" 
              class="day-cell"
              :class="{ 
                'other-month': !cell.isCurrentMonth, 
                'is-today': cell.isToday,
                'is-selected': selectedDate === cell.formattedDate 
              }"
              @click="selectDay(cell)"
            >
              <!-- Número del día -->
              <div class="day-number-container">
                <span class="day-number" :class="{ 'today-badge': cell.isToday }">
                  {{ cell.dayNumber }}
                </span>
              </div>

              <!-- Contenedor de tareas en este día (Escritorio) -->
              <div class="day-tasks-container desktop-only">
                <div 
                  v-for="task in getTasksForDay(cell.formattedDate)" 
                  :key="task.id"
                  class="calendar-task-bar"
                  :class="getTaskBarClasses(task, cell.formattedDate)"
                  :style="getTaskBarStyle(task)"
                  @click.stop="openEditModal(task)"
                >
                  <span class="task-bar-text" v-if="shouldShowText(task, cell.formattedDate)">
                    {{ task.title }}
                  </span>
                </div>
              </div>

              <!-- Indicadores de tareas (Móvil) -->
              <div class="day-indicators-container mobile-only">
                <span 
                  v-for="task in getTasksForDay(cell.formattedDate).slice(0, 3)" 
                  :key="task.id" 
                  class="indicator-dot"
                  :style="{ backgroundColor: getBadgeColor(task.category?.name || 'General', 1) }"
                ></span>
                <span v-if="getTasksForDay(cell.formattedDate).length > 3" class="indicator-more">+</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Panel de Tareas del Día Seleccionado (Móvil) -->
        <div class="selected-day-panel mobile-only" v-if="selectedDate">
          <h3 class="panel-title">Tareas del {{ formatSelectedDateText }}</h3>
          <div class="panel-tasks-list" v-if="selectedDayTasks.length > 0">
            <div 
              v-for="task in selectedDayTasks" 
              :key="task.id" 
              class="panel-task-card"
              :style="{ borderLeft: `4px solid ${getBadgeColor(task.category?.name || 'General', 1)}` }"
              @click="openEditModal(task)"
            >
              <div class="panel-task-header">
                <span class="panel-task-title" :class="{ 'completed-text': task.completed }">{{ task.title }}</span>
                <span class="panel-task-badge" :style="{ backgroundColor: getBadgeColor(task.category?.name || 'General', 0.1), color: getBadgeColor(task.category?.name || 'General', 1) }">
                  {{ task.category?.name || 'General' }}
                </span>
              </div>
              <div class="panel-task-meta">
                <span class="panel-task-dates">
                  {{ formatDateRangeText(task.createdAt, task.deadline) }}
                </span>
                <span class="panel-task-priority" :class="task.priority?.toLowerCase()">
                  {{ task.priority }}
                </span>
              </div>
            </div>
          </div>
          <div v-else class="panel-empty-state">
            No hay tareas programadas para este día.
          </div>
        </div>

        <!-- MODAL RÁPIDO PARA CREAR TAREA -->
        <transition name="modal-fade">
          <div class="modal-overlay" v-if="showCreateModal" @click.self="closeCreateModal">
            <div class="modal-card-custom">
              <header class="modal-header">
                <h3>{{ isEditing ? 'Editar Tarea' : 'Nueva Tarea' }}</h3>
                <button class="close-btn" @click="closeCreateModal">&times;</button>
              </header>
              <form @submit.prevent="saveTask">
                <div class="modal-body">
                  <div class="form-group">
                    <label for="title">Título de la Tarea</label>
                    <input 
                      type="text" 
                      id="title" 
                      v-model="form.title" 
                      required 
                      placeholder="Ej: Revisión de Diseño"
                      class="modal-input"
                    />
                  </div>

                  <div class="form-group">
                    <label for="description">Descripción</label>
                    <textarea 
                      id="description" 
                      v-model="form.description" 
                      placeholder="Detalles sobre el entregable de la tarea..."
                      class="modal-input text-area"
                      rows="3"
                    ></textarea>
                  </div>

                  <div class="form-row-2">
                    <div class="form-group">
                      <label for="createdAt">Fecha de Inicio</label>
                      <input 
                        type="date" 
                        id="createdAt" 
                        v-model="form.createdAt" 
                        required
                        class="modal-input"
                      />
                    </div>
                    <div class="form-group">
                      <label for="deadline">Plazo de Entrega</label>
                      <input 
                        type="date" 
                        id="deadline" 
                        v-model="form.deadline" 
                        required
                        class="modal-input"
                      />
                    </div>
                  </div>

                  <div class="form-row-2">
                    <div class="form-group">
                      <label for="priority">Prioridad</label>
                      <select id="priority" v-model="form.priority" class="modal-input select">
                        <option value="Baja">Baja</option>
                        <option value="Media">Media</option>
                        <option value="Alta">Alta</option>
                      </select>
                    </div>
                    <div class="form-group">
                      <label for="category">Categoría</label>
                      <select id="category" v-model="form.categoryId" class="modal-input select">
                        <option :value="null">Ninguna (General)</option>
                        <option v-for="cat in availableCategories" :key="cat.id" :value="cat.id">
                          {{ cat.name }}
                        </option>
                      </select>
                    </div>
                  </div>

                  <!-- Campo de estado completado (solo al editar) -->
                  <div class="form-group checkbox-row" v-if="isEditing">
                    <label class="checkbox-label">
                      <input type="checkbox" v-model="form.completed" />
                      <span class="custom-checkbox-indicator"></span>
                      Marcar como completada
                    </label>
                  </div>
                </div>
                <footer class="modal-footer">
                  <button type="button" class="btn-secondary" @click="closeCreateModal">Cancelar</button>
                  <button type="submit" class="btn-primary-action" :disabled="isSubmitting">
                    {{ isEditing ? 'Guardar Cambios' : 'Crear Tarea' }}
                  </button>
                </footer>
              </form>
            </div>
          </div>
        </transition>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import Sidebar from '@/components/Sidebar.vue'
import { useAuthStore } from '@/stores/auth'
import { taskService } from '@/services/taskService'
import axios from 'axios'

const authStore = useAuthStore()

// Navegación de Fechas
const currentDate = ref(new Date())
const currentMonth = ref(currentDate.value.getMonth())
const currentYear = ref(currentDate.value.getFullYear())
const selectedDate = ref(formatDateISO(new Date()))

const weekdays = ['LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁB', 'DOM']
const months = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
]

const monthLabel = computed(() => {
  return `${months[currentMonth.value]} ${currentYear.value}`
})

// Tareas
const tasks = ref<any[]>([])
const availableCategories = ref<any[]>([])

// Formulario Modal
const showCreateModal = ref(false)
const isEditing = ref(false)
const isSubmitting = ref(false)
const editingTaskId = ref<number | null>(null)
const form = ref({
  title: '',
  description: '',
  createdAt: formatDateISO(new Date()),
  deadline: formatDateISO(new Date()),
  priority: 'Media',
  categoryId: null as number | null,
  completed: false
})

// Cargar categorías existentes (para poblar el selector)
const fetchCategories = async () => {
  try {
    const apiUrl = import.meta.env.VITE_API_ENDPOINT || 'http://localhost:8080/to-do-list'
    const response = await axios.get(`${apiUrl}/categories`, {
      headers: { Authorization: authStore.authHeader }
    })
    availableCategories.value = response.data
  } catch (error) {
    console.error('Error fetching categories:', error)
    // Categorías mock de respaldo si falla
    availableCategories.value = [
      { id: 1, name: 'Trabajo' },
      { id: 2, name: 'Personal' },
      { id: 3, name: 'Estudios' },
      { id: 4, name: 'Urgente' }
    ]
  }
}

// Cargar Tareas del Backend
const fetchTasks = async () => {
  try {
    if (authStore.authHeader) {
      const response = await taskService.getAllTasks(authStore.authHeader)
      tasks.value = response.data
    }
  } catch (error) {
    console.error('Error fetching tasks for calendar:', error)
  }
}

// Inicialización
onMounted(async () => {
  await fetchTasks()
  await fetchCategories()
})

// Generar días del mes para la cuadrícula
const calendarDays = computed(() => {
  const days = []
  const firstDayOfMonth = new Date(currentYear.value, currentMonth.value, 1)
  
  // startDay en base a Lunes = 0, Domingo = 6
  let startDay = firstDayOfMonth.getDay() - 1
  if (startDay === -1) startDay = 6 // Domingo

  // Rellenar días del mes anterior
  const prevMonthLastDate = new Date(currentYear.value, currentMonth.value, 0).getDate()
  for (let i = startDay - 1; i >= 0; i--) {
    const dayDate = new Date(currentYear.value, currentMonth.value - 1, prevMonthLastDate - i)
    days.push({
      date: dayDate,
      dayNumber: dayDate.getDate(),
      isCurrentMonth: false,
      isToday: isSameDay(dayDate, new Date()),
      formattedDate: formatDateISO(dayDate)
    })
  }

  // Rellenar días del mes activo
  const currentMonthLastDate = new Date(currentYear.value, currentMonth.value + 1, 0).getDate()
  for (let i = 1; i <= currentMonthLastDate; i++) {
    const dayDate = new Date(currentYear.value, currentMonth.value, i)
    days.push({
      date: dayDate,
      dayNumber: i,
      isCurrentMonth: true,
      isToday: isSameDay(dayDate, new Date()),
      formattedDate: formatDateISO(dayDate)
    })
  }

  // Rellenar días del mes siguiente (completar cuadrícula de 42 celdas para evitar saltos visuales)
  const totalCells = 42
  const nextDaysCount = totalCells - days.length
  for (let i = 1; i <= nextDaysCount; i++) {
    const dayDate = new Date(currentYear.value, currentMonth.value + 1, i)
    days.push({
      date: dayDate,
      dayNumber: dayDate.getDate(),
      isCurrentMonth: false,
      isToday: isSameDay(dayDate, new Date()),
      formattedDate: formatDateISO(dayDate)
    })
  }

  return days
})

// Navegación de Meses
const prevMonth = () => {
  currentMonth.value--
  if (currentMonth.value < 0) {
    currentMonth.value = 11
    currentYear.value--
  }
}

const nextMonth = () => {
  currentMonth.value++
  if (currentMonth.value > 11) {
    currentMonth.value = 0
    currentYear.value++
  }
}

const goToToday = () => {
  const today = new Date()
  currentMonth.value = today.getMonth()
  currentYear.value = today.getFullYear()
  selectedDate.value = formatDateISO(today)
}

const selectDay = (cell: any) => {
  selectedDate.value = cell.formattedDate
  // Si se selecciona un día de otro mes, navegar a él
  if (!cell.isCurrentMonth) {
    currentMonth.value = cell.date.getMonth()
    currentYear.value = cell.date.getFullYear()
  }
}

// Obtener tareas activas en un día dado (createdAt <= fecha <= deadline)
const getTasksForDay = (formattedDate: string) => {
  return tasks.value.filter(task => {
    // Normalizar fechas a cadenas YYYY-MM-DD
    const start = task.createdAt || task.deadline || formattedDate
    const end = task.deadline || task.createdAt || formattedDate
    return formattedDate >= start && formattedDate <= end
  })
}

// Determinar el listado de tareas del día seleccionado (para la vista de móvil)
const selectedDayTasks = computed(() => {
  if (!selectedDate.value) return []
  return getTasksForDay(selectedDate.value)
})

// Texto descriptivo del día seleccionado en español
const formatSelectedDateText = computed(() => {
  if (!selectedDate.value) return ''
  const dateObj = new Date(selectedDate.value + 'T00:00:00')
  return dateObj.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })
})

// Lógica de Renderizado de la barra de Tareas
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
  // Mostramos el texto el día de inicio
  if (formattedDate === start) return true
  
  // O en el primer día de la semana si la tarea cruza el lunes
  const dateObj = new Date(formattedDate + 'T00:00:00')
  if (dateObj.getDay() === 1) return true // Lunes es 1
  
  return false
}

// Colores basados en la categoría
const colors = [
  { bg: '#8b5cf6', hex: '#8b5cf6' }, // Púrpura (Default)
  { bg: '#10b981', hex: '#10b981' }, // Verde
  { bg: '#3b82f6', hex: '#3b82f6' }, // Azul
  { bg: '#f59e0b', hex: '#f59e0b' }, // Naranja
  { bg: '#ec4899', hex: '#ec4899' }, // Rosa
]

const getBadgeColor = (name: string, opacity: number) => {
  if (!name) return `rgba(139, 92, 246, ${opacity})`
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  }
  const colorIndex = Math.abs(hash) % colors.length
  const color = colors[colorIndex]
  
  if (opacity === 1) return color.hex
  
  // Convertir hex a rgb para usar opacidad traslúcida
  const r = parseInt(color.hex.slice(1, 3), 16)
  const g = parseInt(color.hex.slice(3, 5), 16)
  const b = parseInt(color.hex.slice(5, 7), 16)
  return `rgba(${r}, ${g}, ${b}, ${opacity})`
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

// Modales de Creación / Edición
const openCreateModal = (cellDate: string | null) => {
  isEditing.value = false
  editingTaskId.value = null
  const defaultDate = cellDate || selectedDate.value || formatDateISO(new Date())
  
  form.value = {
    title: '',
    description: '',
    createdAt: defaultDate,
    deadline: defaultDate,
    priority: 'Media',
    categoryId: null,
    completed: false
  }
  showCreateModal.value = true
}

const openEditModal = (task: any) => {
  isEditing.value = true
  editingTaskId.value = task.id
  
  form.value = {
    title: task.title,
    description: task.description || '',
    createdAt: task.createdAt || formatDateISO(new Date()),
    deadline: task.deadline || formatDateISO(new Date()),
    priority: task.priority || 'Media',
    categoryId: task.category?.id || null,
    completed: task.completed
  }
  showCreateModal.value = true
}

const closeCreateModal = () => {
  showCreateModal.value = false
  isEditing.value = false
  editingTaskId.value = null
}

const saveTask = async () => {
  isSubmitting.value = true
  try {
    if (authStore.authHeader) {
      const dto = {
        title: form.value.title,
        description: form.value.description,
        priority: form.value.priority,
        estimateHours: 1, // Default estático requerido
        deadline: form.value.deadline,
        completed: form.value.completed,
        categoryId: form.value.categoryId
      }

      if (isEditing.value && editingTaskId.value !== null) {
        // Enviar actualización
        await taskService.updateTask(authStore.authHeader, editingTaskId.value, dto)
      } else {
        // Crear tarea
        // Nota: en el backend la fecha createdAt se autogenera en TaskService, pero en el front la mapeamos por seguridad
        await taskService.createTask(authStore.authHeader, dto)
      }
      
      await fetchTasks() // Recargar calendario
      closeCreateModal()
    }
  } catch (error) {
    console.error('Error saving task from calendar:', error)
  } finally {
    isSubmitting.value = false
  }
}

// Utilidades de Fechas
function isSameDay(d1: Date, d2: Date) {
  return d1.getFullYear() === d2.getFullYear() &&
         d1.getMonth() === d2.getMonth() &&
         d1.getDate() === d2.getDate()
}

function formatDateISO(date: Date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function formatDateRangeText(startStr: string, endStr: string) {
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
  box-sizing: border-box;
}

.content-container {
  max-width: 1400px;
  width: 100%;
  margin: 0 auto;
}

/* Cabecera */
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 28px;
}

.page-title {
  font-size: 28px;
  font-weight: 700;
  color: #ffffff;
  margin: 0 0 6px 0;
}

.page-subtitle {
  font-size: 14px;
  color: #a1a1aa;
  margin: 0;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 16px;
}

.btn-today {
  background-color: #1a1a1c;
  border: 1px solid #2a2a2d;
  color: #ffffff;
  border-radius: 8px;
  padding: 8px 16px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-today:hover {
  background-color: #27272a;
  border-color: #3f3f46;
}

.nav-arrows {
  display: flex;
  align-items: center;
  background-color: #1a1a1c;
  border: 1px solid #2a2a2d;
  border-radius: 8px;
  padding: 4px;
  gap: 8px;
}

.arrow-btn {
  background: none;
  border: none;
  color: #71717a;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
}

.arrow-btn:hover {
  color: #ffffff;
  background-color: #27272a;
}

.month-title {
  font-size: 14px;
  font-weight: 600;
  color: #ffffff;
  min-width: 120px;
  text-align: center;
  user-select: none;
}

.btn-primary {
  background-color: #8b5cf6;
  color: #ffffff;
  border: none;
  border-radius: 8px;
  padding: 8px 16px;
  font-size: 14px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.btn-primary:hover {
  background-color: #7c3aed;
}

/* Tarjeta del Calendario */
.calendar-card {
  background-color: #1a1a1c;
  border: 1px solid #2a2a2d;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.4);
}

/* Cabeceras de días */
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

/* Cuadrícula de días */
.days-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  grid-auto-rows: minmax(110px, 1fr);
  background-color: #242426;
  gap: 1px; /* Hace que el borde de las celdas sea visible */
}

.day-cell {
  background-color: #1a1a1c;
  padding: 8px;
  display: flex;
  flex-direction: column;
  position: relative;
  cursor: pointer;
  transition: background-color 0.2s;
}

.day-cell:hover {
  background-color: #1e1e21;
}

.day-cell.other-month {
  background-color: #151517;
  opacity: 0.35;
}

.day-cell.is-selected {
  background-color: rgba(139, 92, 246, 0.04);
}

.day-number-container {
  display: flex;
  justify-content: flex-start;
  margin-bottom: 6px;
}

.day-number {
  font-size: 13px;
  font-weight: 500;
  color: #e4e4e7;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.2s;
}

/* Día hoy destacado estilo captura (círculo morado) */
.today-badge {
  background-color: #8b5cf6 !important;
  color: #ffffff !important;
  font-weight: 700;
}

/* Contenedor de tareas */
.day-tasks-container {
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
  overflow-y: auto;
  max-height: 120px;
  scrollbar-width: none; /* Ocultar scroll en firefox */
}

.day-tasks-container::-webkit-scrollbar {
  display: none; /* Ocultar scroll en webkit */
}

/* Barras Continuas de Tareas */
.calendar-task-bar {
  font-size: 11px;
  font-weight: 600;
  padding: 5px 8px;
  height: 22px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  cursor: pointer;
  transition: filter 0.15s;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.calendar-task-bar:hover {
  filter: brightness(1.15);
}

.task-bar-text {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.task-span-single {
  border-radius: 6px;
  margin: 0 4px;
}

.task-span-start {
  border-top-left-radius: 6px;
  border-bottom-left-radius: 6px;
  margin-left: 4px;
  border-right: none !important;
}

.task-span-middle {
  border-left: none !important;
  border-right: none !important;
  margin: 0;
}

.task-span-end {
  border-top-right-radius: 6px;
  border-bottom-right-radius: 6px;
  margin-right: 4px;
  border-left: none !important;
}

.task-completed {
  text-decoration: line-through;
  opacity: 0.45;
}

/* Indicadores de Tareas Móvil */
.day-indicators-container {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 3px;
  margin-top: auto;
}

.indicator-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
}

.indicator-more {
  font-size: 10px;
  color: #a1a1aa;
  font-weight: bold;
}

.desktop-only {
  display: flex;
}

.mobile-only {
  display: none;
}

/* MODALES */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.65);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-card-custom {
  background-color: #1a1a1c;
  border: 1px solid #2a2a2d;
  border-radius: 12px;
  width: 100%;
  max-width: 460px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid #2a2a2d;
  background-color: #161618;
}

.modal-header h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 700;
  color: #ffffff;
}

.close-btn {
  background: none;
  border: none;
  color: #71717a;
  font-size: 24px;
  cursor: pointer;
  line-height: 1;
}

.close-btn:hover {
  color: #ffffff;
}

.modal-body {
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form-row-2 {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.form-group label {
  font-size: 11px;
  font-weight: 600;
  color: #a1a1aa;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.modal-input {
  background-color: #121214;
  border: 1px solid #2a2a2d;
  border-radius: 8px;
  padding: 10px 12px;
  color: #ffffff;
  font-size: 14px;
  outline: none;
  transition: border-color 0.2s;
}

.modal-input:focus {
  border-color: #8b5cf6;
}

.text-area {
  resize: none;
}

.select {
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%23a1a1aa' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3E%3C/svg%3E");
  background-position: right 10px center;
  background-repeat: no-repeat;
  background-size: 18px;
  padding-right: 32px;
}

/* Checkbox */
.checkbox-row {
  margin-top: 4px;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  font-size: 13px;
  color: #e4e4e7;
  user-select: none;
}

.checkbox-label input {
  display: none;
}

.custom-checkbox-indicator {
  width: 18px;
  height: 18px;
  border: 2px solid #3f3f46;
  border-radius: 4px;
  background-color: #121214;
  display: inline-block;
  position: relative;
  transition: all 0.2s;
}

.checkbox-label input:checked + .custom-checkbox-indicator {
  background-color: #8b5cf6;
  border-color: #8b5cf6;
}

.checkbox-label input:checked + .custom-checkbox-indicator::after {
  content: '';
  position: absolute;
  left: 5px;
  top: 1px;
  width: 4px;
  height: 8px;
  border: solid white;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}

.modal-footer {
  padding: 14px 20px;
  background-color: #161618;
  border-top: 1px solid #2a2a2d;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.btn-secondary {
  background-color: #1a1a1c;
  border: 1px solid #2a2a2d;
  color: #e4e4e7;
  border-radius: 8px;
  padding: 8px 16px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-secondary:hover {
  background-color: #27272a;
}

.btn-primary-action {
  background-color: #8b5cf6;
  border: none;
  color: #ffffff;
  border-radius: 8px;
  padding: 8px 16px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.btn-primary-action:hover {
  background-color: #7c3aed;
}

.btn-primary-action:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Animations */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.25s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

/* RESPONSIVIDAD */
@media (max-width: 1024px) {
  .days-grid {
    grid-auto-rows: minmax(90px, 1fr);
  }
}

@media (max-width: 768px) {
  .main-content {
    margin-left: 0;
    margin-bottom: 60px;
    padding: 20px 16px;
  }
  
  .header {
    flex-direction: column;
    align-items: stretch;
    gap: 16px;
  }
  
  .header-actions {
    flex-direction: column-reverse;
    align-items: stretch;
    gap: 12px;
  }
  
  .nav-arrows {
    justify-content: space-between;
  }
  
  .btn-today, .btn-primary {
    justify-content: center;
    width: 100%;
  }

  .desktop-only {
    display: none !important;
  }
  
  .mobile-only {
    display: flex !important;
  }
  
  .days-grid {
    grid-auto-rows: minmax(55px, 1fr);
  }
  
  .day-cell {
    padding: 4px;
    justify-content: space-between;
    align-items: center;
  }
  
  .day-number-container {
    margin-bottom: 0;
  }
  
  /* Panel de lista inferior en móviles */
  .selected-day-panel {
    margin-top: 24px;
    background-color: #1a1a1c;
    border: 1px solid #2a2a2d;
    border-radius: 12px;
    padding: 16px;
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.4);
  }
  
  .panel-title {
    font-size: 16px;
    font-weight: 700;
    margin: 0 0 16px 0;
    text-transform: capitalize;
    color: #ffffff;
  }
  
  .panel-tasks-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  
  .panel-task-card {
    background-color: #161618;
    border: 1px solid #2a2a2d;
    border-radius: 8px;
    padding: 12px;
    cursor: pointer;
    transition: background-color 0.2s;
  }
  
  .panel-task-card:hover {
    background-color: #1e1e21;
  }
  
  .panel-task-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 12px;
    margin-bottom: 8px;
  }
  
  .panel-task-title {
    font-size: 14px;
    font-weight: 600;
    color: #ffffff;
  }
  
  .completed-text {
    text-decoration: line-through;
    color: #71717a !important;
  }
  
  .panel-task-badge {
    font-size: 10px;
    font-weight: 600;
    padding: 2px 6px;
    border-radius: 4px;
    white-space: nowrap;
  }
  
  .panel-task-meta {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 11px;
    color: #71717a;
  }
  
  .panel-task-priority {
    font-size: 10px;
    font-weight: 700;
    text-transform: uppercase;
  }
  
  .panel-task-priority.alta {
    color: #ef4444;
  }
  
  .panel-task-priority.media {
    color: #f59e0b;
  }
  
  .panel-task-priority.baja {
    color: #10b981;
  }
  
  .panel-empty-state {
    font-size: 13px;
    color: #71717a;
    text-align: center;
    padding: 20px 0;
  }
}

@media (max-width: 480px) {
  .page-title {
    font-size: 24px;
  }
  .modal-card-custom {
    width: calc(100% - 32px);
    margin: 16px;
  }
  .modal-body {
    padding: 16px;
    gap: 12px;
  }
  .form-row-2 {
    grid-template-columns: 1fr;
    gap: 12px;
  }
}
</style>
