<template>
  <div class="layout">
    <Sidebar />
    <main class="main-content">
      <div class="content-container">
        <PageHeader title="Categorías y Etiquetas" subtitle="Gestiona las agrupaciones y palabras clave para organizar tus tareas." />

        <div class="management-grid">
          <!-- Panel Categorías -->
          <ItemPanel
            title="Categorías"
            :canAdd="isPrivileged"
            :showReadOnly="!isPrivileged"
            @add="openCategoryModal()"
          >
            <template #icon>
              <svg viewBox="0 0 24 24" width="20" height="20" stroke="#8b5cf6" stroke-width="2" fill="none" class="panel-icon">
                <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
              </svg>
            </template>

            <LoadingState v-if="loadingCategories" message="Cargando categorías..." />
            <EmptyState v-else-if="categories.length === 0" message="No hay categorías creadas." />
            <div v-else class="items-list">
              <ItemRow
                v-for="cat in categories"
                :key="cat.id"
                :showActions="isPrivileged"
                @edit="openCategoryModal(cat)"
                @delete="confirmDeleteCategory(cat)"
              >
                <template #badge>
                  <span class="category-dot"></span>
                  <span class="item-name">{{ cat.name }}</span>
                </template>
              </ItemRow>
            </div>
          </ItemPanel>

          <!-- Panel Etiquetas -->
          <ItemPanel title="Etiquetas" :canAdd="true" addBtnClass="tag-btn" @add="openTagModal()">
            <template #icon>
              <svg viewBox="0 0 24 24" width="20" height="20" stroke="#34d399" stroke-width="2" fill="none" class="panel-icon">
                <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path>
                <line x1="7" y1="7" x2="7.01" y2="7"></line>
              </svg>
            </template>

            <LoadingState v-if="loadingTags" message="Cargando etiquetas..." />
            <EmptyState v-else-if="tags.length === 0" message="No hay etiquetas creadas." />
            <div v-else class="items-list">
              <ItemRow
                v-for="tag in tags"
                :key="tag.id"
                :showActions="true"
                @edit="openTagModal(tag)"
                @delete="confirmDeleteTag(tag)"
              >
                <template #badge>
                  <span class="tag-badge"># {{ tag.name }}</span>
                </template>
              </ItemRow>
            </div>
          </ItemPanel>
        </div>
      </div>
    </main>

    <!-- Modal Categoría -->
    <transition name="modal-fade">
      <div v-if="showCategoryModal" class="modal-overlay" @click.self="showCategoryModal = false">
        <div class="modal-card">
          <header class="modal-header">
            <h3>{{ editingCategory ? 'Editar Categoría' : 'Nueva Categoría' }}</h3>
            <button class="close-btn" @click="showCategoryModal = false">&times;</button>
          </header>
          <form @submit.prevent="submitCategory">
            <div class="modal-body">
              <div class="form-group">
                <label for="category-name">Nombre de la Categoría</label>
                <input type="text" id="category-name" v-model="categoryForm.name"
                  placeholder="Ej. Trabajo, Universidad, Personal..." class="modal-input" required ref="categoryInputRef" />
              </div>
            </div>
            <footer class="modal-footer">
              <button type="button" class="modal-btn cancel" @click="showCategoryModal = false">Cancelar</button>
              <button type="submit" class="modal-btn save" :disabled="savingCategory">
                {{ savingCategory ? 'Guardando...' : 'Guardar' }}
              </button>
            </footer>
          </form>
        </div>
      </div>
    </transition>

    <!-- Modal Etiqueta -->
    <transition name="modal-fade">
      <div v-if="showTagModal" class="modal-overlay" @click.self="showTagModal = false">
        <div class="modal-card">
          <header class="modal-header">
            <h3>{{ editingTag ? 'Editar Etiqueta' : 'Nueva Etiqueta' }}</h3>
            <button class="close-btn" @click="showTagModal = false">&times;</button>
          </header>
          <form @submit.prevent="submitTag">
            <div class="modal-body">
              <div class="form-group">
                <label for="tag-name">Nombre de la Etiqueta</label>
                <input type="text" id="tag-name" v-model="tagForm.name"
                  placeholder="Ej. Urgente, Frontend, Reunión..." class="modal-input" required ref="tagInputRef" />
              </div>
            </div>
            <footer class="modal-footer">
              <button type="button" class="modal-btn cancel" @click="showTagModal = false">Cancelar</button>
              <button type="submit" class="modal-btn save tag-btn" :disabled="savingTag">
                {{ savingTag ? 'Guardando...' : 'Guardar' }}
              </button>
            </footer>
          </form>
        </div>
      </div>
    </transition>

    <ConfirmModal
      :isOpen="showConfirmDeleteCategoryModal"
      title="Eliminar Categoría"
      :message="`¿Estás seguro de que deseas eliminar permanentemente la categoría '${categoryToDelete?.name}'?`"
      confirmText="Eliminar"
      @confirm="handleDeleteCategory"
      @close="showConfirmDeleteCategoryModal = false"
    />

    <ConfirmModal
      :isOpen="showConfirmDeleteTagModal"
      title="Eliminar Etiqueta"
      :message="`¿Estás seguro de que deseas eliminar permanentemente la etiqueta '${tagToDelete?.name}'?`"
      confirmText="Eliminar"
      @confirm="handleDeleteTag"
      @close="showConfirmDeleteTagModal = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from 'vue'
import Sidebar from '@/components/Sidebar.vue'
import PageHeader from '@/components/shared/PageHeader.vue'
import LoadingState from '@/components/shared/LoadingState.vue'
import EmptyState from '@/components/shared/EmptyState.vue'
import ItemPanel from '@/components/categories/ItemPanel.vue'
import ItemRow from '@/components/categories/ItemRow.vue'
import ConfirmModal from '@/components/shared/ConfirmModal.vue'
import { useAuthStore } from '@/stores/auth'
import { categoryService } from '@/services/categoryService'
import { tagService } from '@/services/tagService'

const authStore = useAuthStore()
const categories = ref<any[]>([])
const tags = ref<any[]>([])
const loadingCategories = ref(true)
const loadingTags = ref(true)

const showCategoryModal = ref(false)
const editingCategory = ref<any>(null)
const categoryForm = ref({ name: '' })
const savingCategory = ref(false)
const categoryInputRef = ref<HTMLInputElement | null>(null)

const showTagModal = ref(false)
const editingTag = ref<any>(null)
const tagForm = ref({ name: '' })
const savingTag = ref(false)
const tagInputRef = ref<HTMLInputElement | null>(null)

const showConfirmDeleteCategoryModal = ref(false)
const categoryToDelete = ref<any>(null)
const showConfirmDeleteTagModal = ref(false)
const tagToDelete = ref<any>(null)

const isPrivileged = computed(() => {
  const r = (authStore.roles || '').toUpperCase()
  return r.includes('ADMIN') || r.includes('GESTOR')
})

const fetchCategories = async () => {
  loadingCategories.value = true
  try {
    const response = await categoryService.getAllCategories(authStore.authHeader)
    categories.value = response.data
  } catch (e) { console.error('Error fetching categories:', e) }
  finally { loadingCategories.value = false }
}

const fetchTags = async () => {
  loadingTags.value = true
  try {
    const response = await tagService.getAllTags(authStore.authHeader)
    tags.value = response.data
  } catch (e) { console.error('Error fetching tags:', e) }
  finally { loadingTags.value = false }
}

const openCategoryModal = (cat?: any) => {
  editingCategory.value = cat || null
  categoryForm.value = { name: cat?.name || '' }
  showCategoryModal.value = true
  nextTick(() => categoryInputRef.value?.focus())
}

const submitCategory = async () => {
  savingCategory.value = true
  try {
    if (editingCategory.value) {
      await categoryService.updateCategory(authStore.authHeader, editingCategory.value.id, categoryForm.value)
    } else {
      await categoryService.createCategory(authStore.authHeader, categoryForm.value)
    }
    showCategoryModal.value = false
    await fetchCategories()
  } catch (e) {
    console.error('Error saving category:', e)
    alert('Error al guardar la categoría. Asegúrate de que no exista previamente.')
  } finally { savingCategory.value = false }
}

const confirmDeleteCategory = (cat: any) => {
  categoryToDelete.value = cat
  showConfirmDeleteCategoryModal.value = true
}

const handleDeleteCategory = async () => {
  if (!categoryToDelete.value) return
  try {
    await categoryService.deleteCategory(authStore.authHeader, categoryToDelete.value.id)
    await fetchCategories()
  } catch (e) {
    alert('No se pudo eliminar la categoría. Es posible que esté asociada a tareas existentes.')
  } finally {
    showConfirmDeleteCategoryModal.value = false
    categoryToDelete.value = null
  }
}

const openTagModal = (tag?: any) => {
  editingTag.value = tag || null
  tagForm.value = { name: tag?.name || '' }
  showTagModal.value = true
  nextTick(() => tagInputRef.value?.focus())
}

const submitTag = async () => {
  savingTag.value = true
  try {
    if (editingTag.value) {
      await tagService.updateTag(authStore.authHeader, editingTag.value.id, tagForm.value)
    } else {
      await tagService.createTag(authStore.authHeader, tagForm.value)
    }
    showTagModal.value = false
    await fetchTags()
  } catch (e) {
    console.error('Error saving tag:', e)
    alert('Error al guardar la etiqueta. Asegúrate de que no exista previamente.')
  } finally { savingTag.value = false }
}

const confirmDeleteTag = (tag: any) => {
  tagToDelete.value = tag
  showConfirmDeleteTagModal.value = true
}

const handleDeleteTag = async () => {
  if (!tagToDelete.value) return
  try {
    await tagService.deleteTag(authStore.authHeader, tagToDelete.value.id)
    await fetchTags()
  } catch (e) {
    alert('Error al eliminar la etiqueta.')
  } finally {
    showConfirmDeleteTagModal.value = false
    tagToDelete.value = null
  }
}

onMounted(() => { fetchCategories(); fetchTags() })
</script>

<style scoped>
.management-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
}

.items-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 8px;
}

.category-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: linear-gradient(135deg, #8b5cf6, #a855f7);
  flex-shrink: 0;
}

.item-name {
  font-size: 14px;
  font-weight: 500;
  color: #e4e4e7;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.tag-badge {
  font-size: 13px;
  font-weight: 600;
  color: #34d399;
  background-color: rgba(52, 211, 153, 0.1);
  padding: 3px 10px;
  border-radius: 20px;
  border: 1px solid rgba(52, 211, 153, 0.2);
  font-family: 'Courier New', monospace;
}

.panel-icon { flex-shrink: 0; }

@media (max-width: 768px) {
  .management-grid { grid-template-columns: 1fr; }
}
</style>
