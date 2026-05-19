<template>
  <header class="header">
    <div>
      <h1 class="page-title">Calendario</h1>
      <p class="page-subtitle">Líneas de tiempo y plazos de entrega de tus tareas.</p>
    </div>
    <div class="header-actions">
      <button class="btn-today" @click="$emit('today')">Hoy</button>
      <div class="nav-arrows">
        <button class="arrow-btn" @click="$emit('prev')" title="Mes anterior">
          <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        </button>
        <span class="month-title">{{ monthLabel }}</span>
        <button class="arrow-btn" @click="$emit('next')" title="Mes siguiente">
          <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </button>
      </div>
      <button class="btn-primary" @click="$emit('newTask')">
        <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none"
          stroke-linecap="round" stroke-linejoin="round">
          <line x1="12" y1="5" x2="12" y2="19"></line>
          <line x1="5" y1="12" x2="19" y2="12"></line>
        </svg>
        Nueva Tarea
      </button>
    </div>
  </header>
</template>

<script setup lang="ts">
defineProps<{
  monthLabel: string
}>()

defineEmits<{
  (e: 'today'): void
  (e: 'prev'): void
  (e: 'next'): void
  (e: 'newTask'): void
}>()
</script>

<style scoped>
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
.btn-today:hover { background-color: #27272a; border-color: #3f3f46; }

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
.arrow-btn:hover { color: #ffffff; background-color: #27272a; }

.month-title {
  font-size: 14px;
  font-weight: 600;
  color: #ffffff;
  min-width: 120px;
  text-align: center;
  user-select: none;
}
</style>
