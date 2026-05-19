<template>
  <div class="item-row">
    <div class="item-badge-wrapper">
      <slot name="badge" />
    </div>
    <div class="item-actions" v-if="showActions">
      <button class="icon-btn edit-btn" @click="$emit('edit')" title="Editar">
        <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2" fill="none"
          stroke-linecap="round" stroke-linejoin="round">
          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
          <path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4Z"></path>
        </svg>
      </button>
      <button class="icon-btn delete-btn" @click="$emit('delete')" title="Eliminar">
        <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2" fill="none"
          stroke-linecap="round" stroke-linejoin="round">
          <polyline points="3 6 5 6 21 6"></polyline>
          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{ showActions?: boolean }>()
defineEmits<{
  (e: 'edit'): void
  (e: 'delete'): void
}>()
</script>

<style scoped>
.item-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #121214;
  border-radius: 10px;
  padding: 12px 16px;
  border: 1px solid #1f1f22;
  transition: border-color 0.15s, background-color 0.15s;
}

.item-row:hover {
  background-color: #1a1a1e;
  border-color: #2a2a2d;
}

.item-badge-wrapper {
  display: flex;
  align-items: center;
  gap: 10px;
  flex: 1;
  overflow: hidden;
}

.item-actions {
  display: flex;
  gap: 6px;
  flex-shrink: 0;
}

.icon-btn {
  width: 28px;
  height: 28px;
  border: 1px solid #2a2a2d;
  border-radius: 6px;
  background-color: transparent;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s;
  color: #71717a;
}

.edit-btn:hover   { background-color: rgba(139, 92, 246, 0.1); border-color: #8b5cf6; color: #8b5cf6; }
.delete-btn:hover { background-color: rgba(239, 68, 68, 0.1);  border-color: #ef4444; color: #ef4444; }
</style>
