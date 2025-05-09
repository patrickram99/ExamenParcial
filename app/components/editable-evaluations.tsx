"use client"
import { useState, useEffect } from "react"
import EditableField from "./editable-field"
import { isEditable } from "../config/editable-fields"
import { PlusCircle, Trash2, Calendar, Percent, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { defaultEvaluationSchedule } from "../data/evaluation-schedule"

interface Evaluacion {
  nombre: string
  descripcion: string
  fecha: string
  peso: string
}

interface EditableEvaluationsProps {
  evaluations: Evaluacion[]
  onChange: (evaluations: Evaluacion[]) => void
}

export default function EditableEvaluations({ evaluations, onChange }: EditableEvaluationsProps) {
  const canEdit = isEditable("criterios_evaluacion.evaluaciones")
  const [hasLoadedDefaults, setHasLoadedDefaults] = useState(false)

  // Check if we need to pre-load the default evaluation schedule
  useEffect(() => {
    if (canEdit && evaluations.length === 0 && !hasLoadedDefaults) {
      onChange(defaultEvaluationSchedule)
      setHasLoadedDefaults(true)
    }
  }, [canEdit, evaluations, onChange, hasLoadedDefaults])

  const handleFieldChange = (index: number, field: keyof Evaluacion, value: string) => {
    const newEvaluations = [...evaluations]
    newEvaluations[index] = { ...newEvaluations[index], [field]: value }
    onChange(newEvaluations)
  }

  const handleAdd = () => {
    const newEvaluation = {
      nombre: "Nueva Evaluación",
      descripcion: "Descripción de la evaluación",
      fecha: getFormattedDate(30), // Default to 30 days from now
      peso: "Porcentaje de la nota final",
    }
    onChange([...evaluations, newEvaluation])
  }

  const handleDelete = (index: number) => {
    const newEvaluations = evaluations.filter((_, i) => i !== index)
    onChange(newEvaluations)
  }

  const loadDefaultSchedule = () => {
    onChange(defaultEvaluationSchedule)
    setHasLoadedDefaults(true)
  }

  // Helper function to get a formatted date X days from now
  const getFormattedDate = (daysFromNow: number) => {
    const date = new Date()
    date.setDate(date.getDate() + daysFromNow)
    return `${date.getDate().toString().padStart(2, "0")}-${(date.getMonth() + 1).toString().padStart(2, "0")}-${date.getFullYear()}`
  }

  return (
    <div>
      {canEdit && (
        <div className="mb-4 flex justify-end">
          <Button variant="outline" size="sm" onClick={loadDefaultSchedule} className="flex items-center">
            <RefreshCw size={14} className="mr-1" />
            Cargar fechas y pesos predeterminados
          </Button>
        </div>
      )}

      <table className="evaluation-table w-full border-collapse mb-4">
        <thead>
          <tr>
            <th className="border p-2 bg-gray-200 w-1/6">EVALUACIÓN</th>
            <th className="border p-2 bg-gray-200 w-1/3">PESO</th>
            <th className="border p-2 bg-gray-200 w-1/6">FECHA DE CONSOLIDACIÓN</th>
            <th className="border p-2 bg-gray-200 w-1/3">DESCRIPCIÓN DE LA EVALUACIÓN</th>
          </tr>
        </thead>
        <tbody>
          {evaluations.map((evaluation, index) => (
            <tr key={index} className={index % 2 === 0 ? "bg-gray-100" : ""}>
              <td className="border p-2">
                <div className="flex justify-between items-center">
                  <EditableField
                    value={evaluation.nombre}
                    path={`criterios_evaluacion.evaluaciones[${index}].nombre`}
                    onChange={(_, value) => handleFieldChange(index, "nombre", value)}
                    allowDelete={true}
                  />
                  {canEdit && (
                    <button
                      onClick={() => handleDelete(index)}
                      className="text-red-500 opacity-0 group-hover:opacity-100 ml-2"
                      aria-label="Eliminar evaluación"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              </td>
              <td className="border p-2">
                <div className="flex items-center">
                  <Percent size={14} className="mr-1 text-gray-500 flex-shrink-0" />
                  <EditableField
                    value={evaluation.peso}
                    path={`criterios_evaluacion.evaluaciones[${index}].peso`}
                    onChange={(_, value) => handleFieldChange(index, "peso", value)}
                    multiline
                    allowDelete={true}
                  />
                </div>
              </td>
              <td className="border p-2 text-center">
                <div className="flex items-center justify-center">
                  <Calendar size={14} className="mr-1 text-gray-500 flex-shrink-0" />
                  <EditableField
                    value={evaluation.fecha}
                    path={`criterios_evaluacion.evaluaciones[${index}].fecha`}
                    onChange={(_, value) => handleFieldChange(index, "fecha", value)}
                    allowDelete={true}
                  />
                </div>
              </td>
              <td className="border p-2">
                <EditableField
                  value={evaluation.descripcion}
                  path={`criterios_evaluacion.evaluaciones[${index}].descripcion`}
                  onChange={(_, value) => handleFieldChange(index, "descripcion", value)}
                  multiline
                  allowDelete={true}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {canEdit && (
        <button onClick={handleAdd} className="flex items-center text-blue-500 text-sm">
          <PlusCircle size={16} className="mr-1" /> Agregar evaluación
        </button>
      )}
    </div>
  )
}
