<template>
  <transition name="modal-fade">
    <div v-if="modelValue" class="modal-overlay" @click.self="$emit('update:modelValue', false)">
      <div class="modal-card">
        <header class="modal-header">
          <h3>Editar Usuario</h3>
          <button class="close-btn" @click="$emit('update:modelValue', false)">&times;</button>
        </header>

        <div class="modal-body">
          <div class="form-group">
            <label>Nombre Completo</label>
            <input type="text" v-model="localForm.fullname" placeholder="Nombre completo" class="modal-input" />
          </div>

          <div class="form-group">
            <label>Nombre de Usuario</label>
            <input type="text" v-model="localForm.username" disabled class="modal-input disabled" />
            <small class="help-text">El nombre de usuario no se puede cambiar.</small>
          </div>

          <div class="form-group">
            <label>Rol del Usuario</label>
            <div class="role-selector-group">
              <label class="role-radio-label">
                <input type="radio" v-model="localForm.roleType" value="USER" />
                <span class="radio-custom"></span>
                <span>Usuario (Básico)</span>
              </label>
              <label class="role-radio-label">
                <input type="radio" v-model="localForm.roleType" value="GESTOR" />
                <span class="radio-custom"></span>
                <span>Gestor (Manager)</span>
              </label>
            </div>
          </div>
        </div>

        <footer class="modal-footer">
          <button class="modal-btn cancel" @click="$emit('update:modelValue', false)">Cancelar</button>
          <button class="modal-btn save" @click="$emit('save', localForm)" :disabled="saving">
            {{ saving ? 'Guardando...' : 'Guardar Cambios' }}
          </button>
        </footer>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { reactive, watch } from 'vue'

const props = defineProps<{
  modelValue: boolean
  form: { fullname: string; username: string; roleType: string }
  saving: boolean
}>()

defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'save', form: any): void
}>()

const localForm = reactive({ ...props.form })
watch(() => props.form, (val) => { Object.assign(localForm, val) }, { deep: true })
</script>

<style scoped>
.help-text {
  font-size: 11px;
  color: #71717a;
}

.modal-input.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.role-selector-group {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.role-radio-label {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  font-size: 14px;
  color: #e4e4e7;
  user-select: none;
}

.role-radio-label input[type="radio"] { display: none; }

.radio-custom {
  width: 16px;
  height: 16px;
  border: 2px solid #52525b;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  flex-shrink: 0;
  position: relative;
}

.role-radio-label input:checked + .radio-custom {
  border-color: #8b5cf6;
}

.role-radio-label input:checked + .radio-custom::after {
  content: '';
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: #8b5cf6;
  position: absolute;
}
</style>
