import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import ReusableDataTable from './ReusableDataTable ';
import { fetchData, deleteData,postData } from '../../../api/apiHandler';
import { config } from '../../../api/config';
import ExportCustomerPaymentsButton from '../reusableExportData/ExportCustomerPaymentsButton'; // ✅ Import the export button
import ImportData from '../resusableComponents/ResuableImportData';
import { toast } from 'react-toastify';
const CustomerPaymentsTable = () => {
    const [paymentType, setPaymentType] = useState([]);
    const [verifiedBy, setVerifiedBy] = useState([]);
    const [fundingBank, setFundingBank] = useState([]);
    const [paymentMode, setPaymentMode] = useState([]);
    const [exportData, setExportData] = useState([]); // ✅ Track data for export

    useEffect(() => {
        const removeDuplicates = (data, key) => {
            return Array.from(new Map(data.map(item => [item[key], item])).values());
        };

        fetchData(config.getPaymentTypeCp).then(res => {
            setPaymentType(removeDuplicates(res.data || [], 'paymentType'));
        });

        fetchData(config.getVerifiedByCp).then(res => {
            setVerifiedBy(removeDuplicates(res.data || [], 'employeeName'));
        });

        fetchData(config.getFundingBankCp).then(res => {
            setFundingBank(removeDuplicates(res.data || [], 'bankName'));
        });

        fetchData(config.getPaymentModePc).then(res => {
            setPaymentMode(removeDuplicates(res.data || [], 'paymentMode'));
        });
    }, []);

    const [customers, setCustomers] = useState([]);

    const handleExcelImport = async (data) => {
        try {
            const response = await postData(config.createCustomerImport, { customers: data }); // ✅ send customers in body
            toast.success("Customers imported successfully!");

        } catch (err) {
            console.error(err);
            toast.error(err.response?.data?.error || "Failed to import customers.");
        }
    };


    const CustomerImportButton = () => (
        <ImportData
            headers={[
                "customer_id",
                "customer_name",
                "contact_number",
                "email",
                "profession",
                "native_language",
                "project_name",
                "block_name",
                "flat_no",
                "agreed_price",
                "installment_no",
                "amount_received",
                "payment_mode",
                "payment_type",
                "verified_by",
                "funding_bank",
                "documents",
                "flat_hand_over_date",
                "flat_area",
                "no_of_bhk"
            ]}
            fileName="Customer"
            uploadData={handleExcelImport}
        />
    );


    const fetchProjectCredits = async ({ payment_type, verified_by, funding_bank, payment_mode, skip, limit }) => {
        const url = `${config.getCustomerPayments}?payment_type=${payment_type || ''}&verified_by=${verified_by || ''}&funding_bank=${funding_bank || ''}&payment_mode=${payment_mode || ''}&skip=${skip}&limit=${limit}`;
        const res = await fetchData(url);
        const data = res.data?.data || [];
        setExportData(data); // ✅ Save fetched data for export
        return {
            data,
            count: res.data?.count || 0,
        };
    };

    return (
        <div>

            <ReusableDataTable
                title="Customer Payments Table"
                fetchFunction={fetchProjectCredits}
                deleteFunction={(id) => deleteData(config.deleteCustomerPayment(id))}
                exportData={exportData}
                ExportButtonComponent={ExportCustomerPaymentsButton}
              ImportButtonComponent={CustomerImportButton}
                filters={[
                    {
                        field: 'payment_type',
                        header: 'Payment Type',
                        options: paymentType,
                        optionLabel: 'paymentType',
                        optionValue: 'paymentType',
                        queryKey: 'payment_type'
                    },
                    {
                        field: 'verified_by',
                        header: 'Verified By',
                        options: verifiedBy,
                        optionLabel: 'employeeName',
                        optionValue: 'employeeName',
                        queryKey: 'verified_by'
                    },
                    {
                        field: 'funding_bank',
                        header: 'Funding Bank',
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
                    }
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
                    {
                        field: 'documents',
                        header: 'Documents',
                        body: (rowData) => {
                            if (rowData.documents && rowData.documents.length > 0) {
                                const documentsArray = typeof rowData.documents === 'string'
                                    ? rowData.documents.split(',').map(doc => doc.trim())
                                    : rowData.documents;

                                const sanitizeUrl = (url) => {
                                    const r2Prefix = 'https://pub-029295a7436d410e9cb079b9c6f2c11c.r2.dev/';
                                    if (!url.startsWith('http')) return r2Prefix + url;
                                    return url.includes(r2Prefix + r2Prefix)
                                        ? url.substring(url.indexOf(r2Prefix))
                                        : url;
                                };

                                return (
                                    <div className="d-flex flex-wrap gap-1">
                                        {documentsArray.map((fileUrl, index) => {
                                            const safeUrl = sanitizeUrl(fileUrl);
                                            return (
                                                <a
                                                    key={index}
                                                    href={safeUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="btn btn-sm btn-outline-primary"
                                                >
                                                    Download {index + 1}
                                                </a>
                                            );
                                        })}
                                    </div>
                                );
                            }
                            return <span className="text-muted">N/A</span>;
                        }
                    },
                    { field: 'flat_hand_over_date', header: 'Flat Hand Over Date' },
                    { field: 'flat_area', header: 'Flat Area' },
                    { field: 'no_of_bhk', header: 'No Of Bhk' },
                ]}
                actions={(rowData, { onDelete, onView }) => (
                    <>
                        <button className="btn btn-outline-primary btn-sm" onClick={() => onView(rowData)}>
                            <i className="pi pi-eye" />
                        </button>
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
