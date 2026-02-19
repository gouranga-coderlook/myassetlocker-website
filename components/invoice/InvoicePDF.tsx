import React from "react";
import { Document, Page, Text, View, StyleSheet, Image } from "@react-pdf/renderer";
import { type Invoice } from "@/lib/api/invoiceService";

// Company Information
const companyInfo = {
  name: "MyAssetLocker",
  address: "123 Storage Street",
  city: "New York",
  state: "NY",
  zipCode: "10001",
  phone: "+1 (555) 123-4567",
  email: "support@myassetlocker.com",
  taxId: "TAX-123456",
};

// Create styles
const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#FFFFFF",
    padding: 30,
    fontFamily: "Helvetica",
  },
  header: {
    marginBottom: 15,
    paddingBottom: 10,
    borderBottom: "2 solid #f8992f",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  headerLeft: {
    flex: 1,
  },
  headerRight: {
    width: "45%",
    alignItems: "flex-end",
  },
  companyLogo: {
    width: 80,
    height: 40,
    marginBottom: 5,
    objectFit: "contain",
  },
  companyName: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#4c4946",
    marginBottom: 3,
  },
  companyInfo: {
    fontSize: 8,
    color: "#666666",
    marginBottom: 2,
    textAlign: "right",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#4c4946",
    marginBottom: 3,
  },
  invoiceNumber: {
    fontSize: 10,
    color: "#666666",
    marginTop: 3,
  },
  statusBadge: {
    backgroundColor: "#10b981",
    color: "#FFFFFF",
    padding: "3 10",
    borderRadius: 3,
    fontSize: 9,
    fontWeight: "bold",
    marginTop: 5,
    alignSelf: "flex-start",
  },
  section: {
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#4c4946",
    marginBottom: 6,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  twoColumn: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  column: {
    width: "48%",
  },
  label: {
    fontSize: 9,
    color: "#666666",
    marginBottom: 2,
  },
  value: {
    fontSize: 9,
    color: "#000000",
  },
  customerInfo: {
    fontSize: 9,
    color: "#000000",
    marginBottom: 2,
  },
  planBox: {
    backgroundColor: "#fff7ed",
    padding: 8,
    borderRadius: 3,
    marginBottom: 12,
    border: "1 solid #f8992f",
  },
  planText: {
    fontSize: 9,
    color: "#000000",
    marginBottom: 2,
  },
  discountText: {
    fontSize: 8,
    color: "#10b981",
    marginTop: 3,
  },
  table: {
    marginTop: 6,
    marginBottom: 12,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#f3f4f6",
    padding: 6,
    borderBottom: "1 solid #e5e7eb",
  },
  tableRow: {
    flexDirection: "row",
    padding: 6,
    borderBottom: "1 solid #e5e7eb",
  },
  tableCol1: {
    width: "40%",
    fontSize: 9,
    color: "#000000",
  },
  tableCol2: {
    width: "15%",
    fontSize: 9,
    color: "#000000",
    textAlign: "center",
  },
  tableCol3: {
    width: "20%",
    fontSize: 9,
    color: "#000000",
    textAlign: "right",
  },
  tableCol4: {
    width: "25%",
    fontSize: 9,
    color: "#000000",
    fontWeight: "bold",
    textAlign: "right",
  },
  tableHeaderText: {
    fontSize: 9,
    fontWeight: "bold",
    color: "#4c4946",
  },
  summaryBox: {
    backgroundColor: "#f9fafb",
    padding: 10,
    borderRadius: 3,
    marginTop: 6,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
    fontSize: 9,
    color: "#000000",
  },
  summaryTotal: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 6,
    paddingTop: 6,
    borderTop: "2 solid #d1d5db",
    fontSize: 12,
    fontWeight: "bold",
    color: "#4c4946",
  },
  totalAmount: {
    fontSize: 14,
    color: "#f8992f",
  },
  savingsText: {
    color: "#10b981",
  },
  footer: {
    marginTop: 15,
    paddingTop: 10,
    borderTop: "1 solid #e5e7eb",
    fontSize: 8,
    color: "#666666",
    textAlign: "center",
  },
});

interface InvoicePDFProps {
  invoice: Invoice;
}

const InvoicePDF: React.FC<InvoicePDFProps> = ({ invoice }) => {
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

  const getCurrencySymbol = (currency: string) => {
    return currency === "USD" ? "$" : currency;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PAID":
        return "#10b981";
      case "PENDING":
        return "#f59e0b";
      case "FAILED":
        return "#ef4444";
      case "CANCELLED":
        return "#6b7280";
      default:
        return "#6b7280";
    }
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.title}>INVOICE</Text>
            <Text style={styles.invoiceNumber}>
              Invoice #: {invoice.id.slice(0, 8).toUpperCase()}
            </Text>
            <View
              style={[
                styles.statusBadge,
                { backgroundColor: getStatusColor(invoice.paymentStatus) },
              ]}
            >
              <Text>{invoice.paymentStatus}</Text>
            </View>
          </View>
          
          <View style={styles.headerRight}>
            {/* Company Logo */}
            {/* eslint-disable-next-line jsx-a11y/alt-text */}
            <Image
              src="/logo.png"
              style={styles.companyLogo}
            />
            <Text style={styles.companyName}>{companyInfo.name}</Text>
            <Text style={styles.companyInfo}>
             {companyInfo.address}, {companyInfo.city}, {companyInfo.state} {companyInfo.zipCode}
            </Text>
            <Text style={styles.companyInfo}>{companyInfo.phone}</Text>
            <Text style={styles.companyInfo}>{companyInfo.email}</Text>
          </View>
        </View>

        {/* Invoice Info and Customer Info */}
        <View style={styles.twoColumn}>
          <View style={styles.column}>
            <Text style={styles.sectionTitle}>Invoice Information</Text>
            <Text style={styles.label}>Invoice Date:</Text>
            <Text style={styles.value}>{formatDate(invoice.invoiceDate)}</Text>
            <Text style={styles.label}>Payment ID:</Text>
            <Text style={styles.value}>
              {invoice.paymentId.slice(0, 8).toUpperCase()}
            </Text>
            {/* <Text style={styles.label}>Cart Item ID:</Text>
            <Text style={styles.value}>
              {invoice.cartItemId?.slice(0, 8).toUpperCase() || "N/A"}
            </Text> */}
          </View>

          <View style={styles.column}>
            <Text style={styles.sectionTitle}>Bill To</Text>
            <Text style={styles.customerInfo}>{invoice.customer.name}</Text>
            <Text style={styles.customerInfo}>{invoice.customer.email}</Text>
            <Text style={styles.customerInfo}>{invoice.customer.phone}</Text>
            <Text style={styles.customerInfo}>{invoice.customer.address}</Text>
            <Text style={styles.customerInfo}>
              {invoice.customer.city}, {invoice.customer.state}{" "}
              {invoice.customer.zip}
            </Text>
          </View>
        </View>

        {/* Plan Information */}
        {invoice.plan && (
          <View style={styles.planBox}>
            <Text style={styles.sectionTitle}>Selected Plan</Text>
            <Text style={styles.planText}>
              <Text style={{ fontWeight: "bold" }}>{invoice.plan.name}</Text> - {invoice.plan.details}
            </Text>
            {invoice.plan.hasDiscount && (
              <Text style={styles.discountText}>
                {invoice.plan.discountPercentage}% discount applied
              </Text>
            )}
          </View>
        )}

        {/* Invoice Items Table */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Invoice Items</Text>
          <View style={styles.table}>
            <View style={styles.tableHeader}>
              <Text style={[styles.tableCol1, styles.tableHeaderText]}>
                Description
              </Text>
              <Text style={[styles.tableCol2, styles.tableHeaderText]}>
                Qty
              </Text>
              <Text style={[styles.tableCol3, styles.tableHeaderText]}>
                Unit Price
              </Text>
              <Text style={[styles.tableCol4, styles.tableHeaderText]}>
                Total
              </Text>
            </View>
            {invoice.items.map((item, index) => {
              const itemKey = `${item.type}-${item.description}-${item.unitPrice}-${index}`;
              return (
              <View key={itemKey} style={styles.tableRow}>
                <View style={styles.tableCol1}>
                  <Text>{item.description}</Text>
                  <Text style={{ fontSize: 7, color: "#666666", marginTop: 1 }}>
                    {item.type} • {item.unit}
                  </Text>
                </View>
                <Text style={styles.tableCol2}>{item.quantity}</Text>
                <Text style={styles.tableCol3}>
                  {getCurrencySymbol(invoice.summary.currency)}{item.unitPrice.toFixed(2)}
                </Text>
                <Text style={styles.tableCol4}>
                  {getCurrencySymbol(invoice.summary.currency)}{item.total.toFixed(2)}
                </Text>
              </View>
              );
            })}
          </View>
        </View>

        {/* Summary */}
        <View style={styles.summaryBox}>
          <Text style={styles.sectionTitle}>Summary</Text>
          {invoice.summary.baseStorageCost > 0 && (
            <View style={styles.summaryRow}>
              <Text>Base Storage Cost:</Text>
              <Text>
                {getCurrencySymbol(invoice.summary.currency)}{invoice.summary.baseStorageCost.toFixed(2)}
              </Text>
            </View>
          )}
          {invoice.summary.redeliveryFee > 0 && (
            <View style={styles.summaryRow}>
              <Text>Redelivery Fee:</Text>
              <Text>
                {getCurrencySymbol(invoice.summary.currency)}{invoice.summary.redeliveryFee.toFixed(2)}
              </Text>
            </View>
          )}
          {invoice.summary.climateControlCost > 0 && (
            <View style={styles.summaryRow}>
              <Text>Climate Control:</Text>
              <Text>
                {getCurrencySymbol(invoice.summary.currency)}{invoice.summary.climateControlCost.toFixed(2)}
              </Text>
            </View>
          )}
          {invoice.summary.addonsCost > 0 && (
            <View style={styles.summaryRow}>
              <Text>Add-ons Cost:</Text>
              <Text>
                {getCurrencySymbol(invoice.summary.currency)}{invoice.summary.addonsCost.toFixed(2)}
              </Text>
            </View>
          )}
          {invoice.summary.addonsDeliveryCost > 0 && (
            <View style={styles.summaryRow}>
              <Text>Add-ons Delivery Cost:</Text>
              <Text>
                {getCurrencySymbol(invoice.summary.currency)}{invoice.summary.addonsDeliveryCost.toFixed(2)}
              </Text>
            </View>
          )}
          {invoice.summary.protectionPlanCost > 0 && (
            <View style={styles.summaryRow}>
              <Text>Protection Plan:</Text>
              <Text>
                {getCurrencySymbol(invoice.summary.currency)}{invoice.summary.protectionPlanCost.toFixed(2)}
              </Text>
            </View>
          )}
          {invoice.summary.zoneDeliveryCharges && invoice.summary.zoneDeliveryCharges > 0 && (
            <View style={styles.summaryRow}>
              <Text>Zone Delivery Charges:</Text>
              <Text>
                {getCurrencySymbol(invoice.summary.currency)}{invoice.summary.zoneDeliveryCharges.toFixed(2)}
              </Text>
            </View>
          )}
          {invoice.summary.savings > 0 && (
            <View style={[styles.summaryRow, styles.savingsText]}>
              <Text>Savings:</Text>
              <Text>
                -{getCurrencySymbol(invoice.summary.currency)}{invoice.summary.savings.toFixed(2)}
              </Text>
            </View>
          )}
          <View style={styles.summaryTotal}>
            <Text>Total:</Text>
            <Text style={styles.totalAmount}>
              {getCurrencySymbol(invoice.summary.currency)}{invoice.summary.total.toFixed(2)}
            </Text>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text>Thank you for your business!</Text>
          <Text style={{ marginTop: 3 }}>
            This is a computer-generated invoice. No signature required.
          </Text>
        </View>
      </Page>
    </Document>
  );
};

export default InvoicePDF;

