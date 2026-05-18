<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { authService } from '@/services/authService'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const activeTab = ref('signin')

// Login state
const username = ref('')
const password = ref('')
const error = ref('')

// Register state
const regUsername = ref('')
const regEmail = ref('')
const regPassword = ref('')
const regError = ref('')
const regSuccess = ref(false)

const handleLogin = async () => {
  error.value = ''
  try {
    const credentials = 'Basic ' + btoa(username.value + ':' + password.value)
    const response = await authService.login(credentials)
    
    if (response.status === 202) {
      authStore.setAuth(
        response.data.username,
        response.data.roles,
        credentials
      )
      router.push('/')
    }
  } catch (err: any) {
    error.value = 'Error de autenticación. Verifica tus credenciales.'
    console.error(err)
  }
}

const handleRegister = async () => {
  regError.value = ''
  regSuccess.value = false
  try {
    const userData = {
      username: regUsername.value,
      email: regEmail.value,
      password: btoa(regPassword.value)
    }
    await authService.register(userData)
    regSuccess.value = true
    setTimeout(() => {
      username.value = regUsername.value
      activeTab.value = 'signin'
    }, 2000)
  } catch (err: any) {
    regError.value = 'Error al crear la cuenta. Inténtalo de nuevo.'
    console.error(err)
  }
}
</script>

<template>
  <div class="split-layout">
    <!-- Panel Izquierdo -->
    <div class="left-panel">
      <div class="left-content">
        <!-- Logo -->
        <div class="brand">
          <img src="@/images/logo-task.png" alt="TaskFlow Logo" class="logo-img" />
          <span class="brand-text">TaskFlow</span>
        </div>

        <!-- Texto Principal -->
        <div class="hero-section">
          <h1 class="hero-title">Domina tu tiempo,<br/>simplifica tu vida</h1>
          <p class="hero-subtitle">
            La plataforma definitiva para gestionar tus proyectos, priorizar tareas y alcanzar tus objetivos sin estrés.
          </p>

          <!-- Características -->
          <div class="features">
            <div class="feature">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path><polyline points="9 12 11 14 15 10"></polyline></svg>
              <span>Seguro y privado</span>
            </div>
            <div class="feature">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>
              <span>Rápido y eficiente</span>
            </div>
            <div class="feature">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
              <span>Colaborativo</span>
            </div>
          </div>
        </div>

        <!-- Redes Sociales -->
        <div class="social-links">
          <a href="#" class="social-icon">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5 5.9 15.8 8 16c-3.1-2.2-4.1-6.1-2-9-.2.2-4.1 4.5-9 4.5 0-5.3 4.2-9.6 9.6-9.6 1.4 0 2.8.5 3.9 1.4.9-.2 1.8-.6 2.6-1.1-.3.9-1 1.7-1.8 2.2z"></path></svg>
          </a>
          <a href="#" class="social-icon">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
          </a>
          <a href="#" class="social-icon">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
          </a>
        </div>
      </div>
    </div>

    <!-- Panel Derecho -->
    <div class="right-panel">
      <div class="login-card">
        <!-- Pestañas -->
        <div class="tabs">
          <button class="tab" :class="{ active: activeTab === 'signin' }" @click="activeTab = 'signin'">Sign In</button>
          <button class="tab" :class="{ active: activeTab === 'signup' }" @click="activeTab = 'signup'">Sign Up</button>
        </div>

        <div class="form-container">
          <transition name="form-fade" mode="out-in">
            <!-- Formulario Sign In -->
            <form v-if="activeTab === 'signin'" key="signin" @submit.prevent="handleLogin" class="form-content">
              <div v-if="error" class="error-message">
                {{ error }}
              </div>

              <div class="input-group">
                <div class="input-wrapper">
                  <svg class="input-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                  <input type="text" id="login-username" v-model="username" placeholder="Email address or Username" autocomplete="username" required />
                </div>
              </div>

              <div class="input-group">
                <div class="input-wrapper">
                  <svg class="input-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                  <input type="password" id="login-password" v-model="password" placeholder="Password" autocomplete="current-password" required />
                </div>
              </div>

              <div class="form-options">
                <label class="remember-me">
                  <input type="checkbox" />
                  <span class="checkbox-custom"></span>
                  Remember me
                </label>
                <a href="#" class="forgot-password">Forgot password?</a>
              </div>

              <button type="submit" class="btn-primary">Sign In</button>

              <div class="divider">
                <span>Or continue with</span>
              </div>

              <div class="social-login">
                <button type="button" class="btn-social">
                  <svg class="social-icon-btn" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
                  GitHub
                </button>
                <button type="button" class="btn-social">
                  <svg class="social-icon-btn" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"/></svg>
                  Google
                </button>
              </div>
            </form>

            <!-- Formulario Sign Up -->
            <form v-else key="signup" @submit.prevent="handleRegister" class="form-content">
              <div v-if="regError" class="error-message">
                {{ regError }}
              </div>
              <div v-if="regSuccess" class="success-message">
                Cuenta creada con éxito. Redirigiendo...
              </div>

              <div class="input-group">
                <div class="input-wrapper">
                  <svg class="input-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                  <input type="text" id="reg-username" v-model="regUsername" placeholder="Username" autocomplete="username" required />
                </div>
              </div>

              <div class="input-group">
                <div class="input-wrapper">
                  <svg class="input-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                  <input type="email" id="reg-email" v-model="regEmail" placeholder="Email address" autocomplete="email" required />
                </div>
              </div>

              <div class="input-group">
                <div class="input-wrapper">
                  <svg class="input-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                  <input type="password" id="reg-password" v-model="regPassword" placeholder="Password" autocomplete="new-password" required />
                </div>
              </div>

              <button type="submit" class="btn-primary">Sign Up</button>

              <div class="divider">
                <span>Or sign up with</span>
              </div>

              <div class="social-login">
                <button type="button" class="btn-social">
                  <svg class="social-icon-btn" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
                  GitHub
                </button>
                <button type="button" class="btn-social">
                  <svg class="social-icon-btn" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"/></svg>
                  Google
                </button>
              </div>
            </form>
          </transition>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Contenedor Base */
.split-layout {
  display: flex;
  min-height: 100vh;
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
  color: #ffffff;
}

/* Panel Izquierdo */
.left-panel {
  flex: 1;
  background-color: #18181b; /* Gris oscuro / Negro del diseño original */
  display: flex;
  flex-direction: column;
  padding: 3rem 4rem;
  position: relative;
}

.left-content {
  max-width: 500px;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.brand {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 4rem;
}

.logo-img {
  width: 36px;
  height: 36px;
}

.brand-text {
  font-size: 22px;
  font-weight: 700;
  color: #ffffff;
  letter-spacing: -0.5px;
}

.hero-section {
  margin: auto 0;
}

.hero-title {
  font-size: 3.5rem;
  font-weight: 700;
  line-height: 1.1;
  margin-bottom: 1.5rem;
  color: #ffffff;
  letter-spacing: -1px;
}

.hero-subtitle {
  font-size: 1.125rem;
  color: #a1a1aa;
  line-height: 1.6;
  margin-bottom: 3rem;
  max-width: 90%;
}

.features {
  display: flex;
  gap: 2rem;
  flex-wrap: wrap;
}

.feature {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.875rem;
  color: #a1a1aa;
}

.feature svg {
  width: 18px;
  height: 18px;
  color: #a1a1aa;
}

.social-links {
  margin-top: 4rem;
  display: flex;
  gap: 1rem;
}

.social-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 1px solid #27272a;
  color: #a1a1aa;
  transition: all 0.2s ease;
}

.social-icon:hover {
  background-color: #27272a;
  color: #ffffff;
}

.social-icon svg {
  width: 18px;
  height: 18px;
}

/* Panel Derecho */
.right-panel {
  flex: 1;
  background-color: #09090b; /* Negro más oscuro */
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.login-card {
  width: 100%;
  max-width: 440px;
  background-color: #18181b;
  border-radius: 12px;
  border: 1px solid #27272a;
  padding: 2.5rem;
}

.tabs {
  display: flex;
  margin-bottom: 2rem;
  border: 1px solid #27272a;
  border-radius: 6px;
  overflow: hidden;
  background-color: #09090b;
}

.tab {
  flex: 1;
  padding: 0.875rem;
  font-size: 0.875rem;
  font-weight: 500;
  text-align: center;
  background: transparent;
  border: none;
  color: #71717a;
  cursor: pointer;
  transition: all 0.2s;
}

.tab.active {
  background-color: #18181b;
  color: #ffffff;
  border: 1px solid #3b2a75; /* Borde violeta oscuro estilo diseño */
  border-radius: 6px;
}

.form-content {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.error-message {
  color: #ef4444;
  background-color: rgba(239, 68, 68, 0.1);
  padding: 10px;
  border-radius: 8px;
  font-size: 14px;
  text-align: center;
  border: 1px solid rgba(239, 68, 68, 0.2);
}

.success-message {
  color: #10b981;
  background-color: rgba(16, 185, 129, 0.1);
  padding: 10px;
  border-radius: 8px;
  font-size: 14px;
  text-align: center;
  border: 1px solid rgba(16, 185, 129, 0.2);
}

/* Transiciones de formulario */
.form-fade-enter-active,
.form-fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.form-fade-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

.form-fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

.input-group {
  position: relative;
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.input-icon {
  position: absolute;
  left: 1rem;
  width: 18px;
  height: 18px;
  color: #71717a;
}

.input-wrapper input {
  width: 100%;
  padding: 0.875rem 1rem 0.875rem 2.75rem;
  background-color: #09090b;
  border: 1px solid #27272a;
  border-radius: 8px;
  color: #ffffff;
  font-size: 0.875rem;
  outline: none;
  transition: border-color 0.2s;
}

.input-wrapper input:focus {
  border-color: #6e44ff;
}

.input-wrapper input::placeholder {
  color: #52525b;
}

.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.8125rem;
  margin-top: 0.25rem;
}

.remember-me {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #a1a1aa;
  cursor: pointer;
}

.remember-me input {
  display: none;
}

.checkbox-custom {
  width: 14px;
  height: 14px;
  border: 1px solid #3f3f46;
  border-radius: 3px;
  display: inline-block;
  position: relative;
  background-color: #09090b;
}

.remember-me input:checked + .checkbox-custom {
  background-color: #6e44ff;
  border-color: #6e44ff;
}

.remember-me input:checked + .checkbox-custom::after {
  content: '';
  position: absolute;
  left: 4px;
  top: 1px;
  width: 3px;
  height: 7px;
  border: solid white;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}

.forgot-password {
  color: #6e44ff;
  text-decoration: none;
  transition: color 0.2s;
}

.forgot-password:hover {
  color: #8b66ff;
  text-decoration: underline;
}

.btn-primary {
  width: 100%;
  padding: 0.875rem;
  background-color: #7c3aed; /* Violeta principal */
  color: #ffffff;
  border: none;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
  margin-top: 0.5rem;
}

.btn-primary:hover {
  background-color: #6d28d9;
}

.divider {
  display: flex;
  align-items: center;
  text-align: center;
  color: #52525b;
  font-size: 0.75rem;
  margin: 1rem 0;
}

.divider::before,
.divider::after {
  content: '';
  flex: 1;
  border-bottom: 1px solid #27272a;
}

.divider span {
  padding: 0 1rem;
}

.social-login {
  display: flex;
  gap: 1rem;
}

.btn-social {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem;
  background-color: transparent;
  border: 1px solid #27272a;
  border-radius: 8px;
  color: #ffffff;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.btn-social:hover {
  background-color: #27272a;
}

.social-icon-btn {
  width: 18px;
  height: 18px;
}

/* Responsiveness básica */
@media (max-width: 960px) {
  .split-layout {
    flex-direction: column;
    min-height: 100vh;
  }
  .left-panel {
    padding: 2rem 1.5rem;
    align-items: center;
    border-bottom: 1px solid #27272a;
    flex: none;
  }
  .left-content {
    align-items: center;
    text-align: center;
    max-width: 100%;
  }
  .brand {
    margin-bottom: 0;
  }
  .hero-section, .social-links {
    display: none;
  }
  .right-panel {
    padding: 2.5rem 1.5rem;
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .login-card {
    width: 100%;
    max-width: 400px;
    margin: 0;
  }
}
</style>