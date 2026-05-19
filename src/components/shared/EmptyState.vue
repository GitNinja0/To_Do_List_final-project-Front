<template>
  <div class="empty-state">
    <slot name="icon" />
    <p>{{ message }}</p>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  message: string
}>()
</script>
