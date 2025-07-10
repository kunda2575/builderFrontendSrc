import React, { useRef } from 'react';
import { CSVLink } from 'react-csv';
import { toast } from 'react-toastify';

const ExportMaterialsButton = ({ data }) => {
  const csvLinkRef = useRef();

  const headers = [
    { label: 'ID', key: 'id' },
    { label: 'Material ID', key: 'material_id' },
    { label: 'Material Name', key: 'material_name' },
    { label: 'Unit Type', key: 'unit_type' },
    { label: 'Available Stock', key: 'available_stock' },
   
  ];

  const handleExport = () => {
    if (!data || data.length === 0) {
      toast.warn('No material data to export.');
      return;
    }

    setTimeout(() => {
      csvLinkRef.current.link.click();
    }, 100);
  };

  return (
    <>
      <button className="btn btn-success btn-sm me-2" onClick={handleExport}>
       <i className="pi pi-download me-2"></i>  Export Materials
      </button>
      <CSVLink
        data={data}
        headers={headers}
        filename={`materials_${new Date().toISOString().slice(0, 10)}.csv`}
        className="d-none"
        ref={csvLinkRef}
        target="_blank"
      />
    </>
  );
};

export default ExportMaterialsButton;
