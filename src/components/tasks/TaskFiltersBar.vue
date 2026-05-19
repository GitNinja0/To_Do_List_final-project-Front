<template>
  <div class="filters-bar">
    <SearchBox :modelValue="modelValue" :placeholder="placeholder" @update:modelValue="$emit('update:modelValue', $event)" />
    <div class="filters-group">
      <slot name="filters" />
    </div>
  </div>
</template>

<script setup lang="ts">
import SearchBox from '@/components/shared/SearchBox.vue'

withDefaults(defineProps<{
  modelValue: string
  placeholder?: string
}>(), {
  placeholder: 'Buscar...'
})

defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()
</script>

<style scoped>
.filters-bar {
  display: flex;
  gap: 16px;
  margin-bottom: 32px;
}

.filters-group {
  display: flex;
  gap: 12px;
}

@media (max-width: 768px) {
  .filters-bar {
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
    margin-bottom: 24px;
  }
  .filters-group {
    width: 100%;
    justify-content: space-between;
    gap: 8px;
  }
  .filters-group > * {
    flex: 1;
  }
}
</style>
