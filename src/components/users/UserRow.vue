<template>
  <tr class="user-row">
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
    <td><span class="user-email">{{ user.email }}</span></td>
    <td>
      <span class="role-badge" :class="getRoleClass(user)">{{ getRoleLabel(user) }}</span>
    </td>
    <td>
      <div class="actions-cell">
        <button class="action-btn edit" @click="$emit('edit', user)" title="Editar">
          <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none"
            stroke-linecap="round" stroke-linejoin="round">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
            <path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4Z"></path>
          </svg>
        </button>
        <button class="action-btn delete" @click="$emit('delete', user)" title="Eliminar">
          <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none"
            stroke-linecap="round" stroke-linejoin="round">
            <polyline points="3 6 5 6 21 6"></polyline>
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
            <line x1="10" y1="11" x2="10" y2="17"></line>
            <line x1="14" y1="11" x2="14" y2="17"></line>
          </svg>
        </button>
      </div>
    </td>
  </tr>
</template>

<script setup lang="ts">
defineProps<{ user: any }>()
defineEmits<{
  (e: 'edit', user: any): void
  (e: 'delete', user: any): void
}>()

const getPrimaryRole = (user: any): string => {
  const names = (user.roles || []).map((r: any) => (r.name || '').toUpperCase())
  if (names.some((n: string) => n.includes('ADMIN'))) return 'ADMIN'
  if (names.some((n: string) => n.includes('GESTOR') || n.includes('MANAGER'))) return 'GESTOR'
  return 'USER'
}

const getRoleLabel = (user: any) => {
  const r = getPrimaryRole(user)
  return r === 'ADMIN' ? 'Administrador' : r === 'GESTOR' ? 'Gestor' : 'Usuario'
}
const getRoleClass = (user: any) => {
  const r = getPrimaryRole(user)
  return r === 'ADMIN' ? 'badge-admin' : r === 'GESTOR' ? 'badge-manager' : 'badge-user'
}

const getInitials = (user: any) => {
  const name = user.fullname || user.username || 'U'
  const parts = name.trim().split(' ')
  return parts.length > 1 ? (parts[0][0] + parts[1][0]).toUpperCase() : name.substring(0, 2).toUpperCase()
}

const getAvatarStyle = (user: any) => {
  const name = user.fullname || user.username || ''
  let hash = 0
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash)
  const h = Math.abs(hash % 360)
  return { backgroundColor: `hsl(${h}, 50%, 25%)`, color: `hsl(${h}, 80%, 75%)` }
}
</script>

<style scoped>
.user-row {
  border-bottom: 1px solid #1e1e20;
  transition: background-color 0.15s;
}
.user-row:last-child { border-bottom: none; }
.user-row:hover { background-color: #1f1f22; }

.user-row td {
  padding: 16px 20px;
  vertical-align: middle;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.user-avatar-circle {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  font-weight: 700;
  flex-shrink: 0;
}

.user-name-details {
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.user-fullname { font-size: 14px; font-weight: 600; color: #e4e4e7; }
.user-username { font-size: 12px; color: #71717a; }
.user-email    { font-size: 13px; color: #a1a1aa; }

.role-badge {
  font-size: 11px;
  font-weight: 700;
  padding: 3px 10px;
  border-radius: 20px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
.badge-admin   { background-color: rgba(139, 92, 246, 0.15); color: #8b5cf6; }
.badge-manager { background-color: rgba(59, 130, 246, 0.15); color: #60a5fa; }
.badge-user    { background-color: rgba(161, 161, 170, 0.1);  color: #a1a1aa; }

.actions-cell {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}

.action-btn {
  width: 32px;
  height: 32px;
  border: 1px solid #2a2a2d;
  border-radius: 6px;
  background-color: transparent;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s;
}
.action-btn.edit:hover  { background-color: rgba(139, 92, 246, 0.1); border-color: #8b5cf6; color: #8b5cf6; }
.action-btn.delete:hover{ background-color: rgba(239, 68, 68, 0.1);  border-color: #ef4444; color: #ef4444; }

.action-btn svg { color: #71717a; transition: color 0.15s; }
.action-btn.edit:hover svg  { color: #8b5cf6; }
.action-btn.delete:hover svg{ color: #ef4444; }

@media (max-width: 640px) {
  .user-row td:nth-child(2) { display: none; }
}
</style>
