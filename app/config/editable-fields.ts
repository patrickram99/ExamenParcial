// This file controls which fields can be edited in the syllabus
// Set to true to make a field editable, false to make it read-only

export const editableFields = {
  // Course information
  "curso.nombre": true,
  "curso.codigo": false,
  "curso.datos_generales.facultad": false,
  "curso.datos_generales.carrera": false,
  "curso.datos_generales.semestre": true,
  "curso.datos_generales.area_formacion": false,
  "curso.datos_generales.tipo_curso": false,
  "curso.datos_generales.creditos": false,
  "curso.datos_generales.prerequisitos": true,
  "curso.datos_generales.periodo_lectivo": true,
  "curso.datos_generales.horas_semanales.teoria": true,
  "curso.datos_generales.horas_semanales.practica": true,
  "curso.docente.nombre": true,
  "curso.docente.correo": true,

  // Competencies
  "competencias.competencias_curso": true,
  "competencias.competencias_perfil_egreso": false,
  "competencias.competencias_previas": true,

  // Summary
  sumilla: true,

  // Learning units
  unidades_aprendizaje: true,

  // Activities
  "actividades.investigacion_formativa": true,

  // Evaluation criteria
  "criterios_evaluacion.evaluaciones": true,

  // Metadata
  "meta.fecha_documento": true,
}

// Helper function to check if a field is editable
export function isEditable(path: string): boolean {
  return editableFields[path as keyof typeof editableFields] || false
}
