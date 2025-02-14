import jsPDF from "jspdf";
import { format } from "date-fns";
import { Invoice } from "@prisma/client";
import html2canvas from "html2canvas";
import { toast } from "sonner";

export async function downloadInvoicePDF(invoice: Invoice) {
  const pdf = new jsPDF();

  // Add header
  pdf.setFontSize(20);
  pdf.text("Invoice", 20, 20);

  // Add invoice details
  pdf.setFontSize(12);
  pdf.text(`Invoice Number: ${invoice.number}`, 20, 40);
  pdf.text(`Client: ${invoice.clientName}`, 20, 50);
  pdf.text(`Amount: $${invoice.amount.toFixed(2)}`, 20, 60);
  pdf.text(`Due Date: ${format(new Date(invoice.dueDate), "PP")}`, 20, 70);
  pdf.text(`Status: ${invoice.status}`, 20, 80);

  // Save the PDF
  pdf.save(`invoice-${invoice.number}.pdf`);
}

export async function downloadAsPDF(elementId: string, title: string) {
  const element = document.getElementById(elementId);
  if (!element) return;

  try {
    // Wait for charts to render
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const canvas = await html2canvas(element, {
      scale: 2, // Increase quality
      logging: false,
      useCORS: true,
      allowTaint: true,
    });

    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    // const pdfHeight = pdf.internal.pageSize.getHeight();
    const aspectRatio = canvas.height / canvas.width;
    const imgWidth = pdfWidth;
    const imgHeight = pdfWidth * aspectRatio;

    // Add title
    pdf.setFontSize(20);
    pdf.text(title, 20, 20);

    // Add timestamp
    pdf.setFontSize(12);
    pdf.text(`Generated on: ${new Date().toLocaleString()}`, 20, 40);

    // Add the chart image
    pdf.addImage(imgData, "PNG", 0, 60, imgWidth, imgHeight);

    pdf.save(`${title.toLowerCase().replace(/\s+/g, "-")}-report.pdf`);
  } catch (error) {
    console.error("Error generating PDF:", error);
    toast.error("Failed to generate PDF");
  }
}
