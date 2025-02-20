"use client";

import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Download, Edit } from "lucide-react";
import { EditInvoice } from "./edit-invoice";
import { useState } from "react";
import { downloadInvoicePDF } from "@/lib/pdf-generator";
import { updateInvoiceStatus } from "@/lib/actions/invoices";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Invoice } from "@prisma/client";
import { InvoiceStatus } from "@/types/global";

interface InvoiceListProps {
  invoices: Invoice[];
}

export function InvoiceList({ invoices }: InvoiceListProps) {
  const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null);

  const handleStatusChange = async (invoiceId: string, status: string) => {
    try {
      await updateInvoiceStatus(invoiceId, status as InvoiceStatus);
      toast.success("Invoice status updated");
    } catch (error) {
      console.error("Error updating invoice status: ", error)
      toast.error("Failed to update invoice status");
    }
  };

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Invoice Number</TableHead>
            <TableHead>Client</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Due Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {invoices.map((invoice) => (
            <TableRow key={invoice.id}>
              <TableCell>{invoice.invoiceNumber}</TableCell>
              <TableCell>{invoice.clientName}</TableCell>
              <TableCell>${Number(invoice.amount).toFixed(2)}</TableCell>
              <TableCell>{format(new Date(invoice.dueDate), 'PP')}</TableCell>
              <TableCell>
                <Select
                  defaultValue={invoice.status}
                  onValueChange={(value) => handleStatusChange(invoice.id, value)}
                >
                  <SelectTrigger className="w-[130px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="DRAFT">Draft</SelectItem>
                    <SelectItem value="SENT">Sent</SelectItem>
                    <SelectItem value="PAID">Paid</SelectItem>
                    <SelectItem value="OVERDUE">Overdue</SelectItem>
                    <SelectItem value="CANCELLED">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </TableCell>
              <TableCell className="space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => downloadInvoicePDF(invoice)}
                >
                  <Download className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setEditingInvoice(invoice)}
                >
                  <Edit className="w-4 h-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <EditInvoice
        invoice={editingInvoice as Invoice}
        open={!!editingInvoice}
        onOpenChange={(open) => !open && setEditingInvoice(null)}
      />
    </>
  );
} 