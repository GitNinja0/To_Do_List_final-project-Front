<template>
  <div class="item-panel">
    <div class="panel-header">
      <div class="panel-title-row">
        <slot name="icon" />
        <h3 class="panel-title">{{ title }}</h3>
      </div>
      <div class="panel-header-actions">
        <span v-if="showReadOnly" class="read-only-badge">Solo lectura</span>
        <button v-if="canAdd" class="btn-add" :class="addBtnClass" @click="$emit('add')">
          <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2.5" fill="none">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          Añadir
        </button>
      </div>
    </div>
    <div class="panel-body">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string
  canAdd?: boolean
  showReadOnly?: boolean
  addBtnClass?: string
}>()

defineEmits<{ (e: 'add'): void }>()
</script>

<style scoped>
.item-panel {
  background-color: #1a1a1c;
  border: 1px solid #2a2a2d;
  border-radius: 16px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid #2a2a2d;
}

.panel-title-row {
  display: flex;
  align-items: center;
  gap: 10px;
}

.panel-title {
  font-size: 16px;
  font-weight: 700;
  margin: 0;
}

.panel-header-actions {
  display: flex;
  align-items: center;
  gap: 10px;
}

.read-only-badge {
  font-size: 11px;
  font-weight: 600;
  color: #71717a;
  background-color: #1f1f22;
  border: 1px solid #2a2a2d;
  border-radius: 12px;
  padding: 3px 10px;
}

.panel-body {
  padding: 20px 24px;
  flex: 1;
}

.btn-add {
  display: flex;
  align-items: center;
  gap: 6px;
  background-color: #8b5cf6;
  color: #ffffff;
  border: none;
  border-radius: 6px;
  padding: 7px 12px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s, transform 0.1s;
}

.btn-add:hover   { background-color: #7c3aed; }
.btn-add:active  { transform: scale(0.97); }

/* Variant for tags (green) */
.btn-add.tag-btn { background-color: #059669; }
.btn-add.tag-btn:hover { background-color: #047857; }
</style>
