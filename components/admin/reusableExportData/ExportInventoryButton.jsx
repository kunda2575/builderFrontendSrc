import React, { useRef } from "react";
import { CSVLink } from "react-csv";
import { toast } from "react-toastify";

const ExportInventorysButton = ({ data }) => {
  const csvLinkRef = useRef();

  const headers = [
    { label: "Inventory ID", key: "id" },
    { label: "Material ID", key: "material_id" },
    { label: "Material Name", key: "material_name" },
    { label: "Vendor Name", key: "vendor_name" },
    { label: "Invoice Number", key: "invoice_number" },
    { label: "Invoice Date", key: "invoice_date" },
    { label: "Invoice Cost Incl Gst", key: "invoice_cost_incl_gst" },
    { label: "Unit Type", key: "unit_type" },
    { label: "Quantity Received", key: "quantity_received" },
    { label: "Entered By", key: "entered_by" },
    { label: "Documents", key: "invoice_attachment" }
  ];

  const sanitizeData = (data, headers) => {
    return data.map(row => {
      const sanitizedRow = {};
      headers.forEach(header => {
        sanitizedRow[header.key] = row[header.key] ?? "";
      });
      return sanitizedRow;
    });
  };

  const handleExport = () => {
    if (!data || data.length === 0) {
      toast.warn("No Inventory entries available to export.");
      return;
    }

    setTimeout(() => {
      csvLinkRef.current.link.click();
    }, 100);
  };

  return (
    <>
      <button className="btn btn-success btn-sm me-2" onClick={handleExport}>
        <i className="pi pi-download me-2"></i> Export Filtered Inventory
      </button>
      <CSVLink
        data={sanitizeData(data, headers)}
        headers={headers}
        filename={`inventory_export_${new Date().toISOString().slice(0, 10)}.csv`}
        className="d-none"
        ref={csvLinkRef}
        target="_blank"
      />
    </>
  );
};

export default ExportInventorysButton;
