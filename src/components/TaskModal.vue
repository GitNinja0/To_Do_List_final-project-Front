<template>
  <transition name="modal-fade">
    <div class="modal-overlay" v-if="isOpen" @click.self="close">
      <div class="modal-card">
        <header class="modal-header">
          <h3>{{ task ? 'Editar Tarea' : 'Nueva Tarea' }}</h3>
          <button class="close-btn" @click="close" aria-label="Cerrar modal">&times;</button>
        </header>

        <form @submit.prevent="handleSubmit">
          <div class="modal-body">
            <!-- Título -->
            <div class="form-group">
              <label for="title">Título de la Tarea</label>
              <input
                type="text"
                id="title"
                v-model="form.title"
                required
                placeholder="Ej: Reunión de sincronización"
                class="modal-input"
              />
            </div>

            <!-- Descripción -->
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

            <!-- Fechas -->
            <div class="form-row">
              <div class="form-group">
                <label for="createdAt">Fecha de Inicio</label>
                <div class="date-input-wrapper">
                  <input
                    type="date"
                    id="createdAt"
                    v-model="form.createdAt"
                    required
                    class="modal-input date-input"
                  />
                </div>
              </div>
              <div class="form-group">
                <label for="deadline">Plazo de Entrega</label>
                <div class="date-input-wrapper">
                  <input
                    type="date"
                    id="deadline"
                    v-model="form.deadline"
                    required
                    class="modal-input date-input"
                  />
                </div>
              </div>
            </div>

            <!-- Prioridad, Estimación y Categoría -->
            <div class="form-row">
              <div class="form-group">
                <label>Prioridad</label>
                <CustomSelect
                  v-model="form.priority"
                  :options="priorityOptions"
                />
              </div>

              <div class="form-group">
                <label for="estimateHours">Horas Estimadas</label>
                <input
                  type="number"
                  id="estimateHours"
                  v-model.number="form.estimateHours"
                  min="1"
                  class="modal-input"
                />
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label>Categoría</label>
                <CustomSelect
                  v-model="form.categoryId"
                  :options="categoryOptions"
                />
              </div>

              <div class="form-group">
                <label>Etiquetas <span class="tag-hint">(máx. 3)</span></label>
                <div class="tags-selector">
                  <div class="selected-tags" v-if="form.tagIds.length > 0">
                    <span
                      v-for="tagId in form.tagIds"
                      :key="tagId"
                      class="tag-chip"
                    >
                      {{ getTagName(tagId) }}
                      <button type="button" class="tag-remove" @click="removeTag(tagId)">&times;</button>
                    </span>
                  </div>
                  <CustomSelect
                    v-if="form.tagIds.length < 3"
                    v-model="tagToAdd"
                    :options="availableTagOptions"
                    placeholder="Añadir etiqueta..."
                    :searchable="true"
                    searchPlaceholder="Buscar etiqueta..."
                  />
                </div>
              </div>
            </div>

            <!-- Asignación de Usuario (Solo Admin/Gestor) -->
            <div class="form-row" v-if="isPrivileged">
              <div class="form-group">
                <label>Asignar a</label>
                <CustomSelect
                  v-model="form.assignedUsername"
                  :options="userOptions"
                  :searchable="true"
                  searchPlaceholder="Buscar usuario..."
                />
              </div>
            </div>

            <!-- Completada (Solo al editar) -->
            <div class="form-group checkbox-group" v-if="task">
              <label class="checkbox-label">
                <input type="checkbox" v-model="form.completed" />
                <span class="custom-checkbox">
                  <svg viewBox="0 0 24 24" width="12" height="12" stroke="white" stroke-width="3" fill="none"><polyline points="20 6 9 17 4 12"></polyline></svg>
                </span>
                Marcar como completada
              </label>
            </div>
          </div>

          <footer class="modal-footer">
            <button type="button" class="btn-secondary" @click="close">Cancelar</button>
            <button type="submit" class="btn-primary" :disabled="isSubmitting">
              {{ task ? 'Guardar Cambios' : 'Crear Tarea' }}
            </button>
          </footer>
        </form>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { taskService } from '@/services/taskService'
import { userService } from '@/services/userService'
import { tagService } from '@/services/tagService'
import CustomSelect from '@/components/shared/CustomSelect.vue'
import axios from 'axios'

const props = defineProps<{
  isOpen: boolean
  task?: any // Si viene, estamos editando
  defaultDate?: string // Fecha por defecto para nueva tarea (ej: desde el calendario)
}>()

const emit = defineEmits(['close', 'saved'])

const authStore = useAuthStore()
const categories = ref<any[]>([])
const users = ref<any[]>([])
const tags = ref<any[]>([])
const isSubmitting = ref(false)
const tagToAdd = ref<number | null>(null)

const priorityOptions = [
  { value: 'Baja', label: 'Baja' },
  { value: 'Media', label: 'Media' },
  { value: 'Alta', label: 'Alta' }
]

const categoryOptions = computed(() => [
  { value: null, label: 'Ninguna (General)' },
  ...categories.value.map(cat => ({ value: cat.id, label: cat.name }))
])

const userOptions = computed(() => [
  { value: null, label: 'Autoasignado (Tú)' },
  ...users.value.map(u => ({
    value: u.username,
    label: u.fullname ? `${u.fullname} (${u.username})` : u.username
  }))
])

const formatDateISO = (date: Date) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

const form = ref({
  title: '',
  description: '',
  createdAt: props.defaultDate || formatDateISO(new Date()),
  deadline: props.defaultDate || formatDateISO(new Date()),
  priority: 'Media',
  estimateHours: 1,
  categoryId: null as number | null,
  assignedUsername: null as string | null,
  completed: false,
  tagIds: [] as number[]
})

// Computed: opciones de tags disponibles (excluye las ya seleccionadas)
const availableTagOptions = computed(() => {
  return tags.value
    .filter(t => !form.value.tagIds.includes(t.id))
    .map(t => ({ value: t.id, label: t.name }))
})

const getTagName = (tagId: number): string => {
  const tag = tags.value.find(t => t.id === tagId)
  return tag ? tag.name : 'Etiqueta'
}

const removeTag = (tagId: number) => {
  form.value.tagIds = form.value.tagIds.filter(id => id !== tagId)
}

// Watcher para agregar tag al seleccionarlo en el CustomSelect
watch(tagToAdd, (newVal) => {
  if (newVal !== null && !form.value.tagIds.includes(newVal) && form.value.tagIds.length < 3) {
    form.value.tagIds.push(newVal)
    tagToAdd.value = null
  }
})

// Reset del formulario
const resetForm = () => {
  form.value = {
    title: '',
    description: '',
    createdAt: props.defaultDate || formatDateISO(new Date()),
    deadline: props.defaultDate || formatDateISO(new Date()),
    priority: 'Media',
    estimateHours: 1,
    categoryId: null,
    assignedUsername: null,
    completed: false,
    tagIds: []
  }
  tagToAdd.value = null
}

// Rellenar formulario si estamos editando
watch(() => props.task, (newTask) => {
  if (newTask) {
    form.value = {
      title: newTask.title || '',
      description: newTask.description || '',
      createdAt: newTask.createdAt || formatDateISO(new Date()),
      deadline: newTask.deadline || formatDateISO(new Date()),
      priority: newTask.priority || 'Media',
      estimateHours: newTask.estimateHours || 1,
      categoryId: newTask.category?.id || null,
      assignedUsername: newTask.author?.username || null,
      completed: newTask.completed || false,
      tagIds: (newTask.tags || []).map((t: any) => t.id)
    }
  } else {
    resetForm()
  }
  tagToAdd.value = null
}, { immediate: true })

// Privilegiado (Admin o Gestor)
const isPrivileged = computed(() => {
  const rolesUpper = (authStore.roles || '').toUpperCase()
  return rolesUpper.includes('ADMIN') || rolesUpper.includes('GESTOR')
})

// Cargar categorías
const fetchCategories = async () => {
  try {
    const apiUrl = import.meta.env.VITE_API_ENDPOINT || 'http://localhost:8080/to-do-list'
    const response = await axios.get(`${apiUrl}/categories`, {
      headers: { Authorization: authStore.authHeader }
    })
    categories.value = response.data
  } catch (error) {
    console.error('Error fetching categories in TaskModal:', error)
  }
}

// Cargar usuarios
const fetchUsers = async () => {
  try {
    if (isPrivileged.value && authStore.authHeader) {
      const response = await userService.getAllUsers(authStore.authHeader)
      users.value = response.data
    }
  } catch (error) {
    console.error('Error fetching users in TaskModal:', error)
  }
}

// Cargar etiquetas
const fetchTags = async () => {
  try {
    const response = await tagService.getAllTags(authStore.authHeader)
    tags.value = response.data
  } catch (error) {
    console.error('Error fetching tags in TaskModal:', error)
  }
}

onMounted(() => {
  fetchCategories()
  fetchUsers()
  fetchTags()
})

const close = () => {
  emit('close')
}

const handleSubmit = async () => {
  isSubmitting.value = true
  try {
    const dto = {
      title: form.value.title,
      description: form.value.description,
      priority: form.value.priority,
      estimateHours: form.value.estimateHours || 1,
      deadline: form.value.deadline,
      completed: form.value.completed,
      categoryId: form.value.categoryId,
      assignedUsername: form.value.assignedUsername,
      tagIds: form.value.tagIds
    }

    if (props.task) {
      await taskService.updateTask(authStore.authHeader, props.task.id, dto)
    } else {
      await taskService.createTask(authStore.authHeader, dto)
    }

    emit('saved')
    close()
  } catch (error) {
    console.error('Error saving task:', error)
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.75);
  backdrop-filter: blur(8px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 16px;
}

.modal-card {
  background-color: #1c1c1e;
  border: 1px solid #2c2c2e;
  border-radius: 16px;
  width: 100%;
  max-width: 580px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 10px 10px -5px rgba(0, 0, 0, 0.4);
  display: flex;
  flex-direction: column;
  overflow: visible; /* Permitir ver el custom select */
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid #2c2c2e;
}

.modal-header h3 {
  margin: 0;
  font-size: 20px;
  font-weight: 700;
  color: #ffffff;
}

.close-btn {
  background: none;
  border: none;
  color: #a1a1aa;
  font-size: 28px;
  cursor: pointer;
  line-height: 1;
  padding: 0;
  transition: color 0.2s;
}

.close-btn:hover {
  color: #ffffff;
}

.modal-body {
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  max-height: 70vh;
  overflow-y: auto;
}

/* Scrollbar personalizado para modal-body */
.modal-body::-webkit-scrollbar {
  width: 8px;
}
.modal-body::-webkit-scrollbar-track {
  background: transparent;
}
.modal-body::-webkit-scrollbar-thumb {
  background: #2c2c2e;
  border-radius: 4px;
}
.modal-body::-webkit-scrollbar-thumb:hover {
  background: #3a3a3c;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

label {
  font-size: 13px;
  font-weight: 600;
  color: #a1a1aa;
}

.modal-input {
  background-color: #121214;
  border: 1px solid #2c2c2e;
  border-radius: 8px;
  color: #ffffff;
  padding: 10px 14px;
  font-size: 14px;
  outline: none;
  transition: all 0.2s;
  width: 100%;
  box-sizing: border-box;
}

.modal-input:focus {
  border-color: #8b5cf6;
  box-shadow: 0 0 0 2px rgba(139, 92, 246, 0.15);
}

.text-area {
  resize: vertical;
  min-height: 80px;
  font-family: inherit;
}

.select {
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23a1a1aa' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 14px center;
  background-size: 16px;
  padding-right: 40px;
  cursor: pointer;
}



/* Date Input Styling */
.date-input-wrapper {
  position: relative;
  width: 100%;
}

.date-input {
  cursor: pointer;
}

/* Estilo para los calendar-pickers nativos en Chrome/Safari/Edge */
.date-input::-webkit-calendar-picker-indicator {
  filter: invert(1) sepia(1) saturate(5) hue-rotate(240deg); /* colorea el icono de morado/blanco */
  cursor: pointer;
  opacity: 0.8;
  transition: opacity 0.2s;
}

.date-input::-webkit-calendar-picker-indicator:hover {
  opacity: 1;
}

/* Checkbox Completada */
.checkbox-group {
  margin-top: 4px;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  user-select: none;
  font-size: 14px;
  color: #ffffff;
}

.checkbox-label input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
  height: 0;
  width: 0;
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

.checkbox-label:hover .custom-checkbox {
  border-color: #71717a;
}

.checkbox-label input:checked ~ .custom-checkbox {
  background-color: #8b5cf6;
  border-color: #8b5cf6;
}

.checkbox-label svg {
  display: none;
}

.checkbox-label input:checked ~ .custom-checkbox svg {
  display: block;
}

/* Footer */
.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 20px 24px;
  border-top: 1px solid #2c2c2e;
  background-color: #161618;
  border-bottom-left-radius: 16px;
  border-bottom-right-radius: 16px;
}

.btn-secondary {
  background-color: #2c2c2e;
  color: #e4e4e7;
  border: none;
  border-radius: 8px;
  padding: 10px 18px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
}

.btn-secondary:hover {
  background-color: #3a3a3c;
}

.btn-primary {
  background-color: #8b5cf6;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 10px 18px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
}

.btn-primary:hover {
  background-color: #7c3aed;
}

.btn-primary:disabled {
  background-color: #4c2d9a;
  color: #a78bfa;
  cursor: not-allowed;
}

/* Transiciones */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.2s ease;
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateY(-8px);
  opacity: 0;
}

@media (max-width: 640px) {
  .form-row {
    grid-template-columns: 1fr;
    gap: 20px;
  }
}

/* Ocultar las flechas arriba/abajo en inputs de tipo number */
input[type="number"]::-webkit-outer-spin-button,
input[type="number"]::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

input[type="number"] {
  -moz-appearance: textfield;
}

/* Tags Selector */
.tag-hint {
  font-weight: 400;
  color: #71717a;
  font-size: 12px;
}

.tags-selector {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.selected-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tag-chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background-color: rgba(52, 211, 153, 0.1);
  color: #34d399;
  border: 1px solid rgba(52, 211, 153, 0.25);
  border-radius: 20px;
  padding: 5px 10px 5px 12px;
  font-size: 13px;
  font-weight: 600;
  animation: chip-in 0.2s ease;
}

@keyframes chip-in {
  from {
    opacity: 0;
    transform: scale(0.85);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.tag-remove {
  background: none;
  border: none;
  color: #34d399;
  font-size: 16px;
  cursor: pointer;
  padding: 0;
  line-height: 1;
  opacity: 0.7;
  transition: opacity 0.15s;
}

.tag-remove:hover {
  opacity: 1;
}
</style>
