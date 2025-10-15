import React, { useEffect, useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// NOTE: These relative imports (headerImg, footerImg) will only work if you 
// have an external tool that compiles these assets. For this environment, 
// we assume they are handled by your setup.
import headerImg from "../assets/ptc1.jpg";
import footerImg from "../assets/ptc2.jpg";
import signImg from "../assets/sign.png"; // <-- Added Signature Image Import
import ptc3 from "../assets/ptc3.jpg"; // <-- Added Footer Image Import
import ptc4 from "../assets/ptc4.jpg"; // <-- Added Footer Image Import
import ptc5 from "../assets/ptc5.jpg"; // <-- Added Footer Image Import


export default function InvoicePDF({ formData, vehicles }) {
  // Updated state to store both the URL for preview and the desired filename for download
  const [pdfData, setPdfData] = useState({ url: null, filename: null });

  useEffect(() => {
    // --- 1. Validation and Initial Setup ---
    if (!formData || !vehicles || vehicles.length === 0) {
      setPdfData({ url: null, filename: null }); 
      return;
    }

    // --- Helper function to convert number to words (Indian system) ---
    const numberToWords = (n) => {
        if (typeof n !== 'number' || isNaN(n)) return 'Zero';
        const num = Math.floor(n);
        if (num === 0) return 'Zero';

        const a = ['', 'One ', 'Two ', 'Three ', 'Four ', 'Five ', 'Six ', 'Seven ', 'Eight ', 'Nine ', 'Ten ', 'Eleven ', 'Twelve ', 'Thirteen ', 'Fourteen ', 'Fifteen ', 'Sixteen ', 'Seventeen ', 'Eighteen ', 'Nineteen '];
        const b = ['', '', 'Twenty ', 'Thirty ', 'Forty ', 'Fifty ', 'Sixty ', 'Seventy ', 'Eighty ', 'Ninety '];

        const convertTens = (x) => (x < 20 ? a[x] : b[Math.floor(x / 10)] + a[x % 10]);

        const convertHundreds = (x) => {
            let s = convertTens(x % 100);
            if (x > 99) s = a[Math.floor(x / 100)] + 'Hundred ' + s;
            return s;
        };

        let words = '';
        let tempNum = num;

        // Crores (10,000,000)
        let part = Math.floor(tempNum / 10000000);
        if (part > 0) words += convertTens(part) + 'Crore ';
        tempNum %= 10000000;
        
        // Lakhs (100,000)
        part = Math.floor(tempNum / 100000);
        if (part > 0) words += convertTens(part) + 'Lakh ';
        tempNum %= 100000;

        // Thousands (1,000)
        part = Math.floor(tempNum / 1000);
        if (part > 0) words += convertTens(part) + 'Thousand ';
        tempNum %= 1000;
        
        // Hundreds (1)
        words += convertHundreds(tempNum);

        return words.trim() + ' Only';
    };
    // -------------------------------------------------------------------

    const doc = new jsPDF();

    // PDF Configuration Constants
    const PAGE_WIDTH = 210;
    const MARGIN = 10; // 10mm margin for 190mm usable width
    
    // Default Table Styles
    const TABLE_BASE_STYLES = {
      fontSize: 6.5,
      cellPadding: 1.5,
      // Change: Darkened text color for better readability
      textColor: [50, 50, 50], 
      lineColor: [0, 0, 0],
      lineWidth: 0.1,
      margin: { left: MARGIN, right: MARGIN },
      // Added: Default white fill color for all body cells
      alternateRowStyles: { fillColor: [255, 255, 255] }, 
      styles: { fillColor: [255, 255, 255] }
    };

    // Header Style
    const TABLE_HEAD_STYLES = { 
      fillColor: [200, 200, 200],
      textColor: [0, 0, 0],
      fontStyle: 'bold',
      halign: 'center',
      fontSize: 7.5
    };

    let currentY = 0;

    // --- 2. Helper Functions for Table Generation (6 Columns, Consolidated) ---

    const getVehicleTableConfig = () => {
      // 6 Columns: Vehicle Info, Charge Name, Charge Amount, Total Freight (A), Advance Paid (C), Balance Due (D=A-C)
      const head = [[
        'Vehicle Information', 
        'Charge Name', 
        'Charge Amount', 
        'TOTAL FREIGHT', 
        'TOTAL ADVANCE', 
        'BALANCE DUE' 
      ]]; 

      const N_ROWS_FOR_CHARGES = 6; 
      let body = [];

      // --- 2a. Aggregate Data Across All Vehicles ---
      const totalFreightAgg = vehicles.reduce((sum, v) => sum + parseFloat(v.totalFreight || 0), 0);
      const totalAdvanceAgg = vehicles.reduce((sum, v) => sum + parseFloat(v.advance || 0), 0);
      const totalBalanceAgg = vehicles.reduce((sum, v) => sum + parseFloat(v.balance || 0), 0);
      
      const aggregateCharges = {
          Freight: vehicles.reduce((sum, v) => sum + parseFloat(v.freight || 0), 0),
          Unloading: vehicles.reduce((sum, v) => sum + parseFloat(v.unloadingCharges || 0), 0),
          Detention: vehicles.reduce((sum, v) => sum + parseFloat(v.detention || 0), 0),
          Weight: vehicles.reduce((sum, v) => sum + parseFloat(v.weightCharges || 0), 0),
          Others: vehicles.reduce((sum, v) => sum + parseFloat(v.others || 0), 0),
          Commission: vehicles.reduce((sum, v) => sum + parseFloat(v.commission || 0), 0),
      };

      const charges = [
          { label: 'Freight', value: aggregateCharges.Freight },
          { label: 'Unloading Ch.', value: aggregateCharges.Unloading },
          { label: 'Detention Ch.', value: aggregateCharges.Detention },
          { label: 'Weight Ch.', value: aggregateCharges.Weight },
          { label: 'Other Ch.', value: aggregateCharges.Others },
          { label: 'Commission', value: aggregateCharges.Commission },
      ];

      // --- 2b. Vehicle Info Column Content (Concatenated) ---
      const vehicleInfoContent = vehicles.map((v, idx) => 
          `${idx + 1}. LR: ${v.lrNo || ''} | Veh: ${v.vehicleNo || ''} | Cont: ${v.containerNo || ''}`
      ).join('\n\n');
      
      // --- 2c. Total Column Content (Formatted) ---
      const totalFreightColumn = `${totalFreightAgg.toFixed(2)}`;
      const advancePaidColumn = `${totalAdvanceAgg.toFixed(2)}`;
      const balanceDueColumn = `${totalBalanceAgg.toFixed(2)}`;
      
      // --- 2d. Build the Body Rows ---
      for (let i = 0; i < N_ROWS_FOR_CHARGES; i++) {
          let row = [];
          const charge = charges[i];
          
          // Col 1: Vehicle Info (Only in the first row, spans N rows)
          if (i === 0) {
              row.push({ 
                  content: vehicleInfoContent, 
                  rowSpan: N_ROWS_FOR_CHARGES, 
                  styles: { 
                      fontStyle: 'bold', // Highlighted text
                      fontSize: 7.5, // Slightly larger font
                      valign: 'top',
                      // Highlight Vehicle Info with light yellow fill
                      fillColor: [255, 255, 240] 
                  } 
              });
          } 

          // Col 2: Charge Name
          row.push({ content: charge.label, styles: { fontSize: 6.5, fontStyle: 'normal' } });
          
          // Col 3: Charge Amount
          row.push({ content: charge.value.toFixed(2), styles: { halign: 'right', fontSize: 6.5, fontStyle: 'normal' } });

          // Col 4: Total Freight 
          if (i === 0) {
              row.push({ 
                  content: totalFreightColumn, 
                  rowSpan: N_ROWS_FOR_CHARGES, 
                  styles: { 
                      fontStyle: 'bold', 
                      fontSize: 8.5, 
                      halign: 'right', 
                      valign: 'top', 
                  } 
              });
          }

          // Col 5: Total Advance
           if (i === 0) {
              row.push({ 
                  content: advancePaidColumn, 
                  rowSpan: N_ROWS_FOR_CHARGES, 
                  styles: { 
                      fontStyle: 'bold', 
                      fontSize: 8.5, 
                      halign: 'right', 
                      valign: 'top', 
                  } 
              });
          }
          
          // Col 6: Total Balance Due
          if (i === 0) {
              row.push({ 
                  content: balanceDueColumn, 
                  rowSpan: N_ROWS_FOR_CHARGES, 
                  styles: { 
                      fontStyle: 'bold', 
                      fontSize: 8.5, 
                      halign: 'right', 
                      valign: 'top', 
                  } 
              });
          } 

          body.push(row);
      }

      // --- FINAL ROW: GRAND AGGREGATE TOTALS (Summary) ---
      body.push([
          // Col 1-3 Span: Label
          { 
              content: 'GRAND AGGREGATE TOTALS', 
              colSpan: 3, 
              styles: { 
                  fontStyle: 'bold', 
                  halign: 'right', 
                  fontSize: 8, 
                  // Kept: Light gray fill for summary row label
                  fillColor: [220, 220, 220] 
              } 
          },
          // Col 4: Total Freight
          { 
              content: totalFreightAgg.toFixed(2), 
              styles: { 
                  fontStyle: 'bold', 
                  fontSize: 8, 
                  halign: 'right', 
                  fillColor: [230, 230, 230] 
              } 
          }, 
          // Col 5: Total Advance
          { 
              content: totalAdvanceAgg.toFixed(2), 
              styles: { 
                  fontStyle: 'bold', 
                  fontSize: 8, 
                  halign: 'right', 
                  fillColor: [230, 230, 230] 
              } 
          }, 
          // Col 6: Total Balance Due (Final Summary Value)
          { 
              content: totalBalanceAgg.toFixed(2), 
              styles: { 
                  fontStyle: 'bold', 
                  fontSize: 8, 
                  halign: 'right', 
                  fillColor: [230, 230, 230] 
              } 
          } 
      ]);

      // Column Styles: Total width must be 190mm
      const colStyles = {
        // START CHANGE: Increased width to 50mm
        0: { cellWidth: 50, valign: 'top' },     
        // Reduced width to 25mm to compensate
        1: { cellWidth: 25, valign: 'middle' },  
        2: { cellWidth: 25, valign: 'middle', halign: 'right' },  
        3: { cellWidth: 30, valign: 'top' },     
        4: { cellWidth: 30, valign: 'top' },     
        5: { cellWidth: 30, valign: 'top' },     
        // END CHANGE (Total Width: 50 + 25 + 25 + 30 + 30 + 30 = 190mm)
      };

      return { head, body, colStyles, totalBalanceAgg };
    };


    // --- 3. Document Content Generation (Header, Details, Footer remain the same) ---

    // 3.1 Header Image
    //doc.addImage(headerImg, "JPEG", 0, 0, PAGE_WIDTH, 53.9); // for ptc1.jpg
    //doc.addImage(ptc3, "JPEG", 0, 0, PAGE_WIDTH, 60.48); // for ptc3.jpg
    doc.addImage(ptc4, "JPEG", 0, 0, PAGE_WIDTH, 56.56); // for ptc4.jpg
    currentY = 62;

    // 3.2 Invoice/Date Info
    doc.setFontSize(10);
    doc.setFont(undefined, 'bold');
    doc.text(`BILL NO. ${formData.invoiceNo || '1'}`, MARGIN, currentY);
    doc.text(`DATE: ${formData.billDate || ''}`, PAGE_WIDTH - MARGIN - 30, currentY);
    
    currentY += 8;
    
    // 3.3 Party Details
    doc.setFontSize(9);
    doc.setFont(undefined, 'normal');
    doc.text(`Party Name: ${formData.partyName || ''}`, MARGIN, currentY);
    currentY += 5;
    doc.text(`Address: ${formData.partyAddress || 'KALAMBOLI'}`, MARGIN, currentY);
    currentY += 5;

    // 3.4 Global Trip Details
    doc.setFont(undefined, 'bold');
    doc.text(`Loading Date: ${formData.loadingDate || ''}`, MARGIN, currentY);
    doc.text(`Unloading Date: ${formData.unloadingDate || ''}`, MARGIN + 50, currentY);
    currentY += 5;
    doc.text(`From: ${formData.from || ''}`, MARGIN, currentY);
    doc.text(`To: ${formData.to || ''}`, MARGIN + 50, currentY);
    doc.text(`Back To: ${formData.backTo || ''}`, MARGIN + 100, currentY);
    doc.setFont(undefined, 'normal');
    currentY += 4;

    // 3.5 Vehicle/Charges Table 
    const { head, body, colStyles, totalBalanceAgg } = getVehicleTableConfig();
    autoTable(doc, {
      ...TABLE_BASE_STYLES,
      startY: currentY,
      headStyles: TABLE_HEAD_STYLES,
      head: head,
      body: body,
      columnStyles: colStyles,
      theme: 'grid',
    });
    
    currentY = doc.lastAutoTable.finalY + 5;
    
    // 3.6 Total Due Summary 
    const totalDueAmount = totalBalanceAgg.toFixed(2);
    const totalDueWords = numberToWords(totalBalanceAgg);

    doc.setFontSize(10);
    doc.setFont(undefined, 'bold');
    doc.text('Total Balance Due:', MARGIN, currentY);
    
    // Display total due amount right-aligned
    doc.text(`INR ${totalDueAmount}`, PAGE_WIDTH - MARGIN - doc.getTextWidth(`INR ${totalDueAmount}`), currentY);

    currentY += 5;
    doc.setFont(undefined, 'normal');
    doc.setFontSize(9);
    // Move "In Words" text to the left margin
    doc.text(`(In Words: ${totalDueWords})`, PAGE_WIDTH - MARGIN - doc.getTextWidth(`(In Words: ${totalDueWords})`), currentY);

    currentY += 8;
    
    // 3.7 Bank Details and Notes Table (NEW SECTION)
    const bankDetailsContent = 
        `PAN NO.: AWWPP1314Q\n\n` +
        `Bank Account Details:\n` +
        `Bank Account Name: PALAK TRANSPORT CORP\n` +
        `Bank Name: HDFC BANK LTD.\n` +
        `Bank Account No. 50200044714511\n` +
        `IFSC:HDFC0002822\n` +
        `Branch:KALAMBOLI`;

    const termsContent = 
        `Note:\n\n` +
        `1) 12% Interest will be charged if the payment of this bill is not made within 15 days from the date of bill.\n\n` +
        `2) You are requested to make payment to this bill by cross or order cheque in favour of "PALAK TRANSPORT CORP"`;

    autoTable(doc, {
        startY: currentY,
        head: [], // No header
        body: [
            [
                { 
                    content: bankDetailsContent, 
                    // Use bold font style for the left column (bank details)
                    styles: { fontStyle: 'bold', fontSize: 7.5, textColor: [50, 50, 50], valign: 'top', cellPadding: 2 } 
                },
                { 
                    content: termsContent, 
                    styles: { fontStyle: 'normal', fontSize: 7, textColor: [50, 50, 50], valign: 'top', cellPadding: 2 } 
                }
            ]
        ],
        styles: { 
            // Theme 'plain' removes lines but we need borders
            lineWidth: 0.1, // Keep the border line
            lineColor: [150, 150, 150], // Light gray border
            fillColor: [255, 255, 255] // White fill for the cells
        },
        columnStyles: {
            0: { cellWidth: 75 }, // Bank/PAN details (75mm)
            1: { cellWidth: 115 }, // Notes/Terms (115mm)
        },
        theme: 'plain', 
        margin: { left: MARGIN, right: MARGIN },
    });
    
    currentY = doc.lastAutoTable.finalY + 8; // Update Y position after the notes table

    // 3.8 Signatures 
    const SIGNATURE_Y = 210;
    
    // Signature Image Placement
    const SIGNATURE_IMAGE_WIDTH = 30; // 30mm width
    // Calculated height to maintain aspect ratio (30 / (255/176) = 20.7mm, adjusting slightly)
    const SIGNATURE_IMAGE_HEIGHT = 20; 
    
    // Position the image above the 'Authorised Signatory' text, starting around X=150
    const SIGNATURE_IMAGE_X = 160; 
    const SIGNATURE_IMAGE_Y = SIGNATURE_Y - SIGNATURE_IMAGE_HEIGHT - 3; // 220 - 20 - 3 = 197mm

    // Add Signature Image to the PDF
    doc.addImage(signImg, "PNG", SIGNATURE_IMAGE_X, SIGNATURE_IMAGE_Y, SIGNATURE_IMAGE_WIDTH, SIGNATURE_IMAGE_HEIGHT);
    
    doc.setFontSize(8);
    // doc.text('Prepared By.', MARGIN + 10, SIGNATURE_Y);
    // doc.text('Checked By.', PAGE_WIDTH / 2 - 10, SIGNATURE_Y);
    doc.text('Authorised Signatory', PAGE_WIDTH - MARGIN - 40, SIGNATURE_Y);
    doc.text('for PALAK TRANSPORT CORP.', PAGE_WIDTH - MARGIN - 45, SIGNATURE_Y + 5);
    
    // 3.9 Footer Image 
    //doc.addImage(footerImg, "JPEG", 0, 238.4, PAGE_WIDTH, 58.6); //fpr ptc2.jpg
    doc.addImage(ptc5, "JPEG", 0, 297-33.12, PAGE_WIDTH, 33.12); // for ptc5.jpg
    // --- 4. Final Output ---
    const blob = doc.output("blob");
    const url = URL.createObjectURL(blob);
    
    // Determine the filename based on invoice number
    const invoiceNo = formData.invoiceNo || 'DRAFT';
    const filename = `Invoice_${invoiceNo}.pdf`;
    
    // Update state with URL and filename
    setPdfData({ url, filename });
    
    return () => URL.revokeObjectURL(url);
  }, [formData, vehicles]);
  
  // New function to handle the download action
  const handleDownload = () => {
    if (pdfData.url && pdfData.filename) {
      // Create a temporary link element
      const link = document.createElement('a');
      link.href = pdfData.url;
      // Set the filename using the 'download' attribute
      link.download = pdfData.filename; 
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };


  // The return block remains unchanged
  return (
    <div style={{ padding: '10px', backgroundColor: '#f3f4f6', borderRadius: '8px' }}>
      <div style={{ marginBottom: '10px', textAlign: 'right' }}>
        <button
          onClick={handleDownload}
          disabled={!pdfData.url}
          style={{
            padding: '8px 16px',
            backgroundColor: '#10b981',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: pdfData.url ? 'pointer' : 'not-allowed',
            fontWeight: 'bold',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}
        >
          Download ({pdfData.filename || 'PDF'})
        </button>
      </div>
      <div style={{ width: "100%", height: "600px", border: "1px solid #ccc", borderRadius: "8px", overflow: 'hidden' }}>
        {pdfData.url ? (
          <iframe 
            src={pdfData.url} 
            title="Invoice PDF" 
            width="100%" 
            height="100%" 
            style={{ border: 'none' }} 
          />
        ) : (
          <p style={{ padding: '20px', textAlign: 'center' }}>Loading PDF...</p>
        )}
      </div>
    </div>
  );
}