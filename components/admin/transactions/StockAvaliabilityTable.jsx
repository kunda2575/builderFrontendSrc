import React, { useEffect, useState } from 'react';
import ReusableDataTable from './ReusableDataTable ';
import { fetchData, deleteData } from '../../../api/apiHandler';
import { config } from '../../../api/config';
import { Link } from 'react-router-dom';
import ExportMaterialsButton from '../reusableExportData/ExportMaterialsButton';

const StockAvailabilityTable = () => {
    const [materialDetails, setMaterialDetails] = useState([]);
    const [unitTypes, setUnitTypes] = useState([]);
  const [exportData, setExportData] = useState([]);
    useEffect(() => {
        fetchData(config.material).then(res => setMaterialDetails(res.data || []));
        fetchData(config.unitType).then(res => setUnitTypes(res.data || []));
    }, []);

    const fetchStocks = async ({ material_id, materialName, unit, skip, limit }) => {
        const url = `${config.getStocks}?material_id=${material_id || ''}&materialName=${materialName || ''}&unit=${unit || ''}&skip=${skip}&limit=${limit}`;
        const res = await fetchData(url);
        const data= res.data?.materialDetails || [];

         if (skip === 0) {
            setExportData(data); // ✅ Save first page for export
        }

        return {
            data,
            count: res.data?.materialDetailsCount || 0,
        };
       
    };
    return (
     
        <ReusableDataTable
            title="Stock Availability Management"
            fetchFunction={fetchStocks}
              exportData={exportData}
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
    );
};

export default StockAvailabilityTable;
