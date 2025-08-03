import React, { useRef } from 'react';
import { Button } from 'primereact/button';
import { CSVLink } from 'react-csv';
import { toast } from 'react-toastify';

const ExportCSVButton = ({ data, fields, fileName = 'exported_data' }) => {
  const csvLinkRef = useRef();

  // Build headers dynamically from fields
  const headers = fields.map(field => ({
    label: field.label,
    key: field.name
  }));

  const handleExport = () => {
    if (!data || data.length === 0) {
      toast.warn('No data to export.');
      return;
    }

    setTimeout(() => {
      csvLinkRef.current.link.click();
    }, 100);
  };

  return (
    <>
      <Button
        label="Export CSV"
        icon="pi pi-download"
        onClick={handleExport}
        className="btn btn-sm btn-primary me-2"
      />
      <CSVLink
        data={data}
        headers={headers}
        filename={`${fileName}_${new Date().toISOString().slice(0, 10)}.csv`}
        className="d-none"
        ref={csvLinkRef}
        target="_blank"
      />
    </>
  );
};

export default ExportCSVButton;
