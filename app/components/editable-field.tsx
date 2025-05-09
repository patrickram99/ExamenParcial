"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { isEditable } from "../config/editable-fields"
import { Trash2 } from "lucide-react"

interface EditableFieldProps {
  value: string
  path: string
  onChange: (path: string, value: string) => void
  multiline?: boolean
  placeholder?: string
  allowDelete?: boolean
}

export default function EditableField({
  value,
  path,
  onChange,
  multiline = false,
  placeholder = "",
  allowDelete = false,
}: EditableFieldProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [currentValue, setCurrentValue] = useState(value)
  const canEdit = isEditable(path)

  useEffect(() => {
    setCurrentValue(value)
  }, [value])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setCurrentValue(e.target.value)
  }

  const handleBlur = () => {
    setIsEditing(false)
    if (currentValue !== value) {
      onChange(path, currentValue)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !multiline) {
      setIsEditing(false)
      if (currentValue !== value) {
        onChange(path, currentValue)
      }
    }
  }

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation()
    setCurrentValue("")
    onChange(path, "")
  }

  if (!canEdit) {
    return <span>{value || placeholder}</span>
  }

  if (isEditing) {
    if (multiline) {
      return (
        <textarea
          value={currentValue}
          onChange={handleChange}
          onBlur={handleBlur}
          className="w-full p-2 border rounded"
          rows={3}
          placeholder={placeholder}
          autoFocus
        />
      )
    }

    return (
      <input
        type="text"
        value={currentValue}
        onChange={handleChange}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        className="w-full p-2 border rounded"
        placeholder={placeholder}
        autoFocus
      />
    )
  }

  return (
    <div className="group inline-flex items-center">
      <span
        onClick={() => canEdit && setIsEditing(true)}
        className={cn("cursor-pointer hover:bg-gray-100 p-1 rounded min-h-[1.5rem]", !value && "text-gray-400 italic")}
        data-editable={canEdit ? "true" : "false"}
      >
        {value || placeholder}
        {canEdit && <span className="ml-2 text-blue-500 text-xs editable-indicator">(Editable)</span>}
      </span>
      {allowDelete && canEdit && value && (
        <button
          onClick={handleClear}
          className="text-red-500 opacity-0 group-hover:opacity-100 ml-1"
          aria-label="Borrar texto"
        >
          <Trash2 size={14} />
        </button>
      )}
    </div>
  )
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ")
}
