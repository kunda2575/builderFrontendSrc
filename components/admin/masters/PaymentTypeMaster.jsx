import React from 'react';
import ReusableTableForm from './ReusableTableForm';
import {
  getpaymentTypes,
  createpaymentType,
  updatepaymentType,
  deletepaymentType
} from '../../../api/paymentTypeApi'; // Your API functions

const fields = [
  { name: 'paymentType', label: 'Payment Types', type: 'text', required: true },


];


const PaymentType = () => {

  return (
    <div className="container-fluid">
      <ReusableTableForm
        title="Payment Type"
        fields={fields}
        fetchData={getpaymentTypes}
        createData={createpaymentType}
        updateData={updatepaymentType}
        deleteData={deletepaymentType}
      />
    </div>
  );
};

export default PaymentType;