import jsPDF from "jspdf";
import { format } from "date-fns";

export async function downloadInvoicePDF(invoice: any) {
  const pdf = new jsPDF();
  
  // Add header
  pdf.setFontSize(20);
  pdf.text("Invoice", 20, 20);
  
  // Add invoice details
  pdf.setFontSize(12);
  pdf.text(`Invoice Number: ${invoice.number}`, 20, 40);
  pdf.text(`Client: ${invoice.clientName}`, 20, 50);
  pdf.text(`Amount: $${invoice.amount.toFixed(2)}`, 20, 60);
  pdf.text(`Due Date: ${format(new Date(invoice.dueDate), 'PP')}`, 20, 70);
  pdf.text(`Status: ${invoice.status}`, 20, 80);
  
  // Save the PDF
  pdf.save(`invoice-${invoice.number}.pdf`);
} 