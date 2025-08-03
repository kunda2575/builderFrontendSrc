import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import ReusableDataTable from './ReusableDataTable ';
import { fetchData, deleteData, postData } from '../../../api/apiHandler';
import { config } from '../../../api/config';
import ExportProjectCreditsButton from '../reusableExportData/ExportProjectCreditsButton';
import ImportData from '../resusableComponents/ResuableImportData';
import { toast } from 'react-toastify';
import ImportErrorModal from '../resusableComponents/ImportErrorModal';

const ProjectCreditsTable = () => {
    const [source, setSource] = useState([]);
    const [purpose, setPurpose] = useState([]);
    const [paymentMode, setPaymentMode] = useState([]);
    const [depositeBank, setDepositeBank] = useState([]);
    const [exportData, setExportData] = useState([]);

    const [importErrors, setImportErrors] = useState([]);
    const [showErrorModal, setShowErrorModal] = useState(false);


    const tableRef = useRef();
    useEffect(() => {
        fetchData(config.getSource).then(res => setSource(res.data || []));
        fetchData(config.getPurpose).then(res => setPurpose(res.data || []));
        fetchData(config.getDepositeBankPc).then(res => setDepositeBank(res.data || []));
        fetchData(config.getPaymentModePc).then(res => setPaymentMode(res.data || []));

    }, []);


    const [projectCredits, setProjectCredits] = useState([]);

    const handleExcelImport = async (data) => {
        try {
            const response = await postData(config.createProjectCreditImport, { projectCredits: data });

            if (response.success) {
                toast.success("Project credits imported successfully!");
                if (tableRef.current) {
                    tableRef.current.refresh(); // ✅ Refresh the table data
                }
            } else {
                toast.error(response.message || "Failed to import project credits.");

                // Optional: show backend validation errors
                if (response.data?.errors?.length) {
                    setImportErrors(response.data.errors);
                    setShowErrorModal(true);
                }
            }
        } catch (err) {
            console.error(err);
            toast.error(err.response?.data?.error || "Failed to import project credits.");
        }
    };



    const ProjectCreditImportButton = () => (
        <ImportData
            headers={[
                "date",
                "source",
                "amount_inr",
                "payment_mode",
                "purpose",
                "deposit_bank",
            ]}
            fileName="ProjectCredit"
            uploadData={handleExcelImport}
        />
    );


    const fetchProjectCredits = async ({ source, deposite_bank, purpose, payment_mode, skip, limit }) => {

        const url = `${config.getProjectCredits}?source=${source || ''}&purpose=${purpose || ''}&payment_mode=${payment_mode || ''}&deposite_bank=${deposite_bank || ''}&skip=${skip}&limit=${limit}`;
        const res = await fetchData(url);
        const data = res.data?.projectCreditsDetails || [];
        if (skip === 0) {
            setExportData(data); // ✅ Save first page for export
        }
        return {
            data,
            count: res.data?.projectCreditsDetailsCount || 0,
        };
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
                title="Project Credits Table"
                ref={tableRef}
                fetchFunction={fetchProjectCredits}
                exportData={exportData}
                ImportButtonComponent={ProjectCreditImportButton}
                ExportButtonComponent={ExportProjectCreditsButton}
                deleteFunction={(id) => deleteData(config.deleteProjectCredits(id))}
                filters={[
                    {
                        field: 'source',
                        header: 'Source',
                        options: source,
                        optionLabel: 'fundSource',
                        optionValue: 'fundSource',
                        queryKey: 'fundSource'
                    },
                    {
                        field: 'deposit_bank',
                        header: 'Deposite Bank',
                        options: depositeBank,
                        optionLabel: 'bankName',
                        optionValue: 'bankName',
                        queryKey: 'deposite_bank'
                    },
                    {
                        field: 'purpose',
                        header: 'Purpose',
                        options: purpose,
                        optionLabel: 'fundPurpose',
                        optionValue: 'fundPurpose',
                        queryKey: 'fundPurpose'
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
                    { field: 'date', header: 'Date' },
                    { field: 'amount_inr', header: 'Amount (INR)' },


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

                addButtonLink="/projectCreditForm"
                backButtonLink="/transaction"
            />
        </div>
    );
};

export default ProjectCreditsTable;
