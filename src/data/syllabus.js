export const syllabus = {
  curso: {
    nombre: "Inteligencia de Negocios y Minería de Datos",
    codigo: "3.7.5.21",
    datos_generales: {
      facultad: "Ingenierías y Arquitectura",
      carrera: "Ingeniería de Software",
      semestre: "VII",
      area_formacion: "Ingeniería de software",
      tipo_curso: "Obligatorio",
      creditos: 3,
      prerequisitos: "Ninguno",
      periodo_lectivo: "2025 - I",
      horas_semanales: {
        teoria: 2,
        practica: 2,
      },
    },
    docente: {
      nombre: "Ana Maria Cuadros Valdivia",
      correo: "acuadrosv@ulasalle.edu.pe",
    },
  },
  competencias: {
    competencias_curso: [
      "Conocer las técnicas de la inteligencia de negocios en las organizaciones.",
      "Implementar soluciones informáticas para el tratamiento de grandes volúmenes de datos que ayuden en la toma de decisiones.",
      "Aplicar las técnicas de minería de datos como herramientas para la toma de decisiones.",
    ],
    competencias_perfil_egreso: [
      "Aplicar el conocimiento de ciencias de la computación, de tecnologías de la información, y de las organizaciones, para desarrollar soluciones informáticas.",
      "Aplicar fundamentos matemáticos, principios algorítmicos y teorías de Ciencias de la Computación en la modelación y diseño de soluciones informáticas.",
    ],
    competencias_previas: [
      "El estudiante cuenta con conocimientos matemáticos, algorítmicos y de ciencia de la computación.",
    ],
  },
  sumilla:
    "El curso contempla los siguientes temas: Contexto de las soluciones de Inteligencia de Negocios. Importancia de BI en las organizaciones. Datawarehouse. DataMart. El valor de Inteligencia de Negocios. Metodología de implementación para Inteligencia de Negocios. Análisis de Requerimientos. Modelamiento Dimensional Modelo estrella. Copo de nieve. Casos reales de modelamiento. Procesos de Carga (ETL) Estrategias a seguir para una correcta carga de datos. Optimización y validaciones de información. Explotación de datos. Evolución de funcionalidades de explotación de datos. Alternativas tecnológicas de apoyo a soluciones BI. Alternativas tecnológicas en el mercado. Tableros de control (Dashboards) Características para un buen diseño de Dashboards. Estrategia para la elaboración de Dashboards. Metodología de Gestión de Proyectos para BI. Características y consideraciones para un adecuado proyecto BI. Planificando las iniciativas de Inteligencia de Negocios. Data Mining. Factores críticos de éxito, retorno de inversión y buenas prácticas en proyectos BI. Árboles de decisión, modelos factoriales, modelamiento de ecuaciones estructurales, reglas de asociación, clustering, métodos de casos, visualización de datos.",
  unidades_aprendizaje: [
    {
      numero_unidad: 2,
      titulo: "Análisis Exploratorio de Datos",
      periodo: "10-03-2025 05-04-2025",
      resultado_esperado:
        "Se espera que los alumnos evalúen la escalabilidad y esparcidad de grandes conjuntos de datos al realizar el análisis exploratorio de datos.",
      contenidos_semanales: [
        {
          semana: 1,
          contenido:
            "Introducción a la minería de datos y su relación con el proceso de extracción del conocimiento y sus principales aplicaciones. Qué es análisis de negocios, ciencia de datos.",
        },
        {
          semana: 2,
          contenido: "Data warehouse, data mart, big data. Análisis de datos.",
        },
        {
          semana: 3,
          contenido: "Python: Pandas",
        },
        {
          semana: 4,
          contenido: "ETL, Preprocesamiento de datos.",
        },
      ],
      metodologia: "Clases magistrales, lecturas, exposiciones y elaboración de informes.",
      fuentes_consulta: [
        "M. M. Kantardzic, «Data mining: concepts, models, methods, and algorithms». 2019.",
        "G. Shmueli, P. C. Bruce, P. Gedeck, y N. R. Patel, Data mining for business analytics: concepts, techniques and applications in Python. Hoboken, NJ: John Wiley & Sons, Inc, 2020.",
        "R. Sharda, D. Delen, y E. Turban, Business intelligence, analytics, and data science: a managerial perspective, Fourth edition. New York, NY: Pearson, 2018.",
      ],
    },
    {
      numero_unidad: 3,
      titulo: "Minería de Datos",
      periodo: "07-04-2025 09-05-2025",
      resultado_esperado:
        "Adquirir la capacidad de utilizar apropiadamente las diversas técnicas existentes de minería de datos, en cada una de las fases de extracción de conocimiento.",
      contenidos_semanales: [
        {
          semana: 5,
          contenido: "ETL, Transformación de Datos",
        },
        {
          semana: 6,
          contenido: "Visualización de datos, Dashboards.",
        },
        {
          semana: 7,
          contenido: "Análisis univariado y multivariado.",
        },
        {
          semana: 8,
          contenido: "Proyecto Análisis Exploratorio de Datos.",
        },
        {
          semana: 9,
          contenido: "Examen Parcial",
          fecha_examen: "10-05-2025",
        },
      ],
      metodologia: "Clases magistrales, lecturas, exposiciones y elaboración de informes.",
      fuentes_consulta: [
        "M. M. Kantardzic, «Data mining: concepts, models, methods, and algorithms». 2019.",
        "G. Shmueli, P. C. Bruce, P. Gedeck, y N. R. Patel, Data mining for business analytics: concepts, techniques and applications in Python. Hoboken, NJ: John Wiley & Sons, Inc, 2020.",
      ],
    },
    {
      numero_unidad: 1,
      titulo: "Aplicaciones de Minería de Datos",
      periodo: "12-05-2025 07-06-2025",
      resultado_esperado:
        "Los alumnos conocerán cómo los sistemas de recomendación trabajan, qué problemas se tiene en los conjuntos de datos y cómo estos problemas repercuten en la aplican las medidas de similitud.",
      contenidos_semanales: [
        {
          semana: 10,
          contenido: "Definición y objetivos de los sistemas de recomendación.",
        },
        {
          semana: 11,
          contenido:
            "Técnicas de minería de datos a partir de propuestas de aprendizaje supervisado y no supervisado. k-nn",
        },
        {
          semana: 12,
          contenido: "Filtrado colaborativo. Medidas de distancia en espacios n-dimensional.",
        },
        {
          semana: 13,
          contenido: "Reducción de datos.",
        },
      ],
      metodologia: "Clases magistrales, lecturas, exposiciones y elaboración de informes.",
      fuentes_consulta: [
        "M. M. Kantardzic, «Data mining: concepts, models, methods, and algorithms». 2019.",
        "G. Shmueli, P. C. Bruce, P. Gedeck, y N. R. Patel, Data mining for business analytics: concepts, techniques and applications in Python. Hoboken, NJ: John Wiley & Sons, Inc, 2020.",
        "R. Sharda, D. Delen, y E. Turban, Business intelligence, analytics, and data science: a managerial perspective, Fourth edition. New York, NY: Pearson, 2018.",
      ],
    },
    {
      numero_unidad: 4,
      titulo: "Analítica para Inteligencia de Negocios",
      periodo: "09-06-2025 05-07-2025",
      resultado_esperado: "Los alumnos entenderán la naturaleza de los datos, modelamiento y visualización.",
      contenidos_semanales: [
        {
          semana: 14,
          contenido: "Algoritmos de clustering",
        },
        {
          semana: 15,
          contenido: "Algoritmos de clasificación",
        },
        {
          semana: 16,
          contenido: "Proyecto de Análisis de Negocios",
        },
        {
          semana: 17,
          contenido: "Examen Final",
        },
      ],
      metodologia: "Clases magistrales, lecturas, exposiciones y elaboración de informes.",
      fuentes_consulta: [
        "M. M. Kantardzic, «Data mining: concepts, models, methods, and algorithms». 2019.",
        "G. Shmueli, P. C. Bruce, P. Gedeck, y N. R. Patel, Data mining for business analytics: concepts, techniques and applications in Python. Hoboken, NJ: John Wiley & Sons, Inc, 2020.",
        "R. Sharda, D. Delen, y E. Turban, Business intelligence, analytics, and data science: a managerial perspective, Fourth edition. New York, NY: Pearson, 2018.",
      ],
    },
  ],
  actividades: {
    investigacion_formativa:
      "Los alumnos desarrollarán un proyecto de investigación de análisis visual de datos aplicado a grandes conjuntos de datos multidimensionales.",
  },
  criterios_evaluacion: {
    evaluaciones: [
      {
        nombre: "Evidencia 1",
        descripcion: "Proyecto Análisis Exploratorio de Datos: Pre-procesamiento.",
        fecha: "03-04-2025",
        peso: "El promedio de la evidencia 1 y la evidencia 2 corresponde al 20% de la nota final.",
      },
      {
        nombre: "Evidencia 2",
        descripcion: "Proyecto Análisis Exploratorio en grandes conjuntos de datos.",
        fecha: "24-04-2025",
        peso: "El promedio de la evidencia 1 y la evidencia 2 corresponde al 20% de la nota final.",
      },
      {
        nombre: "EXAMEN PARCIAL",
        descripcion: "Exposición y Entrega por escrito del Proyecto de Análisis Exploratorio de Datos.",
        fecha: "08-05-2025",
        peso: "La evaluación parcial corresponde al 30% de la nota final",
      },
      {
        nombre: "Evidencia 3",
        descripcion: "Proyecto de análisis visual de datos: reducción de dimensionalidad para datos complejos.",
        fecha: "29-05-2025",
        peso: "El promedio de la evidencia 3 y la evidencia 4 corresponde al 20% de la nota final.",
      },
      {
        nombre: "Evidencia 4",
        descripcion:
          "Proyecto de análisis visual de datos: visualización de resultados de algoritmos supervisados y no supervisados.",
        fecha: "19-06-2025",
        peso: "El promedio de la evidencia 3 y la evidencia 4 corresponde al 20% de la nota final.",
      },
      {
        nombre: "EXAMEN FINAL",
        descripcion: "Exposición y Entrega por escrito del Proyecto de análisis visual de datos.",
        fecha: "03-07-2025",
        peso: "La evaluación final corresponde al 30% de la nota final.",
      },
    ],
  },
  meta: {
    fecha_documento: "04-03-2025",
  },
}

export default syllabus
