<template>
  <div class="layout">
    <Sidebar />
    <main class="main-content">
      <div class="content-container">
        <PageHeader title="Ajustes de Perfil" subtitle="Actualiza tu información personal y opciones de cuenta." />

        <div class="settings-panel">
          <form @submit.prevent="saveProfile" class="profile-form">
            <div class="form-group">
              <label for="username">Nombre de Usuario</label>
              <input type="text" id="username" v-model="profileForm.username" class="modal-input" placeholder="Tu usuario" />
              <small class="hint">Nota: Si cambias tu usuario, podrías necesitar volver a iniciar sesión.</small>
            </div>
            
            <div class="form-group">
              <label for="fullname">Nombre Completo</label>
              <input type="text" id="fullname" v-model="profileForm.fullname" class="modal-input" placeholder="Tu nombre completo" />
            </div>

            <div class="form-group">
              <label for="email">Correo Electrónico</label>
              <input type="email" id="email" v-model="profileForm.email" class="modal-input" placeholder="tu@correo.com" />
            </div>

            <div class="form-group">
              <label for="password">Nueva Contraseña (Opcional)</label>
              <input type="password" id="password" v-model="profileForm.password" class="modal-input" placeholder="Deja en blanco para no cambiar" />
            </div>

            <div class="form-actions">
              <button type="submit" class="save-btn" :disabled="saving">
                {{ saving ? 'Guardando...' : 'Guardar Cambios' }}
              </button>
            </div>
            
            <div v-if="successMsg" class="success-msg">{{ successMsg }}</div>
            <div v-if="errorMsg" class="error-msg">{{ errorMsg }}</div>
          </form>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import Sidebar from '@/components/Sidebar.vue'
import PageHeader from '@/components/shared/PageHeader.vue'
import { useAuthStore } from '@/stores/auth'
import { userService } from '@/services/userService'

const authStore = useAuthStore()
const saving = ref(false)
const successMsg = ref('')
const errorMsg = ref('')

const profileForm = ref({
  username: authStore.username || '',
  fullname: '',
  email: '',
  password: ''
})

const saveProfile = async () => {
  saving.value = true
  successMsg.value = ''
  errorMsg.value = ''
  
  try {
    const payload: any = {}
    if (profileForm.value.username && profileForm.value.username !== authStore.username) payload.username = profileForm.value.username
    if (profileForm.value.fullname) payload.fullname = profileForm.value.fullname
    if (profileForm.value.email) payload.email = profileForm.value.email
    if (profileForm.value.password) payload.password = profileForm.value.password

    if (Object.keys(payload).length === 0) {
      errorMsg.value = 'No hay cambios para guardar.'
      saving.value = false
      return
    }

    await userService.updateProfile(authStore.authHeader, payload)
    
    successMsg.value = 'Perfil actualizado correctamente.'
    
    // Si cambió el usuario, podría ser necesario actualizar el store (aunque el token podría quedar inválido si depende del user)
    if (payload.username) {
      authStore.setAuth(payload.username, authStore.roles, authStore.authHeader)
    }
    
    profileForm.value.password = '' // Clear password after save
  } catch (e) {
    console.error('Error actualizando perfil:', e)
    errorMsg.value = 'Error al actualizar el perfil. Revisa tus datos.'
  } finally {
    saving.value = false
  }
}
</script>

<style scoped>
.settings-panel {
  background-color: #1a1a1c;
  border: 1px solid #2a2a2d;
  border-radius: 12px;
  padding: 24px;
  margin-top: 20px;
  max-width: 600px;
}

.profile-form {
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
  color: #a1a1aa;
  font-size: 14px;
  font-weight: 500;
}

.modal-input {
  background-color: #27272a;
  border: 1px solid #3f3f46;
  color: #e4e4e7;
  padding: 10px 14px;
  border-radius: 8px;
  font-size: 15px;
  transition: border-color 0.2s, box-shadow 0.2s;
  outline: none;
}

.modal-input:focus {
  border-color: #8b5cf6;
  box-shadow: 0 0 0 2px rgba(139, 92, 246, 0.2);
}

.hint {
  color: #71717a;
  font-size: 12px;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 10px;
}

.save-btn {
  background-color: #8b5cf6;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
}

.save-btn:hover:not(:disabled) {
  background-color: #7c3aed;
}

.save-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.success-msg {
  color: #34d399;
  background-color: rgba(52, 211, 153, 0.1);
  padding: 12px;
  border-radius: 8px;
  font-size: 14px;
  text-align: center;
}

.error-msg {
  color: #f43f5e;
  background-color: rgba(244, 63, 94, 0.1);
  padding: 12px;
  border-radius: 8px;
  font-size: 14px;
  text-align: center;
}
</style>
