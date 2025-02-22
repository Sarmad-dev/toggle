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
import { Download } from "lucide-react";
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
import { Prisma } from "@prisma/client";

interface InvoiceListProps {
  invoices: {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    userId: string;
    status: string;
    dueDate: Date;
    template: string;
    invoiceNumber: string;
    logo: string | null;
    signature: string | null;
    clientName: string;
    clientEmail: string | null;
    clientAddress: string;
    paymentTerms: string;
    notes: string | null;
    taxRate: string | undefined;
    discount: string | undefined;
    services: {
      id: string;
      title: string;
      description: string | null;
      hours: string;
      rate: string;
      total: string;
      createdAt: Date;
      updatedAt: Date;
      invoiceId: string;
    }[];
  }[];
}

export function InvoiceList({ invoices }: InvoiceListProps) {

  const handleStatusChange = async (invoiceId: string, status: string) => {
    try {
      await updateInvoiceStatus(invoiceId, status as InvoiceStatus);
      toast.success("Invoice status updated");
    } catch (error) {
      console.error("Error updating invoice status: ", error);
      toast.error("Failed to update invoice status");
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const convertInvoiceForPDF = (invoice: InvoiceListProps['invoices'][0]): Invoice & { services: any[] } => {
    return {
      ...invoice,
      taxRate: invoice.taxRate ? invoice.taxRate.toString() : null,
      discount: invoice.discount ? invoice.discount.toString() : null,
      services: invoice.services.map(service => ({
        ...service,
        hours: service.hours.toString(),
        rate: service.rate.toString(),
        total: service.total.toString(),
      }))
    } as Invoice & { services: any[] };
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
              <TableCell>
                ${invoice.services.reduce(
                  (acc, service) => acc + Number(service.total),
                  0
                )}
              </TableCell>
              <TableCell>{format(new Date(invoice.dueDate), "PP")}</TableCell>
              <TableCell>
                <Select
                  defaultValue={invoice.status}
                  onValueChange={(value) =>
                    handleStatusChange(invoice.id, value)
                  }
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
                  onClick={() => downloadInvoicePDF(convertInvoiceForPDF(invoice))}
                >
                  <Download className="w-4 h-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
}
