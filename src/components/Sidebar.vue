<template>
  <aside class="sidebar">
    <div class="sidebar-top">
      <div class="logo-icon">
        <img src="@/images/logo-task.png" alt="TaskFlow Logo" class="logo-img" />
      </div>

      <nav class="nav-menu">
        <router-link to="/" class="nav-item" active-class="active" title="Dashboard">
          <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" class="css-i6dzq1"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
        </router-link>

        <router-link to="/tasks" class="nav-item" active-class="active" title="Todas las Tareas">
          <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" class="css-i6dzq1"><polyline points="9 11 12 14 22 4"></polyline><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path></svg>
        </router-link>

        <router-link to="/calendar" class="nav-item" active-class="active" title="Calendario">
          <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" class="css-i6dzq1"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
        </router-link>

        <router-link v-if="isAdmin" to="/users" class="nav-item" active-class="active" title="Gestión de Usuarios">
          <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" class="css-i6dzq1"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
        </router-link>

        <a href="#" class="nav-item" title="Estadísticas">
          <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" class="css-i6dzq1"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>
        </a>
      </nav>
    </div>

    <div class="sidebar-bottom">
      <a href="#" class="nav-item" title="Configuración">
        <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" class="css-i6dzq1"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
      </a>
      
      <div class="user-menu-container">
        <transition name="fade">
          <div v-if="showUserMenu" class="user-dropdown">
            <button class="dropdown-item logout" @click="logout">
              <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
              Cerrar sesión
            </button>
          </div>
        </transition>

        <div class="user-avatar" @click="toggleMenu" title="Menú de usuario">
          {{ initials }}
        </div>
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()
const showUserMenu = ref(false)

const initials = computed(() => {
  const name = authStore.username || 'U'
  return name.substring(0, 2).toUpperCase()
})

const isAdmin = computed(() => {
  const rolesStr = authStore.roles || ''
  return rolesStr.toUpperCase().includes('ADMIN')
})

const toggleMenu = () => {
  showUserMenu.value = !showUserMenu.value
}

const closeMenu = (e: MouseEvent) => {
  const target = e.target as HTMLElement
  if (!target.closest('.user-menu-container')) {
    showUserMenu.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', closeMenu)
})

onUnmounted(() => {
  document.removeEventListener('click', closeMenu)
})

const logout = () => {
  authStore.logout()
  router.push('/login')
}
</script>

<style scoped>
.sidebar {
  width: 70px;
  height: 100vh;
  box-sizing: border-box;
  background-color: #1a1a1c;
  border-right: 1px solid #2a2a2d;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  padding: 24px 0;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 100;
}

.sidebar-top, .sidebar-bottom {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  width: 100%;
}

.logo-icon {
  width: 44px;
  height: 44px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
  overflow: hidden;
}

.logo-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.nav-menu {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  width: 100%;
}

.nav-item {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #71717a;
  border-radius: 12px;
  transition: all 0.2s ease;
  text-decoration: none;
}

.nav-item:hover {
  color: #e4e4e7;
  background-color: #27272a;
}

.nav-item.active {
  color: #8b5cf6;
  background-color: #27272a;
  border-left: 3px solid #8b5cf6;
  border-radius: 8px;
}

.user-menu-container {
  position: relative;
  display: flex;
  justify-content: center;
  width: 100%;
}

.user-dropdown {
  position: absolute;
  bottom: 50px;
  left: 10px;
  background-color: #27272a;
  border: 1px solid #3f3f46;
  border-radius: 8px;
  padding: 8px;
  width: 160px;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.5);
  z-index: 101;
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding: 10px 12px;
  background: none;
  border: none;
  color: #e4e4e7;
  font-size: 14px;
  cursor: pointer;
  border-radius: 6px;
  transition: background-color 0.2s;
  text-align: left;
}

.dropdown-item:hover {
  background-color: #3f3f46;
}

.dropdown-item.logout {
  color: #f43f5e;
}

.dropdown-item.logout:hover {
  background-color: rgba(244, 63, 94, 0.1);
}

.user-avatar {
  width: 36px;
  height: 36px;
  background-color: #3f3f46;
  color: #8b5cf6;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.2s;
  border: 1px solid #52525b;
}

.user-avatar:hover {
  background-color: #52525b;
}

/* Animations */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

@media (max-width: 768px) {
  .sidebar {
    width: 100vw;
    height: 60px;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding: 0 16px;
    position: fixed;
    top: auto;
    bottom: 0;
    left: 0;
    border-right: none;
    border-top: 1px solid #2a2a2d;
    z-index: 999;
  }
  
  .sidebar-top {
    flex-direction: row;
    align-items: center;
    gap: 0;
    width: auto;
  }
  
  .logo-icon {
    display: none;
  }
  
  .nav-menu {
    flex-direction: row;
    gap: 8px;
    align-items: center;
  }
  
  .nav-item {
    width: 44px;
    height: 44px;
    border-left: none !important;
    border-bottom: 3px solid transparent;
  }
  
  .nav-item.active {
    border-left: none !important;
    border-bottom: 3px solid #8b5cf6 !important;
    border-radius: 8px 8px 0 0;
  }
  
  .sidebar-bottom {
    flex-direction: row;
    align-items: center;
    gap: 12px;
    width: auto;
  }
  
  .user-dropdown {
    bottom: 60px;
    left: auto;
    right: 0;
    width: 150px;
  }
}
</style>
