<template>
  <div class="search-box-wrapper">
    <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none"
      stroke-linecap="round" stroke-linejoin="round" class="search-icon-inner">
      <circle cx="11" cy="11" r="8"></circle>
      <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
    </svg>
    <input
      type="text"
      :placeholder="placeholder"
      :value="modelValue"
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    />
  </div>
</template>

<script setup lang="ts">
defineProps<{
  modelValue: string
  placeholder?: string
}>()
defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()
</script>

<style scoped>
.search-box-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  background-color: #1a1a1c;
  border: 1px solid #2a2a2d;
  border-radius: 8px;
  padding: 0 16px 0 42px;
  height: 44px;
  flex: 1;
  transition: border-color 0.2s;
}

.search-box-wrapper:focus-within {
  border-color: #8b5cf6;
}

.search-icon-inner {
  position: absolute;
  left: 14px;
  color: #71717a;
  pointer-events: none;
}

input {
  background: transparent;
  border: none;
  color: #ffffff;
  font-size: 14px;
  width: 100%;
  outline: none;
}

input::placeholder {
  color: #52525b;
}
</style>
