import { Button } from "primereact/button";
import React, { useRef } from 'react';
import { CSVLink } from 'react-csv';
import { toast } from 'react-toastify';

const ExportExpendituresButton = ({ data }) => {
  const csvLinkRef = useRef();

  const headers = [
    { label: 'ID', key: 'id' },
    { label: 'Date', key: 'date' },
    { label: 'Vendor Name', key: 'vendor_name' },
    { label: 'Expense Head', key: 'expense_head' },
    { label: 'Amount (INR)', key: 'amount_inr' },
    { label: 'Invoice Number', key: 'invoice_number' },
    { label: 'Payment Mode', key: 'payment_mode' },
    { label: 'Payment Bank', key: 'payment_bank' },
    { label: 'Payment Reference', key: 'payment_reference' },
    { label: 'Payment Evidence', key: 'payment_evidence' }
  ];

  const handleExport = () => {
    if (!data || data.length === 0) {
      toast.warn("No expenditure data to export.");
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
        filename={`expenditures_${new Date().toISOString().slice(0, 10)}.csv`}
        className="d-none"
        ref={csvLinkRef}
        target="_blank"
      />
    </>
  );
};

export default ExportExpendituresButton;
