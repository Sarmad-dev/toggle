import { Prisma } from "@prisma/client";
import { format } from "date-fns";
import Image from "next/image";
import React from "react";

export interface InvoiceTemplate {
  name: string;
  colors: {
    primary: string;
    secondary: string;
    background: string;
    text: string;
    accent?: string;
  };
  typography: {
    header: string;
    body: string;
  };
  layout: string;
  preview: (props: {
    invoiceNumber: string;
    clientName: string;
    clientEmail: string;
    clientAddress: string;
    logo: string;
    signature: string;
    createdAt: Date;
    dueDate: Date;
    paymentTerms: string;
    amount: string;
    date: string;
    status: string;
    taxRate: string;
    notes: string;
  }) => React.JSX.Element;
}

export const invoiceTemplates: Record<string, InvoiceTemplate> = {
  professional: {
    name: "Professional",
    colors: {
      primary: "#059669",
      secondary: "#047857",
      background: "#f8fafc",
      text: "#1e293b",
      accent: "#d1fae5",
    },
    typography: {
      header: "text-2xl font-semibold uppercase",
      body: "text-sm",
    },
    layout: "horizontal",
    preview: ({
      invoiceNumber,
      clientName,
      clientEmail,
      clientAddress,
      logo,
      signature,
      createdAt,
      dueDate,
      paymentTerms,
      taxRate,
      notes,
      amount,
      date,
      status,
    }: {
      invoiceNumber: string;
      clientName: string;
      clientEmail: string;
      clientAddress: string;
      logo: string;
      signature: string;
      createdAt: Date;
      dueDate: Date;
      paymentTerms: string;
      taxRate: string;
      notes: string;
      amount: string;
      date: string;
      status: string;
    }) => {
      const taxDecimal = new Prisma.Decimal(taxRate);
      const taxAmount = taxRate
        ? taxDecimal.mul(amount).div(100)
        : new Prisma.Decimal(0);
      return (
        <div className="p-8 w-[210mm] min-h-[297mm] bg-background rounded-lg shadow-sm">
          <div className="flex justify-between items-center mb-8 border-b pb-4">
            <div className="flex items-center gap-4">
              <Image src={logo} alt="Logo" width={80} height={80} />
            </div>
            <div className="text-right">
              <p className="font-medium text-primary">INVOICE</p>
              <p className="text-sm text-muted-foreground">
                {invoiceNumber || "#PRO-2024-001"}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 mb-8">
            <div>
              <h3 className="font-semibold mb-2">Client Information</h3>
              <p>{clientName || "Global Enterprises Ltd."}</p>
              <p>{clientEmail || "abc@gmail.com"}</p>
              <p>{clientAddress || "789 Corporate Blvd."}</p>
            </div>
            <div className="text-right">
              <p>
                <span className="font-semibold">Issued:</span>{" "}
                {format(new Date(createdAt), "PP")}
              </p>
              <p>
                <span className="font-semibold">Due:</span>{" "}
                {format(new Date(dueDate), "PP")}
              </p>
              <p>
                <span className="font-semibold">Terms:</span>{" "}
                {paymentTerms || "NET 15"}
              </p>
            </div>
          </div>

          <table className="w-full mb-8">
            <thead className="bg-accent">
              <tr>
                <th className="text-left p-3 text-sm">Service Description</th>
                <th className="text-right p-3 text-sm">Hours</th>
                <th className="text-right p-3 text-sm">Rate</th>
                <th className="text-right p-3 text-sm">Total</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="p-3 text-sm">Strategic Consulting</td>
                <td className="p-3 text-right text-sm">25</td>
                <td className="p-3 text-right text-sm">$200.00</td>
                <td className="p-3 text-right text-sm">$5,000.00</td>
              </tr>
              <tr className="border-b">
                <td className="p-3 text-sm">Market Research</td>
                <td className="p-3 text-right text-sm">40</td>
                <td className="p-3 text-right text-sm">$150.00</td>
                <td className="p-3 text-right text-sm">$6,000.00</td>
              </tr>
            </tbody>
          </table>

          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-2">
              <div className="p-4 bg-accent/20 rounded-lg">
                <p className="text-sm font-medium">Payment Instructions</p>
                <p className="text-xs text-muted-foreground">
                  {notes || "Bank Transfer to Account: 1234-5678"}
                </p>
              </div>
            </div>
            <div className="text-right space-y-2">
              <div className="flex justify-between">
                <span>Tax {taxRate || "0%"}:</span>
                <span>{`${taxAmount}`}</span>
              </div>
              <div className="flex justify-between font-semibold">
                <span>Total Due:</span>
                <span>{`${new Prisma.Decimal(amount).add(taxAmount)}`}</span>
              </div>
            </div>
          </div>
        </div>
      );
    },
  },
  creative: {
    name: "Creative",
    colors: {
      primary: "#7c3aed",
      secondary: "#6d28d9",
      background: "#f5f3ff",
      text: "#334155",
      accent: "#ede9fe",
    },
    typography: {
      header: "text-3xl font-bold italic",
      body: "text-base",
    },
    layout: "vertical",
    preview: ({}) => (
      <div className="p-8 w-[210mm] min-h-[297mm] bg-background rounded-lg shadow-xl">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-primary/10 rounded-full mx-auto mb-4 flex items-center justify-center">
            <svg
              className="w-10 h-10 text-primary"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-bold italic text-primary">INVOICE</h1>
          <p className="text-muted-foreground">#CRE-2024-001</p>
        </div>

        <div className="grid grid-cols-2 gap-8 mb-8">
          <div className="space-y-2">
            <h3 className="font-bold text-lg">From</h3>
            <p>Creative Studio</p>
            <p>456 Design Street</p>
            <p>Paris, France</p>
          </div>
          <div className="space-y-2 text-right">
            <h3 className="font-bold text-lg">To</h3>
            <p>Innovative Solutions</p>
            <p>789 Tech Avenue</p>
            <p>San Francisco, CA</p>
          </div>
        </div>

        <div className="mb-8">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-primary">
                <th className="text-left py-3">Project</th>
                <th className="text-right py-3">Days</th>
                <th className="text-right py-3">Rate</th>
                <th className="text-right py-3">Total</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="py-3">Brand Identity Design</td>
                <td className="py-3 text-right">10</td>
                <td className="py-3 text-right">$500.00</td>
                <td className="py-3 text-right">$5,000.00</td>
              </tr>
              <tr className="border-b">
                <td className="py-3">Web Design</td>
                <td className="py-3 text-right">15</td>
                <td className="py-3 text-right">$400.00</td>
                <td className="py-3 text-right">$6,000.00</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="grid grid-cols-2 gap-8">
          <div className="space-y-2">
            <div className="p-4 bg-accent/30 rounded-lg">
              <p className="font-medium">Creative Notes</p>
              <p className="text-sm">Thank you for choosing innovation!</p>
            </div>
          </div>
          <div className="text-right space-y-2">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>$11,000.00</span>
            </div>
            <div className="flex justify-between">
              <span>Discount (15%):</span>
              <span>-$1,650.00</span>
            </div>
            <div className="flex justify-between font-bold text-lg">
              <span>Total:</span>
              <span>$9,350.00</span>
            </div>
          </div>
        </div>
      </div>
    ),
  },
};

export type TemplateId = keyof typeof invoiceTemplates;
