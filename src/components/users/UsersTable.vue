<template>
  <div class="users-list-container">
    <LoadingState v-if="loading" message="Cargando usuarios..." />
    <div v-else-if="users.length === 0" class="empty-state">
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
        <UserRow
          v-for="user in users"
          :key="user.id"
          :user="user"
          @edit="$emit('edit', $event)"
          @delete="$emit('delete', $event)"
        />
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import LoadingState from '@/components/shared/LoadingState.vue'
import UserRow from './UserRow.vue'

defineProps<{
  users: any[]
  loading: boolean
}>()

defineEmits<{
  (e: 'edit', user: any): void
  (e: 'delete', user: any): void
}>()
</script>

<style scoped>
.users-list-container {
  background-color: #1a1a1c;
  border: 1px solid #2a2a2d;
  border-radius: 12px;
  overflow: hidden;
}

.users-table {
  width: 100%;
  border-collapse: collapse;
}

.users-table thead tr {
  background-color: #161618;
  border-bottom: 1px solid #2a2a2d;
}

.users-table th {
  padding: 14px 20px;
  text-align: left;
  font-size: 11px;
  font-weight: 700;
  color: #71717a;
  letter-spacing: 0.07em;
  text-transform: uppercase;
}

.actions-header { text-align: right; }

@media (max-width: 640px) {
  .users-table th:nth-child(2) { display: none; }
}
</style>
