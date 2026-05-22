<template>
  <ErrorLayout
    title="Página no encontrada"
    message="La página que estás buscando no existe, ha sido movida o está temporalmente inaccesible."
  >
    <template #icon>
      <svg viewBox="0 0 24 24" width="64" height="64" stroke="#a855f7" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round">
        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
        <line x1="12" y1="9" x2="12" y2="13"></line>
        <line x1="12" y1="17" x2="12.01" y2="17"></line>
      </svg>
    </template>
  </ErrorLayout>
</template>

<script setup lang="ts">
import ErrorLayout from '@/components/shared/ErrorLayout.vue'
</script>
