"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { formatISO } from "date-fns";

export async function createInvoice(data: {
  clientName: string;
  clientEmail?: string;
  address: string;
  amount: number;
  dueDate: Date;
  timeEntryIds: string[];
  userId: string;
}) {
  try {
    // Generate invoice number (e.g., INV-2024-001)
    const invoiceCount = await prisma.invoice.count();
    const invoiceNumber = `INV-${new Date().getFullYear()}-${String(invoiceCount + 1).padStart(3, '0')}`;

    const invoice = await prisma.invoice.create({
      data: {
        number: invoiceNumber,
        clientName: data.clientName,
        clientEmail: data.clientEmail,
        address: data.address,
        amount: data.amount,
        dueDate: data.dueDate,
        userId: data.userId,
        timeEntries: {
          connect: data.timeEntryIds.map(id => ({ id })),
        },
      },
      include: {
        timeEntries: true,
      },
    });

    return { success: true, data: invoice };
  } catch (error) {
    console.error("Error creating invoice:", error);
    return { success: false, error: "Failed to create invoice" };
  }
}

export async function getInvoices(userId: string) {
  try {
    const invoices = await prisma.invoice.findMany({
      where: { userId },
      include: {
        timeEntries: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return { success: true, data: invoices };
  } catch (error) {
    console.error("Error fetching invoices:", error);
    return { success: false, error: "Failed to fetch invoices" };
  }
}

export async function getInvoice(id: string) {
  try {
    const invoice = await prisma.invoice.findUnique({
      where: { id },
      include: {
        timeEntries: true,
      },
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
      include: {
        timeEntries: true,
      },
    });

    return { success: true, data: invoice };
  } catch (error) {
    console.error("Error updating invoice:", error);
    return { success: false, error: "Failed to update invoice" };
  }
}

export async function updateInvoiceStatus(id: string, status: "DRAFT" | "SENT" | "PAID" | "OVERDUE" | "CANCELLED") {
  try {
    const invoice = await prisma.invoice.update({
      where: { id },
      data: { status },
    });
    return { success: true, data: invoice };
  } catch (error) {
    return { success: false, error: "Failed to update invoice status" };
  }
} 