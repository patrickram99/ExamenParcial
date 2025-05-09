"use client"

import type React from "react"

import { useState } from "react"
import { isEditable } from "../config/editable-fields"
import { PlusCircle, Trash2, AlertCircle, Check } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface EditableListProps {
  items: string[]
  path: string
  onChange: (path: string, items: string[]) => void
  formatType?: "apa" | "none"
  placeholder?: string
}

export default function EditableList({
  items,
  path,
  onChange,
  formatType = "none",
  placeholder = "Nuevo elemento",
}: EditableListProps) {
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [currentValue, setCurrentValue] = useState("")
  const [formatError, setFormatError] = useState<string | null>(null)
  const canEdit = isEditable(path)

  const handleEdit = (index: number) => {
    if (!canEdit) return
    setEditingIndex(index)
    setCurrentValue(items[index])
    setFormatError(null)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setCurrentValue(e.target.value)

    // Validate APA format if needed
    if (formatType === "apa") {
      validateApaFormat(e.target.value)
    }
  }

  const validateApaFormat = (value: string) => {
    // Basic APA validation - this is simplified and could be enhanced
    if (value.length > 10) {
      // Check for author and year pattern
      const hasAuthorYear = /[A-Za-z]+,\s*[A-Za-z.]+\s*$$\d{4}$$/.test(value)

      if (!hasAuthorYear) {
        setFormatError("El formato no parece seguir el estilo APA. Ejemplo: Apellido, A. (2023). Título. Editorial.")
      } else {
        setFormatError(null)
      }
    }
  }

  const handleBlur = () => {
    if (editingIndex !== null) {
      // Don't save if there's a format error
      if (formatError && formatType === "apa") {
        return
      }

      const newItems = [...items]
      newItems[editingIndex] = currentValue
      onChange(path, newItems)
      setEditingIndex(null)
      setFormatError(null)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleBlur()
    }
  }

  const handleAdd = () => {
    const newItems = [...items, placeholder]
    onChange(path, newItems)
    // Set the new item to edit mode immediately
    setEditingIndex(newItems.length - 1)
    setCurrentValue(placeholder)
  }

  const handleDelete = (index: number) => {
    const newItems = items.filter((_, i) => i !== index)
    onChange(path, newItems)
  }

  return (
    <div className="space-y-2">
      <ul className="list-disc pl-5 space-y-2">
        {items.length > 0 ? (
          items.map((item, index) => (
            <li key={index} className="flex items-start group">
              {editingIndex === index ? (
                <div className="flex-1 relative">
                  <textarea
                    value={currentValue}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    onKeyDown={handleKeyDown}
                    className={`w-full p-2 border rounded ${formatError ? "border-red-500" : ""}`}
                    rows={3}
                    autoFocus
                  />
                  {formatError && (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="absolute right-2 top-2 text-red-500">
                            <AlertCircle size={16} />
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="max-w-xs">{formatError}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                </div>
              ) : (
                <div className="flex-1 group">
                  <span
                    onClick={() => handleEdit(index)}
                    className={canEdit ? "cursor-pointer hover:bg-gray-100 p-1 rounded block" : ""}
                  >
                    {item}
                  </span>
                </div>
              )}
              {canEdit && (
                <button
                  onClick={() => handleDelete(index)}
                  className="text-red-500 opacity-0 group-hover:opacity-100 ml-2 mt-1 flex-shrink-0"
                  aria-label="Eliminar elemento"
                >
                  <Trash2 size={16} />
                </button>
              )}
            </li>
          ))
        ) : (
          <li className="text-gray-500 italic">No hay elementos. Haga clic en "Agregar elemento" para comenzar.</li>
        )}
      </ul>
      {canEdit && (
        <button onClick={handleAdd} className="flex items-center text-blue-500 text-sm">
          <PlusCircle size={16} className="mr-1" /> Agregar elemento
        </button>
      )}

      {formatType === "apa" && (
        <div className="mt-2 text-xs text-gray-500 bg-gray-50 p-2 rounded">
          <p className="font-medium flex items-center">
            <Check size={14} className="mr-1 text-green-500" />
            Formato APA recomendado:
          </p>
          <p className="mt-1">
            Apellido, A. A. (Año). <em>Título del libro en cursiva</em>. Editorial.
          </p>
          <p>
            Apellido, A. A. (Año). Título del artículo. <em>Nombre de la revista en cursiva, volumen</em>(número),
            páginas.
          </p>
        </div>
      )}
    </div>
  )
}
