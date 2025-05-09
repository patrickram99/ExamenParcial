<template>
  <span>
    <span v-if="!isEditing" 
      @click="canEdit && startEditing()" 
      :class="canEdit ? 'cursor-pointer hover:bg-gray-100 p-1 rounded' : ''"
      :data-editable="canEdit ? 'true' : 'false'">
      {{ modelValue }}
      <span v-if="canEdit" class="ml-2 text-blue-500 text-xs editable-indicator">(Editable)</span>
    </span>
    <textarea
      v-else-if="multiline"
      v-model="currentValue"
      @blur="finishEditing"
      class="w-full p-2 border rounded"
      rows="3"
      ref="inputRef"
    ></textarea>
    <input
      v-else
      type="text"
      v-model="currentValue"
      @blur="finishEditing"
      @keydown.enter="finishEditing"
      class="w-full p-2 border rounded"
      ref="inputRef"
    />
  </span>
</template>

<script>
import { ref, watch, nextTick, onMounted } from 'vue'
import { isEditable } from '../config/editable-fields'

export default {
  name: 'EditableField',
  props: {
    value: {
      type: String,
      required: true
    },
    path: {
      type: String,
      required: true
    },
    multiline: {
      type: Boolean,
      default: false
    }
  },
  emits: ['update:value'],
  setup(props, { emit }) {
    const isEditing = ref(false)
    const currentValue = ref(props.value)
    const canEdit = isEditable(props.path)
    const inputRef = ref(null)
    
    // Update currentValue when props.value changes
    watch(() => props.value, (newValue) => {
      currentValue.value = newValue
    })
    
    const startEditing = () => {
      if (!canEdit) return
      isEditing.value = true
      // Focus the input after the DOM updates
      nextTick(() => {
        if (inputRef.value) {
          inputRef.value.focus()
        }
      })
    }
    
    const finishEditing = () => {
      isEditing.value = false
      if (currentValue.value !== props.value) {
        emit('update:value', props.path, currentValue.value)
      }
    }
    
    return {
      isEditing,
      currentValue,
      canEdit,
      inputRef,
      startEditing,
      finishEditing,
      modelValue: props.value
    }
  }
}
</script>
