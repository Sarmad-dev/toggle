"use client";

import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { getInvoices } from "@/lib/actions/invoices";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { InvoiceList } from "@/components/dashboard/invoice-list";
import { CreateInvoice } from "@/components/dashboard/create-invoice";
import { Spinner } from "@/components/ui/spinner";

// export const dynamic = 'force-dynamic';

export default function InvoicesPage() {
  const [showCreateModal, setShowCreateModal] = useState(false);

  const {
    data: invoices,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["invoices"],
    queryFn: () => getInvoices(),
  });


  if (isLoading) {
    return <Spinner />;
  }

  if (error) {
    return <div>Error loading invoices</div>;
  }

  return (
    <div className="p-4 space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Invoices</h1>
        <Button onClick={() => setShowCreateModal(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Create Invoice
        </Button>
      </div>

      <InvoiceList invoices={invoices?.data || []} />

      <CreateInvoice
        open={showCreateModal}
        onOpenChange={setShowCreateModal}
      />
    </div>
  );
} 