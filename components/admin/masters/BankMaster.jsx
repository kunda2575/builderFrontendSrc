import React from 'react';
import ReusableTableForm from './ReusableTableForm';
import {
    getBankDetails,
    createBankDetails,
    updateBankDetails,
    deleteBankDetails
} from '../../../api/banksApi'; // Your API functions

const fields = [
    { name: 'bankName', label: 'Bank Name', type: 'text', required: true },
    { name: 'ifscCode', label: 'IFSC Code', type: 'text', required: true },
    { name: 'branch', label: 'Branch', type: 'text' },
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
        <ReusableTableForm
            title="Bank"
            fields={fields}
            fetchData={getBankDetails}
            createData={createBankDetails}
            updateData={updateBankDetails}
            deleteData={deleteBankDetails}
        />
    );
};

export default BankMaster;
