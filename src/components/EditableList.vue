<template>
  <div class="space-y-2">
    <ul class="list-disc pl-5 space-y-2">
      <li v-for="(item, index) in items" :key="index" class="flex items-start group">
        <div v-if="editingIndex === index" class="flex-1">
          <textarea
            v-model="currentValue"
            @blur="handleBlur"
            @keydown.enter="handleBlur"
            class="w-full p-2 border rounded"
            rows="2"
            ref="textareaRef"
          ></textarea>
        </div>
        <div v-else class="flex-1">
          <span
            @click="handleEdit(index)"
            :class="canEdit ? 'cursor-pointer hover:bg-gray-100 p-1 rounded' : ''"
          >
            {{ item }}
          </span>
        </div>
        <button
          v-if="canEdit"
          @click="handleDelete(index)"
          class="text-red-500 opacity-0 group-hover:opacity-100 ml-2"
          aria-label="Eliminar elemento"
        >
          <trash-2 :size="16" />
        </button>
      </li>
    </ul>
    <button v-if="canEdit" @click="handleAdd" class="flex items-center text-blue-500 text-sm">
      <plus-circle :size="16" class="mr-1" /> Agregar elemento
    </button>
  </div>
</template>

<script>
import { ref, nextTick } from 'vue'
import { PlusCircle, Trash2 } from 'lucide-vue-next'
import { isEditable } from '../config/editable-fields'

export default {
  name: 'EditableList',
  components: {
    PlusCircle,
    Trash2
  },
  props: {
    items: {
      type: Array,
      required: true
    },
    path: {
      type: String,
      required: true
    }
  },
  emits: ['update:items'],
  setup(props, { emit }) {
    const editingIndex = ref(null)
    const currentValue = ref('')
    const textareaRef = ref(null)
    const canEdit = isEditable(props.path)

    const handleEdit = (index) => {
      if (!canEdit) return
      editingIndex.value = index
      currentValue.value = props.items[index]
      
      // Focus the textarea after the DOM updates
      nextTick(() => {
        if (textareaRef.value) {
          textareaRef.value.focus()
        }
      })
    }

    const handleBlur = () => {
      if (editingIndex.value !== null) {
        const newItems = [...props.items]
        newItems[editingIndex.value] = currentValue.value
        emit('update:items', props.path, newItems)
        editingIndex.value = null
      }
    }

    const handleAdd = () => {
      const newItems = [...props.items, 'Nuevo elemento']
      emit('update:items', props.path, newItems)
    }

    const handleDelete = (index) => {
      const newItems = props.items.filter((_, i) => i !== index)
      emit('update:items', props.path, newItems)
    }

    return {
      editingIndex,
      currentValue,
      textareaRef,
      canEdit,
      handleEdit,
      handleBlur,
      handleAdd,
      handleDelete
    }
  }
}
</script>
