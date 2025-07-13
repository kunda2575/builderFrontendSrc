import React, { useRef } from "react";
import { CSVLink } from "react-csv";
import { toast } from "react-toastify";
import { Button } from "primereact/button";
const ExportCustomerPaymentsButton = ({ data }) => {
  const csvLinkRef = useRef();

  const headers = [
    { label: "Customer ID", key: "customer_id" },
    { label: "Customer Name", key: "customer_name" },
    { label: "Contact Number", key: "contact_number" },
    { label: "Email", key: "email" },
    { label: "Profession", key: "profession" },
    { label: "Native Language", key: "native_language" },
    { label: "Project Name", key: "project_name" },
    { label: "Block Name", key: "block_name" },
    { label: "Flat No", key: "flat_no" },
    { label: "Agreed Price", key: "agreed_price" },
    { label: "Installment No", key: "installment_no" },
    { label: "Amount Received", key: "amount_received" },
    { label: "Payment Mode", key: "payment_mode" },
    { label: "Payment Type", key: "payment_type" },
    { label: "Verified By", key: "verified_by" },
    { label: "Funding Bank", key: "funding_bank" },
    { label: "Documents", key: "documents" },
    { label: "Flat Handover Date", key: "flat_hand_over_date" },
    { label: "Flat Area", key: "flat_area" },
    { label: "No of BHK", key: "no_of_bhk" },
    { label: "Created At", key: "createdAt" },
    { label: "Updated At", key: "updatedAt" }
  ];

  // Ensure all expected keys exist in each row
  const sanitizeData = (rows, headers) => {
    return rows.map(row => {
      const sanitized = {};
      headers.forEach(({ key }) => {
        sanitized[key] = row[key] ?? ""; // Fallback to empty string
      });
      return sanitized;
    });
  };

  const handleExport = () => {
    if (!data || data.length === 0) {
      toast.warn("No customer payments available to export.");
      return;
    }

    setTimeout(() => {
      csvLinkRef.current.link.click();
    }, 100); // Delay to ensure ref is available
  };

  return (
    <>
     

       <Button
              label="Export Data"
              icon="pi pi-download"
              onClick={handleExport}
              className="btn btn-sm btn-primary"
            />
      
      <CSVLink
        data={sanitizeData(data, headers)}
        headers={headers}
        filename={`customer_payments_${new Date().toISOString().slice(0, 10)}.csv`}
        className="d-none"
        ref={csvLinkRef}
        target="_blank"
      />
    </>
  );
};

export default ExportCustomerPaymentsButton;
