<template>
  <main class="min-h-screen bg-gray-50">
    <div class="container mx-auto px-4 py-8">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold">Editor de Sílabo</h1>
        <pdf-generator content-id="syllabus-content" />
      </div>

      <div id="syllabus-content" class="bg-white p-6 rounded-lg shadow-md">
        <logo />

        <h1 class="text-2xl font-bold text-center mb-6">
          SÍLABO DEL CURSO DE
          <editable-field
            :value="syllabus.curso.nombre"
            path="curso.nombre"
            @update:value="handleFieldChange"
          />
        </h1>

        <!-- General Information -->
        <section class="mb-8">
          <h2 class="text-xl font-bold mb-4 border-b pb-2">I. DATOS GENERALES</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p>
                <strong>Facultad:</strong> {{ syllabus.curso.datos_generales.facultad }}
              </p>
              <p>
                <strong>Carrera:</strong> {{ syllabus.curso.datos_generales.carrera }}
              </p>
              <p>
                <strong>Semestre:</strong>
                <editable-field
                  :value="syllabus.curso.datos_generales.semestre"
                  path="curso.datos_generales.semestre"
                  @update:value="handleFieldChange"
                />
              </p>
              <p>
                <strong>Área de Formación:</strong> {{ syllabus.curso.datos_generales.area_formacion }}
              </p>
              <p>
                <strong>Tipo de Curso:</strong> {{ syllabus.curso.datos_generales.tipo_curso }}
              </p>
            </div>
            <div>
              <p>
                <strong>Créditos:</strong> {{ syllabus.curso.datos_generales.creditos }}
              </p>
              <p>
                <strong>Prerequisitos:</strong>
                <editable-field
                  :value="syllabus.curso.datos_generales.prerequisitos"
                  path="curso.datos_generales.prerequisitos"
                  @update:value="handleFieldChange"
                />
              </p>
              <p>
                <strong>Periodo Lectivo:</strong>
                <editable-field
                  :value="syllabus.curso.datos_generales.periodo_lectivo"
                  path="curso.datos_generales.periodo_lectivo"
                  @update:value="handleFieldChange"
                />
              </p>
              <p>
                <strong>Horas Semanales:</strong> Teoría:
                <editable-field
                  :value="String(syllabus.curso.datos_generales.horas_semanales.teoria)"
                  path="curso.datos_generales.horas_semanales.teoria"
                  @update:value="handleFieldChange"
                />
                , Práctica:
                <editable-field
                  :value="String(syllabus.curso.datos_generales.horas_semanales.practica)"
                  path="curso.datos_generales.horas_semanales.practica"
                  @update:value="handleFieldChange"
                />
              </p>
              <p>
                <strong>Código del Curso:</strong> {{ syllabus.curso.codigo }}
              </p>
            </div>
          </div>
          <div class="mt-4">
            <p>
              <strong>Docente:</strong>
              <editable-field
                :value="syllabus.curso.docente.nombre"
                path="curso.docente.nombre"
                @update:value="handleFieldChange"
              />
            </p>
            <p>
              <strong>Correo:</strong>
              <editable-field
                :value="syllabus.curso.docente.correo"
                path="curso.docente.correo"
                @update:value="handleFieldChange"
              />
            </p>
          </div>
        </section>

        <!-- Competencies -->
        <section class="mb-8">
          <h2 class="text-xl font-bold mb-4 border-b pb-2">II. COMPETENCIA DEL CURSO</h2>
          <p class="mb-2">Al culminar el curso el estudiante debe:</p>
          <editable-list
            :items="syllabus.competencias.competencias_curso"
            path="competencias.competencias_curso"
            @update:items="handleListChange"
          />
        </section>

        <section class="mb-8">
          <h2 class="text-xl font-bold mb-4 border-b pb-2">
            III. COMPETENCIA DEL PERFIL DE EGRESO AL QUE CONTRIBUYE
          </h2>
          <p class="mb-2">
            El curso de Inteligencia de Negocios y Minería de Datos contribuye al logro de la siguiente competencia
            prevista en el perfil del egresado de la carrera de Ingeniería de Software que dice:
          </p>
          <editable-list
            :items="syllabus.competencias.competencias_perfil_egreso"
            path="competencias.competencias_perfil_egreso"
            @update:items="handleListChange"
          />
        </section>

        <section class="mb-8">
          <h2 class="text-xl font-bold mb-4 border-b pb-2">IV. COMPETENCIAS PREVIAS NECESARIAS</h2>
          <editable-list
            :items="syllabus.competencias.competencias_previas"
            path="competencias.competencias_previas"
            @update:items="handleListChange"
          />
        </section>

        <!-- Summary -->
        <section class="mb-8">
          <h2 class="text-xl font-bold mb-4 border-b pb-2">V. SUMILLA</h2>
          <editable-field
            :value="syllabus.sumilla"
            path="sumilla"
            :multiline="true"
            @update:value="handleFieldChange"
          />
        </section>

        <!-- Learning Units -->
        <section class="mb-8">
          <h2 class="text-xl font-bold mb-4 border-b pb-2">VI. UNIDADES DE APRENDIZAJE</h2>
          <editable-unit
            v-for="unit in sortedUnits"
            :key="unit.numero_unidad"
            :unit="unit"
            :index="findUnitIndex(unit.numero_unidad)"
            @update:unit="handleUnitChange"
            @delete:unit="handleDeleteUnit"
          />
          <button
            v-if="isEditable('unidades_aprendizaje')"
            @click="handleAddUnit"
            class="flex items-center text-blue-500"
          >
            <plus-circle class="mr-1" :size="20" /> Agregar unidad
          </button>
        </section>

        <!-- Activities -->
        <section class="mb-8">
          <h2 class="text-xl font-bold mb-4 border-b pb-2">VII. ACTIVIDADES</h2>
          <div class="mb-4">
            <h3 class="font-bold mb-2">Investigación Formativa</h3>
            <editable-field
              :value="syllabus.actividades.investigacion_formativa"
              path="actividades.investigacion_formativa"
              :multiline="true"
              @update:value="handleFieldChange"
            />
          </div>
        </section>

        <!-- Evaluation Criteria -->
        <section class="mb-8">
          <h2 class="text-xl font-bold mb-4 border-b pb-2">VIII. CRITERIOS DE EVALUACIÓN</h2>
          <editable-evaluations
            :evaluations="syllabus.criterios_evaluacion.evaluaciones"
            @update:evaluations="handleEvaluationsChange"
          />
        </section>

        <!-- Signature -->
        <section class="mt-12">
          <div class="grid grid-cols-2 gap-4 border-t border-b py-4">
            <div>
              <p>
                <strong>Fecha:</strong>
                <editable-field
                  :value="syllabus.meta.fecha_documento"
                  path="meta.fecha_documento"
                  @update:value="handleFieldChange"
                />
              </p>
            </div>
            <div>
              <p>
                <strong>Firma del docente:</strong>
                <button 
                  @click="$refs.signatureInput.click()" 
                  class="ml-2 px-2 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600"
                >
                  Subir firma
                </button>
                <input 
                  ref="signatureInput"
                  type="file" 
                  accept="image/*" 
                  class="hidden" 
                  @change="handleSignatureUpload"
                />
              </p>
              <div class="h-16 flex items-center">
                <img 
                  :src="signatureImage" 
                  alt="Firma del docente" 
                  class="h-12 object-contain" 
                />
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  </main>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { PlusCircle } from 'lucide-vue-next'
import Logo from './components/Logo.vue'
import EditableField from './components/EditableField.vue'
import EditableList from './components/EditableList.vue'
import EditableUnit from './components/EditableUnit.vue'
import EditableEvaluations from './components/EditableEvaluations.vue'
import PdfGenerator from './components/PdfGenerator.vue'
import syllabusData from './data/syllabus'
import { isEditable } from './config/editable-fields'

export default {
  name: 'App',
  components: {
    Logo,
    EditableField,
    EditableList,
    EditableUnit,
    EditableEvaluations,
    PdfGenerator,
    PlusCircle
  },
  setup() {
    const syllabus = ref(JSON.parse(JSON.stringify(syllabusData)))
    const signatureInput = ref(null)
    const signatureImage = ref('/firma-docente.png')
    

    const sortedUnits = computed(() => {
      return [...syllabus.value.unidades_aprendizaje].sort((a, b) => a.numero_unidad - b.numero_unidad)
    })

    const findUnitIndex = (unitNumber) => {
      return syllabus.value.unidades_aprendizaje.findIndex(u => u.numero_unidad === unitNumber)
    }

    const handleFieldChange = (path, value) => {
      const parts = path.split('.')
      let current = syllabus.value

      // Navigate to the nested property
      for (let i = 0; i < parts.length - 1; i++) {
        const part = parts[i]
        if (part.includes('[')) {
          const [arrayName, indexStr] = part.split('[')
          const index = parseInt(indexStr.replace(']', ''))
          current = current[arrayName][index]
        } else {
          current = current[part]
        }
      }

      // Update the value
      const lastPart = parts[parts.length - 1]
      current[lastPart] = value
    }

    const handleListChange = (path, items) => {
      const parts = path.split('.')
      let current = syllabus.value

      // Navigate to the nested property
      for (let i = 0; i < parts.length - 1; i++) {
        current = current[parts[i]]
      }

      // Update the value
      const lastPart = parts[parts.length - 1]
      current[lastPart] = items
    }

    const handleUnitChange = (index, unit) => {
      const newUnits = [...syllabus.value.unidades_aprendizaje]
      newUnits[index] = unit
      syllabus.value.unidades_aprendizaje = newUnits
    }

    const handleAddUnit = () => {
      const maxUnitNumber = Math.max(
        ...syllabus.value.unidades_aprendizaje.map(unit => unit.numero_unidad),
        0
      )

      const newUnit = {
        numero_unidad: maxUnitNumber + 1,
        titulo: "Nueva Unidad",
        periodo: "DD-MM-YYYY DD-MM-YYYY",
        resultado_esperado: "Resultado esperado de la unidad",
        contenidos_semanales: [
          {
            semana: 1,
            contenido: "Contenido de la semana"
          }
        ],
        metodologia: "Clases magistrales, lecturas, exposiciones y elaboración de informes.",
        fuentes_consulta: [
          "Nueva fuente de consulta"
        ]
      }

      syllabus.value.unidades_aprendizaje.push(newUnit)
    }

    const handleDeleteUnit = (index) => {
      syllabus.value.unidades_aprendizaje = syllabus.value.unidades_aprendizaje.filter((_, i) => i !== index)
    }

    const handleEvaluationsChange = (evaluations) => {
      syllabus.value.criterios_evaluacion.evaluaciones = evaluations
    }

    const handleSignatureUpload = (event) => {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          signatureImage.value = e.target.result;
        };
        reader.readAsDataURL(file);
      }
    }

    return {
      syllabus,
      sortedUnits,
      findUnitIndex,
      handleFieldChange,
      handleListChange,
      handleUnitChange,
      handleAddUnit,
      handleDeleteUnit,
      handleEvaluationsChange,
      isEditable,
      signatureImage,
      handleSignatureUpload
    }
  }
}
</script>

<style>
@import './assets/styles.css';
</style>
