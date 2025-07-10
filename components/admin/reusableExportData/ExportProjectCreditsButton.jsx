import React, { useRef } from 'react';
import { CSVLink } from 'react-csv';
import { toast } from 'react-toastify';

const ExportProjectCreditsButton = ({ data }) => {
  const csvLinkRef = useRef();

  const headers = [
    { label: 'ID', key: 'id' },
    { label: 'Date', key: 'date' },
    { label: 'Source', key: 'source' },
    { label: 'Amount (INR)', key: 'amount_inr' },
    { label: 'Payment Mode', key: 'payment_mode' },
    { label: 'Purpose', key: 'purpose' },
    { label: 'Deposit Bank', key: 'deposit_bank' },
  ];

  const handleExport = () => {
    if (!data || data.length === 0) {
      toast.warn('No project credit data to export.');
      return;
    }

    // Trigger CSV download
    setTimeout(() => {
      csvLinkRef.current.link.click();
    }, 100);
  };

  return (
    <>
      <button className="btn btn-success btn-sm me-2" onClick={handleExport}>
       <i className="pi pi-download me-2"></i>  Export Project Credits
      </button>
      <CSVLink
        data={data}
        headers={headers}
        filename={`project_credits_${new Date().toISOString().slice(0, 10)}.csv`}
        className="d-none"
        ref={csvLinkRef}
        target="_blank"
      />
    </>
  );
};

export default ExportProjectCreditsButton;
