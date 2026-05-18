<template>
  <div class="layout">
    <Sidebar />
    <main class="main-content">
      <div class="content-container">
        <header class="header">
          <div>
            <h1 class="page-title">Gestión de Usuarios</h1>
            <p class="page-subtitle">Gestiona los miembros del equipo, roles y permisos de la plataforma.</p>
          </div>
          <div class="header-actions">
            <button class="btn-primary" @click="openAddModal">
              <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
              Añadir Usuario
            </button>
          </div>
        </header>

        <div class="filters-bar">
          <div class="search-box">
            <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" class="search-icon"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            <input type="text" placeholder="Buscar usuarios por nombre o email..." v-model="searchQuery" />
          </div>
          
          <div class="filters-group">
            <div class="dropdown-container">
              <select v-model="selectedRoleFilter" class="dropdown-select">
                <option value="">Todos los Roles</option>
                <option value="ADMIN">Administrador</option>
                <option value="GESTOR">Gestor</option>
                <option value="USER">Usuario</option>
              </select>
            </div>
          </div>
        </div>

        <div class="users-list-container">
          <div v-if="loading" class="loading-state">
            <div class="spinner"></div>
            <p>Cargando usuarios...</p>
          </div>

          <div v-else-if="filteredUsers.length === 0" class="empty-state">
            <p>No se encontraron usuarios que coincidan con la búsqueda.</p>
          </div>

          <table v-else class="users-table">
            <thead>
              <tr>
                <th>NOMBRE</th>
                <th>EMAIL</th>
                <th>ROL</th>
                <th class="actions-header">ACCIONES</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="user in paginatedUsers" :key="user.id" class="user-row">
                <td>
                  <div class="user-info">
                    <div class="user-avatar-circle" :style="getAvatarStyle(user)">
                      {{ getInitials(user) }}
                    </div>
                    <div class="user-name-details">
                      <span class="user-fullname">{{ user.fullname || user.username }}</span>
                      <span class="user-username">@{{ user.username }}</span>
                    </div>
                  </div>
                </td>
                <td>
                  <span class="user-email">{{ user.email }}</span>
                </td>
                <td>
                  <span class="role-badge" :class="getRoleClass(user)">
                    {{ getRoleLabel(user) }}
                  </span>
                </td>
                <td>
                  <div class="actions-cell">
                    <button class="action-btn edit" @click="openEditModal(user)" title="Editar roles / detalles">
                      <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4Z"></path></svg>
                    </button>
                    <button class="action-btn delete" @click="confirmDeleteUser(user)" title="Eliminar usuario">
                      <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Paginación -->
        <div v-if="filteredUsers.length > 0" class="pagination-bar">
          <span class="pagination-info">
            Mostrando {{ paginationStart + 1 }} a {{ Math.min(paginationEnd, filteredUsers.length) }} de {{ filteredUsers.length }} usuarios
          </span>
          <div class="pagination-actions">
            <button class="pagination-btn" :disabled="currentPage === 1" @click="currentPage--">
              Anterior
            </button>
            <button class="pagination-btn" :disabled="paginationEnd >= filteredUsers.length" @click="currentPage++">
              Siguiente
            </button>
          </div>
        </div>
      </div>
    </main>

    <!-- Modal Editar Roles / Detalles -->
    <transition name="modal-fade">
      <div v-if="showEditModal" class="modal-overlay" @click.self="showEditModal = false">
        <div class="modal-card">
          <header class="modal-header">
            <h3>Editar Usuario</h3>
            <button class="close-btn" @click="showEditModal = false">&times;</button>
          </header>
          
          <div class="modal-body">
            <div class="form-group">
              <label>Nombre Completo</label>
              <input type="text" v-model="editUserForm.fullname" placeholder="Nombre completo" class="modal-input" />
            </div>

            <div class="form-group">
              <label>Nombre de Usuario</label>
              <input type="text" v-model="editUserForm.username" disabled class="modal-input disabled" />
              <small class="help-text">El nombre de usuario no se puede cambiar.</small>
            </div>

            <div class="form-group">
              <label>Rol del Usuario</label>
              <div class="role-selector-group">
                <label class="role-radio-label">
                  <input type="radio" v-model="editUserForm.roleType" value="USER" />
                  <span class="radio-custom"></span>
                  <span>Usuario (Básico)</span>
                </label>
                <label class="role-radio-label">
                  <input type="radio" v-model="editUserForm.roleType" value="GESTOR" />
                  <span class="radio-custom"></span>
                  <span>Gestor (Manager)</span>
                </label>
              </div>
            </div>
          </div>

          <footer class="modal-footer">
            <button class="modal-btn cancel" @click="showEditModal = false">Cancelar</button>
            <button class="modal-btn save" @click="saveEditUser" :disabled="saving">
              {{ saving ? 'Guardando...' : 'Guardar Cambios' }}
            </button>
          </footer>
        </div>
      </div>
    </transition>

    <!-- Modal Añadir Usuario (Simulado / Informativo) -->
    <transition name="modal-fade">
      <div v-if="showAddModal" class="modal-overlay" @click.self="showAddModal = false">
        <div class="modal-card">
          <header class="modal-header">
            <h3>Añadir Nuevo Miembro</h3>
            <button class="close-btn" @click="showAddModal = false">&times;</button>
          </header>
          
          <div class="modal-body text-center">
            <div class="info-icon-container">
              <svg viewBox="0 0 24 24" width="48" height="48" stroke="#8b5cf6" stroke-width="2" fill="none"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
            </div>
            <p class="modal-info-text">
              Para agregar un nuevo miembro al equipo, pídele que se registre desde la pantalla de inicio ("Sign Up") de la plataforma. Una vez creada su cuenta, podrás gestionar su rol y permisos desde este panel de administración.
            </p>
          </div>

          <footer class="modal-footer justify-center">
            <button class="modal-btn save" @click="showAddModal = false">Entendido</button>
          </footer>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import Sidebar from '@/components/Sidebar.vue'
import { useAuthStore } from '@/stores/auth'
import { userService } from '@/services/userService'

const authStore = useAuthStore()

const users = ref<any[]>([])
const loading = ref(true)
const saving = ref(false)
const searchQuery = ref('')
const selectedRoleFilter = ref('')

// Paginación
const currentPage = ref(1)
const itemsPerPage = 6

// Modales
const showEditModal = ref(false)
const showAddModal = ref(false)
const selectedUser = ref<any>(null)

const editUserForm = ref({
  fullname: '',
  username: '',
  roleType: 'USER'
})

const fetchUsers = async () => {
  loading.value = true
  try {
    const response = await userService.getAllUsers(authStore.authHeader)
    users.value = response.data
  } catch (error) {
    console.error('Error fetching users:', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchUsers()
})

// Filtrado de usuarios
const filteredUsers = computed(() => {
  return users.value.filter(user => {
    // Buscar por texto
    const text = searchQuery.value.toLowerCase()
    const matchesText = 
      (user.username || '').toLowerCase().includes(text) ||
      (user.fullname || '').toLowerCase().includes(text) ||
      (user.email || '').toLowerCase().includes(text)
    
    // Filtrar por rol
    if (!matchesText) return false
    if (!selectedRoleFilter.value) return true
    
    const roles: any[] = user.roles || []
    return roles.some((r: any) => {
      const roleName = (r.name || '').toUpperCase()
      return roleName.includes(selectedRoleFilter.value)
    })
  })
})

// Paginación calculada
const paginatedUsers = computed(() => {
  const start = paginationStart.value
  const end = paginationEnd.value
  return filteredUsers.value.slice(start, end)
})

const paginationStart = computed(() => {
  return (currentPage.value - 1) * itemsPerPage
})

const paginationEnd = computed(() => {
  return currentPage.value * itemsPerPage
})

// Generar iniciales del usuario
const getInitials = (user: any) => {
  const name = user.fullname || user.username || 'U'
  const parts = name.trim().split(' ')
  if (parts.length > 1) {
    return (parts[0][0] + parts[1][0]).toUpperCase()
  }
  return name.substring(0, 2).toUpperCase()
}

// Estilo de color del Avatar basado en hash del nombre
const getAvatarStyle = (user: any) => {
  const name = user.fullname || user.username || ''
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  }
  const h = Math.abs(hash % 360)
  return {
    backgroundColor: `hsl(${h}, 50%, 25%)`,
    color: `hsl(${h}, 80%, 75%)`
  }
}

// Identificar rol principal
const getPrimaryRole = (user: any): string => {
  const roles: any[] = user.roles || []
  const roleNames = roles.map(r => (r.name || '').toUpperCase())
  
  if (roleNames.some(name => name.includes('ADMIN'))) return 'ADMIN'
  if (roleNames.some(name => name.includes('GESTOR') || name.includes('MANAGER'))) return 'GESTOR'
  return 'USER'
}

const getRoleLabel = (user: any) => {
  const role = getPrimaryRole(user)
  if (role === 'ADMIN') return 'Administrador'
  if (role === 'GESTOR') return 'Gestor'
  return 'Usuario'
}

const getRoleClass = (user: any) => {
  const role = getPrimaryRole(user)
  if (role === 'ADMIN') return 'badge-admin'
  if (role === 'GESTOR') return 'badge-manager'
  return 'badge-user'
}

// Modales acciones
const openAddModal = () => {
  showAddModal.value = true
}

const openEditModal = (user: any) => {
  selectedUser.value = user
  editUserForm.value = {
    fullname: user.fullname || '',
    username: user.username || '',
    roleType: getPrimaryRole(user)
  }
  showEditModal.value = true
}

const saveEditUser = async () => {
  if (!selectedUser.value) return
  saving.value = true
  
  try {
    // 1. Guardar cambio de Nombre Completo
    if (editUserForm.value.fullname !== selectedUser.value.fullname) {
      await userService.changeFullName(
        authStore.authHeader,
        selectedUser.value.id,
        { fullname: editUserForm.value.fullname }
      )
    }

    // 2. Gestionar cambio de Rol (Promote / Demote)
    const originalRole = getPrimaryRole(selectedUser.value)
    const newRole = editUserForm.value.roleType

    if (originalRole !== newRole) {
      if (newRole === 'GESTOR') {
        // Promocionar a gestor
        await userService.promoteUser(authStore.authHeader, selectedUser.value.id)
      } else if (originalRole === 'GESTOR' && newRole === 'USER') {
        // Degradar a usuario normal
        await userService.demoteUser(authStore.authHeader, selectedUser.value.id)
      }
    }

    showEditModal.value = false
    await fetchUsers() // Recargar tabla
  } catch (error) {
    console.error('Error al guardar cambios de usuario:', error)
    alert('Ocurrió un error al actualizar el usuario.')
  } finally {
    saving.value = false
  }
}

const confirmDeleteUser = async (user: any) => {
  const role = getPrimaryRole(user)
  if (role === 'ADMIN') {
    alert('No se puede eliminar a un Administrador principal por motivos de seguridad.')
    return
  }
  
  if (confirm(`¿Estás seguro de que deseas eliminar permanentemente al usuario "${user.fullname || user.username}"?`)) {
    try {
      await userService.deleteUser(authStore.authHeader, user.id)
      await fetchUsers() // Recargar tabla
    } catch (error) {
      console.error('Error al eliminar usuario:', error)
      alert('Error: Asegúrate de que el backend tenga el endpoint de eliminación configurado.')
    }
  }
}
</script>

<style scoped>
.layout {
  display: flex;
  min-height: 100vh;
  background-color: #121214;
  color: #e4e4e7;
}

.main-content {
  margin-left: 70px;
  flex: 1;
  padding: 40px;
  box-sizing: border-box;
}

.content-container {
  max-width: 1400px;
  width: 100%;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 32px;
}

/* Cabecera */
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.page-title {
  font-size: 28px;
  font-weight: 700;
  color: #ffffff;
  margin: 0 0 6px 0;
  letter-spacing: -0.5px;
}

.page-subtitle {
  font-size: 14px;
  color: #a1a1aa;
  margin: 0;
}

.btn-primary {
  display: flex;
  align-items: center;
  gap: 8px;
  background-color: #8b5cf6;
  color: #ffffff;
  border: none;
  border-radius: 8px;
  padding: 10px 18px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s, transform 0.1s;
}

.btn-primary:hover {
  background-color: #7c3aed;
}

.btn-primary:active {
  transform: scale(0.98);
}

/* Barra de Filtros */
.filters-bar {
  display: flex;
  gap: 16px;
  width: 100%;
}

.search-box {
  position: relative;
  flex: 1;
}

.search-icon {
  position: absolute;
  left: 14px;
  top: 50%;
  transform: translateY(-50%);
  color: #71717a;
}

.search-box input {
  width: 100%;
  padding: 12px 16px 12px 42px;
  background-color: #1a1a1c;
  border: 1px solid #2a2a2d;
  border-radius: 8px;
  color: #ffffff;
  font-size: 14px;
  outline: none;
  transition: border-color 0.2s;
  box-sizing: border-box;
}

.search-box input:focus {
  border-color: #8b5cf6;
}

.dropdown-container {
  height: 100%;
}

.dropdown-select {
  height: 100%;
  padding: 0 16px;
  background-color: #1a1a1c;
  border: 1px solid #2a2a2d;
  border-radius: 8px;
  color: #a1a1aa;
  font-size: 14px;
  outline: none;
  cursor: pointer;
  min-width: 150px;
}

.dropdown-select:focus {
  border-color: #8b5cf6;
  color: #ffffff;
}

/* Lista / Tabla de Usuarios */
.users-list-container {
  background-color: #1a1a1c;
  border: 1px solid #2a2a2d;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
  flex: 1;
}

.users-table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
}

.users-table th {
  padding: 16px 24px;
  font-size: 11px;
  font-weight: 700;
  color: #71717a;
  text-transform: uppercase;
  border-bottom: 1px solid #2a2a2d;
  letter-spacing: 0.5px;
}

.users-table td {
  padding: 16px 24px;
  border-bottom: 1px solid #2a2a2d;
  vertical-align: middle;
}

.user-row {
  transition: background-color 0.2s;
}

.user-row:hover {
  background-color: rgba(255, 255, 255, 0.02);
}

.user-info {
  display: flex;
  align-items: center;
  gap: 16px;
}

.user-avatar-circle {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 14px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.user-name-details {
  display: flex;
  flex-direction: column;
}

.user-fullname {
  font-size: 14px;
  font-weight: 600;
  color: #ffffff;
}

.user-username {
  font-size: 12px;
  color: #71717a;
}

.user-email {
  font-size: 14px;
  color: #a1a1aa;
}

/* Badges de Roles */
.role-badge {
  display: inline-block;
  padding: 4px 12px;
  font-size: 12px;
  font-weight: 600;
  border-radius: 9999px;
  text-transform: capitalize;
}

.badge-admin {
  background-color: rgba(139, 92, 246, 0.15);
  color: #a78bfa;
  border: 1px solid rgba(139, 92, 246, 0.2);
}

.badge-manager {
  background-color: rgba(16, 185, 129, 0.15);
  color: #34d399;
  border: 1px solid rgba(16, 185, 129, 0.2);
}

.badge-user {
  background-color: rgba(113, 113, 122, 0.15);
  color: #a1a1aa;
  border: 1px solid rgba(113, 113, 122, 0.2);
}

/* Acciones */
.actions-header {
  text-align: right;
}

.actions-cell {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.action-btn {
  background: none;
  border: none;
  color: #71717a;
  cursor: pointer;
  padding: 6px;
  border-radius: 6px;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.action-btn:hover {
  background-color: #27272a;
}

.action-btn.edit:hover {
  color: #8b5cf6;
}

.action-btn.delete:hover {
  color: #ef4444;
}

/* Paginación */
.pagination-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 10px;
}

.pagination-info {
  font-size: 13px;
  color: #71717a;
}

.pagination-actions {
  display: flex;
  gap: 8px;
}

.pagination-btn {
  background-color: #1a1a1c;
  border: 1px solid #2a2a2d;
  border-radius: 8px;
  padding: 8px 16px;
  font-size: 13px;
  color: #e4e4e7;
  cursor: pointer;
  transition: all 0.2s;
}

.pagination-btn:hover:not(:disabled) {
  background-color: #27272a;
  border-color: #3f3f46;
}

.pagination-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

/* Modal Estilos */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-card {
  background-color: #1a1a1c;
  border: 1px solid #2a2a2d;
  border-radius: 12px;
  width: 100%;
  max-width: 440px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid #2a2a2d;
}

.modal-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 700;
  color: #ffffff;
}

.close-btn {
  background: none;
  border: none;
  color: #71717a;
  font-size: 24px;
  cursor: pointer;
  line-height: 1;
}

.close-btn:hover {
  color: #ffffff;
}

.modal-body {
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group label {
  font-size: 12px;
  font-weight: 600;
  color: #a1a1aa;
}

.modal-input {
  background-color: #121214;
  border: 1px solid #2a2a2d;
  border-radius: 8px;
  padding: 10px 14px;
  color: #ffffff;
  font-size: 14px;
  outline: none;
  transition: border-color 0.2s;
}

.modal-input:focus:not(.disabled) {
  border-color: #8b5cf6;
}

.modal-input.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.help-text {
  font-size: 11px;
  color: #71717a;
}

/* Radio buttons personalizados para los Roles en el modal */
.role-selector-group {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 4px;
}

.role-radio-label {
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  font-size: 14px;
  color: #e4e4e7;
}

.role-radio-label input {
  display: none;
}

.radio-custom {
  width: 18px;
  height: 18px;
  border: 2px solid #3f3f46;
  border-radius: 50%;
  display: inline-block;
  position: relative;
  background-color: #121214;
  transition: border-color 0.2s;
}

.role-radio-label input:checked + .radio-custom {
  border-color: #8b5cf6;
}

.role-radio-label input:checked + .radio-custom::after {
  content: '';
  position: absolute;
  width: 8px;
  height: 8px;
  background-color: #8b5cf6;
  border-radius: 50%;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}

.modal-footer {
  padding: 16px 24px;
  background-color: #121214;
  border-top: 1px solid #2a2a2d;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.modal-btn {
  padding: 10px 18px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.modal-btn.cancel {
  background: none;
  border: 1px solid #2a2a2d;
  color: #a1a1aa;
}

.modal-btn.cancel:hover {
  background-color: #1a1a1c;
  color: #ffffff;
}

.modal-btn.save {
  background-color: #8b5cf6;
  border: none;
  color: #ffffff;
}

.modal-btn.save:hover:not(:disabled) {
  background-color: #7c3aed;
}

.modal-btn.save:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Modales Informativos */
.text-center {
  text-align: center;
}

.justify-center {
  justify-content: center;
}

.info-icon-container {
  display: flex;
  justify-content: center;
  margin-bottom: 8px;
}

.modal-info-text {
  font-size: 14px;
  line-height: 1.6;
  color: #a1a1aa;
  margin: 0;
}

/* Spinner de carga */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 0;
  gap: 16px;
  color: #71717a;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid rgba(139, 92, 246, 0.1);
  border-radius: 50%;
  border-top-color: #8b5cf6;
  animation: spin 1s ease-in-out infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.empty-state {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 80px 0;
  color: #71717a;
  font-size: 14px;
}

/* Transiciones modales */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.25s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

.modal-fade-enter-active .modal-card,
.modal-fade-leave-active .modal-card {
  transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}

.modal-fade-enter-from .modal-card {
  transform: scale(0.95) translateY(10px);
}

.modal-fade-leave-to .modal-card {
  transform: scale(0.95) translateY(10px);
}

@media (max-width: 768px) {
  .main-content {
    margin-left: 0;
    margin-bottom: 60px;
    padding: 24px 16px;
  }
  .header {
    flex-direction: column;
    align-items: stretch;
    gap: 16px;
  }
  .btn-primary {
    justify-content: center;
    width: 100%;
  }
  .filters-bar {
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
  }
  .dropdown-container {
    width: 100%;
  }
  .dropdown-select {
    width: 100%;
  }
  
  /* Conversión de Tabla a Cards Responsivas */
  .users-table, 
  .users-table thead, 
  .users-table tbody, 
  .users-table th, 
  .users-table td, 
  .users-table tr {
    display: block;
  }
  
  .users-table thead {
    display: none;
  }
  
  .user-row {
    position: relative;
    border-bottom: 1px solid #2a2a2d;
    padding: 20px 16px;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  
  .users-table td {
    border: none;
    padding: 0;
  }
  
  .users-table td:nth-child(2) {
    /* Email */
    padding-left: 56px; /* Alineación perfecta con el texto del nombre (Avatar 40px + gap 16px) */
  }
  
  .users-table td:nth-child(3) {
    /* Rol */
    padding-left: 56px;
  }
  
  .users-table td:nth-child(4) {
    /* Acciones posicionadas en la esquina superior derecha */
    position: absolute;
    top: 20px;
    right: 16px;
  }
  
  .pagination-bar {
    flex-direction: column;
    gap: 16px;
    align-items: center;
    text-align: center;
    padding: 20px 16px;
  }
  .pagination-actions {
    width: 100%;
  }
  .pagination-btn {
    flex: 1;
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .page-title {
    font-size: 24px;
  }
  .modal-card {
    width: calc(100% - 32px);
    margin: 16px;
    max-height: calc(100vh - 32px);
  }
  .modal-body {
    padding: 16px;
    gap: 16px;
  }
  .modal-footer {
    padding: 12px 16px;
  }
}
</style>
