"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { FileText, DollarSign } from "lucide-react";

type Invoice = {
  id: string;
  number: string;
  status: "DRAFT" | "SENT" | "PAID" | "OVERDUE" | "CANCELLED";
  issueDate: string;
  dueDate: string;
  amount: number;
  currency: string;
};

const statusColors = {
  DRAFT: "secondary",
  SENT: "blue",
  PAID: "green",
  OVERDUE: "destructive",
  CANCELLED: "gray",
} as const;

export function InvoiceList() {
  // TODO: Replace with actual data fetching
  const invoices: Invoice[] = [];

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Invoice Number</TableHead>
            <TableHead>Issue Date</TableHead>
            <TableHead>Due Date</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {invoices.map((invoice) => (
            <TableRow key={invoice.id}>
              <TableCell>
                <div className="flex items-center">
                  <FileText className="mr-2 h-4 w-4" />
                  {invoice.number}
                </div>
              </TableCell>
              <TableCell>{format(new Date(invoice.issueDate), "PP")}</TableCell>
              <TableCell>{format(new Date(invoice.dueDate), "PP")}</TableCell>
              <TableCell>
                <div className="flex items-center">
                  <DollarSign className="mr-1 h-4 w-4" />
                  {invoice.amount.toFixed(2)} {invoice.currency}
                </div>
              </TableCell>
              <TableCell>
                <Badge variant={statusColors[invoice.status]}>
                  {invoice.status}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
} 