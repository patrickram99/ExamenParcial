"use client"

import { useState } from "react"
import { jsPDF } from "jspdf"
import autoTable from "jspdf-autotable"
import { Download, Loader2 } from "lucide-react"

interface PdfGeneratorProps {
  contentId: string
}

export default function PdfGenerator({ contentId }: PdfGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false)

  const generatePDF = async () => {
    try {
      setIsGenerating(true)

      const content = document.getElementById(contentId)
      if (!content) {
        throw new Error("Content element not found")
      }

      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      })

      pdf.setTextColor(0, 0, 0) // Default text color black

      pdf.setProperties({
        title: "Sílabo del Curso",
        subject: "Sílabo",
        author: "Universidad La Salle",
        creator: "Generador de Sílabos",
      })

      const pageWidth = pdf.internal.pageSize.getWidth()
      const pageHeight = pdf.internal.pageSize.getHeight()
      const margin = 10
      const usableWidth = pageWidth - 2 * margin
      let y = margin

      pdf.setFontSize(16)
      pdf.setFont("helvetica", "bold")
      pdf.text("UNIVERSIDAD LA SALLE", pageWidth / 2, y + 10, { align: "center" })
      y += 15

      const courseNameElement = content.querySelector("h1")
      if (courseNameElement) {
        const courseName = courseNameElement.textContent?.replace("(Editable)", "").trim() || "SÍLABO DEL CURSO"
        pdf.setFontSize(14)
        pdf.text(courseName, pageWidth / 2, y, { align: "center" })
        y += 10
      }

      const addSectionTitle = (title: string) => {
        if (y > pageHeight - margin - 20) {
          pdf.addPage()
          y = margin
        }
        pdf.setFontSize(12)
        pdf.setFont("helvetica", "bold")
        pdf.text(title, margin, y)
        y += 7
      }

      const addParagraph = (text: string, indent = 0) => {
        if (y > pageHeight - margin - 20) {
          pdf.addPage()
          y = margin
        }
        pdf.setFontSize(10)
        pdf.setFont("helvetica", "normal")
        const textLines = pdf.splitTextToSize(text, usableWidth - indent)
        pdf.text(textLines, margin + indent, y)
        y += 5 * textLines.length
      }

      // General Information
      addSectionTitle("I. DATOS GENERALES")
      const generalInfoSection = content.querySelector("section:nth-of-type(1)")
      if (generalInfoSection) {
        generalInfoSection.querySelectorAll("p").forEach((item) => {
          addParagraph(item.textContent?.replace("(Editable)", "").replace("Subir firma", "").trim() || "")
        })
      }
      y += 5

      // Competencies
      addSectionTitle("II. COMPETENCIA DEL CURSO")
      const competenciesSection = content.querySelector("section:nth-of-type(2)")
      if (competenciesSection) {
        addParagraph(competenciesSection.querySelector("p")?.textContent || "")
        competenciesSection.querySelectorAll("li").forEach((item) => {
          addParagraph("• " + (item.textContent?.replace("(Editable)", "").trim() || ""), 5)
        })
      }
      y += 5

      // Profile Competencies
      addSectionTitle("III. COMPETENCIA DEL PERFIL DE EGRESO AL QUE CONTRIBUYE")
      const profileSection = content.querySelector("section:nth-of-type(3)")
      if (profileSection) {
        addParagraph(profileSection.querySelector("p")?.textContent || "")
        profileSection.querySelectorAll("li").forEach((item) => {
          addParagraph("• " + (item.textContent?.replace("(Editable)", "").trim() || ""), 5)
        })
      }
      y += 5

      // Previous Competencies
      addSectionTitle("IV. COMPETENCIAS PREVIAS NECESARIAS")
      const previousSection = content.querySelector("section:nth-of-type(4)")
      if (previousSection) {
        previousSection.querySelectorAll("li").forEach((item) => {
          addParagraph("• " + (item.textContent?.replace("(Editable)", "").trim() || ""), 5)
        })
      }
      y += 5

      // Summary
      addSectionTitle("V. SUMILLA")
      const summarySection = content.querySelector("section:nth-of-type(5)")
      if (summarySection) {
        addParagraph(summarySection.textContent?.replace("V. SUMILLA", "").replace("(Editable)", "").trim() || "")
      }
      y += 5

      // Learning Units
      addSectionTitle("VI. UNIDADES DE APRENDIZAJE")
      const unitsSection = content.querySelector("section:nth-of-type(6)")
      if (unitsSection) {
        const unitTables = unitsSection.querySelectorAll("table.unit-table")
        unitTables.forEach((table) => {
          if (y > pageHeight - margin - 60) {
            pdf.addPage()
            y = margin
          }

          const unitHeader = table.querySelector("thead tr")
          const unitNumber =
            unitHeader?.querySelector("th:nth-child(1)")?.textContent?.replace("UNIDAD", "").trim() || ""
          const unitTitle =
            unitHeader?.querySelector("th:nth-child(2)")?.textContent?.replace("(Editable)", "").trim() || ""
          const rows = Array.from(table.querySelectorAll("tbody tr"))
          const firstRow = rows[0]
          const period =
            firstRow
              ?.querySelector("td:nth-child(1)")
              ?.textContent?.replace("(Editable)", "")
              .replace("Periodo:", "")
              .trim() || ""
          const expectedResult =
            firstRow
              ?.querySelector("td:nth-child(2)")
              ?.textContent?.replace("(Editable)", "")
              .replace("Resultado esperado:", "")
              .trim() || ""
          const weeklyContent: { week: string; content: string; date?: string }[] = []

          // Check if there are weeks defined
          if (rows[0] && rows[0].querySelector("td:nth-child(3)")) {
            const weekCell = rows[0].querySelector("td:nth-child(3)")
            const contentCell = rows[0].querySelector("td:nth-child(4)")

            if (weekCell && contentCell) {
              const content =
                contentCell.textContent?.replace("(Editable)", "").replace("Eliminar semana", "").trim() || ""
              const dateMatch = content.match(/Fecha: ([0-9-]+)/)

              weeklyContent.push({
                week: weekCell.textContent?.trim() || "",
                content: content
                  .replace(/Fecha: [0-9-]+/, "")
                  .replace("Agregar fecha de examen", "")
                  .trim(),
                date: dateMatch ? dateMatch[1] : undefined,
              })
            }
          }

          for (let i = 1; i < rows.length - 2; i++) {
            const weekCell = rows[i].querySelector("td:nth-child(1)")
            const contentCell = rows[i].querySelector("td:nth-child(2)")

            if (weekCell && contentCell) {
              const content =
                contentCell.textContent?.replace("(Editable)", "").replace("Eliminar semana", "").trim() || ""
              const dateMatch = content.match(/Fecha: ([0-9-]+)/)

              weeklyContent.push({
                week: weekCell.textContent?.trim() || "",
                content: content
                  .replace(/Fecha: [0-9-]+/, "")
                  .replace("Agregar fecha de examen", "")
                  .trim(),
                date: dateMatch ? dateMatch[1] : undefined,
              })
            }
          }

          const methodologyRow = rows[rows.length - 2]
          const methodology =
            methodologyRow?.textContent
              ?.replace("Metodología", "")
              .replace("(Editable)", "")
              .replace("Seleccionar metodología", "")
              .trim() || ""

          const sourcesRow = rows[rows.length - 1]
          const sourcesList: string[] = []
          sourcesRow?.querySelectorAll("li")?.forEach((item) => {
            const text = item.textContent?.replace("(Editable)", "").trim() || ""
            if (text) sourcesList.push(text)
          })

          autoTable(pdf, {
            startY: y,
            head: [
              [
                { content: `UNIDAD ${unitNumber}`, styles: { halign: "center", fillColor: [217, 217, 217] } },
                { content: unitTitle, styles: { halign: "left", fillColor: [217, 217, 217], fontStyle: "italic" } },
                { content: "SEMANA", styles: { halign: "center", fillColor: [217, 217, 217] } },
                { content: "CONTENIDOS ESPECÍFICOS", styles: { halign: "center", fillColor: [217, 217, 217] } },
              ],
            ],
            body: [
              [
                { content: period, rowSpan: weeklyContent.length || 1, styles: { valign: "top" } },
                { content: expectedResult, rowSpan: weeklyContent.length || 1, styles: { valign: "top" } },
                ...(weeklyContent.length > 0
                  ? [
                      { content: weeklyContent[0].week, styles: { halign: "center" } },
                      {
                        content: weeklyContent[0].date
                          ? `${weeklyContent[0].content}\nFecha: ${weeklyContent[0].date}`
                          : weeklyContent[0].content,
                      },
                    ]
                  : [{ content: "", styles: { halign: "center" } }, { content: "No hay contenidos definidos" }]),
              ],
              ...weeklyContent.slice(1).map((item) => [
                { content: item.week, styles: { halign: "center" } },
                {
                  content: item.date ? `${item.content}\nFecha: ${item.date}` : item.content,
                },
              ]),
              [{ content: `Metodología: ${methodology}`, colSpan: 4 }],
              [
                {
                  content: `Fuentes de consulta documental:\n${sourcesList.map((s) => `• ${s}`).join("\n")}`,
                  colSpan: 4,
                },
              ],
            ],
            styles: {
              fontSize: 9,
              cellPadding: 3,
              textColor: [0, 0, 0], // Set default text color for this table to black
            },
            headStyles: {
              textColor: [0, 0, 0], // Ensure header text is black
            },
            margin: { left: margin, right: margin },
            tableWidth: usableWidth,
          })
          y = (pdf as any).lastAutoTable.finalY + 10
        })
      }

      // Activities
      if (y > pageHeight - margin - 40) {
        pdf.addPage()
        y = margin
      }
      addSectionTitle("VII. ACTIVIDADES")
      const activitiesSection = content.querySelector("section:nth-of-type(7)")
      if (activitiesSection) {
        addParagraph(activitiesSection.querySelector("h3")?.textContent || "", 0)
        addParagraph(activitiesSection.querySelector("span")?.textContent?.replace("(Editable)", "").trim() || "", 5)
      }
      y += 5

      // Evaluation Criteria
      if (y > pageHeight - margin - 60) {
        pdf.addPage()
        y = margin
      }
      addSectionTitle("VIII. CRITERIOS DE EVALUACIÓN")
      const evaluationSection = content.querySelector("section:nth-of-type(8)")
      if (evaluationSection) {
        const evaluationTable = evaluationSection.querySelector("table")
        if (evaluationTable) {
          const evaluationRows: any[][] = []
          const headerCells = evaluationTable.querySelectorAll("thead th")
          const headerRow = Array.from(headerCells).map((cell) => ({
            content: cell.textContent?.trim() || "",
            styles: { halign: "center", fillColor: [229, 229, 229], textColor: [0, 0, 0] }, // Ensure black text here
          }))
          const bodyRows = evaluationTable.querySelectorAll("tbody tr")
          bodyRows.forEach((row, index) => {
            const cells = row.querySelectorAll("td")
            const rowData = Array.from(cells).map((cell) => ({
              content: cell.textContent?.replace("(Editable)", "").replace("Eliminar evaluación", "").trim() || "",
              styles: { fillColor: index % 2 === 0 ? [229, 229, 229] : null, textColor: [0, 0, 0] }, // Ensure black text for body cells too
            }))
            evaluationRows.push(rowData)
          })

          autoTable(pdf, {
            startY: y,
            head: [headerRow],
            body: evaluationRows,
            styles: {
              fontSize: 9,
              cellPadding: 3,
              textColor: [0, 0, 0], // Set default text color for this table to black
            },
            margin: { left: margin, right: margin },
            tableWidth: usableWidth,
          })
          y = (pdf as any).lastAutoTable.finalY + 10
        }
      }

      // Signature
      if (y > pageHeight - margin - 30) {
        pdf.addPage()
        y = margin
      }
      const signatureSection = content.querySelector("section:nth-of-type(9)")
      if (signatureSection) {
        addParagraph(
          signatureSection.querySelector("p:nth-child(1)")?.textContent?.replace("(Editable)", "").trim() || "",
        )
        addParagraph(
          signatureSection
            .querySelector("p:nth-child(2)")
            ?.textContent?.replace("(Editable)", "")
            .replace("Subir firma", "")
            .trim() || "",
        )

        // Add signature image
        const signatureImg = signatureSection.querySelector("img")
        if (signatureImg && signatureImg.src) {
          try {
            // For base64 images from FileReader
            if (signatureImg.src.startsWith("data:image")) {
              pdf.addImage(signatureImg.src, "JPEG", margin + 20, y, 50, 20)
            } else {
              // For regular image paths
              pdf.addImage(signatureImg.src, "JPEG", margin + 20, y, 50, 20)
            }
          } catch (error) {
            console.error("Error adding signature image to PDF:", error)
          }
        }

        y += 25
      }

      // Add page numbers
      const totalPages = pdf.getNumberOfPages()
      for (let i = 1; i <= totalPages; i++) {
        pdf.setPage(i)
        pdf.setFontSize(10)
        pdf.setTextColor(0, 0, 0) // Black page numbers
        pdf.text(`Página ${i} de ${totalPages}`, pageWidth / 2, pageHeight - 5, { align: "center" })
      }

      pdf.save("silabo-curso.pdf")
    } catch (error) {
      console.error("Error generating PDF:", error)
      alert("Hubo un error al generar el PDF. Por favor, intente nuevamente.")
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <button
      onClick={generatePDF}
      disabled={isGenerating}
      className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-400"
    >
      {isGenerating ? (
        <>
          <Loader2 size={18} className="mr-2 animate-spin" />
          Generando PDF...
        </>
      ) : (
        <>
          <Download size={18} className="mr-2" />
          Exportar a PDF
        </>
      )}
    </button>
  )
}
