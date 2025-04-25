import React from 'react';
import ReusableTableForm from './ReusableTableForm';
import {
  getCustomerDetails,
  createCustomerDetails,
  updateCustomerDetails,
  deleteCustomerDetails
} from '../../../api/customerApi'; // Your API functions

const fields = [
  { name: 'customerId', label: 'Customer Id', type: 'number', required: true },
  { name: 'customerName', label: 'Customer Name', type: 'text', required: true },
  { name: 'customerPhone', label: 'Mobile', type: 'number', required: true },
  { name: 'customerEmail', label: 'Email', type: 'email', required: true },
  { name: 'customerAddress', label: 'Address', type: 'text', required: true },
  { name: 'customerProfession', label: 'Profession', type: 'text', required: true },
  { name: 'languagesKnown', label: 'Languages Known', type: 'text', required: true },
  { name: 'projectNameBlock', label: 'Project Name Block', type: 'text', required: true },
  { name: 'flatNo', label: 'Flat No', type: 'number', required: true }
];


const CustomerMaster = () => {

  return (
    <div className="container-fluid">
      <ReusableTableForm
        title="Customer"
        fields={fields}
        fetchData={getCustomerDetails}
        createData={createCustomerDetails}
        updateData={updateCustomerDetails}
        deleteData={deleteCustomerDetails}
      />
    </div>
  );
};

export default CustomerMaster;