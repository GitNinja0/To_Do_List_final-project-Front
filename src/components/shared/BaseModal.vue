<template>
  <transition name="modal-fade">
    <div class="modal-overlay" v-if="isOpen" @click.self="close">
      <div class="modal-card">
        <header class="modal-header">
          <h3>{{ title }}</h3>
          <button class="close-btn" @click="close" aria-label="Cerrar modal">&times;</button>
        </header>

        <slot name="body"></slot>
        
        <slot name="footer"></slot>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
defineProps<{
  isOpen: boolean
  title: string
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

const close = () => {
  emit('close')
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
  overflow: visible; /* Permitir ver selectores custom que se desbordan */
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

/* Transiciones genéricas */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}
</style>
