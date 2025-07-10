// ExportLeadsButton.jsx
import React, { useRef } from "react";
import { CSVLink } from "react-csv";
import { toast } from "react-toastify";

const ExportLeadsButton = ({ data }) => {
  const csvLinkRef = useRef();

  const headers = [
      { label: "Lead ID", key: "id" },
    { label: "Contact Name", key: "contact_name" },
    { label: "Contact Phone", key: "contact_phone" },
    { label: "Contact Email", key: "contact_email" },
    { label: "Address", key: "address" },
    { label: "Customer Profession", key: "customer_profession" },
    { label: "Native Language", key: "native_language" },
    { label: "Lead Source", key: "lead_source" },
    { label: "Lead Stage", key: "lead_stage" },
    { label: "Value in INR", key: "value_in_inr" },
    { label: "Creation Date", key: "creation_date" },
    { label: "Expected Date", key: "expected_date" },
    { label: "Team Member", key: "team_member" },
    { label: "Last Interacted On", key: "last_interacted_on" },
    { label: "Next Interacted Date", key: "next_interacted_date" },
    { label: "Remarks", key: "remarks" },
    { label: "Reason For Lost Customers", key: "reason_for_lost_customers" },
    // { label: "Created At", key: "created_at" },
  ];

  const handleExport = () => {
    if (!data || data.length === 0) {
      toast.warn("No leads available to export.");
      return;
    }

    setTimeout(() => {
      csvLinkRef.current.link.click();
    }, 100);
  };

  return (
    <>
      <button className="btn btn-success btn-sm me-2" onClick={handleExport}>
        <i className="pi pi-download me-2"></i> Export Filtered Leads
      </button>
      <CSVLink
        data={data}
        headers={headers}
        filename={`leads_export_${new Date().toISOString().slice(0, 10)}.csv`}
        className="d-none"
        ref={csvLinkRef}
        target="_blank"
      />
    </>
  );
};

export default ExportLeadsButton;
