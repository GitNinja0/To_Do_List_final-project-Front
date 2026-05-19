<template>
  <div class="filters-bar">
    <div class="search-box-custom">
      <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2"
        fill="none" stroke-linecap="round" stroke-linejoin="round" class="search-icon">
        <circle cx="11" cy="11" r="8"></circle>
        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
      </svg>
      <input
        type="text"
        placeholder="Buscar usuarios por nombre o email..."
        :value="searchQuery"
        @input="$emit('update:searchQuery', ($event.target as HTMLInputElement).value)"
      />
    </div>

    <div class="dropdown-wrapper">
      <select
        :value="roleFilter"
        @change="$emit('update:roleFilter', ($event.target as HTMLSelectElement).value)"
        class="dropdown-select"
      >
        <option value="">Todos los Roles</option>
        <option value="ADMIN">Administrador</option>
        <option value="GESTOR">Gestor</option>
        <option value="USER">Usuario</option>
      </select>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  searchQuery: string
  roleFilter: string
}>()

defineEmits<{
  (e: 'update:searchQuery', value: string): void
  (e: 'update:roleFilter', value: string): void
}>()
</script>

<style scoped>
.filters-bar {
  display: flex;
  gap: 16px;
  width: 100%;
  margin-bottom: 20px;
}

.search-box-custom {
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

.search-box-custom input {
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

.search-box-custom input:focus { border-color: #8b5cf6; }

.dropdown-wrapper { display: flex; align-items: stretch; }

.dropdown-select {
  padding: 0 16px;
  background-color: #1a1a1c;
  border: 1px solid #2a2a2d;
  border-radius: 8px;
  color: #a1a1aa;
  font-size: 14px;
  outline: none;
  cursor: pointer;
  min-width: 160px;
  height: 100%;
}

.dropdown-select:focus { border-color: #8b5cf6; color: #ffffff; }

@media (max-width: 600px) {
  .filters-bar   { flex-direction: column; }
  .dropdown-wrapper { width: 100%; }
  .dropdown-select  { width: 100%; min-width: unset; height: 44px; }
}
</style>
