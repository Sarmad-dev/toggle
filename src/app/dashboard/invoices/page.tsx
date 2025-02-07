import { InvoiceList } from "@/components/dashboard/invoice-list";
import { CreateInvoice } from "@/components/dashboard/create-invoice";

export default function InvoicesPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Invoices</h2>
        <CreateInvoice />
      </div>
      <InvoiceList />
    </div>
  );
} 