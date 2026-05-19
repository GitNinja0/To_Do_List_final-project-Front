<template>
  <transition name="modal-fade">
    <div v-if="modelValue" class="modal-overlay" @click.self="$emit('update:modelValue', false)">
      <div class="modal-card">
        <header class="modal-header">
          <h3>Añadir Nuevo Miembro</h3>
          <button class="close-btn" @click="$emit('update:modelValue', false)">&times;</button>
        </header>

        <div class="modal-body text-center">
          <div class="info-icon-container">
            <svg viewBox="0 0 24 24" width="48" height="48" stroke="#8b5cf6" stroke-width="2" fill="none">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="16" x2="12" y2="12"></line>
              <line x1="12" y1="8" x2="12.01" y2="8"></line>
            </svg>
          </div>
          <p class="modal-info-text">
            Para agregar un nuevo miembro al equipo, pídele que se registre desde la pantalla de inicio ("Sign Up") de la plataforma. Una vez creada su cuenta, podrás gestionar su rol y permisos desde este panel de administración.
          </p>
        </div>

        <footer class="modal-footer justify-center">
          <button class="modal-btn save" @click="$emit('update:modelValue', false)">Entendido</button>
        </footer>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
defineProps<{ modelValue: boolean }>()
defineEmits<{ (e: 'update:modelValue', value: boolean): void }>()
</script>

<style scoped>
.text-center { text-align: center; }

.info-icon-container {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}

.modal-info-text {
  color: #a1a1aa;
  font-size: 14px;
  line-height: 1.7;
  margin: 0;
}

.justify-center { justify-content: center; }
</style>
