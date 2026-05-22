<template>
  <BaseModal :isOpen="isOpen" :title="task ? 'Editar Tarea' : 'Nueva Tarea'" @close="close">
    <template #body>
      <TaskForm
        :task="task"
        :defaultDate="defaultDate"
        :categories="categories"
        :users="users"
        :tags="tags"
        :isPrivileged="isPrivileged"
        :isSubmitting="isSubmitting"
        @submit="handleSubmit"
        @delete="handleDelete"
        @cancel="close"
      />
    </template>
  </BaseModal>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { taskService } from '@/services/taskService'
import { userService } from '@/services/userService'
import { tagService } from '@/services/tagService'
import axios from 'axios'
import BaseModal from '@/components/shared/BaseModal.vue'
import TaskForm from '@/components/tasks/TaskForm.vue'

const props = defineProps<{
  isOpen: boolean
  task?: any
  defaultDate?: string
}>()

const emit = defineEmits(['close', 'saved'])

const authStore = useAuthStore()
const categories = ref<any[]>([])
const users = ref<any[]>([])
const tags = ref<any[]>([])
const isSubmitting = ref(false)

const isPrivileged = computed(() => {
  const rolesUpper = (authStore.roles || '').toUpperCase()
  return rolesUpper.includes('ADMIN') || rolesUpper.includes('GESTOR')
})

const fetchCategories = async () => {
  try {
    const apiUrl = import.meta.env.VITE_API_ENDPOINT || 'http://localhost:8080/to-do-list'
    const response = await axios.get(`${apiUrl}/categories`, {
      headers: { Authorization: authStore.authHeader }
    })
    categories.value = response.data
  } catch (error) {
    console.error('Error fetching categories in TaskModal:', error)
  }
}

const fetchUsers = async () => {
  try {
    if (isPrivileged.value && authStore.authHeader) {
      const response = await userService.getAllUsers(authStore.authHeader)
      users.value = response.data.content ? response.data.content : response.data
    }
  } catch (error) {
    console.error('Error fetching users in TaskModal:', error)
  }
}

const fetchTags = async () => {
  try {
    const response = await tagService.getAllTags(authStore.authHeader)
    tags.value = response.data
  } catch (error) {
    console.error('Error fetching tags in TaskModal:', error)
  }
}

onMounted(() => {
  fetchCategories()
  fetchUsers()
  fetchTags()
})

const close = () => {
  emit('close')
}

const handleSubmit = async (dto: any) => {
  isSubmitting.value = true
  try {
    if (props.task) {
      await taskService.updateTask(authStore.authHeader, props.task.id, dto)
    } else {
      await taskService.createTask(authStore.authHeader, dto)
    }
    emit('saved')
    close()
  } catch (error) {
    console.error('Error saving task:', error)
  } finally {
    isSubmitting.value = false
  }
}

const handleDelete = async () => {
  isSubmitting.value = true
  try {
    await taskService.deleteTask(authStore.authHeader, props.task.id)
    emit('saved')
    close()
  } catch (error) {
    console.error('Error deleting task:', error)
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style scoped>
</style>
