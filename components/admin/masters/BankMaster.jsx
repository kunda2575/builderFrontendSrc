import React from 'react';
import ReusableTableForm from './ReusableTableForm';
import {
    getBankDetails,
    createBankDetails,
    updateBankDetails,
    deleteBankDetails
} from '../../../api/updateApis/banksApi'; // Your API functions

const fields = [
    {
        name: 'bankName',
        label: 'Bank Name',
        type: 'select',
        required: true,
        options: [
          { label: 'State Bank of India (SBI)', value: 'SBI' },
          { label: 'HDFC Bank', value: 'HDFC' },
          { label: 'ICICI Bank', value: 'ICICI' },
          { label: 'Axis Bank', value: 'Axis' },
          { label: 'Punjab National Bank (PNB)', value: 'PNB' },
          { label: 'Bank of Baroda', value: 'BoB' },
          { label: 'Kotak Mahindra Bank', value: 'Kotak' },
          { label: 'Yes Bank', value: 'YesBank' },
          { label: 'Canara Bank', value: 'Canara' },
          { label: 'Union Bank of India', value: 'UnionBank' },
          { label: 'IDFC FIRST Bank', value: 'IDFC' },
          { label: 'IndusInd Bank', value: 'IndusInd' },
          { label: 'Central Bank of India', value: 'CBI' },
          { label: 'Indian Overseas Bank', value: 'IOB' },
          { label: 'UCO Bank', value: 'UCO' }
        ]
      },
      
    { name: 'ifscCode', label: 'IFSC Code', type: 'text', required: true },
    
    { name: 'branch', label: 'Branch', type: 'text', required: true },

    // {
    //     name: 'status',
    //     label: 'Status',
    //     type: 'select',
    //     options: [
    //         { label: 'Active', value: 'active' },
    //         { label: 'Inactive', value: 'inactive' }
    //     ]
    // },
    // { name: 'isVerified', label: 'Verified', type: 'checkbox' }
];

const BankMaster = () => {
    return (
        <div className="container-fluid">
            <ReusableTableForm
                title="Bank"
                fields={fields}
                fetchData={getBankDetails}
                createData={createBankDetails}
                updateData={updateBankDetails}
                deleteData={deleteBankDetails}
            />
        </div>
    );
};

export default BankMaster;
