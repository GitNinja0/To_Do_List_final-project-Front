<template>
  <div class="layout">
    <Sidebar />
    <main class="main-content">
      <div class="content-container">
        <PageHeader title="Estadísticas de Usuarios" subtitle="Visualiza el progreso y rendimiento de cada miembro del equipo.">
        </PageHeader>

        <div v-if="!isAdmin" class="forbidden-message">
          <svg viewBox="0 0 24 24" width="48" height="48" stroke="#f43f5e" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
          </svg>
          <h2>Acceso Denegado</h2>
          <p>Solo los administradores pueden ver las estadísticas globales de los usuarios.</p>
        </div>
        
        <UserStatsList v-else />
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import Sidebar from '@/components/Sidebar.vue'
import PageHeader from '@/components/shared/PageHeader.vue'
import UserStatsList from '@/components/statistics/UserStatsList.vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

const isAdmin = computed(() => {
  const roles = (authStore.roles || '').toUpperCase()
  return roles.includes('ADMIN')
})
</script>

<style scoped>
.forbidden-message {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 80px 20px;
  background-color: #121214;
  border: 1px dashed #2c2c2e;
  border-radius: 12px;
  color: #e4e4e7;
}

.forbidden-message h2 {
  margin: 16px 0 8px;
  font-size: 20px;
}

.forbidden-message p {
  color: #a1a1aa;
  font-size: 14px;
}
</style>
