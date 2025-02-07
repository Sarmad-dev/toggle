"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createInvoice(data: {
  userId: string;
  timeEntries: string[];
  dueDate: Date;
  amount: number;
  currency: string;
  notes?: string;
}) {
  try {
    const invoice = await prisma.invoice.create({
      data: {
        number: `INV-${Date.now()}`, // You might want a more sophisticated number generation
        status: "DRAFT",
        issueDate: new Date(),
        dueDate: data.dueDate,
        amount: data.amount,
        currency: data.currency,
        notes: data.notes,
        timeEntries: {
          connect: data.timeEntries.map(id => ({ id })),
        },
      },
    });

    // Update time entries to link them to this invoice
    await prisma.timeEntry.updateMany({
      where: { id: { in: data.timeEntries } },
      data: { invoiceId: invoice.id },
    });

    revalidatePath("/dashboard/invoices");
    return { success: true, data: invoice };
  } catch (error) {
    return { success: false, error: "Failed to create invoice" };
  }
}

export async function getInvoices(userId: string) {
  try {
    const invoices = await prisma.invoice.findMany({
      include: {
        timeEntries: {
          include: {
            project: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
    return { success: true, data: invoices };
  } catch (error) {
    return { success: false, error: "Failed to fetch invoices" };
  }
}

export async function updateInvoiceStatus(id: string, status: "DRAFT" | "SENT" | "PAID" | "OVERDUE" | "CANCELLED") {
  try {
    const invoice = await prisma.invoice.update({
      where: { id },
      data: { status },
    });
    revalidatePath("/dashboard/invoices");
    return { success: true, data: invoice };
  } catch (error) {
    return { success: false, error: "Failed to update invoice status" };
  }
} 