import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import ReusableDataTable from './ReusableDataTable ';
import { fetchData, deleteData, postData } from '../../../api/apiHandler';
import { config } from '../../../api/config';
import ExportProjectDebitsButton from '../reusableExportData/ExportProjectDebitsButton';
import ImportData from '../resusableComponents/ResuableImportData';
import { toast } from 'react-toastify';
import ImportErrorModal from '../resusableComponents/ImportErrorModal';

const ProjectDebitTable = () => {
    const [vendorName, setVendorName] = useState([]);
    const [payedTo, setPayedTo] = useState([]);
    const [paymentMode, setPaymentMode] = useState([]);
    const [paymentBank, setPaymentBank] = useState([]);
    const [exportData, setExportData] = useState([]);

    const [importErrors, setImportErrors] = useState([]);
    const [showErrorModal, setShowErrorModal] = useState(false);

    const tableRef = useRef();


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


    const [projectDebits, setProjectDebits] = useState([]);




    const ProjectDebitImportButton = () => (
        <ImportData
            headers={[
                "date",
                "payed_to",
                "vendor_name",
                "amount_inr",
                "invoice_number",
                "payment_mode",
                "payment_bank",

            ]}
            fileName="ProjectDebit"
            uploadData={handleExcelImport}
        />
    );

    const fetchProjectDebit = async ({ vendor_name, payed_to, payment_mode, payment_bank, skip, limit }) => {
        // const params = { vendor_name, payed_to, payment_mode, payment_bank, skip, limit };
        const url = `${config.getProjectDebits}?vendor_name=${vendor_name || ''}&payed_to=${payed_to || ''}&payment_mode=${payment_mode || ''}&payment_bank=${payment_bank || ''}&skip=${skip}&limit=${limit}`;
        const res = await fetchData(url);
        const data = res.data?.projectDebitDetails || [];
        if (skip === 0) {
            setExportData(data); // ✅ Save first page for export
        }

        return {
            data,
            count: res.data?.projectDebitDetailsCount || 0,
        };
    };
    const handleExcelImport = async (data) => {
        try {
            const response = await postData(config.createProjectDebitImport, { projectDebits: data }); // ✅ send projectDebits in body
            if (response.success) {
                toast.success("Project Debits imported successfully!");
                if (tableRef.current) {
                    tableRef.current.refresh(); // ✅ Refresh the table data
                }
            } else {
                toast.error(response.message || "Failed to import project Debits.");

                // Optional: show backend validation errors
                if (response.data?.errors?.length) {
                    setImportErrors(response.data.errors);
                setShowErrorModal(true);
                }
            }
        } catch (err) {
            console.error(err);
            toast.error(err.response?.data?.error || "Failed to import project Debits.");
        }
    };

    return (
        <div>
            {/* Action Buttons */}
 <ImportErrorModal
                show={showErrorModal}
                errors={importErrors}
                onClose={() => setShowErrorModal(false)}
            />
            <ReusableDataTable
                title="Project Debit's Table"
                ref={tableRef}
                fetchFunction={fetchProjectDebit}
                exportData={exportData}
                ImportButtonComponent={ProjectDebitImportButton}
                ExportButtonComponent={ExportProjectDebitsButton}
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
                actions={(rowData, { onDelete, onView }) => (
                    <>
                        <button className="btn btn-outline-primary btn-sm" onClick={() => onView(rowData)}>
                            <i className="pi pi-eye" />
                        </button>
                        <Link to={`/stockAvailabilityForm?id=${rowData.id}`} className="btn btn-outline-info btn-sm">
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
