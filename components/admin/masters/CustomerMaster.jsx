import React from 'react';
import ReusableForm_Table from './ReusableForm_Table';
import {
  getCustomerDetails,
  createCustomerDetails,
  updateCustomerDetails,
  deleteCustomerDetails
} from '../../../api/updateApis/customerApi'; // Your API functions

const fields = [
{ name: 'customerId', label: 'Customer Id', type: 'number', required: true, disabled: true },

  { name: 'customerName', label: 'Customer Name', type: 'text', required: true },
  { name: 'customerPhone', label: 'Mobile', type: 'number', required: true },
  { name: 'customerEmail', label: 'Email', type: 'email', required: true },
 
  
  { name: 'customerProfession', label: 'Profession', type: 'text', required: true },
  {
    name: 'languagesKnown',
    label: 'Languages Known',
    type: 'select',
    multiple: true,
    required: true,
    options: [
      { label: 'Telugu', value: 'Telugu' },
      { label: 'Hindi', value: 'Hindi' },
      { label: 'English', value: 'English' }
    ]
  
  
  },
  
  { name: 'projectNameBlock', label: 'Project Name Block', type: 'text', required: true },
  { name: 'flatNo', label: 'Flat No', type: 'number', required: true },
  {
    name: 'customerAddress',
    label: 'Address',
    type: 'textarea',
    required: true
  },
];


const CustomerMaster = () => {

  return (
    <div className="container-fluid">
      <ReusableForm_Table
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