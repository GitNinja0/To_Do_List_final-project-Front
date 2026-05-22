<template>
  <div class="error-layout">
    <div class="error-container">
      <div class="error-icon">
        <slot name="icon">
          <svg viewBox="0 0 24 24" width="64" height="64" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
        </slot>
      </div>
      <h1 class="error-title">{{ title }}</h1>
      <p class="error-message">{{ message }}</p>
      <div class="error-actions">
        <button class="btn-primary" @click="$router.push('/')">Volver al Inicio</button>
        <button class="btn-secondary" @click="$router.go(-1)">Regresar</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string
  message: string
}>()
</script>

<style scoped>
.error-layout {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #09090b;
  color: #ffffff;
  padding: 24px;
}

.error-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  background-color: #121214;
  border: 1px solid #2c2c2e;
  border-radius: 16px;
  padding: 48px;
  max-width: 480px;
  width: 100%;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5);
  animation: fade-in 0.4s ease-out;
}

@keyframes fade-in {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.error-icon {
  color: #f43f5e;
  margin-bottom: 24px;
}

.error-title {
  font-size: 28px;
  font-weight: 700;
  margin: 0 0 16px 0;
  color: #e4e4e7;
}

.error-message {
  font-size: 15px;
  color: #a1a1aa;
  line-height: 1.5;
  margin: 0 0 32px 0;
}

.error-actions {
  display: flex;
  gap: 16px;
}

.btn-primary {
  background-color: #8b5cf6;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 12px 24px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
}

.btn-primary:hover {
  background-color: #7c3aed;
}

.btn-secondary {
  background-color: #2c2c2e;
  color: #e4e4e7;
  border: none;
  border-radius: 8px;
  padding: 12px 24px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
}

.btn-secondary:hover {
  background-color: #3a3a3c;
}

@media (max-width: 480px) {
  .error-actions {
    flex-direction: column;
    width: 100%;
  }
  
  .btn-primary, .btn-secondary {
    width: 100%;
  }
}
</style>
