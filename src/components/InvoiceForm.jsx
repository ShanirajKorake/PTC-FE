// src/components/InvoiceForm.jsx
import React, { useState } from "react";
import InvoicePDF from "./InvoicePDF";

export default function InvoiceForm() {
  const [formData, setFormData] = useState({
    invoiceNo: "001",
    billDate: new Date().toISOString().split("T")[0],
    lrNo: "10886",
    vehicleNo: "MH 43 Y 7655",
    containerNo: "BMOU-6382983",
    loadingDate: new Date().toISOString().split("T")[0],
    unloadingDate: new Date().toISOString().split("T")[0],
    from: "IMPEX",
    to: "BHILAD",
    freight: "12000",
    advance: "3000",
    balance: "9000",
    remarks: "N/A",
    received: "No",
    commission: "0",
    chNo: "",
    date: new Date().toISOString().split("T")[0],
    partyName: "SAHIL ROADWAYS",
    partyAddress: "KALAMBOLI",
    contactNo: "9876543210",
    port: "Import 1x40",
    balanceVehicleWise: "6602",
    days: "2",
  });

  const [submittedData, setSubmittedData] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleGeneratePDF = (e) => {
    e.preventDefault();
    setSubmittedData(formData); // Pass data to InvoicePDF for rendering
  };

  return (
    <div className="max-w-6xl mx-auto bg-white shadow-lg rounded-2xl p-8 my-8">
      <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800">
        Create New Invoice
      </h2>

      <form
        onSubmit={handleGeneratePDF}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        {Object.keys(formData).map((key) => (
          <div key={key} className="flex flex-col">
            <label
              htmlFor={key}
              className="text-gray-700 font-medium mb-1 capitalize"
            >
              {key
                .replace(/([A-Z])/g, " $1")
                .replace(/^./, (str) => str.toUpperCase())}
            </label>
            <input
              id={key}
              name={key}
              type={
                key.toLowerCase().includes("date")
                  ? "date"
                  : key.toLowerCase().includes("days") ||
                    key.toLowerCase().includes("balance") ||
                    key.toLowerCase().includes("freight") ||
                    key.toLowerCase().includes("advance") ||
                    key.toLowerCase().includes("commission")
                  ? "number"
                  : "text"
              }
              value={formData[key]}
              onChange={handleChange}
              className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
        ))}

        <div className="md:col-span-2 flex justify-center mt-6">
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-all duration-200"
          >
            Generate Invoice PDF
          </button>
        </div>
      </form>

      {/* PDF Preview */}
      {submittedData && (
        <div className="mt-10">
          <h3 className="text-xl font-semibold mb-4 text-gray-700 text-center">
            Invoice Preview
          </h3>
          <InvoicePDF formData={submittedData} />
        </div>
      )}
    </div>
  );
}
