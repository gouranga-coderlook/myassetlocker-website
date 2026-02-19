"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import Hero from "@/components/Hero";
import toast from "react-hot-toast";
import { getInvoiceById, type Invoice } from "@/lib/api/invoiceService";
import InvoiceDisplay from "@/components/invoice/InvoiceDisplay";

export default function InvoicePage({ params }: Readonly<{ params: Promise<{ invoiceId: string }> }>) {
  const { invoiceId } = use(params);
  const router = useRouter();
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadInvoice = async () => {
      try {
        setLoading(true);
        const invoiceData = await getInvoiceById(invoiceId);
        if (invoiceData) {
          setInvoice(invoiceData);
        }
      } catch (error) {
        toast.error("Failed to load invoice");
        console.error("Error loading invoice:", error);
      } finally {
        setLoading(false);
      }
    };

    loadInvoice();
  }, [invoiceId, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#f7f7f7] to-[#fef7ed] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#f8992f] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading invoice...</p>
        </div>
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#f7f7f7] to-[#fef7ed] flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-2">Invoice not found</p>
          <p className="text-gray-600">Please check the invoice ID and try again.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f7f7f7] to-[#fef7ed]">
      <Hero
        backgroundImage="/cart_image.jpg"
        headline="Invoice Details"
        bodyText="View your invoice information"
        height="compact"
      />
      <div className="max-w-5xl mx-auto px-4 py-12">
        <InvoiceDisplay invoice={invoice} />
      </div>
    </div>
  );
}

