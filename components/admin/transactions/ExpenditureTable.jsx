import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import ReusableDataTable from './ReusableDataTable ';
import { fetchData, deleteData } from '../../../api/apiHandler';
import { config } from '../../../api/config';
import ExportExpendituresButton from '../reusableExportData/ExportExpendituresButton';

const ExpenditureTable = () => {
    const [vendorName, setVendorName] = useState([]);
    const [expenseHead, setExpenseHead] = useState([]);
    const [paymentMode, setPaymentMode] = useState([]);
    const [paymentBank, setPaymentBank] = useState([]);
    const [exportData, setExportData] = useState([]); // ✅ Track data for export

    useEffect(() => {
        const removeDuplicates = (data, key) =>
            Array.from(new Map(data.map(item => [item[key], item])).values());

        fetchData(config.getVendorNameEx).then(res => {
            const unique = removeDuplicates(res.data || [], 'vendorName');
            setVendorName(unique);
        });

        fetchData(config.getExpenseHeadEx).then(res => {
            const unique = removeDuplicates(res.data || [], 'expenseHead');
            setExpenseHead(unique);
        });

        fetchData(config.getPaymentModeEx).then(res => {
            const unique = removeDuplicates(res.data || [], 'paymentMode');
            setPaymentMode(unique);
        });

        fetchData(config.getPaymentBankEx).then(res => {
            const unique = removeDuplicates(res.data || [], 'bankName');
            setPaymentBank(unique);
        });
    }, []);

   const fetchExpenditure = async ({ vendor_name, expense_head, payment_mode, payment_bank, skip, limit }) => {
    const url = `${config.getExpenditures}?vendor_name=${vendor_name || ''}&expense_head=${expense_head || ''}&payment_mode=${payment_mode || ''}&payment_bank=${payment_bank || ''}&skip=${skip}&limit=${limit}`;

    const res = await fetchData(url);
    const data = res.data?.expenditureDetails || [];

    // ✅ Set export data only on first page (optional)
    if (skip === 0) {
        setExportData(data);
    }

    return {
        data,
        count: res.data?.expenditureDetailsCount || 0,
    };
};

    return (
        <div className="mt-3">
           
            
            <ReusableDataTable
                title="Expenditure Table"
                fetchFunction={fetchExpenditure}
                exportData={exportData}
                 ExportButtonComponent={ExportExpendituresButton}
                deleteFunction={async (id) => {
                    try {
                        await deleteData(config.deleteExpenditure(id));
                        // Optionally you can refetch or trigger a table reload here if needed
                        console.log(`Deleted item with ID: ${id}`);
                    } catch (err) {
                        console.error("Delete failed:", err);
                    }
                }}
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
                        body: (rowData) => {
                            const files = typeof rowData.payment_reference === 'string'
                                ? rowData.payment_reference.split(',').map(f => f.trim())
                                : rowData.payment_reference || [];

                            if (!files.length) return <span className="text-muted">N/A</span>;

                            const sanitizeUrl = (url) => {
                                const r2Prefix = 'https://pub-029295a7436d410e9cb079b9c6f2c11c.r2.dev/';
                                if (!url) return '';

                                // Remove double prefix
                                let cleaned = url.replace(`${r2Prefix}${r2Prefix}`, r2Prefix);

                                // If it's a partial path (e.g., just the filename), prepend prefix
                                if (!/^https?:\/\//.test(cleaned)) {
                                    cleaned = r2Prefix + cleaned;
                                }

                                return cleaned;
                            };

                            return (
                                <div className="d-flex flex-wrap gap-2">
                                    {files.map((fileUrl, index) => {
                                        const url = sanitizeUrl(fileUrl);
                                        const isImage = /\.(jpg|jpeg|png|gif|webp)$/i.test(url);
                                        const isPDF = /\.pdf$/i.test(url);

                                        if (isImage) {
                                            return (
                                                <div key={index} className="text-center" style={{ width: '100px' }}>
                                                    <a href={url} target="_blank" rel="noopener noreferrer">
                                                        <img
                                                            src={url}
                                                            alt={`Preview ${index + 1}`}
                                                            className="img-thumbnail"
                                                            style={{ width: '100%', height: 'auto', objectFit: 'cover' }}
                                                        />
                                                    </a>
                                                </div>
                                            );
                                        }

                                        return (
                                            <a
                                                key={index}
                                                href={url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="btn btn-sm btn-outline-primary"
                                            >
                                                {isPDF ? `Download PDF ${index + 1}` : `Download File ${index + 1}`}
                                            </a>
                                        );
                                    })}
                                </div>
                            );
                        }
                    },
                    {
                        field: 'payment_evidence',
                        header: 'Payment Evidence',
                        body: (rowData) => {
                            const files = typeof rowData.payment_evidence === 'string'
                                ? rowData.payment_evidence.split(',').map(f => f.trim())
                                : rowData.payment_evidence || [];

                            if (!files.length) return <span className="text-muted">N/A</span>;

                            const sanitizeUrl = (url) => {
                                const r2Prefix = 'https://pub-029295a7436d410e9cb079b9c6f2c11c.r2.dev/';
                                if (!url) return '';

                                // Remove double prefix
                                let cleaned = url.replace(`${r2Prefix}${r2Prefix}`, r2Prefix);

                                // If it's a partial path (e.g., just the filename), prepend prefix
                                if (!/^https?:\/\//.test(cleaned)) {
                                    cleaned = r2Prefix + cleaned;
                                }

                                return cleaned;
                            };

                            return (
                                <div className="d-flex flex-wrap gap-2">
                                    {files.map((fileUrl, index) => {
                                        const url = sanitizeUrl(fileUrl);
                                        const isImage = /\.(jpg|jpeg|png|gif|webp)$/i.test(url);
                                        const isPDF = /\.pdf$/i.test(url);

                                        if (isImage) {
                                            return (
                                                <div key={index} className="text-center" style={{ width: '100px' }}>
                                                    <a href={url} target="_blank" rel="noopener noreferrer">
                                                        <img
                                                            src={url}
                                                            alt={`Preview ${index + 1}`}
                                                            className="img-thumbnail"
                                                            style={{ width: '100%', height: 'auto', objectFit: 'cover' }}
                                                        />
                                                    </a>
                                                </div>
                                            );
                                        }

                                        return (
                                            <a
                                                key={index}
                                                href={url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="btn btn-sm btn-outline-primary"
                                            >
                                                {isPDF ? `Download PDF ${index + 1}` : `Download File ${index + 1}`}
                                            </a>
                                        );
                                    })}
                                </div>
                            );
                        }
                    }


                ]}
                actions={(rowData, { onDelete, onView }) => (
                    <>
                        <Link to={`/expenditureForm?id=${rowData.id}`} className="btn btn-outline-info btn-sm">
                            <i className="pi pi-pencil" />
                        </Link>
                        <button className="btn btn-outline-danger btn-sm" onClick={() => onDelete(rowData.id)}>
                            <i className="pi pi-trash" />
                        </button>
                        <button className="btn btn-outline-primary btn-sm" onClick={() => onView(rowData)}>
                            <i className="pi pi-eye" />
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
