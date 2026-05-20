<template>
  <div class="layout">
    <Sidebar />
    <main class="main-content">
      <div class="content-container">
        <PageHeader title="Gestión de Usuarios" subtitle="Gestiona los miembros del equipo, roles y permisos de la plataforma.">
          <template #actions>
            <button class="btn-primary" @click="showAddModal = true">
              <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none"
                stroke-linecap="round" stroke-linejoin="round">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
              Añadir Usuario
            </button>
          </template>
        </PageHeader>

        <UsersFiltersBar
          v-model:searchQuery="searchQuery"
          v-model:roleFilter="selectedRoleFilter"
        />

        <UsersTable
          :users="paginatedUsers"
          :loading="loading"
          @edit="openEditModal"
          @delete="confirmDeleteUser"
        />

        <div v-if="totalElements > 0" class="pagination-bar">
          <span class="pagination-info">
            Mostrando {{ paginationStart + 1 }} a {{ Math.min(paginationEnd, totalElements) }} de {{ totalElements }} usuarios
          </span>
          <div class="pagination-actions">
            <button class="pagination-btn" :disabled="currentPage === 1" @click="currentPage--">Anterior</button>
            <button class="pagination-btn" :disabled="paginationEnd >= totalElements" @click="currentPage++">Siguiente</button>
          </div>
        </div>
      </div>
    </main>

    <UserEditModal
      v-model="showEditModal"
      :form="editUserForm"
      :saving="saving"
      @save="saveEditUser"
    />

    <UserAddInfoModal v-model="showAddModal" />

    <ConfirmModal
      :isOpen="showConfirmDeleteModal"
      title="Eliminar Usuario"
      :message="`¿Estás seguro de que deseas eliminar permanentemente al usuario '${userToDelete?.fullname || userToDelete?.username}'?`"
      confirmText="Eliminar"
      @confirm="handleDeleteUser"
      @close="showConfirmDeleteModal = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import Sidebar from '@/components/Sidebar.vue'
import PageHeader from '@/components/shared/PageHeader.vue'
import UsersFiltersBar from '@/components/users/UsersFiltersBar.vue'
import UsersTable from '@/components/users/UsersTable.vue'
import UserEditModal from '@/components/users/UserEditModal.vue'
import UserAddInfoModal from '@/components/users/UserAddInfoModal.vue'
import ConfirmModal from '@/components/shared/ConfirmModal.vue'
import { useAuthStore } from '@/stores/auth'
import { userService } from '@/services/userService'

const authStore = useAuthStore()
const users = ref<any[]>([])
const loading = ref(true)
const saving = ref(false)
const searchQuery = ref('')
const selectedRoleFilter = ref('')
const currentPage = ref(1)
const itemsPerPage = 6
const totalElements = ref(0)
const showEditModal = ref(false)
const showAddModal = ref(false)
const selectedUser = ref<any>(null)
const editUserForm = ref({ fullname: '', username: '', roleType: 'USER' })

const showConfirmDeleteModal = ref(false)
const userToDelete = ref<any>(null)

const fetchUsers = async () => {
  loading.value = true
  try {
    const response = await userService.getAllUsers(
      authStore.authHeader, 
      searchQuery.value, 
      selectedRoleFilter.value, 
      currentPage.value - 1, 
      itemsPerPage
    )
    users.value = response.data.content
    totalElements.value = response.data.totalElements
  } catch (e) { console.error('Error fetching users:', e) }
  finally { loading.value = false }
}

const getPrimaryRole = (user: any): string => {
  const roles: any[] = user.roles || []
  const names = roles.map(r => (r.name || '').toUpperCase())
  if (names.some(n => n.includes('ADMIN'))) return 'ADMIN'
  if (names.some(n => n.includes('GESTOR') || n.includes('MANAGER'))) return 'GESTOR'
  return 'USER'
}

const paginationStart = computed(() => (currentPage.value - 1) * itemsPerPage)
const paginationEnd = computed(() => currentPage.value * itemsPerPage)
const paginatedUsers = computed(() => users.value)

watch([searchQuery, selectedRoleFilter], () => {
  currentPage.value = 1
  fetchUsers()
})

watch(currentPage, () => {
  fetchUsers()
})

const openEditModal = (user: any) => {
  selectedUser.value = user
  editUserForm.value = { fullname: user.fullname || '', username: user.username || '', roleType: getPrimaryRole(user) }
  showEditModal.value = true
}

const saveEditUser = async (form: any) => {
  if (!selectedUser.value) return
  saving.value = true
  try {
    if (form.fullname !== selectedUser.value.fullname) {
      await userService.changeFullName(authStore.authHeader, selectedUser.value.id, { fullname: form.fullname })
    }
    const originalRole = getPrimaryRole(selectedUser.value)
    if (originalRole !== form.roleType) {
      if (form.roleType === 'GESTOR') {
        await userService.promoteUser(authStore.authHeader, selectedUser.value.id)
      } else if (originalRole === 'GESTOR' && form.roleType === 'USER') {
        await userService.demoteUser(authStore.authHeader, selectedUser.value.id)
      }
    }
    showEditModal.value = false
    await fetchUsers()
  } catch (e) {
    console.error('Error al guardar cambios:', e)
    alert('Ocurrió un error al actualizar el usuario.')
  } finally { saving.value = false }
}

const confirmDeleteUser = (user: any) => {
  if (getPrimaryRole(user) === 'ADMIN') {
    alert('No se puede eliminar a un Administrador principal por motivos de seguridad.')
    return
  }
  userToDelete.value = user
  showConfirmDeleteModal.value = true
}

const handleDeleteUser = async () => {
  if (!userToDelete.value) return
  try {
    await userService.deleteUser(authStore.authHeader, userToDelete.value.id)
    await fetchUsers()
  } catch (e) {
    alert('Error al eliminar el usuario.')
  } finally {
    showConfirmDeleteModal.value = false
    userToDelete.value = null
  }
}

onMounted(fetchUsers)
</script>

<style scoped>
.pagination-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 0;
  border-top: 1px solid #2a2a2d;
  margin-top: 8px;
}
.pagination-info { font-size: 13px; color: #71717a; }
.pagination-actions { display: flex; gap: 8px; }
.pagination-btn {
  padding: 8px 16px;
  background-color: #1a1a1c;
  border: 1px solid #2a2a2d;
  border-radius: 8px;
  color: #d4d4d8;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s;
}
.pagination-btn:hover:not(:disabled) { background-color: #27272a; border-color: #3f3f46; color: #ffffff; }
.pagination-btn:disabled { opacity: 0.4; cursor: not-allowed; }
</style>
