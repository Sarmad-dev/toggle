import jsPDF from "jspdf";
import { format } from "date-fns";
import { Invoice } from "@prisma/client";
import html2canvas from "html2canvas";
import { toast } from "sonner";
import { invoiceTemplates } from "@/lib/invoice-templates";
import ReactDOMServer from 'react-dom/server';

export async function downloadInvoicePDF(invoice: Invoice) {
  // Create a temporary div to render the invoice template
  const tempDiv = document.createElement('div');
  tempDiv.id = 'temp-invoice';
  document.body.appendChild(tempDiv);

  try {
    // Get the template component
    const Template = invoiceTemplates[invoice.template as keyof typeof invoiceTemplates];
    if (!Template?.preview) {
      throw new Error("Template not found");
    }

    // Render React component to HTML string
    const html = ReactDOMServer.renderToString(
      Template.preview({
        invoiceNumber: invoice.invoiceNumber,
        clientName: invoice.clientName,
        clientEmail: invoice.clientEmail as string,
        clientAddress: invoice.clientAddress,
        logo: invoice.logo as string,
        signature: invoice.signature as string,
        createdAt: invoice.createdAt,
        paymentTerms: invoice.paymentTerms,
        dueDate: invoice.dueDate,
        amount: invoice.amount.toString(),
        date: format(new Date(invoice.dueDate), "PP"),
        status: invoice.status,
      })
    );

    tempDiv.innerHTML = `<div style="padding: 20px;">${html}</div>`;

    // Wait for content to load
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Generate PDF
    await generateInvoicePDF(
      'temp-invoice',
      `invoice-${invoice.invoiceNumber}`,
      invoice.template
    );
  } catch (error) {
    console.error('PDF Generation Error:', error);
    toast.error('Failed to generate PDF');
  } finally {
    // Clean up
    document.body.removeChild(tempDiv);
  }
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

export async function generateInvoicePDF(elementId: string, fileName: string, templateId?: string) {
  const element = document.getElementById(elementId);
  if (!element) return;

  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    logging: true,
  });
  
  const imgData = canvas.toDataURL("image/png");
  const isLandscape = templateId === 'landscape';
  const pdf = new jsPDF(isLandscape ? "l" : "p", "mm", "a4");
  
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const imgRatio = canvas.width / canvas.height;
  
  let imgWidth = pageWidth;
  let imgHeight = pageWidth / imgRatio;
  
  if (imgHeight > pageHeight) {
    imgHeight = pageHeight;
    imgWidth = imgHeight * imgRatio;
  }

  pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
  pdf.save(`${fileName}.pdf`);
}
