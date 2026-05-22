<template>
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
          <TagSelector 
            v-model="form.tagIds" 
            :options="tagOptions" 
            :maxTags="3" 
          />
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

    <footer class="modal-footer" :class="{ 'footer-between': task }">
      <button type="button" class="btn-danger" v-if="task" @click="handleDelete" :disabled="isSubmitting">
        Borrar Tarea
      </button>
      <div class="footer-actions">
        <button type="button" class="btn-secondary" @click="$emit('cancel')">Cancelar</button>
        <button type="submit" class="btn-primary" :disabled="isSubmitting">
          {{ task ? 'Guardar Cambios' : 'Crear Tarea' }}
        </button>
      </div>
    </footer>

    <!-- Confirm Modal para Eliminar Tarea -->
    <ConfirmModal
      :isOpen="isDeleteModalOpen"
      title="Borrar Tarea"
      message="¿Estás seguro de que deseas eliminar esta tarea de forma permanente? Esta acción no se puede deshacer."
      confirmText="Eliminar"
      cancelText="Cancelar"
      :isDanger="true"
      @confirm="confirmDelete"
      @close="isDeleteModalOpen = false"
    />
  </form>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import CustomSelect from '@/components/shared/CustomSelect.vue'
import TagSelector from '@/components/tasks/TagSelector.vue'
import ConfirmModal from '@/components/shared/ConfirmModal.vue'

const props = defineProps<{
  task?: any
  defaultDate?: string
  categories: any[]
  users: any[]
  tags: any[]
  isPrivileged: boolean
  isSubmitting: boolean
}>()

const emit = defineEmits<{
  (e: 'submit', dto: any): void
  (e: 'delete'): void
  (e: 'cancel'): void
}>()

const priorityOptions = [
  { value: 'Baja', label: 'Baja' },
  { value: 'Media', label: 'Media' },
  { value: 'Alta', label: 'Alta' }
]

const categoryOptions = computed(() => [
  { value: null, label: 'Ninguna (General)' },
  ...props.categories.map(cat => ({ value: cat.id, label: cat.name }))
])

const userOptions = computed(() => [
  { value: null, label: 'Autoasignado (Tú)' },
  ...props.users.map(u => ({
    value: u.username,
    label: u.fullname ? `${u.fullname} (${u.username})` : u.username
  }))
])

const tagOptions = computed(() => {
  return props.tags.map(t => ({ value: t.id, label: t.name }))
})

const formatDateISO = (date: Date) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

const parseDateSafely = (val: any) => {
  if (!val) return formatDateISO(new Date())
  if (Array.isArray(val)) {
    return `${val[0]}-${String(val[1]).padStart(2, '0')}-${String(val[2]).padStart(2, '0')}`
  }
  if (typeof val === 'string') {
    return val.split('T')[0] // Get only the YYYY-MM-DD part
  }
  return formatDateISO(new Date(val))
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
}

watch(() => props.task, (newTask) => {
  if (newTask) {
    form.value = {
      title: newTask.title || '',
      description: newTask.description || '',
      createdAt: parseDateSafely(newTask.createdAt),
      deadline: parseDateSafely(newTask.deadline || newTask.expirationDate),
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
}, { immediate: true })

const handleSubmit = () => {
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
  emit('submit', dto)
}

const isDeleteModalOpen = ref(false)

const handleDelete = () => {
  isDeleteModalOpen.value = true
}

const confirmDelete = () => {
  isDeleteModalOpen.value = false
  emit('delete')
}
</script>

<style scoped>
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

/* Date Input Styling */
.date-input-wrapper {
  position: relative;
  width: 100%;
}

.date-input {
  cursor: pointer;
}

.date-input::-webkit-calendar-picker-indicator {
  filter: invert(1) sepia(1) saturate(5) hue-rotate(240deg);
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

.footer-between {
  justify-content: space-between;
}

.footer-actions {
  display: flex;
  gap: 12px;
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

.btn-danger {
  background-color: rgba(244, 63, 94, 0.1);
  color: #f43f5e;
  border: 1px solid rgba(244, 63, 94, 0.2);
  border-radius: 8px;
  padding: 10px 18px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-danger:hover {
  background-color: #f43f5e;
  color: white;
}

.btn-danger:disabled {
  opacity: 0.5;
  cursor: not-allowed;
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

.tag-hint {
  font-weight: 400;
  color: #71717a;
  font-size: 12px;
}
</style>
