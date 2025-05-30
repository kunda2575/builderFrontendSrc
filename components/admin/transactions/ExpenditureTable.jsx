import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import ReusableDataTable from './ReusableDataTable ';
import { fetchData, deleteData } from '../../../api/apiHandler';
import { config } from '../../../api/config';

const ExpenditureTable = () => {
    const [vendorName, setVendorName] = useState([]);
    const [expenseHead, setExpenseHead] = useState([]);
    const [paymentMode, setPaymentMode] = useState([]);
    const [paymentBank, setPaymentBank] = useState([]);

    useEffect(() => {
        fetchData(config.getVendorNameEx).then(res => setVendorName(res.data || []));
        fetchData(config.getExpenseHeadEx).then(res => setExpenseHead(res.data || []));
        fetchData(config.getPaymentModeEx).then(res => setPaymentMode(res.data || []));
        fetchData(config.getPaymentBankEx).then(res => setPaymentBank(res.data || []));
    }, []);

    const fetchExpenditure = async ({ vendor_name, expense_head, payment_mode, payment_bank, skip, limit }) => {
        const url = `${config.getExpenditures}?vendor_name=${vendor_name || ''}&expense_head=${expense_head || ''}&payment_mode=${payment_mode || ''}&payment_bank=${payment_bank || ''}&skip=${skip}&limit=${limit}`;
        const res = await fetchData(url);
        return {
            data: res.data?.expenditureDetails || [],
            count: res.data?.expenditureDetailsCount || 0,
        };
    };

    return (
        <div className=" mt-3">
            <ReusableDataTable
                title="Expenditure Table"
                fetchFunction={fetchExpenditure}
                deleteFunction={(id) => deleteData(config.deleteExpenditure(id))}
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
                        field: 'expense_head',
                        header: 'Expense Head',
                        options: expenseHead,
                        optionLabel: 'expenseHead',
                        optionValue: 'expenseHead',
                        queryKey: 'expense_head'
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
                    { field: 'vendor_name', header: 'Vendor Name' },
                    { field: 'expense_head', header: 'Expense Head' },
                    { field: 'amount_inr', header: 'Amount (INR)' },
                    { field: 'invoice_number', header: 'Invoice Number' },
                    { field: 'payment_mode', header: 'Payment Mode' },
                    { field: 'payment_bank', header: 'Payment Bank' },
                    {
                        field: 'payment_reference',
                        header: 'Payment Reference',
                        // Custom body: if there’s at least one file, show a View PDF button.
                        body: (rowData) => {
                            if (rowData.payment_reference && rowData.payment_reference.length > 0) {
                                // You can show the first file or loop for multiple files.
                                const fileUrl = rowData.payment_reference[0];
                                return (
                                    <a
                                        href={fileUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="btn btn-sm btn-outline-primary"
                                    >
                                        View PDF
                                    </a>
                                );
                            }
                            return <span className="text-muted">N/A</span>;
                        }
                    },


                    {
                        field: 'payment_evidence',
                        header: 'Payment Evidence',
                        body: (rowData) => {
                            const files = rowData['payment_evidence']?.split(',').filter(f => f.trim() !== '') || [];
                            return files.length ? (
                                <div className="d-flex flex-column gap-1">
                                    {files.map((file, i) => (
                                        <a
                                            key={i}
                                            href={`http://localhost:2026/uploads/${file}`}
                                            download
                                            className="btn btn-sm btn-outline-primary"
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            Download PDF {i + 1}
                                        </a>
                                    ))}
                                </div>
                            ) : (
                                <span className="text-muted">N/A</span>
                            );
                        }
                    }



                ]}
                actions={(rowData, { onDelete }) => (
                    <>
                        {/* <Link to={`/expenditureForm?id=${rowData.id}`} className="btn btn-outline-info btn-sm me-1">
                            <i className="pi pi-pencil" />
                        </Link> */}
                        <button className="btn btn-outline-danger btn-sm" onClick={() => onDelete(rowData.id)}>
                            <i className="pi pi-trash" />
                        </button>
                    </>
                )}
                addButtonLink="/expenditureForm"
                backButtonLink="/transaction"
            />
        </div>
    );
};

export default ExpenditureTable;
