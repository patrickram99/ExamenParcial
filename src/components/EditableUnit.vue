<template>
  <div class="border rounded-lg mb-6 bg-white shadow-sm overflow-hidden">
    <table class="unit-table w-full border-collapse">
      <thead>
        <tr>
          <th class="border p-2 bg-gray-200 w-1/6">UNIDAD {{ unit.numero_unidad }}</th>
          <th class="border p-2 bg-gray-200 w-2/6 text-left">
            <span class="unit-title">
              <editable-field
                :value="unit.titulo"
                :path="`unidades_aprendizaje[${index}].titulo`"
                @update:value="(path, value) => handleFieldChange('titulo', value)"
              />
            </span>
          </th>
          <th class="border p-2 bg-gray-200 w-1/6">SEMANA</th>
          <th class="border p-2 bg-gray-200 w-2/6">CONTENIDOS ESPECÍFICOS</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td class="border p-2 align-top" :rowspan="unit.contenidos_semanales.length">
            <div class="font-bold">{{ unit.periodo }}</div>
          </td>
          <td class="border p-2 align-top" :rowspan="unit.contenidos_semanales.length">
            <editable-field
              :value="unit.resultado_esperado"
              :path="`unidades_aprendizaje[${index}].resultado_esperado`"
              :multiline="true"
              @update:value="(path, value) => handleFieldChange('resultado_esperado', value)"
            />
          </td>
          <td v-if="unit.contenidos_semanales.length > 0" class="border p-2 text-center">
            {{ unit.contenidos_semanales[0].semana }}
          </td>
          <td v-if="unit.contenidos_semanales.length > 0" class="border p-2">
            <editable-field
              :value="unit.contenidos_semanales[0].contenido"
              :path="`unidades_aprendizaje[${index}].contenidos_semanales[0].contenido`"
              :multiline="true"
              @update:value="(path, value) => handleContentChange(0, value)"
            />
            <div v-if="unit.contenidos_semanales[0].fecha_examen" class="mt-1 text-sm text-gray-600">
              Fecha: {{ unit.contenidos_semanales[0].fecha_examen }}
            </div>
          </td>
        </tr>
        <tr v-for="(content, weekIndex) in unit.contenidos_semanales.slice(1)" :key="weekIndex + 1">
          <td class="border p-2 text-center">{{ content.semana }}</td>
          <td class="border p-2">
            <editable-field
              :value="content.contenido"
              :path="`unidades_aprendizaje[${index}].contenidos_semanales[${weekIndex + 1}].contenido`"
              :multiline="true"
              @update:value="(path, value) => handleContentChange(weekIndex + 1, value)"
            />
            <div v-if="content.fecha_examen" class="mt-1 text-sm text-gray-600">
              Fecha: {{ content.fecha_examen }}
            </div>
          </td>
        </tr>
        <tr>
          <td colspan="4" class="border p-2">
            <div class="font-bold">Metodología</div>
            <editable-field
              :value="unit.metodologia"
              :path="`unidades_aprendizaje[${index}].metodologia`"
              @update:value="(path, value) => handleFieldChange('metodologia', value)"
            />
          </td>
        </tr>
        <tr>
          <td colspan="4" class="border p-2">
            <div class="font-bold">Fuentes de consulta documental</div>
            <editable-list
              :items="unit.fuentes_consulta"
              :path="`unidades_aprendizaje[${index}].fuentes_consulta`"
              @update:items="handleSourcesChange"
            />
          </td>
        </tr>
      </tbody>
    </table>

    <div v-if="canEdit" class="p-3 flex justify-between bg-gray-50 border-t">
      <button @click="handleAddWeek" class="flex items-center text-blue-500 text-sm">
        <plus-circle :size="16" class="mr-1" /> Agregar semana
      </button>
      <button
        @click="$emit('delete:unit', index)"
        class="text-red-500 flex items-center text-sm"
        aria-label="Eliminar unidad"
      >
        <trash-2 :size="16" class="mr-1" /> Eliminar unidad
      </button>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue'
import { PlusCircle, Trash2 } from 'lucide-vue-next'
import EditableField from './EditableField.vue'
import EditableList from './EditableList.vue'
import { isEditable } from '../config/editable-fields'

export default {
  name: 'EditableUnit',
  components: {
    EditableField,
    EditableList,
    PlusCircle,
    Trash2
  },
  props: {
    unit: {
      type: Object,
      required: true
    },
    index: {
      type: Number,
      required: true
    }
  },
  emits: ['update:unit', 'delete:unit'],
  setup(props, { emit }) {
    const canEdit = computed(() => isEditable('unidades_aprendizaje'))

    const handleFieldChange = (field, value) => {
      emit('update:unit', props.index, { ...props.unit, [field]: value })
    }

    const handleContentChange = (weekIndex, content) => {
      const newContents = [...props.unit.contenidos_semanales]
      newContents[weekIndex] = { ...newContents[weekIndex], contenido: content }
      emit('update:unit', props.index, { ...props.unit, contenidos_semanales: newContents })
    }

    const handleAddWeek = () => {
      const newWeek = {
        semana: props.unit.contenidos_semanales.length + 1,
        contenido: "Nuevo contenido"
      }
      emit('update:unit', props.index, {
        ...props.unit,
        contenidos_semanales: [...props.unit.contenidos_semanales, newWeek]
      })
    }

    const handleDeleteWeek = (weekIndex) => {
      const newContents = props.unit.contenidos_semanales.filter((_, i) => i !== weekIndex)
      // Renumber weeks
      const renumberedContents = newContents.map((content, i) => ({
        ...content,
        semana: i + 1
      }))
      emit('update:unit', props.index, { ...props.unit, contenidos_semanales: renumberedContents })
    }

    const handleSourcesChange = (path, sources) => {
      emit('update:unit', props.index, { ...props.unit, fuentes_consulta: sources })
    }

    return {
      canEdit,
      handleFieldChange,
      handleContentChange,
      handleAddWeek,
      handleDeleteWeek,
      handleSourcesChange
    }
  }
}
</script>
