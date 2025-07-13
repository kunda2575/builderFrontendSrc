import { Button } from "primereact/button";
import React, { useRef } from 'react';
import { CSVLink } from 'react-csv';
import { toast } from 'react-toastify';

const ExportMaterialIssueButton = ({ data }) => {
  const csvLinkRef = useRef();

  const headers = [
    { label: 'ID', key: 'id' },
    { label: 'Material Name', key: 'material_name' },
    { label: 'Unit Type', key: 'unit_type' },
    { label: 'Quantity Issued', key: 'quantity_issued' },
    { label: 'Issued By', key: 'issued_by' },
    { label: 'Issued To', key: 'issued_to' },
    { label: 'Issue Date', key: 'issue_date' },
    { label: 'Created At', key: 'createdAt' },
    { label: 'Updated At', key: 'updatedAt' }
  ];

  const handleExport = () => {
    if (!data || data.length === 0) {
      toast.warn('No material issue data to export.');
      return;
    }
    setTimeout(() => {
      csvLinkRef.current.link.click();
    }, 100);
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
        data={data}
        headers={headers}
        filename={`material_issues_${new Date().toISOString().slice(0, 10)}.csv`}
        className="d-none"
        ref={csvLinkRef}
        target="_blank"
      />
    </>
  );
};

export default ExportMaterialIssueButton;
