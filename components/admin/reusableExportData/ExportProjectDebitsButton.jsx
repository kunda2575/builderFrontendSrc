import { Button } from "primereact/button";
import React, { useRef } from 'react';
import { CSVLink } from 'react-csv';
import { toast } from 'react-toastify';

const ExportProjectDebitsButton = ({ data }) => {
  const csvLinkRef = useRef();

  const headers = [
    { label: 'ID', key: 'id' },
    { label: 'Date', key: 'date' },
    { label: 'Payed To', key: 'payed_to' },
    { label: 'Vendor Name', key: 'vendor_name' },
    { label: 'Amount (INR)', key: 'amount_inr' },
    { label: 'Invoice Number', key: 'invoice_number' },
    { label: 'Payment Mode', key: 'payment_mode' },
    { label: 'Payment Bank', key: 'payment_bank' },
  ];

  const handleExport = () => {
    if (!data || data.length === 0) {
      toast.warn('No project debit data to export.');
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
        filename={`project_debits_${new Date().toISOString().slice(0, 10)}.csv`}
        className="d-none"
        ref={csvLinkRef}
        target="_blank"
      />
    </>
  );
};

export default ExportProjectDebitsButton;
