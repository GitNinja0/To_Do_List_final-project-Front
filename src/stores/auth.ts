import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const username = ref(localStorage.getItem('username') || '')
  const roles = ref(localStorage.getItem('roles') || '')
  const authHeader = ref(localStorage.getItem('authHeader') || '')

  const isAuthenticated = computed(() => !!authHeader.value)

  function setAuth(user: string, role: string, header: string) {
    username.value = user
    roles.value = role
    authHeader.value = header
    localStorage.setItem('username', user)
    localStorage.setItem('roles', role)
    localStorage.setItem('authHeader', header)
  }

  function logout() {
    username.value = ''
    roles.value = ''
    authHeader.value = ''
    localStorage.removeItem('username')
    localStorage.removeItem('roles')
    localStorage.removeItem('authHeader')
  }

  return { username, roles, authHeader, isAuthenticated, setAuth, logout }
})
