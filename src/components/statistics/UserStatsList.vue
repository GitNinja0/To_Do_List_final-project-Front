<template>
  <div class="user-stats-list-container">
    <div v-if="loading" class="loading-state">
      <svg class="spinner" viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none">
        <circle cx="12" cy="12" r="10" stroke-opacity="0.25"></circle>
        <path d="M12 2a10 10 0 0 1 10 10"></path>
      </svg>
      <span>Cargando usuarios...</span>
    </div>

    <div v-else-if="users.length === 0" class="empty-state">
      <p>No se encontraron usuarios.</p>
    </div>

    <template v-else>
      <div class="users-grid">
        <UserStatsCard
          v-for="user in users"
          :key="user.id"
          :user="user"
        />
      </div>

      <div class="pagination-controls" v-if="totalPages > 1">
        <button
          class="btn-page"
          :disabled="currentPage === 0"
          @click="changePage(currentPage - 1)"
        >
          Anterior
        </button>
        <span class="page-info">Página {{ currentPage + 1 }} de {{ totalPages }}</span>
        <button
          class="btn-page"
          :disabled="currentPage >= totalPages - 1"
          @click="changePage(currentPage + 1)"
        >
          Siguiente
        </button>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { userService } from '@/services/userService'
import UserStatsCard from './UserStatsCard.vue'

const authStore = useAuthStore()
const users = ref<any[]>([])
const loading = ref(true)
const currentPage = ref(0)
const totalPages = ref(0)
const itemsPerPage = 6

const fetchUsers = async () => {
  if (!authStore.authHeader) return
  loading.value = true
  try {
    const response = await userService.getAllUsers(
      authStore.authHeader,
      '',
      '',
      currentPage.value,
      itemsPerPage
    )
    users.value = response.data.content
    totalPages.value = response.data.totalPages || Math.ceil((response.data.totalElements || 0) / itemsPerPage)
  } catch (error) {
    console.error('Error fetching users for stats:', error)
  } finally {
    loading.value = false
  }
}

const changePage = (page: number) => {
  if (page >= 0 && page < totalPages.value) {
    currentPage.value = page
    fetchUsers()
  }
}

onMounted(fetchUsers)
</script>

<style scoped>
.user-stats-list-container {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.loading-state, .empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 0;
  color: #a1a1aa;
  background-color: #121214;
  border-radius: 12px;
  border: 1px dashed #2c2c2e;
}

.spinner {
  animation: spin 1s linear infinite;
  margin-bottom: 12px;
  color: #8b5cf6;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.users-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.pagination-controls {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 16px;
  margin-top: 16px;
}

.btn-page {
  background-color: #1a1a1c;
  color: #e4e4e7;
  border: 1px solid #2c2c2e;
  border-radius: 8px;
  padding: 8px 16px;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-page:hover:not(:disabled) {
  background-color: #27272a;
  border-color: #3a3a3c;
  color: white;
}

.btn-page:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-info {
  font-size: 13px;
  color: #a1a1aa;
}
</style>
