<template>
  <div class="tags-selector">
    <div class="selected-tags" v-if="modelValue.length > 0">
      <span
        v-for="tagId in modelValue"
        :key="tagId"
        class="tag-chip"
      >
        {{ getTagName(tagId) }}
        <button type="button" class="tag-remove" @click="removeTag(tagId)">&times;</button>
      </span>
    </div>
    
    <CustomSelect
      v-if="modelValue.length < maxTags"
      v-model="tagToAdd"
      :options="availableOptions"
      placeholder="Añadir etiqueta..."
      :searchable="true"
      searchPlaceholder="Buscar etiqueta..."
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import CustomSelect from '@/components/shared/CustomSelect.vue'

const props = withDefaults(defineProps<{
  modelValue: number[]
  options: { value: number, label: string }[]
  maxTags?: number
}>(), {
  maxTags: 3
})

const emit = defineEmits<{
  (e: 'update:modelValue', val: number[]): void
}>()

const tagToAdd = ref<number | null>(null)

const availableOptions = computed(() => {
  return props.options.filter(opt => !props.modelValue.includes(opt.value))
})

const getTagName = (tagId: number): string => {
  const tag = props.options.find(t => t.value === tagId)
  return tag ? tag.label : 'Etiqueta'
}

const removeTag = (tagId: number) => {
  emit('update:modelValue', props.modelValue.filter(id => id !== tagId))
}

watch(tagToAdd, (newVal) => {
  if (newVal !== null && !props.modelValue.includes(newVal) && props.modelValue.length < props.maxTags) {
    emit('update:modelValue', [...props.modelValue, newVal])
    tagToAdd.value = null
  }
})
</script>

<style scoped>
.tags-selector {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.selected-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tag-chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background-color: rgba(52, 211, 153, 0.1);
  color: #34d399;
  border: 1px solid rgba(52, 211, 153, 0.25);
  border-radius: 20px;
  padding: 5px 10px 5px 12px;
  font-size: 13px;
  font-weight: 600;
  animation: chip-in 0.2s ease;
}

@keyframes chip-in {
  from {
    opacity: 0;
    transform: scale(0.85);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.tag-remove {
  background: none;
  border: none;
  color: #34d399;
  font-size: 16px;
  cursor: pointer;
  padding: 0;
  line-height: 1;
  opacity: 0.7;
  transition: opacity 0.15s;
}

.tag-remove:hover {
  opacity: 1;
}
</style>
