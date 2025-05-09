"use client"
import { useState } from "react"
import EditableField from "./editable-field"
import EditableList from "./editable-list"
import { isEditable } from "../config/editable-fields"
import { PlusCircle, Trash2, Calendar, BookOpen, Presentation } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { methodologyOptions } from "../data/methodology-options"

interface ContentoSemanal {
  semana: number
  contenido: string
  fecha_examen?: string
}

interface UnidadAprendizaje {
  numero_unidad: number
  titulo: string
  periodo: string
  resultado_esperado: string
  contenidos_semanales: ContentoSemanal[]
  metodologia: string
  fuentes_consulta: string[]
}

interface EditableUnitProps {
  unit: UnidadAprendizaje
  index: number
  onChange: (index: number, unit: UnidadAprendizaje) => void
  onDelete: (index: number) => void
}

export default function EditableUnit({ unit, index, onChange, onDelete }: EditableUnitProps) {
  const canEdit = isEditable("unidades_aprendizaje")
  const [showMethodologySelector, setShowMethodologySelector] = useState(false)

  const handleFieldChange = (field: keyof UnidadAprendizaje, value: string) => {
    onChange(index, { ...unit, [field]: value })
  }

  const handleContentChange = (weekIndex: number, content: string) => {
    const newContents = [...unit.contenidos_semanales]
    newContents[weekIndex] = { ...newContents[weekIndex], contenido: content }
    onChange(index, { ...unit, contenidos_semanales: newContents })
  }

  const handleAddWeek = () => {
    const lastWeek =
      unit.contenidos_semanales.length > 0 ? Math.max(...unit.contenidos_semanales.map((w) => w.semana)) : 0

    const newWeek = {
      semana: lastWeek + 1,
      contenido: "Nuevo contenido",
    }

    // Auto-complete week 9 as midterm exam (F04)
    if (newWeek.semana === 9) {
      newWeek.contenido = "Examen Parcial"
      newWeek.fecha_examen = getFormattedDate(30) // Set a date 30 days from now
    }

    onChange(index, {
      ...unit,
      contenidos_semanales: [...unit.contenidos_semanales, newWeek],
    })
  }

  const handleDeleteWeek = (weekIndex: number) => {
    const newContents = unit.contenidos_semanales.filter((_, i) => i !== weekIndex)
    // Renumber weeks
    const renumberedContents = newContents.map((content, i) => ({
      ...content,
      semana: i + 1,
    }))
    onChange(index, { ...unit, contenidos_semanales: renumberedContents })
  }

  const handleSourcesChange = (path: string, sources: string[]) => {
    onChange(index, { ...unit, fuentes_consulta: sources })
  }

  const handleMethodologyChange = (value: string) => {
    onChange(index, { ...unit, metodologia: value })
    setShowMethodologySelector(false)
  }

  // Helper function to get a formatted date X days from now
  const getFormattedDate = (daysFromNow: number) => {
    const date = new Date()
    date.setDate(date.getDate() + daysFromNow)
    return `${date.getDate().toString().padStart(2, "0")}-${(date.getMonth() + 1).toString().padStart(2, "0")}-${date.getFullYear()}`
  }

  // Helper function to format exam date
  const handleExamDateChange = (weekIndex: number, date: string) => {
    const newContents = [...unit.contenidos_semanales]
    newContents[weekIndex] = { ...newContents[weekIndex], fecha_examen: date }
    onChange(index, { ...unit, contenidos_semanales: newContents })
  }

  return (
    <div className="border rounded-lg mb-6 bg-white shadow-sm overflow-hidden">
      <table className="unit-table w-full border-collapse">
        <thead>
          <tr>
            <th className="border p-2 bg-gray-200 w-1/6">UNIDAD {unit.numero_unidad}</th>
            <th className="border p-2 bg-gray-200 w-2/6 text-left">
              <span className="unit-title">
                <EditableField
                  value={unit.titulo}
                  path={`unidades_aprendizaje[${index}].titulo`}
                  onChange={(_, value) => handleFieldChange("titulo", value)}
                  allowDelete={true}
                  placeholder="Título de la unidad"
                />
              </span>
            </th>
            <th className="border p-2 bg-gray-200 w-1/6">SEMANA</th>
            <th className="border p-2 bg-gray-200 w-2/6">CONTENIDOS ESPECÍFICOS</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border p-2 align-top" rowSpan={unit.contenidos_semanales.length || 1}>
              <div className="font-bold mb-2">Periodo:</div>
              <EditableField
                value={unit.periodo}
                path={`unidades_aprendizaje[${index}].periodo`}
                onChange={(_, value) => handleFieldChange("periodo", value)}
                placeholder="DD-MM-YYYY DD-MM-YYYY"
                allowDelete={true}
              />
            </td>
            <td className="border p-2 align-top" rowSpan={unit.contenidos_semanales.length || 1}>
              <div className="font-bold mb-2">Resultado esperado:</div>
              <EditableField
                value={unit.resultado_esperado}
                path={`unidades_aprendizaje[${index}].resultado_esperado`}
                onChange={(_, value) => handleFieldChange("resultado_esperado", value)}
                multiline
                allowDelete={true}
                placeholder="Describa el resultado esperado de esta unidad"
              />
            </td>
            {unit.contenidos_semanales.length > 0 ? (
              <>
                <td className="border p-2 text-center">{unit.contenidos_semanales[0].semana}</td>
                <td className="border p-2">
                  <div className="flex flex-col">
                    <EditableField
                      value={unit.contenidos_semanales[0].contenido}
                      path={`unidades_aprendizaje[${index}].contenidos_semanales[0].contenido`}
                      onChange={(_, value) => handleContentChange(0, value)}
                      multiline
                      allowDelete={true}
                      placeholder="Contenido de la semana"
                    />
                    {unit.contenidos_semanales[0].fecha_examen ? (
                      <div className="mt-2 flex items-center">
                        <Calendar size={14} className="mr-1 text-gray-500" />
                        <EditableField
                          value={unit.contenidos_semanales[0].fecha_examen}
                          path={`unidades_aprendizaje[${index}].contenidos_semanales[0].fecha_examen`}
                          onChange={(_, value) => handleExamDateChange(0, value)}
                          placeholder="DD-MM-YYYY"
                          allowDelete={true}
                        />
                      </div>
                    ) : (
                      canEdit &&
                      unit.contenidos_semanales[0].contenido.toLowerCase().includes("examen") && (
                        <button
                          onClick={() => handleExamDateChange(0, getFormattedDate(30))}
                          className="mt-2 text-blue-500 text-xs flex items-center"
                        >
                          <Calendar size={14} className="mr-1" />
                          Agregar fecha de examen
                        </button>
                      )
                    )}
                    {canEdit && (
                      <button
                        onClick={() => handleDeleteWeek(0)}
                        className="self-end mt-2 text-red-500 text-xs flex items-center"
                        aria-label="Eliminar semana"
                      >
                        <Trash2 size={14} className="mr-1" /> Eliminar semana
                      </button>
                    )}
                  </div>
                </td>
              </>
            ) : (
              <td colSpan={2} className="border p-2 text-center text-gray-500">
                No hay semanas definidas. Haga clic en "Agregar semana" para comenzar.
              </td>
            )}
          </tr>
          {unit.contenidos_semanales.slice(1).map((content, weekIndex) => (
            <tr key={weekIndex + 1}>
              <td className="border p-2 text-center">{content.semana}</td>
              <td className="border p-2">
                <div className="flex flex-col">
                  <EditableField
                    value={content.contenido}
                    path={`unidades_aprendizaje[${index}].contenidos_semanales[${weekIndex + 1}].contenido`}
                    onChange={(_, value) => handleContentChange(weekIndex + 1, value)}
                    multiline
                    allowDelete={true}
                    placeholder="Contenido de la semana"
                  />
                  {content.fecha_examen ? (
                    <div className="mt-2 flex items-center">
                      <Calendar size={14} className="mr-1 text-gray-500" />
                      <EditableField
                        value={content.fecha_examen}
                        path={`unidades_aprendizaje[${index}].contenidos_semanales[${weekIndex + 1}].fecha_examen`}
                        onChange={(_, value) => handleExamDateChange(weekIndex + 1, value)}
                        placeholder="DD-MM-YYYY"
                        allowDelete={true}
                      />
                    </div>
                  ) : (
                    canEdit &&
                    content.contenido.toLowerCase().includes("examen") && (
                      <button
                        onClick={() => handleExamDateChange(weekIndex + 1, getFormattedDate(30))}
                        className="mt-2 text-blue-500 text-xs flex items-center"
                      >
                        <Calendar size={14} className="mr-1" />
                        Agregar fecha de examen
                      </button>
                    )
                  )}
                  {canEdit && (
                    <button
                      onClick={() => handleDeleteWeek(weekIndex + 1)}
                      className="self-end mt-2 text-red-500 text-xs flex items-center"
                      aria-label="Eliminar semana"
                    >
                      <Trash2 size={14} className="mr-1" /> Eliminar semana
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
          <tr>
            <td colSpan={4} className="border p-2">
              <div className="flex justify-between items-center mb-2">
                <div className="font-bold flex items-center">
                  <Presentation size={16} className="mr-1" /> Metodología
                </div>
                {canEdit && (
                  <Popover open={showMethodologySelector} onOpenChange={setShowMethodologySelector}>
                    <PopoverTrigger asChild>
                      <Button variant="outline" size="sm">
                        Seleccionar metodología
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80">
                      <div className="space-y-2">
                        <h4 className="font-medium">Metodologías comunes</h4>
                        <div className="grid gap-2">
                          {methodologyOptions.map((option) => (
                            <Button
                              key={option.id}
                              variant="ghost"
                              className="justify-start text-left"
                              onClick={() => handleMethodologyChange(option.text)}
                            >
                              {option.text}
                            </Button>
                          ))}
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>
                )}
              </div>
              <EditableField
                value={unit.metodologia}
                path={`unidades_aprendizaje[${index}].metodologia`}
                onChange={(_, value) => handleFieldChange("metodologia", value)}
                multiline
                allowDelete={true}
                placeholder="Describa la metodología utilizada en esta unidad"
              />
            </td>
          </tr>
          <tr>
            <td colSpan={4} className="border p-2">
              <div className="font-bold flex items-center mb-2">
                <BookOpen size={16} className="mr-1" /> Fuentes de consulta documental (formato APA)
              </div>
              <EditableList
                items={unit.fuentes_consulta}
                path={`unidades_aprendizaje[${index}].fuentes_consulta`}
                onChange={handleSourcesChange}
                formatType="apa"
                placeholder="Ingrese una referencia en formato APA"
              />
            </td>
          </tr>
        </tbody>
      </table>

      {canEdit && (
        <div className="p-3 flex justify-between bg-gray-50 border-t">
          <button onClick={handleAddWeek} className="flex items-center text-blue-500 text-sm">
            <PlusCircle size={16} className="mr-1" /> Agregar semana
          </button>
          <button
            onClick={() => onDelete(index)}
            className="text-red-500 flex items-center text-sm"
            aria-label="Eliminar unidad"
          >
            <Trash2 size={16} className="mr-1" /> Eliminar unidad
          </button>
        </div>
      )}
    </div>
  )
}
