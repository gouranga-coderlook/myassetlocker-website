"use client";

import { useState } from "react";
import { pdf } from "@react-pdf/renderer";
import toast from "react-hot-toast";
import { type Invoice } from "@/lib/api/invoiceService";
import InvoicePDF from "./InvoicePDF";

interface InvoiceDisplayProps {
  readonly invoice: Invoice;
}

export default function InvoiceDisplay({ invoice }: InvoiceDisplayProps) {
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  const getCurrencySymbol = (currency: string) => {
    return currency === "USD" ? "$" : currency;
  };

  const handleDownloadPDF = async () => {
    try {
      setIsGeneratingPDF(true);
      const doc = <InvoicePDF invoice={invoice} />;
      const asPdf = pdf(doc);
      const blob = await asPdf.toBlob();
      
      // Create download link
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `invoice-${invoice.id.slice(0, 8).toUpperCase()}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
      
      toast.success("Invoice downloaded successfully");
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error("Failed to generate PDF");
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "PAID":
        return "bg-green-100 text-green-800 border-green-200";
      case "PENDING":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "FAILED":
        return "bg-red-100 text-red-800 border-red-200";
      case "CANCELLED":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
      {/* Invoice Header */}
      <div className="bg-gradient-to-r from-[#f8992f] to-[#ffb84d] p-8 text-white">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold mb-2">Invoice</h1>
            <p className="text-white/90">
              Invoice #{invoice.id.slice(0, 8).toUpperCase()}
            </p>
          </div>
          <div className="text-right">
            <div
              className={`inline-block px-4 py-2 rounded-lg border-2 ${getStatusBadgeColor(
                invoice.paymentStatus
              )}`}
            >
              <span className="font-semibold">{invoice.paymentStatus}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Invoice Details */}
      <div className="p-8">
        {/* Invoice Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div>
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Invoice Information
            </h2>
            <div className="space-y-2 text-gray-600">
              <p>
                <span className="font-medium">Invoice Date:</span>{" "}
                {formatDate(invoice.invoiceDate)}
              </p>
              <p>
                <span className="font-medium">Payment ID:</span>{" "}
                {invoice.paymentId.slice(0, 8).toUpperCase()}
              </p>
              {/* <p>
                <span className="font-medium">Cart Item ID:</span>{" "}
                {invoice.cartItemId?.slice(0, 8).toUpperCase() || "N/A"}
              </p> */}
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Bill To
            </h2>
            <div className="space-y-2 text-gray-600">
              <p className="font-medium text-gray-800">
                {invoice.customer.name}
              </p>
              <p>{invoice.customer.email}</p>
              <p>{invoice.customer.phone}</p>
              <p className="mt-2">
                {invoice.customer.address}
                <br />
                {invoice.customer.city}, {invoice.customer.state}{" "}
                {invoice.customer.zip}
              </p>
            </div>
          </div>
        </div>

        {/* Plan Information */}
        {invoice.plan && (
          <div className="mb-8 p-4 bg-orange-50 rounded-lg border border-orange-200">
            <h3 className="font-semibold text-gray-800 mb-2">Selected Plan</h3>
            <p className="text-gray-700">
              <span className="font-medium">{invoice.plan.name}</span> -{" "}
              {invoice.plan.details}
            </p>
            {invoice.plan.hasDiscount && (
              <p className="text-green-600 mt-1">
                {invoice.plan.discountPercentage}% discount applied
              </p>
            )}
          </div>
        )}

        {/* Invoice Items */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Invoice Items
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b-2 border-gray-200">
                  <th className="text-left p-4 font-semibold text-gray-700">
                    Description
                  </th>
                  <th className="text-center p-4 font-semibold text-gray-700">
                    Quantity
                  </th>
                  <th className="text-right p-4 font-semibold text-gray-700">
                    Unit Price
                  </th>
                  <th className="text-right p-4 font-semibold text-gray-700">
                    Total
                  </th>
                </tr>
              </thead>
              <tbody>
                {invoice.items.map((item, index) => (
                  <tr
                    key={`${item.type}-${item.description}-${index}`}
                    className="border-b border-gray-100 hover:bg-gray-50"
                  >
                    <td className="p-4 text-gray-700">
                      <div>
                        <p className="font-medium">{item.description}</p>
                        <p className="text-sm text-gray-500">
                          {item.type} • {item.unit}
                        </p>
                      </div>
                    </td>
                    <td className="p-4 text-center text-gray-700">
                      {item.quantity}
                    </td>
                    <td className="p-4 text-right text-gray-700">
                      {getCurrencySymbol(invoice.summary.currency)}
                      {item.unitPrice.toFixed(2)}
                    </td>
                    <td className="p-4 text-right font-medium text-gray-800">
                      {getCurrencySymbol(invoice.summary.currency)}
                      {item.total.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Summary */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Summary</h2>
          <div className="space-y-3">
            {invoice.summary.baseStorageCost > 0 && (
              <div className="flex justify-between text-gray-700">
                <span>Base Storage Cost:</span>
                <span className="font-medium">
                  {getCurrencySymbol(invoice.summary.currency)}
                  {invoice.summary.baseStorageCost.toFixed(2)}
                </span>
              </div>
            )}
            {invoice.summary.redeliveryFee > 0 && (
              <div className="flex justify-between text-gray-700">
                <span>Redelivery Fee:</span>
                <span className="font-medium">
                  {getCurrencySymbol(invoice.summary.currency)}
                  {invoice.summary.redeliveryFee.toFixed(2)}
                </span>
              </div>
            )}
            {invoice.summary.climateControlCost > 0 && (
              <div className="flex justify-between text-gray-700">
                <span>Climate Control:</span>
                <span className="font-medium">
                  {getCurrencySymbol(invoice.summary.currency)}
                  {invoice.summary.climateControlCost.toFixed(2)}
                </span>
              </div>
            )}
            {invoice.summary.addonsCost > 0 && (
              <div className="flex justify-between text-gray-700">
                <span>Add-ons Cost:</span>
                <span className="font-medium">
                  {getCurrencySymbol(invoice.summary.currency)}
                  {invoice.summary.addonsCost.toFixed(2)}
                </span>
              </div>
            )}
            {invoice.summary.addonsDeliveryCost > 0 && (
              <div className="flex justify-between text-gray-700">
                <span>Add-ons Delivery Cost:</span>
                <span className="font-medium">
                  {getCurrencySymbol(invoice.summary.currency)}
                  {invoice.summary.addonsDeliveryCost.toFixed(2)}
                </span>
              </div>
            )}
            {invoice.summary.protectionPlanCost > 0 && (
              <div className="flex justify-between text-gray-700">
                <span>Protection Plan:</span>
                <span className="font-medium">
                  {getCurrencySymbol(invoice.summary.currency)}
                  {invoice.summary.protectionPlanCost.toFixed(2)}
                </span>
              </div>
            )}
            {invoice.summary.zoneDeliveryCharges > 0 && (
                <div className="flex justify-between text-gray-700">
                  <span>Zone Delivery Charges:</span>
                  <span className="font-medium">
                    {getCurrencySymbol(invoice.summary.currency)}
                    {invoice.summary.zoneDeliveryCharges.toFixed(2)}
                  </span>
                </div>
              )}
            {invoice.summary.savings > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Savings:</span>
                <span className="font-medium">
                  -{getCurrencySymbol(invoice.summary.currency)}
                  {invoice.summary.savings.toFixed(2)}
                </span>
              </div>
            )}
            <div className="flex justify-between text-xl font-bold text-[#4c4946] pt-4 border-t-2 border-gray-300">
              <span>Total:</span>
              <span className="text-2xl text-[#f8992f]">
                {getCurrencySymbol(invoice.summary.currency)}
                {invoice.summary.total.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* Print/Download Actions */}
        <div className="mt-8 flex gap-4 justify-end">
          <button
            onClick={() => {
              if (typeof globalThis.print === "function") {
                globalThis.print();
              }
            }}
            className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Print Invoice
          </button>
          <button
            onClick={handleDownloadPDF}
            disabled={isGeneratingPDF}
            className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGeneratingPDF ? "Generating Invoice..." : "Download Invoice"}
          </button>
        </div>
      </div>
    </div>
  );
}

