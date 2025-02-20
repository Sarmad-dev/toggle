"use server";

import { prisma } from "@/lib/prisma";
import { Invoice, InvoiceStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { getUser } from "./user";
import { Prisma } from "@prisma/client";

export async function createInvoice(invoiceData: {
  template: string;
  invoiceNumber: string;
  logo: string | null;
  signature: string | null;
  clientName: string;
  clientEmail: string | null;
  clientAddress: string;
  amount: string;
  dueDate: Date;
  paymentTerms: string;
  notes: string | null;
  taxRate: string;
  discount: string | null;
  userId: string;
}) {
  try {
    const user = await getUser();
    if (!user) throw new Error("User not authenticated");

    console.log("INVOICE DATA: ", invoiceData)

    const invoice = await prisma.invoice.create({
      data: {
        ...invoiceData,
        status: "PENDING",
        amount: new Prisma.Decimal(invoiceData.amount),
        taxRate: new Prisma.Decimal(invoiceData.taxRate),
        discount: invoiceData.discount ? new Prisma.Decimal(invoiceData.discount) : null,
        userId: user.id
      },
    });

    revalidatePath("/dashboard/invoices");
    return invoice;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to create invoice");
  }
}

export async function getInvoices() {
  try {
    const user = await getUser()
    const invoices = await prisma.invoice.findMany({
      where: { userId: user?.id },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Convert Decimal to string before sending to client
    return { 
      success: true, 
      data: invoices.map(invoice => ({
        ...invoice,
        amount: invoice.amount.toString(),
        taxRate: invoice.taxRate?.toString(),
        discount: invoice.discount?.toString()
      }))
    };
  } catch (error) {
    console.error("Error fetching invoices:", error);
    return { success: false, error: "Failed to fetch invoices" };
  }
}

export async function getInvoice(id: string) {
  try {
    const invoice = await prisma.invoice.findUnique({
      where: { id },
    });

    return { success: true, data: invoice };
  } catch (error) {
    console.error("Error fetching invoice:", error);
    return { success: false, error: "Failed to fetch invoice" };
  }
}

export async function updateInvoice(id: string, data: {
  clientName?: string;
  clientEmail?: string;
  address?: string;
  amount?: number;
  dueDate?: Date;
  status?: 'PENDING' | 'PAID' | 'OVERDUE';
}) {
  try {
    const invoice = await prisma.invoice.update({
      where: { id },
      data,
    });

    return { success: true, data: invoice };
  } catch (error) {
    console.error("Error updating invoice:", error);
    return { success: false, error: "Failed to update invoice" };
  }
}

export async function updateInvoiceStatus(id: string, status: InvoiceStatus) {
  try {
    const invoice = await prisma.invoice.update({
      where: { id },
      data: { status },
    });
    return { success: true, data: invoice };
  } catch (error) {
    console.error("Error updating the invoice status: ", error)
    return { success: false, error: "Failed to update invoice status" };
  }
} 