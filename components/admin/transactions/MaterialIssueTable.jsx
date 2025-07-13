import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { fetchData, deleteData,postData } from '../../../api/apiHandler';
import { config } from '../../../api/config';
import ReusableDataTable from './ReusableDataTable ';
import ExportMaterialIssueButton from '../reusableExportData/ExportMaterialIssueButton';
import ImportData from '../resusableComponents/ResuableImportData';

const MaterialIssueTable = () => {
    const [materialDetails, setMaterialDetails] = useState([]);
    const [unitTypes, setUnitTypes] = useState([]);
    const [exportData, setExportData] = useState([]);
    useEffect(() => {
        fetchData(config.material_Issue).then(res => setMaterialDetails(res.data || []));
        fetchData(config.unitType_Issue).then(res => setUnitTypes(res.data || []));
    }, []);


    const [materials, setMaterials] = useState([]);

    const handleExcelImport = async (data) => {
        try {
            const response = await postData(config.createMaterialImport, { materials: data }); // ✅ send materials in body
            toast.success("Materials imported successfully!");

        } catch (err) {
            console.error(err);
            toast.error(err.response?.data?.error || "Failed to import materials.");
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
            setExportData(data); // ✅ Save first page for export
        }

        return {
            data,
            count: res.data?.materialIssuesDetailsCount || 0,
        };
    };

  


    return (
        <ReusableDataTable
            title="Material Issues "
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
                    queryKey: 'material_name', // ✅ change this
                },
                {
                    field: 'unit_type',
                    header: 'Unit Type',
                    options: unitTypes,
                    optionLabel: 'unit',
                    optionValue: 'unit',
                    queryKey: 'unit', // ✅ change this
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
                    <Link to={`/stockAvailabilityForm?id=${rowData.id}`} className="btn btn-outline-info btn-sm">
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

            addButtonLink="/materialIssueForm"
            backButtonLink="/transaction"
        />
    );
};

export default MaterialIssueTable;
