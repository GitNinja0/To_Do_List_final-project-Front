<template>
  <ErrorLayout
    title="Acceso Denegado"
    message="No tienes los permisos necesarios para acceder a esta sección. Si crees que esto es un error, contacta con un administrador."
  >
    <template #icon>
      <svg viewBox="0 0 24 24" width="64" height="64" stroke="#f43f5e" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
        <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
      </svg>
    </template>
  </ErrorLayout>
</template>

<script setup lang="ts">
import ErrorLayout from '@/components/shared/ErrorLayout.vue'
</script>
