import React from 'react';
import ReusableTableForm from './ReusableTableForm';
import {
  getpaymentModes,
  createpaymentMode,
  updatepaymentMode,
  deletepaymentMode
} from '../../../api/updateApis/paymentModeApi'; // Your API functions

const fields = [
  {
    name: 'paymentMode',
    label: 'Payment Mode',
    type: 'select',
    required: true,
    options: [
      { label: 'Cash', value: 'Cash' },
      { label: 'Credit Card', value: 'Credit Card' },
      { label: 'Debit Card', value: 'Debit Card' },
      { label: 'Net Banking', value: 'Net Banking' },
      { label: 'UPI', value: 'UPI' },
      { label: 'Cheque', value: 'Cheque' },
      { label: 'Bank Transfer', value: 'Bank Transfer' },
      { label: 'Mobile Wallet', value: 'Mobile Wallet' }
    ]
  }
  
  

];


const PaymentMode = () => {

  return (
    <div className="container-fluid">
      <ReusableTableForm
        title="Payment Mode"
        fields={fields}
        fetchData={getpaymentModes}
        createData={createpaymentMode}
        updateData={updatepaymentMode}
        deleteData={deletepaymentMode}
      />
    </div>
  );
};

export default PaymentMode;