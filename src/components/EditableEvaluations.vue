<template>
  <div>
    <table class="evaluation-table w-full border-collapse mb-4">
      <thead>
        <tr>
          <th class="border p-2 bg-gray-200 w-1/6">EVALUACIÓN</th>
          <th class="border p-2 bg-gray-200 w-1/3">PESO</th>
          <th class="border p-2 bg-gray-200 w-1/6">FECHA DE CONSOLIDACIÓN</th>
          <th class="border p-2 bg-gray-200 w-1/3">DESCRIPCIÓN DE LA EVALUACIÓN</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(evaluation, index) in evaluations" :key="index" :class="index % 2 === 0 ? 'bg-gray-100' : ''">
          <td class="border p-2">
            <div class="flex justify-between items-center">
              <editable-field
                :value="evaluation.nombre"
                :path="`criterios_evaluacion.evaluaciones[${index}].nombre`"
                @update:value="(path, value) => handleFieldChange(index, 'nombre', value)"
              />
              <button
                v-if="canEdit"
                @click="handleDelete(index)"
                class="text-red-500 opacity-0 group-hover:opacity-100 ml-2"
                aria-label="Eliminar evaluación"
              >
                <trash-2 :size="14" />
              </button>
            </div>
          </td>
          <td class="border p-2">
            <editable-field
              :value="evaluation.peso"
              :path="`criterios_evaluacion.evaluaciones[${index}].peso`"
              :multiline="true"
              @update:value="(path, value) => handleFieldChange(index, 'peso', value)"
            />
          </td>
          <td class="border p-2 text-center">
            <editable-field
              :value="evaluation.fecha"
              :path="`criterios_evaluacion.evaluaciones[${index}].fecha`"
              @update:value="(path, value) => handleFieldChange(index, 'fecha', value)"
            />
          </td>
          <td class="border p-2">
            <editable-field
              :value="evaluation.descripcion"
              :path="`criterios_evaluacion.evaluaciones[${index}].descripcion`"
              :multiline="true"
              @update:value="(path, value) => handleFieldChange(index, 'descripcion', value)"
            />
          </td>
        </tr>
      </tbody>
    </table>

    <button v-if="canEdit" @click="handleAdd" class="flex items-center text-blue-500 text-sm">
      <plus-circle :size="16" class="mr-1" /> Agregar evaluación
    </button>
  </div>
</template>

<script>
import { computed } from 'vue'
import { PlusCircle, Trash2 } from 'lucide-vue-next'
import EditableField from './EditableField.vue'
import { isEditable } from '../config/editable-fields'

export default {
  name: 'EditableEvaluations',
  components: {
    EditableField,
    PlusCircle,
    Trash2
  },
  props: {
    evaluations: {
      type: Array,
      required: true
    }
  },
  emits: ['update:evaluations'],
  setup(props, { emit }) {
    const canEdit = computed(() => isEditable('criterios_evaluacion.evaluaciones'))

    const handleFieldChange = (index, field, value) => {
      const newEvaluations = [...props.evaluations]
      newEvaluations[index] = { ...newEvaluations[index], [field]: value }
      emit('update:evaluations', newEvaluations)
    }

    const handleAdd = () => {
      const newEvaluation = {
        nombre: "Nueva Evaluación",
        descripcion: "Descripción de la evaluación",
        fecha: "DD-MM-YYYY",
        peso: "Porcentaje de la nota final"
      }
      emit('update:evaluations', [...props.evaluations, newEvaluation])
    }

    const handleDelete = (index) => {
      const newEvaluations = props.evaluations.filter((_, i) => i !== index)
      emit('update:evaluations', newEvaluations)
    }

    return {
      canEdit,
      handleFieldChange,
      handleAdd,
      handleDelete
    }
  }
}
</script>
