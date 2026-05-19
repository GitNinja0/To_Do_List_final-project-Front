<template>
  <div class="stat-card">
    <div class="stat-header">
      <div class="stat-icon" :class="iconColor">
        <slot name="icon" />
      </div>
    </div>
    <div class="stat-value">{{ value }}</div>
    <div class="stat-label">{{ label }}</div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  value: number
  label: string
  iconColor: string
}>()
</script>

<style scoped>
.stat-card {
  background-color: #1e1e20;
  border-radius: 16px;
  padding: 24px;
  display: flex;
  flex-direction: column;
}

.stat-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 16px;
}

.stat-icon {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.stat-icon.purple     { background-color: rgba(139, 92, 246, 0.1); color: #8b5cf6; }
.stat-icon.red        { background-color: rgba(244, 63, 94, 0.1);  color: #f43f5e; }
.stat-icon.purple-alt { background-color: rgba(168, 85, 247, 0.1); color: #a855f7; }
.stat-icon.orange     { background-color: rgba(249, 115, 22, 0.1); color: #f97316; }

.stat-value {
  font-size: 32px;
  font-weight: 700;
  margin-bottom: 8px;
}

.stat-label {
  color: #a0a0a5;
  font-size: 14px;
}

@media (max-width: 480px) {
  .stat-card  { padding: 16px; }
  .stat-value { font-size: 24px; }
}
</style>
