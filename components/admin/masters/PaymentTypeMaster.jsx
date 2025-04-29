import React from 'react';
import ReusableTableForm from './ReusableTableForm';
import {
  getpaymentTypes,
  createpaymentType,
  updatepaymentType,
  deletepaymentType
} from '../../../api/updateApis/paymentTypeApi'; // Your API functions

const fields = [
  {
    name: 'paymentType',
    label: 'Payment Type',
    type: 'select',
    required: true,
    options: [
      { label: 'Full Payment', value: 'Full' },
      { label: 'Partial Payment', value: 'Partial' },
      { label: 'Advance Payment', value: 'Advance' },
      { label: 'Installment', value: 'Installment' },
      { label: 'Refund', value: 'Refund' },
      { label: 'Credit', value: 'Credit' }
    ]
  }
  

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