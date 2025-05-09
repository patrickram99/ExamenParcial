"use client"

import type React from "react"

import { useState, useRef } from "react"
import { useSearchParams } from "next/navigation"
import Logo from "./components/logo"
import EditableField from "./components/editable-field"
import EditableList from "./components/editable-list"
import EditableUnit from "./components/editable-unit"
import EditableEvaluations from "./components/editable-evaluations"
import PdfGenerator from "./components/pdf-generator"
import syllabusData from "./data/syllabus"
import { PlusCircle, Upload } from "lucide-react"
import { isEditable } from "./config/editable-fields"
import { Button } from "@/components/ui/button"

export default function Home() {
  const [syllabus, setSyllabus] = useState(syllabusData)
  const [signatureImage, setSignatureImage] = useState<string>("/firma-docente.png")
  const fileInputRef = useRef<HTMLInputElement>(null)
  const searchParams = useSearchParams()

  // Sort units by number
  const sortedUnits = [...syllabus.unidades_aprendizaje].sort((a, b) => a.numero_unidad - b.numero_unidad)

  const handleFieldChange = (path: string, value: string) => {
    const parts = path.split(".")
    const newSyllabus = { ...syllabus }

    // Navigate to the nested property
    let current: any = newSyllabus
    for (let i = 0; i < parts.length - 1; i++) {
      const part = parts[i]
      if (part.includes("[")) {
        const [arrayName, indexStr] = part.split("[")
        const index = Number.parseInt(indexStr.replace("]", ""))
        current = current[arrayName][index]
      } else {
        current = current[part]
      }
    }

    // Update the value
    const lastPart = parts[parts.length - 1]
    current[lastPart] = value

    setSyllabus(newSyllabus)
  }

  const handleListChange = (path: string, items: string[]) => {
    const parts = path.split(".")
    const newSyllabus = { ...syllabus }

    // Navigate to the nested property
    let current: any = newSyllabus
    for (let i = 0; i < parts.length - 1; i++) {
      current = current[parts[i]]
    }

    // Update the value
    const lastPart = parts[parts.length - 1]
    current[lastPart] = items

    setSyllabus(newSyllabus)
  }

  const handleUnitChange = (index: number, unit: any) => {
    const newUnits = [...syllabus.unidades_aprendizaje]
    newUnits[index] = unit
    setSyllabus({ ...syllabus, unidades_aprendizaje: newUnits })
  }

  const handleAddUnit = () => {
    const maxUnitNumber = Math.max(...syllabus.unidades_aprendizaje.map((unit) => unit.numero_unidad), 0)

    const newUnit = {
      numero_unidad: maxUnitNumber + 1,
      titulo: "Nueva Unidad",
      periodo: "DD-MM-YYYY DD-MM-YYYY",
      resultado_esperado: "Resultado esperado de la unidad",
      contenidos_semanales: [
        {
          semana: 1,
          contenido: "Contenido de la semana",
        },
      ],
      metodologia: "Clases magistrales, lecturas, exposiciones y elaboración de informes.",
      fuentes_consulta: ["Nueva fuente de consulta"],
    }

    setSyllabus({
      ...syllabus,
      unidades_aprendizaje: [...syllabus.unidades_aprendizaje, newUnit],
    })
  }

  const handleDeleteUnit = (index: number) => {
    const newUnits = syllabus.unidades_aprendizaje.filter((_, i) => i !== index)
    setSyllabus({ ...syllabus, unidades_aprendizaje: newUnits })
  }

  const handleEvaluationsChange = (evaluations: any[]) => {
    setSyllabus({
      ...syllabus,
      criterios_evaluacion: {
        ...syllabus.criterios_evaluacion,
        evaluaciones: evaluations,
      },
    })
  }

  // Handle signature upload (F08)
  const handleSignatureUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Check if the file is an image (JPG or PNG)
    if (!file.type.match("image/jpeg") && !file.type.match("image/png")) {
      alert("Por favor, seleccione un archivo de imagen JPG o PNG.")
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      if (e.target?.result) {
        setSignatureImage(e.target.result as string)
      }
    }
    reader.readAsDataURL(file)
  }

  const triggerSignatureUpload = () => {
    fileInputRef.current?.click()
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Editor de Sílabo</h1>
          <PdfGenerator contentId="syllabus-content" />
        </div>

        <div id="syllabus-content" className="bg-white p-6 rounded-lg shadow-md">
          <Logo />

          <h1 className="text-2xl font-bold text-center mb-6">
            SÍLABO DEL CURSO DE{" "}
            <EditableField
              value={syllabus.curso.nombre}
              path="curso.nombre"
              onChange={handleFieldChange}
              allowDelete={true}
            />
          </h1>

          {/* General Information */}
          <section className="mb-8">
            <h2 className="text-xl font-bold mb-4 border-b pb-2">I. DATOS GENERALES</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p>
                  <strong>Facultad:</strong> {syllabus.curso.datos_generales.facultad}
                </p>
                <p>
                  <strong>Carrera:</strong> {syllabus.curso.datos_generales.carrera}
                </p>
                <p>
                  <strong>Semestre:</strong>{" "}
                  <EditableField
                    value={syllabus.curso.datos_generales.semestre}
                    path="curso.datos_generales.semestre"
                    onChange={handleFieldChange}
                    allowDelete={true}
                  />
                </p>
                <p>
                  <strong>Área de Formación:</strong> {syllabus.curso.datos_generales.area_formacion}
                </p>
                <p>
                  <strong>Tipo de Curso:</strong> {syllabus.curso.datos_generales.tipo_curso}
                </p>
              </div>
              <div>
                <p>
                  <strong>Créditos:</strong> {syllabus.curso.datos_generales.creditos}
                </p>
                <p>
                  <strong>Prerequisitos:</strong>{" "}
                  <EditableField
                    value={syllabus.curso.datos_generales.prerequisitos}
                    path="curso.datos_generales.prerequisitos"
                    onChange={handleFieldChange}
                    allowDelete={true}
                  />
                </p>
                <p>
                  <strong>Periodo Lectivo:</strong>{" "}
                  <EditableField
                    value={syllabus.curso.datos_generales.periodo_lectivo}
                    path="curso.datos_generales.periodo_lectivo"
                    onChange={handleFieldChange}
                    allowDelete={true}
                  />
                </p>
                <p>
                  <strong>Horas Semanales:</strong> Teoría:{" "}
                  <EditableField
                    value={syllabus.curso.datos_generales.horas_semanales.teoria.toString()}
                    path="curso.datos_generales.horas_semanales.teoria"
                    onChange={handleFieldChange}
                    allowDelete={true}
                  />
                  , Práctica:{" "}
                  <EditableField
                    value={syllabus.curso.datos_generales.horas_semanales.practica.toString()}
                    path="curso.datos_generales.horas_semanales.practica"
                    onChange={handleFieldChange}
                    allowDelete={true}
                  />
                </p>
                <p>
                  <strong>Código del Curso:</strong> {syllabus.curso.codigo}
                </p>
              </div>
            </div>
            <div className="mt-4">
              <p>
                <strong>Docente:</strong>{" "}
                <EditableField
                  value={syllabus.curso.docente.nombre}
                  path="curso.docente.nombre"
                  onChange={handleFieldChange}
                  allowDelete={true}
                />
              </p>
              <p>
                <strong>Correo:</strong>{" "}
                <EditableField
                  value={syllabus.curso.docente.correo}
                  path="curso.docente.correo"
                  onChange={handleFieldChange}
                  allowDelete={true}
                />
              </p>
            </div>
          </section>

          {/* Competencies */}
          <section className="mb-8">
            <h2 className="text-xl font-bold mb-4 border-b pb-2">II. COMPETENCIA DEL CURSO</h2>
            <p className="mb-2">Al culminar el curso el estudiante debe:</p>
            <EditableList
              items={syllabus.competencias.competencias_curso}
              path="competencias.competencias_curso"
              onChange={handleListChange}
            />
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-bold mb-4 border-b pb-2">
              III. COMPETENCIA DEL PERFIL DE EGRESO AL QUE CONTRIBUYE
            </h2>
            <p className="mb-2">
              El curso de Inteligencia de Negocios y Minería de Datos contribuye al logro de la siguiente competencia
              prevista en el perfil del egresado de la carrera de Ingeniería de Software que dice:
            </p>
            <EditableList
              items={syllabus.competencias.competencias_perfil_egreso}
              path="competencias.competencias_perfil_egreso"
              onChange={handleListChange}
            />
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-bold mb-4 border-b pb-2">IV. COMPETENCIAS PREVIAS NECESARIAS</h2>
            <EditableList
              items={syllabus.competencias.competencias_previas}
              path="competencias.competencias_previas"
              onChange={handleListChange}
            />
          </section>

          {/* Summary */}
          <section className="mb-8">
            <h2 className="text-xl font-bold mb-4 border-b pb-2">V. SUMILLA</h2>
            <EditableField
              value={syllabus.sumilla}
              path="sumilla"
              onChange={handleFieldChange}
              multiline
              allowDelete={true}
            />
          </section>

          {/* Learning Units */}
          <section className="mb-8">
            <h2 className="text-xl font-bold mb-4 border-b pb-2">VI. UNIDADES DE APRENDIZAJE</h2>
            {sortedUnits.map((unit, index) => (
              <EditableUnit
                key={unit.numero_unidad}
                unit={unit}
                index={syllabus.unidades_aprendizaje.findIndex((u) => u.numero_unidad === unit.numero_unidad)}
                onChange={handleUnitChange}
                onDelete={handleDeleteUnit}
              />
            ))}
            {isEditable("unidades_aprendizaje") && (
              <button onClick={handleAddUnit} className="flex items-center text-blue-500">
                <PlusCircle size={20} className="mr-1" /> Agregar unidad
              </button>
            )}
          </section>

          {/* Activities */}
          <section className="mb-8">
            <h2 className="text-xl font-bold mb-4 border-b pb-2">VII. ACTIVIDADES</h2>
            <div className="mb-4">
              <h3 className="font-bold mb-2">Investigación Formativa</h3>
              <EditableField
                value={syllabus.actividades.investigacion_formativa}
                path="actividades.investigacion_formativa"
                onChange={handleFieldChange}
                multiline
                allowDelete={true}
              />
            </div>
          </section>

          {/* Evaluation Criteria */}
          <section className="mb-8">
            <h2 className="text-xl font-bold mb-4 border-b pb-2">VIII. CRITERIOS DE EVALUACIÓN</h2>
            <EditableEvaluations
              evaluations={syllabus.criterios_evaluacion.evaluaciones}
              onChange={handleEvaluationsChange}
            />
          </section>

          {/* Signature */}
          <section className="mt-12">
            <div className="grid grid-cols-2 gap-4 border-t border-b py-4">
              <div>
                <p>
                  <strong>Fecha:</strong>{" "}
                  <EditableField
                    value={syllabus.meta.fecha_documento}
                    path="meta.fecha_documento"
                    onChange={handleFieldChange}
                    allowDelete={true}
                  />
                </p>
              </div>
              <div>
                <p className="flex items-center">
                  <strong>Firma del docente:</strong>
                  {isEditable("curso.docente.nombre") && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={triggerSignatureUpload}
                      className="ml-2 flex items-center"
                    >
                      <Upload size={14} className="mr-1" />
                      Subir firma
                    </Button>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png"
                    className="hidden"
                    onChange={handleSignatureUpload}
                  />
                </p>
                <div className="h-16 flex items-center">
                  <img
                    src={signatureImage || "/placeholder.svg"}
                    alt="Firma del docente"
                    className="h-12 object-contain"
                  />
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  )
}
