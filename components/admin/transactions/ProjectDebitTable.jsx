import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import ReusableDataTable from './ReusableDataTable ';
import { fetchData, deleteData } from '../../../api/apiHandler';
import { config } from '../../../api/config';

const ProjectDebitTable = () => {
    const [vendorName, setVendorName] = useState([]);
    const [payedTo, setPayedTo] = useState([]);
    const [paymentMode, setPaymentMode] = useState([]);
    const [paymentBank, setPaymentBank] = useState([]);


    useEffect(() => {
        fetchData(config.getVendorNamePd).then(res => setVendorName(res.data || []));
        // fetchData(config.getPayToPd).then(res => setPayedTo(res.data || []));
         fetchData(config.getPayToPd).then(res => {
        console.log("🚀 PayedTo Response:", res.data);
        setPayedTo(res.data || []);
    });
        fetchData(config.getPaymentModePd).then(res => setPaymentMode(res.data || []));
        fetchData(config.getPaymentBankPd).then(res => setPaymentBank(res.data || []));
    }, []);

    const fetchProjectDebit = async ({ vendor_name, payed_to, payment_mode, payment_bank, skip, limit }) => {
        // const params = { vendor_name, payed_to, payment_mode, payment_bank, skip, limit };
        const url = `${config.getProjectDebits}?vendor_name=${vendor_name || ''}&payed_to=${payed_to || ''}&payment_mode=${payment_mode || ''}&payment_bank=${payment_bank || ''}&skip=${skip}&limit=${limit}`;
        const res = await fetchData(url);
        return {
            data: res.data?.projectDebitDetails || [],
            count: res.data?.projectDebitDetailsCount || 0,
        };
    };


    return (
        <div>
            {/* Action Buttons */}

            <ReusableDataTable
                title="Project Debit's Table"
                fetchFunction={fetchProjectDebit}
                deleteFunction={(id) => deleteData(`${config.host}/api/projectDebit/${id}`)}
                filters={[
                    {
                        field: 'vendor_name',
                        header: 'Vendor Name',
                        options: vendorName,
                        optionLabel: 'vendorName',
                        optionValue: 'vendorName',
                        queryKey: 'vendor_name'
                    },
                    
                    {
                        field: 'payed_to',
                        header: 'Payed To',
                        options: payedTo,
                        optionLabel: 'vendorName', // visible to user
                        optionValue: 'vendorName',         // sent in query
                        queryKey: 'payed_to'
                    },

                    {
                        field: 'payment_mode',
                        header: 'Payment Mode',
                        options: paymentMode,
                        optionLabel: 'paymentMode',
                        optionValue: 'paymentMode',
                        queryKey: 'payment_mode'
                    },
                    {
                        field: 'payment_bank',
                        header: 'Payment Bank',
                        options: paymentBank,
                        optionLabel: 'bankName',
                        optionValue: 'bankName',
                        queryKey: 'payment_bank'
                    }
                ]}
                columns={[
                    { field: 'date', header: 'Date' },
                    { field: 'amount_inr', header: 'Amount (INR)' },
                    { field: 'invoice_number', header: 'Invoice Number' },


                ]}
                actions={(rowData, { onDelete }) => (
                    <>
                        <Link to={`/projectDebitForm?id=${rowData.id}`} className="btn btn-outline-info btn-sm">
                            <i className="pi pi-pencil" />
                        </Link>
                        <button className="btn btn-outline-danger btn-sm" onClick={() => onDelete(rowData.id)}>
                            <i className="pi pi-trash" />
                        </button>
                    </>
                )}
                addButtonLink="/projectDebitForm"
                backButtonLink="/transaction"
            />
        </div>
    );
};

export default ProjectDebitTable;
