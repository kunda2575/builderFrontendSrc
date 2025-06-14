import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import ReusableDataTable from './ReusableDataTable ';
import { fetchData, deleteData } from '../../../api/apiHandler';
import { config } from '../../../api/config';

const CustomerPaymentsTable = () => {
    const [paymentType, setPaymentType] = useState([]);
       const [verifiedBy, setVerifiedBy] = useState([]);
       const [fundingBank, setFundingBank] = useState([])
       const [paymentMode, setPaymentMode] = useState([]);
   useEffect(() => {
    // Remove duplicates based on a key
    const removeDuplicates = (data, key) => {
        return Array.from(new Map(data.map(item => [item[key], item])).values());
    };

    fetchData(config.getPaymentTypeCp).then(res => {
        const unique = removeDuplicates(res.data || [], 'paymentType');
        setPaymentType(unique);
    });

    fetchData(config.getVerifiedByCp).then(res => {
        const unique = removeDuplicates(res.data || [], 'employeeName');
        setVerifiedBy(unique);
    });

    fetchData(config.getFundingBankCp).then(res => {
        const unique = removeDuplicates(res.data || [], 'bankName');
        setFundingBank(unique);
    });

    fetchData(config.getPaymentModePc).then(res => {
        const unique = removeDuplicates(res.data || [], 'paymentMode');
        setPaymentMode(unique);
    });
}, []);

    const fetchProjectCredits = async ({ payment_type, verified_by,funding_bank, payment_mode,  skip, limit }) => {
        
 const url = `${config.getCustomerPayments}?payment_type=${payment_type || ''}&verified_by=${verified_by || ''}&funding_bank=${funding_bank || ''}&payment_mode=${payment_mode || ''}&skip=${skip}&limit=${limit}`;
      const res = await fetchData(url);
        return {
            data: res.data?.customerPaymentsDetails || [],
            count: res.data?.customerPaymentsDetailsCount || 0,
        };
    };

    
    return (
        <div>
            {/* Action Buttons */}
          
            <ReusableDataTable
                title="Customer Payments Table"
                fetchFunction={fetchProjectCredits}
                deleteFunction={(id) => deleteData(config.deleteCustomerPayment(id))}
                          filters={[
                    {
                        field: 'payment_type',
                        header: 'payment Type',
                        options: paymentType,
                        optionLabel: 'paymentType',
                        optionValue: 'paymentType',
                        queryKey: 'payment_type'
                    },
                     {
                        field: 'verified_by',
                        header: 'verified By',
                        options: verifiedBy,
                        optionLabel: 'employeeName',
                        optionValue: 'employeeName',
                        queryKey: 'verified_by'
                    },
                    {
                        field: 'funding_bank',
                        header: 'funding Bank',
                        options: fundingBank,
                        optionLabel: 'bankName',
                        optionValue: 'bankName',
                        queryKey: 'funding_bank'
                    },
                    {
                        field: 'payment_mode',
                        header: 'Payment Mode',
                        options: paymentMode,
                        optionLabel: 'paymentMode',
                        optionValue: 'paymentMode',
                        queryKey: 'payment_mode'
                    },
                   
                ]}
                columns={[
                    { field: 'customer_id', header: 'Customer Id' },
                    { field: 'customer_name', header: 'Customer Name' },
                    { field: 'contact_number', header: 'Contact Number' },
                    { field: 'email', header: 'Email' },
                    { field: 'profession', header: 'Profession' },
                    { field: 'native_language', header: 'Native Language' },
                    { field: 'project_name', header: 'Project Name' },
                    { field: 'block_name', header: 'Block Name' },
                    { field: 'flat_no', header: 'Flat No' },
                    { field: 'agreed_price', header: 'Agreed Price' },
                    { field: 'installment_no', header: 'Installment No' },
                    { field: 'amount_received', header: 'Amount Received' },
                    { field: 'documents', header: 'Documents' },
                    { field: 'flat_hand_over_date', header: 'Flat Hand Over Date' },
                    { field: 'flat_area', header: 'Flat Area' },
                    { field: 'no_of_bhk', header: 'No Of Bhk' },
                    
                   
                ]}
                actions={(rowData, { onDelete }) => (
                    <>
                        <Link to={`/customerPaymentsForm?id=${rowData.id}`} className="btn btn-outline-info btn-sm">
                            <i className="pi pi-pencil" />
                        </Link>
                        <button className="btn btn-outline-danger btn-sm" onClick={() => onDelete(rowData.id)}>
                            <i className="pi pi-trash" />
                        </button>
                    </>
                )}
                 addButtonLink="/customerPaymentsForm"
            backButtonLink="/transaction"
            />
        </div>
    );
};

export default CustomerPaymentsTable;
