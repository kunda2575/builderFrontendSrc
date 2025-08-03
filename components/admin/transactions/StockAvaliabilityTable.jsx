import React, { useEffect, useState, useRef } from 'react';
import ReusableDataTable from './ReusableDataTable ';
import { fetchData, deleteData, postData } from '../../../api/apiHandler';
import { config } from '../../../api/config';
import { Link } from 'react-router-dom';
import ExportMaterialsButton from '../reusableExportData/ExportMaterialsButton';
import ImportData from '../resusableComponents/ResuableImportData';
import { toast } from 'react-toastify';
import ImportErrorModal from '../resusableComponents/ImportErrorModal';

const StockAvailabilityTable = () => {
    const [materialDetails, setMaterialDetails] = useState([]);
    const [unitTypes, setUnitTypes] = useState([]);
    const [exportData, setExportData] = useState([]);

    
        const [importErrors, setImportErrors] = useState([]);
        const [showErrorModal, setShowErrorModal] = useState(false);
    
    const tableRef = useRef();
    useEffect(() => {
        fetchData(config.material).then(res => setMaterialDetails(res.data || []));
        fetchData(config.unitType).then(res => setUnitTypes(res.data || []));
    }, []);

    const fetchStocks = async ({ material_id, materialName, unit, skip, limit }) => {
        const url = `${config.getStocks}?material_id=${material_id || ''}&materialName=${materialName || ''}&unit=${unit || ''}&skip=${skip}&limit=${limit}`;
        const res = await fetchData(url);
        const data = res.data?.materialDetails || [];

        if (skip === 0) {
            setExportData(data); // Save first page for export
        }

        return {
            data,
            count: res.data?.materialDetailsCount || 0,
        };

    };


    const [stockAvailability, setStockAvailabilitys] = useState([]);

    const handleExcelImport = async (data) => {
        try {
            const response = await postData(config.createStockAvailabilityImport, { stockAvailability: data }); // ✅ send stockAvailability in body
            if (response.success) {
                toast.success("Project Debits imported successfully!");
                if (tableRef.current) {
                    tableRef.current.refresh(); //  Refresh the table data
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
            toast.error(err.response?.data?.error || "Failed to import stockAvailability.");
        }
    };


    const StockAvailabilityImportButton = () => (
        <ImportData
            headers={[
                "material_id",
                "material_name",
                "unit_type",
                "available_stock",
            ]}
            fileName="StockAvailability"
            uploadData={handleExcelImport}
        />
    );
    return (
 <div>
            <ImportErrorModal
                show={showErrorModal}
                errors={importErrors}
                onClose={() => setShowErrorModal(false)}
            />

        <ReusableDataTable
            title="Stock Availability Management"
            ref={tableRef}
            fetchFunction={fetchStocks}
            exportData={exportData}
            ImportButtonComponent={StockAvailabilityImportButton}
            ExportButtonComponent={ExportMaterialsButton}
            deleteFunction={(id) => deleteData(config.deleteStock(id))}
            filters={[
                { field: 'material_id', header: 'Material Id', options: materialDetails, optionLabel: 'material_id', optionValue: 'material_id', queryKey: 'material_id' },
                { field: 'material_name', header: 'Material Name', options: materialDetails, optionLabel: 'materialName', optionValue: 'materialName', queryKey: 'materialName' },
                { field: 'unit_type', header: 'Unit Type', options: unitTypes, optionLabel: 'unit', optionValue: 'unit', queryKey: 'unit' },
            ]}
            columns={[
                { field: 'available_stock', header: 'Available Stock', style: { minWidth: '10rem' } },
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

            addButtonLink="/stockAvailabilityForm"
            backButtonLink="/transaction"
        />
        </div>
    );
};

export default StockAvailabilityTable;
