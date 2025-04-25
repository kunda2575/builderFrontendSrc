import React from 'react';
import ReusableTableForm from './ReusableTableForm';
import {
  getpaymentModes,
  createpaymentMode,
  updatepaymentMode,
  deletepaymentMode
} from '../../../api/paymentModeApi'; // Your API functions

const fields = [
  { name: 'paymentMode', label: 'Payment Modes', type: 'text', required: true },


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