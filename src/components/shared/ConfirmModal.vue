<template>
  <transition name="modal-fade">
    <div class="confirm-modal-overlay" v-if="isOpen" @click.self="cancel">
      <div class="confirm-modal-card">
        <header class="confirm-modal-header">
          <div class="header-icon-title">
            <span class="warning-icon" v-if="isDanger">⚠️</span>
            <span class="info-icon" v-else>ℹ️</span>
            <h3>{{ title }}</h3>
          </div>
          <button class="close-btn" @click="cancel">&times;</button>
        </header>
        <div class="confirm-modal-body">
          <p>{{ message }}</p>
        </div>
        <footer class="confirm-modal-footer">
          <button type="button" class="btn-cancel" @click="cancel">{{ cancelText }}</button>
          <button
            type="button"
            :class="['btn-confirm', isDanger ? 'danger' : 'primary']"
            @click="confirm"
          >
            {{ confirmText }}
          </button>
        </footer>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'

const props = withDefaults(defineProps<{
  isOpen: boolean
  title?: string
  message?: string
  confirmText?: string
  cancelText?: string
  isDanger?: boolean
}>(), {
  title: 'Confirmar acción',
  message: '¿Estás seguro de que deseas realizar esta acción?',
  confirmText: 'Confirmar',
  cancelText: 'Cancelar',
  isDanger: true
})

const emit = defineEmits<{
  (e: 'confirm'): void
  (e: 'close'): void
}>()

const confirm = () => {
  emit('confirm')
}

const cancel = () => {
  emit('close')
}

// Close on escape key
const handleKeyDown = (e: KeyboardEvent) => {
  if (e.key === 'Escape' && props.isOpen) {
    cancel()
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeyDown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown)
})
</script>

<style scoped>
.confirm-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000; /* High enough to be on top of other modals */
}

.confirm-modal-card {
  background-color: #1a1a1c;
  border: 1px solid #2a2a2d;
  border-radius: 12px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5);
  width: 400px;
  max-width: 90vw;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.confirm-modal-header {
  padding: 16px 20px;
  border-bottom: 1px solid #2a2a2d;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-icon-title {
  display: flex;
  align-items: center;
  gap: 10px;
}

.warning-icon, .info-icon {
  font-size: 18px;
}

.confirm-modal-header h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #ffffff;
}

.close-btn {
  background: none;
  border: none;
  color: #a1a1aa;
  font-size: 20px;
  cursor: pointer;
  padding: 0;
  line-height: 1;
  transition: color 0.2s;
}

.close-btn:hover {
  color: #ffffff;
}

.confirm-modal-body {
  padding: 20px;
  color: #d4d4d8;
  font-size: 14px;
  line-height: 1.5;
}

.confirm-modal-body p {
  margin: 0;
}

.confirm-modal-footer {
  padding: 16px 20px;
  background-color: #151517;
  border-top: 1px solid #2a2a2d;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.btn-cancel {
  background-color: transparent;
  border: 1px solid #3f3f46;
  color: #e4e4e7;
  border-radius: 6px;
  padding: 8px 16px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-cancel:hover {
  background-color: rgba(255, 255, 255, 0.05);
  border-color: #52525b;
}

.btn-confirm {
  border: none;
  color: white;
  border-radius: 6px;
  padding: 8px 16px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
}

.btn-confirm.danger {
  background-color: #ef4444;
}

.btn-confirm.danger:hover {
  background-color: #dc2626;
}

.btn-confirm.primary {
  background-color: #8b5cf6;
}

.btn-confirm.primary:hover {
  background-color: #7c3aed;
}

/* Transitions */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.25s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

.modal-fade-enter-active .confirm-modal-card,
.modal-fade-leave-active .confirm-modal-card {
  transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}

.modal-fade-enter-from .confirm-modal-card {
  transform: scale(0.95) translateY(10px);
}

.modal-fade-leave-to .confirm-modal-card {
  transform: scale(0.95) translateY(10px);
}
</style>
