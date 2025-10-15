import React, { useState, useEffect } from "react";
import { Plus, Trash2, ArrowLeft } from "lucide-react";
import InvoicePDF from "./InvoicePDF";

// // InvoicePDF Component (Must be in the same file as per single-file mandate)
// const InvoicePDF = ({ formData, vehicles }) => {
//   const totalBalance = vehicles.reduce((sum, v) => sum + parseFloat(v.balance || 0), 0).toFixed(2);
//   const totalAdvance = vehicles.reduce((sum, v) => sum + parseFloat(v.advance || 0), 0).toFixed(2);
//   const totalFreight = vehicles.reduce((sum, v) => sum + parseFloat(v.totalFreight || 0), 0).toFixed(2);

//   return (
//     <div className="p-8 bg-white border border-gray-200 rounded-xl shadow-2xl space-y-8 print:shadow-none">
//       <header className="text-center border-b-2 pb-4 border-blue-600">
//         <h1 className="text-4xl font-extrabold text-blue-800 mb-1">INVOICE</h1>
//         <p className="text-xl text-gray-700 font-semibold">{formData.partyName}</p>
//         <p className="text-sm text-gray-500">{formData.partyAddress}</p>
//       </header>

//       {/* Header Details */}
//       <div className="grid grid-cols-3 gap-4 text-sm font-medium">
//         <div className="col-span-1 p-3 border rounded-lg bg-gray-50">
//             <p><span className="text-gray-600">Invoice No:</span> <span className="font-bold text-gray-800">{formData.invoiceNo}</span></p>
//             <p><span className="text-gray-600">Date:</span> {formData.billDate}</p>
//         </div>
//         <div className="col-span-2 p-3 border rounded-lg bg-gray-50">
//             <p><span className="text-gray-600">Route:</span> <span className="font-bold text-gray-800">{formData.from} → {formData.to} → {formData.backTo}</span></p>
//             <p><span className="text-gray-600">Dates:</span> Loading ({formData.loadingDate}) / Unloading ({formData.unloadingDate})</p>
//         </div>
//       </div>

//       {/* Vehicle Table */}
//       <div className="overflow-x-auto rounded-lg border border-gray-200">
//         <table className="min-w-full divide-y divide-gray-200">
//           <thead className="bg-blue-50">
//             <tr className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
//               <th className="px-3 py-3 text-left">LR / Vehicle / Container</th>
//               <th className="px-3 py-3 text-right">Freight</th>
//               <th className="px-3 py-3 text-right">Charges</th>
//               <th className="px-3 py-3 text-right">Commission</th>
//               <th className="px-3 py-3 text-right">Total Freight</th>
//               <th className="px-3 py-3 text-right">Advance</th>
//               <th className="px-3 py-3 text-right">Balance Due</th>
//             </tr>
//           </thead>
//           <tbody className="bg-white divide-y divide-gray-100">
//             {vehicles.map((v, index) => (
//               <tr key={index} className="text-sm hover:bg-yellow-50/50">
//                 <td className="px-3 py-2 whitespace-nowrap">
//                   <p className="font-semibold text-gray-900">{v.lrNo}</p>
//                   <p className="text-xs text-blue-600">{v.vehicleNo}</p>
//                   <p className="text-xs text-gray-500">{v.containerNo}</p>
//                 </td>
//                 <td className="px-3 py-2 text-right">{parseFloat(v.freight).toLocaleString()}</td>
//                 <td className="px-3 py-2 text-right">
//                     {/* Sum of Unloading + Detention + Weight + Others */}
//                     {(parseFloat(v.unloadingCharges) + parseFloat(v.detention) + parseFloat(v.weightCharges) + parseFloat(v.others)).toFixed(2)}
//                 </td>
//                 <td className="px-3 py-2 text-right font-medium text-purple-600">{parseFloat(v.commission).toLocaleString()}</td>
//                 <td className="px-3 py-2 text-right font-bold text-gray-800">{parseFloat(v.totalFreight).toLocaleString()}</td>
//                 <td className="px-3 py-2 text-right text-red-600">{parseFloat(v.advance).toLocaleString()}</td>
//                 <td className="px-3 py-2 text-right font-extrabold text-green-700">{parseFloat(v.balance).toLocaleString()}</td>
//               </tr>
//             ))}
//           </tbody>
//           {/* Total Row */}
//           <tfoot className="bg-blue-100 border-t-2 border-blue-600">
//             <tr className="text-sm font-extrabold text-blue-900">
//                 <td className="px-3 py-3 text-right uppercase">Invoice Total</td>
//                 <td className="px-3 py-3 text-right" colSpan="3"></td>
//                 <td className="px-3 py-3 text-right">{parseFloat(totalFreight).toLocaleString()}</td>
//                 <td className="px-3 py-3 text-right text-red-700">{parseFloat(totalAdvance).toLocaleString()}</td>
//                 <td className="px-3 py-3 text-right text-green-900">{parseFloat(totalBalance).toLocaleString()}</td>
//             </tr>
//           </tfoot>
//         </table>
//       </div>
      
//       {/* Commission and Notes */}
//       <div className="flex justify-between items-start pt-4 border-t border-gray-300">
//           <div className="w-1/3 p-4 bg-purple-50 rounded-lg border border-purple-200">
//               <p className="text-lg font-bold text-purple-800">Total Commission Paid:</p>
//               <p className="text-3xl font-extrabold text-purple-900 mt-1">₹ {parseFloat(formData.commission).toLocaleString()}</p>
//           </div>
//           <div className="text-right">
//               <p className="text-lg font-semibold text-gray-800">For {formData.partyName}</p>
//               <div className="mt-12">
//                 <p className="border-t border-gray-400 pt-2 text-sm text-gray-500">Authorized Signature</p>
//               </div>
//           </div>
//       </div>
//     </div>
//   );
// };


// Main Application Component
export default function App() {
  const [formData, setFormData] = useState({
    invoiceNo: "1",
    billDate: new Date().toISOString().split("T")[0],
    partyName: "SAHIL ROADWAYS",
    partyAddress: "KALAMBOLI",
    // Global trip details
    from: "IMPEX",
    to: "BHILAD",
    backTo: "PANINDIA",
    // Global dates
    loadingDate: "2024-08-16",
    unloadingDate: "2024-08-18",
    // Total Commission (Calculated)
    commission: "0.00", 
  });

  const [vehicles, setVehicles] = useState([
    {
      lrNo: "10886",
      vehicleNo: "MH 43 Y 7655",
      containerNo: "BMOU-6382983",
      freight: "28000",
      unloadingCharges: "4602",
      detention: "0",
      weightCharges: "0",
      others: "0",
      commission: "500", 
      totalFreight: "33102.00", 
      advance: "26000",
      balance: "7102.00", 
    },
  ]);

  const [showPreview, setShowPreview] = useState(false);

  // Effect to automatically calculate total commission whenever vehicles change
  useEffect(() => {
    const totalCommission = vehicles.reduce((sum, v) => sum + parseFloat(v.commission || 0), 0);
    setFormData(prev => ({ 
        ...prev, 
        commission: totalCommission.toFixed(2).toString() 
    }));
  }, [vehicles]);


  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleVehicleChange = (index, field, value) => {
    const updated = [...vehicles];
    updated[index][field] = value;
    
    // Fields that trigger recalculation
    const calculationFields = ['freight', 'unloadingCharges', 'detention', 'weightCharges', 'others', 'commission', 'advance'];

    if (calculationFields.includes(field)) {
      const v = updated[index];
      
      // Calculate Total Freight: Sum of all charges + commission
      // Ensure all fields are treated as numbers, defaulting to 0 if empty or invalid
      const total = parseFloat(v.freight || 0) + 
                    parseFloat(v.unloadingCharges || 0) + 
                    parseFloat(v.detention || 0) + 
                    parseFloat(v.weightCharges || 0) + 
                    parseFloat(v.others || 0) +
                    parseFloat(v.commission || 0);

      // Recalculate Total Freight and Balance
      updated[index].totalFreight = total.toFixed(2).toString();
      updated[index].balance = (total - parseFloat(v.advance || 0)).toFixed(2).toString();
    }
    
    setVehicles(updated);
  };

  // FIX: Copy all vehicle data except the unique ID fields
  const addVehicle = () => {
    const lastVehicle = vehicles[vehicles.length - 1];

    if (lastVehicle) {
        // 1. Copy all properties (charges, commission, advance, totalFreight, balance)
        const newVehicle = { ...lastVehicle };
        
        // 2. Reset the unique identifier fields as requested
        newVehicle.lrNo = "";
        newVehicle.vehicleNo = "";
        newVehicle.containerNo = "";

        // The remaining fields (charges, totals, balance) are correctly copied as strings.
        
        setVehicles([...vehicles, newVehicle]);
    } else {
        // Fallback for an empty array
        setVehicles([...vehicles, {
          lrNo: "", vehicleNo: "", containerNo: "",
          freight: "0.00", unloadingCharges: "0.00", detention: "0.00",
          weightCharges: "0.00", others: "0.00", commission: "0.00", 
          totalFreight: "0.00", advance: "0.00", balance: "0.00",
        }]);
    }
  };

  const removeVehicle = (index) => {
    if (vehicles.length > 1) {
      setVehicles(vehicles.filter((_, i) => i !== index));
    }
  };

  const handleGeneratePDF = () => {
    setShowPreview(true);
  };
  
  // Calculate summary totals for the form view
  const totalBalance = vehicles.reduce((sum, v) => sum + parseFloat(v.balance || 0), 0).toFixed(2);
  const totalAdvance = vehicles.reduce((sum, v) => sum + parseFloat(v.advance || 0), 0).toFixed(2);
  const totalFreight = vehicles.reduce((sum, v) => sum + parseFloat(v.totalFreight || 0), 0).toFixed(2);


  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-8">
      <div className="max-w-7xl mx-auto bg-white shadow-xl rounded-2xl p-8">
        {!showPreview ? (
          <div>
            <h2 className="text-3xl font-extrabold mb-6 text-center text-blue-900">
              New Invoice
            </h2>

            {/* Bill & Trip Information */}
            <div className="bg-blue-50 p-6 rounded-lg mb-6 shadow-md">
              <h3 className="text-xl font-semibold mb-4 text-blue-900">Bill & Global Trip Information</h3>
              
              {/* Row 1: Bill Info */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                {['invoiceNo', 'billDate', 'partyName'].map((name, i) => (
                    <div key={name}>
                      <label className="block text-sm font-medium text-gray-700 mb-1">{name.replace(/([A-Z])/g, ' $1').trim()}</label>
                      <input
                        type={name.includes('Date') ? 'date' : 'text'}
                        name={name}
                        value={formData[name]}
                        onChange={handleFormChange}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150"
                      />
                    </div>
                ))}
              </div>
              
              {/* Row 2: Global Trip Details & Dates */}
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                {['loadingDate', 'unloadingDate', 'from', 'to', 'backTo'].map((name) => (
                    <div key={name}>
                      <label className="block text-sm font-medium text-gray-700 mb-1">{name.replace(/([A-Z])/g, ' $1').trim()} (All)</label>
                      <input
                        type={name.includes('Date') ? 'date' : 'text'}
                        name={name}
                        value={formData[name]}
                        onChange={handleFormChange}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150"
                      />
                    </div>
                ))}
              </div>

              <div className="mt-4">
                 <label className="block text-sm font-medium text-gray-700 mb-1">Party Address</label>
                 <input
                    type="text"
                    name="partyAddress"
                    value={formData.partyAddress}
                    onChange={handleFormChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150"
                  />
              </div>
            </div>

            {/* Vehicle Details Section */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-gray-800">Vehicle Details ({vehicles.length})</h3>
                <button
                  type="button"
                  onClick={addVehicle}
                  className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-xl shadow-md hover:bg-green-700 transition duration-200 transform hover:scale-[1.02]"
                >
                  <Plus size={18} />
                  Add Vehicle
                </button>
              </div>

              {vehicles.map((vehicle, index) => (
                <div key={index} className="bg-white p-6 rounded-xl mb-6 shadow-lg border-t-4 border-blue-500">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="text-xl font-bold text-blue-700">Vehicle #{index + 1}</h4>
                    {vehicles.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeVehicle(index)}
                        className="text-red-600 hover:text-red-800 flex items-center gap-1 p-2 rounded-full hover:bg-red-50 transition"
                      >
                        <Trash2 size={18} />
                        Remove
                      </button>
                    )}
                  </div>

                  {/* Vehicle Numbers (Unique IDs - LR No, Vehicle No, Container No) */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
                    {['lrNo', 'vehicleNo', 'containerNo'].map(field => (
                        <div key={field}>
                          <label className="block text-sm font-medium text-gray-700 mb-1">{field.replace(/([A-Z])/g, ' $1').trim()}</label>
                          <input
                            type="text"
                            value={vehicle[field]}
                            onChange={(e) => handleVehicleChange(index, field, e.target.value)}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                          />
                        </div>
                    ))}
                  </div>

                  {/* Charges & Advance */}
                  <h5 className="text-md font-semibold text-gray-700 mb-3 border-b pb-2">Charges, Commission & Advance</h5>
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {/* Input Fields */}
                    {['freight', 'unloadingCharges', 'detention', 'weightCharges', 'others', 'commission', 'advance'].map(field => (
                        <div key={field}>
                            <label className="block text-sm font-medium text-gray-700 mb-1">{field.replace(/([A-Z])/g, ' $1').trim()}</label>
                            <input
                              type="number"
                              value={vehicle[field]}
                              onChange={(e) => handleVehicleChange(index, field, e.target.value)}
                              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="0.00"
                            />
                        </div>
                    ))}
                    
                    {/* Calculated Fields */}
                    <div className="lg:col-span-1">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Total Freight</label>
                      <input
                        type="number"
                        value={vehicle.totalFreight}
                        readOnly
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-blue-100 text-blue-900 font-semibold"
                      />
                    </div>
                    <div className="lg:col-span-1">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Balance</label>
                      <input
                        type="number"
                        value={vehicle.balance}
                        readOnly
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-green-100 text-green-800 font-bold"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* INVOICE SUMMARY SECTION (Updated to show all totals) */}
            <div className="bg-gray-100 p-6 rounded-xl mb-8 shadow-inner border border-gray-200">
              <h3 className="text-xl font-extrabold mb-4 text-gray-800">Invoice Totals Summary</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                
                {/* Total Freight */}
                <div className="col-span-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Total Freight Value</label>
                  <div className="w-full border-2 border-blue-300 rounded-lg px-4 py-3 bg-blue-100 text-blue-900 font-extrabold text-xl shadow-inner">
                    ₹ {parseFloat(totalFreight).toLocaleString()}
                  </div>
                </div>
                
                {/* Total Commission */}
                <div className="col-span-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Total Commission Payable</label>
                  <div className="w-full border-2 border-purple-300 rounded-lg px-4 py-3 bg-purple-100 text-purple-900 font-extrabold text-xl shadow-inner">
                    ₹ {parseFloat(formData.commission).toLocaleString()}
                  </div>
                </div>

                {/* Total Advance */}
                <div className="col-span-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Total Advance Given</label>
                  <div className="w-full border-2 border-red-300 rounded-lg px-4 py-3 bg-red-100 text-red-800 font-extrabold text-xl shadow-inner">
                    ₹ {parseFloat(totalAdvance).toLocaleString()}
                  </div>
                </div>

                {/* Total Balance Due */}
                <div className="col-span-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Total Balance Due</label>
                  <div className="w-full border-2 border-green-300 rounded-lg px-4 py-3 bg-green-100 text-green-800 font-extrabold text-xl shadow-inner">
                    ₹ {parseFloat(totalBalance).toLocaleString()}
                  </div>
                </div>
                
              </div>
            </div>

            <div className="flex justify-center">
              <button
                onClick={handleGeneratePDF}
                className="bg-blue-600 text-white px-10 py-4 rounded-xl shadow-lg hover:bg-blue-700 transition-all duration-300 text-xl font-semibold transform hover:scale-[1.02]"
              >
                Generate Invoice PDF
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-gray-800">Invoice Preview</h3>
              <button
                onClick={() => setShowPreview(false)}
                className="flex items-center gap-2 bg-gray-600 text-white px-4 py-2 rounded-xl hover:bg-gray-700 transition"
              >
                <ArrowLeft size={18} /> Back to Form
              </button>
            </div>
            <InvoicePDF formData={formData} vehicles={vehicles} />
          </div>
        )}
      </div>
    </div>
  );
}
