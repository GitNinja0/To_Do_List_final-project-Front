<template>
  <div class="custom-select-container" ref="containerRef">
    <button
      type="button"
      class="custom-select-trigger"
      @click.stop="toggleDropdown"
    >
      <div class="trigger-left">
        <slot name="trigger-icon"></slot>
        <span class="trigger-label">{{ displayLabel }}</span>
      </div>
      <svg
        class="chevron-icon"
        :class="{ 'rotate': isOpen }"
        viewBox="0 0 24 24"
        width="16"
        height="16"
        stroke="currentColor"
        stroke-width="2"
        fill="none"
      >
        <polyline points="6 9 12 15 18 9"></polyline>
      </svg>
    </button>

    <transition name="slide-fade">
      <div class="custom-select-options" v-if="isOpen">
        <div class="search-wrapper" v-if="searchable" @click.stop>
          <input
            type="text"
            v-model="searchQuery"
            :placeholder="searchPlaceholder"
            class="search-input"
            ref="searchInputRef"
          />
        </div>

        <div class="options-list">
          <div
            v-for="(opt, idx) in filteredOptions"
            :key="opt.value !== null ? String(opt.value) : 'null-' + idx"
            class="option-row"
            :class="{ 'active': modelValue === opt.value }"
            @click="selectOption(opt.value)"
          >
            <span class="option-label">{{ opt.label }}</span>
            <span class="option-sublabel" v-if="opt.subLabel">{{ opt.subLabel }}</span>
          </div>
          <div v-if="filteredOptions.length === 0" class="empty-options">
            No se encontraron opciones
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick, watch } from 'vue'

interface Option {
  value: any
  label: string
  subLabel?: string
}

const props = withDefaults(defineProps<{
  modelValue: any
  options: Option[]
  placeholder?: string
  searchable?: boolean
  searchPlaceholder?: string
}>(), {
  placeholder: 'Seleccionar...',
  searchable: false,
  searchPlaceholder: 'Buscar...'
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: any): void
}>()

const containerRef = ref<HTMLElement | null>(null)
const searchInputRef = ref<HTMLInputElement | null>(null)
const isOpen = ref(false)
const searchQuery = ref('')

const selectedOption = computed(() => {
  return props.options.find(opt => opt.value === props.modelValue)
})

const displayLabel = computed(() => {
  return selectedOption.value ? selectedOption.value.label : props.placeholder
})

const filteredOptions = computed(() => {
  const query = searchQuery.value.trim().toLowerCase()
  if (!query) return props.options
  return props.options.filter(opt =>
    (opt.label || '').toLowerCase().includes(query) ||
    (opt.subLabel || '').toLowerCase().includes(query)
  )
})

const toggleDropdown = () => {
  isOpen.value = !isOpen.value
}

watch(isOpen, (newVal) => {
  if (newVal) {
    searchQuery.value = ''
    if (props.searchable) {
      nextTick(() => {
        searchInputRef.value?.focus()
      })
    }
  }
})

const selectOption = (val: any) => {
  emit('update:modelValue', val)
  isOpen.value = false
}

const handleClickOutside = (e: MouseEvent) => {
  if (containerRef.value && !containerRef.value.contains(e.target as Node)) {
    isOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.custom-select-container {
  position: relative;
  width: 100%;
}

.custom-select-trigger {
  background-color: #121214;
  border: 1px solid #2c2c2e;
  border-radius: 8px;
  color: #ffffff;
  padding: 10px 14px;
  font-size: 14px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  cursor: pointer;
  outline: none;
  transition: all 0.2s;
  text-align: left;
  height: 44px;
  box-sizing: border-box;
}

.custom-select-trigger:focus {
  border-color: #8b5cf6;
  box-shadow: 0 0 0 2px rgba(139, 92, 246, 0.15);
}

.trigger-left {
  display: flex;
  align-items: center;
  gap: 8px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.trigger-label {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.chevron-icon {
  color: #a1a1aa;
  transition: transform 0.2s;
  flex-shrink: 0;
}

.chevron-icon.rotate {
  transform: rotate(180deg);
}

.custom-select-options {
  position: absolute;
  top: calc(100% + 6px);
  left: 0;
  right: 0;
  background-color: #1e1e20;
  border: 1px solid #2c2c30;
  border-radius: 8px;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.5);
  z-index: 1100;
  overflow: hidden;
  max-height: 240px;
  display: flex;
  flex-direction: column;
}

.search-wrapper {
  padding: 8px;
  border-bottom: 1px solid #2c2c30;
  background-color: #161618;
}

.search-input {
  width: 100%;
  background-color: #121214;
  border: 1px solid #2c2c2e;
  border-radius: 6px;
  color: white;
  padding: 6px 10px;
  font-size: 13px;
  outline: none;
  box-sizing: border-box;
}

.search-input:focus {
  border-color: #8b5cf6;
}

.options-list {
  overflow-y: auto;
  flex: 1;
}

.options-list::-webkit-scrollbar {
  width: 6px;
}
.options-list::-webkit-scrollbar-thumb {
  background: #2c2c30;
  border-radius: 3px;
}

.option-row {
  padding: 10px 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: background-color 0.15s;
  color: #d4d4d8;
  font-size: 14px;
  user-select: none;
}

.option-row:hover {
  background-color: rgba(139, 92, 246, 0.08);
  color: white;
}

.option-row.active {
  background-color: rgba(139, 92, 246, 0.15);
  color: #8b5cf6;
  font-weight: 600;
}

.option-label {
  font-size: 14px;
}

.option-sublabel {
  font-size: 12px;
  color: #71717a;
  margin-left: 4px;
}

.empty-options {
  padding: 12px;
  text-align: center;
  font-size: 13px;
  color: #71717a;
}

.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.2s ease;
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateY(-8px);
  opacity: 0;
}
</style>
