import React, { useEffect, useState } from 'react';
import ReusableDataTable from './ReusableDataTable';
import { fetchData, deleteData } from '../../../api/apiHandler';
import { config } from '../../../api/config';

const StockAvailabilityTable = () => {
    const [materialDetails, setMaterialDetails] = useState([]);
    const [unitTypes, setUnitTypes] = useState([]);

    useEffect(() => {
        fetchData(config.material).then(res => setMaterialDetails(res.data || []));
        fetchData(config.unitType).then(res => setUnitTypes(res.data || []));
    }, []);

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


    );
};

export default StockAvailabilityTable;
