"use server";

import { prisma } from "@/lib/prisma";
import { InvoiceStatus } from "@prisma/client";
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
  dueDate: Date;
  paymentTerms: string;
  notes: string | null;
  taxRate: string;
  discount: string | null;
  userId: string;
  services: {
    title: string;
    description: string | null;
    hours: string;
    rate: string;
    total: string;
  }[];
}) {
  try {
    const user = await getUser();
    if (!user) throw new Error("User not authenticated");

    await prisma.invoice.create({
      data: {
        ...invoiceData,
        status: "PENDING",
        taxRate: new Prisma.Decimal(invoiceData.taxRate),
        discount: invoiceData.discount
          ? new Prisma.Decimal(invoiceData.discount)
          : null,
        userId: user.id,
        services: {
          create: invoiceData.services.map((service) => ({
            title: service.title,
            description: service.description,
            hours: new Prisma.Decimal(service.hours),
            rate: new Prisma.Decimal(service.rate),
            total: new Prisma.Decimal(service.rate).mul(
              new Prisma.Decimal(service.hours)
            ),
          })),
        },
      },
      include: {
        services: true,
      },
    });

    revalidatePath("/dashboard/invoices");
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to create invoice");
  }
}

export async function getInvoices() {
  try {
    const user = await getUser();
    const invoices = await prisma.invoice.findMany({
      where: { userId: user?.id },
      include: { services: true },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Convert Decimal to string before sending to client
    return {
      success: true,
      data: invoices.map((invoice) => ({
        ...invoice,
        taxRate: invoice.taxRate?.toString(),
        discount: invoice.discount?.toString(),
        services: invoice.services.map((service) => ({
          ...service,
          hours: service.hours.toString(),
          rate: service.rate.toString(),
          total: service.total.toString(),
        })),
      })),
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

export async function updateInvoice(
  id: string,
  data: {
    clientName?: string;
    clientEmail?: string;
    address?: string;
    amount?: number;
    dueDate?: Date;
    status?: "PENDING" | "PAID" | "OVERDUE";
  }
) {
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
    await prisma.invoice.update({
      where: { id },
      data: { status },
    });
    return { success: true };
  } catch (error) {
    console.error("Error updating the invoice status: ", error);
    return { success: false, error: "Failed to update invoice status" };
  }
}
