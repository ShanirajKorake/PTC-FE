// src/components/InvoicePDF.jsx
import React, { useEffect, useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function InvoicePDF({ formData }) {
  const [pdfUrl, setPdfUrl] = useState(null);

  useEffect(() => {
    if (!formData) return;

    const doc = new jsPDF();

    // Header
    doc.setFontSize(16);
    doc.text("PALAK TRANSPORT CORP", 70, 15);
    doc.setFontSize(10);
    doc.text("Fleet Owners & Transport Contractors", 70, 21);
    doc.text("Specialist in Container Handling", 70, 26);
    doc.text("Plot No. 38, Sector 19C, Vashi, Navi Mumbai - 400705", 70, 31);
    doc.text(
      "Email: palaktransportcorp@gmail.com | Mob: 9820991620 / 9920991620",
      20,
      36
    );
    doc.text("Subject to Navi Mumbai Jurisdiction", 70, 42);

    // Line under header
    doc.line(10, 45, 200, 45);

    // Invoice title
    doc.setFontSize(12);
    doc.text("TAX INVOICE", 90, 52);

    // Customer details
    doc.setFontSize(10);
    doc.text(`Invoice No: ${formData.invoiceNo}`, 20, 60);
    doc.text(`Bill Date: ${formData.billDate}`, 150, 60);
    doc.text(`Party Name: ${formData.partyName}`, 20, 67);
    doc.text(`Address: ${formData.partyAddress}`, 20, 73);
    doc.text(`Contact: ${formData.contactNo}`, 20, 79);
    doc.text(`Port: ${formData.port}`, 150, 73);

    // Transport info table
    autoTable(doc, {
      startY: 85,
      theme: "grid",
      styles: { halign: "center", fontSize: 9 },
      headStyles: { fillColor: [230, 230, 230] },
      head: [["L.R No", "Vehicle No", "Container No", "From", "To"]],
      body: [
        [
          formData.lrNo,
          formData.vehicleNo,
          formData.containerNo,
          formData.from,
          formData.to,
        ],
      ],
    });

    // Dates
    let finalY = doc.lastAutoTable.finalY + 5;
    doc.text(`Loading Date: ${formData.loadingDate}`, 20, finalY);
    doc.text(`Unloading Date: ${formData.unloadingDate}`, 120, finalY);

    // Charges table
    autoTable(doc, {
      startY: finalY + 8,
      theme: "grid",
      styles: { halign: "center", fontSize: 9 },
      headStyles: { fillColor: [240, 240, 240] },
      head: [["Freight", "Advance", "Balance", "Commission", "Received"]],
      body: [
        [
          formData.freight,
          formData.advance,
          formData.balance,
          formData.commission,
          formData.received,
        ],
      ],
    });

    finalY = doc.lastAutoTable.finalY + 10;
    doc.text(`Balance Vehicle Wise: ${formData.balanceVehicleWise}`, 20, finalY);
    doc.text(`Days: ${formData.days}`, 150, finalY);
    doc.text(`Remarks: ${formData.remarks}`, 20, finalY + 8);
    doc.text(`Ch. No: ${formData.chNo}`, 20, finalY + 16);
    doc.text(`Date: ${formData.date}`, 120, finalY + 16);

    // Footer
    doc.text("For PALAK TRANSPORT CORP", 140, finalY + 35);
    doc.text("(Authorized Signatory)", 142, finalY + 42);

    // Generate blob URL for iframe
    const blob = doc.output("blob");
    const url = URL.createObjectURL(blob);
    setPdfUrl(url);

    // Clean up the URL on unmount
    return () => URL.revokeObjectURL(url);
  }, [formData]);

  return (
    <div style={{ width: "100%", height: "600px", border: "1px solid #ccc" }}>
      {pdfUrl ? (
        <iframe
          src={pdfUrl}
          title="Invoice PDF"
          width="100%"
          height="100%"
        />
      ) : (
        <p>Loading PDF...</p>
      )}
    </div>
  );
}
    