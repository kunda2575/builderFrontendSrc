import React, { useEffect, useState } from 'react';
<<<<<<< HEAD
import ReusableDataTable from './ReusableDataTable';
import { fetchData, deleteData } from '../../../api/apiHandler';
import { config } from '../../../api/config';
=======
import ReusableDataTable from './ReusableDataTable ';
import { fetchData, deleteData } from '../../../api/apiHandler';
import { config } from '../../../api/config';
import { Link } from 'react-router-dom';
>>>>>>> master

const StockAvailabilityTable = () => {
    const [materialDetails, setMaterialDetails] = useState([]);
    const [unitTypes, setUnitTypes] = useState([]);

    useEffect(() => {
        fetchData(config.material).then(res => setMaterialDetails(res.data || []));
        fetchData(config.unitType).then(res => setUnitTypes(res.data || []));
    }, []);

<<<<<<< HEAD
    const columnsConfig = [
        { field: 'material_id', header: 'Material Id', filterable: true, filterKey: 'material_id' },
        { field: 'material_name', header: 'Material Name', filterable: true, filterKey: 'materialName' },
        { field: 'unit_type', header: 'Unit Type', filterable: true, filterKey: 'unit' },
        { field: 'available_stock', header: 'Available Stock', filterable: false },
    ];
const filterOptions = {
    material_id: { options: Array.isArray(materialDetails) ? materialDetails : [], labelField: 'material_id' },
    materialName: { options: Array.isArray(materialDetails) ? materialDetails : [], labelField: 'material_name' },
    unit: { options: Array.isArray(unitTypes) ? unitTypes : [], labelField: 'unit' },
};

    return (
<ReusableDataTable
    title="Stock Availability Management"
    addButtonLink="/stockAvailabilityForm"
    backButtonLink="/transaction"
    columnsConfig={columnsConfig}
    fetchDataApi={(query) => fetchData(`${config.getStocks}?${query}`)}
    deleteApi={(id) => deleteData(config.deleteStock(id))}
    filterOptions={filterOptions}
    editPath="/stockAvailabilityForm" // ✅ make sure this is here
/>


=======
    const fetchStocks = async ({ material_id, materialName, unit, skip, limit }) => {
        const url = `${config.getStocks}?material_id=${material_id || ''}&materialName=${materialName || ''}&unit=${unit || ''}&skip=${skip}&limit=${limit}`;
        const res = await fetchData(url);
        return {
            data: res.data?.materialDetails || [],
            count: res.data?.materialDetailsCount || 0,
        };
    };
    return (
        <ReusableDataTable
            title="Stock Availability Management"
            fetchFunction={fetchStocks}
            deleteFunction={(id) => deleteData(config.deleteStock(id))}
            filters={[
                { field: 'material_id', header: 'Material Id', options: materialDetails, optionLabel: 'material_id', optionValue: 'material_id', queryKey: 'material_id' },
                { field: 'material_name', header: 'Material Name', options: materialDetails, optionLabel: 'materialName', optionValue: 'materialName', queryKey: 'materialName' },
                { field: 'unit_type', header: 'Unit Type', options: unitTypes, optionLabel: 'unit', optionValue: 'unit', queryKey: 'unit' },
            ]}
            columns={[
                { field: 'available_stock', header: 'Available Stock', style: { minWidth: '10rem' } },
            ]}
            actions={(rowData, { onDelete }) => (
                <>
                    <Link to={`/stockAvailabilityForm?id=${rowData.id}`} className="btn btn-outline-info btn-sm">
                        <i className="pi pi-pencil" />
                    </Link>
                    <button className="btn btn-outline-danger btn-sm" onClick={() => onDelete(rowData.id)}>
                        <i className="pi pi-trash" />
                    </button>
                </>
            )}
            addButtonLink="/stockAvailabilityForm"
            backButtonLink="/transaction"
        />
>>>>>>> master
    );
};

export default StockAvailabilityTable;
