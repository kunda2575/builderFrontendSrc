import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { fetchData, deleteData, postData } from '../../../api/apiHandler';
import { config } from '../../../api/config';
import ReusableDataTable from './ReusableDataTable ';
import ExportMaterialIssueButton from '../reusableExportData/ExportMaterialIssueButton';
import ImportData from '../resusableComponents/ResuableImportData';
import ImportErrorModal from '../resusableComponents/ImportErrorModal';

const MaterialIssueTable = () => {
    const [materialDetails, setMaterialDetails] = useState([]);
    const [unitTypes, setUnitTypes] = useState([]);
    const [exportData, setExportData] = useState([]);

    const [importErrors, setImportErrors] = useState([]);
    const [showErrorModal, setShowErrorModal] = useState(false);

    const tableRef = useRef();

    useEffect(() => {
        fetchData(config.material_Issue).then(res => setMaterialDetails(res.data || []));
        fetchData(config.unitType_Issue).then(res => setUnitTypes(res.data || []));
    }, []);

    const handleExcelImport = async (data) => {
        const response = await postData(config.createMaterialImport, { materials: data });

        if (response.success) {
            toast.success("Materials imported successfully!");

            if (tableRef.current) {
                tableRef.current.refresh();
            }
        } else {
            toast.error(response.message || "Failed to import materials.");

            if (response.data?.errors?.length) {
                setImportErrors(response.data.errors);
                setShowErrorModal(true);
            }
        }
    };

    const MaterialImportButton = () => (
        <ImportData
            headers={[
                "material_name",
                "unit_type",
                "quantity_issued",
                "issued_by",
                "issued_to",
                "issue_date",
            ]}
            fileName="MaterialIssues"
            uploadData={handleExcelImport}
        />
    );

    const fetchMaterials = async ({ material_name, unit, skip, limit }) => {
        const url = `${config.getMaterialIsuues}?material_name=${material_name || ''}&unit=${unit || ''}&skip=${skip}&limit=${limit}`;
        const res = await fetchData(url);
        const data = res.data?.materialIssuesDetails || [];

        if (skip === 0) {
            setExportData(data);
        }

        return {
            data,
            count: res.data?.materialIssuesDetailsCount || 0,
        };
    };

    return (
        <div>
            <ImportErrorModal
                show={showErrorModal}
                errors={importErrors}
                onClose={() => setShowErrorModal(false)}
            />

            <ReusableDataTable
                title="Material Issues"
                ref={tableRef}
                fetchFunction={fetchMaterials}
                exportData={exportData}
                ExportButtonComponent={ExportMaterialIssueButton}
                ImportButtonComponent={MaterialImportButton}
                deleteFunction={(id) => deleteData(config.deleteMaterialIssue(id))}
                filters={[
                    {
                        field: 'material_name',
                        header: 'Material Name',
                        options: materialDetails,
                        optionLabel: 'materialName',
                        optionValue: 'materialName',
                        queryKey: 'material_name',
                    },
                    {
                        field: 'unit_type',
                        header: 'Unit Type',
                        options: unitTypes,
                        optionLabel: 'unit',
                        optionValue: 'unit',
                        queryKey: 'unit',
                    },
                ]}
                columns={[
                    { field: 'quantity_issued', header: 'Quantity Issued', style: { minWidth: '10rem' } },
                    { field: 'issued_by', header: 'Issued By', style: { minWidth: '10rem' } },
                    { field: 'issued_to', header: 'Issued To', style: { minWidth: '10rem' } },
                    { field: 'issue_date', header: 'Issue Date', style: { minWidth: '10rem' } },
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
                addButtonLink="/materialIssueForm"
                backButtonLink="/transaction"
            />
        </div>
    );
};

export default MaterialIssueTable;
