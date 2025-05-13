import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { fetchData, deleteData } from '../../../api/apiHandler';
import { config } from '../../../api/config';
import ReusableDataTable from './ReusableDataTable ';

const MaterialIssueTable = () => {
    const [materialDetails, setMaterialDetails] = useState([]);
    const [unitTypes, setUnitTypes] = useState([]);

    useEffect(() => {
        fetchData(config.material_Issue).then(res => setMaterialDetails(res.data || []));
        fetchData(config.unitType_Issue).then(res => setUnitTypes(res.data || []));
    }, []);

// const fetchMaterials = async ({ material_name, unit_type, skip, limit }) => {
//     const url = `${config.getMaterialIsuues}?material_name=${material_name || ''}&unit_type=${unit_type || ''}&skip=${skip}&limit=${limit}`;

//     try {
//         const res = await fetchData(url);

//         console.log("✅ API Data:", res.data); // Debug

//         return {
//             data: res.data?.materialIssueDetails || [],
//             count: res.data?.materialIssueDetailsCount || 0,
//         };
//     } catch (err) {
//         toast.error('Failed to fetch material issue data');
//         return { data: [], count: 0 };
//     }
// };

const fetchMaterials = async ({ material_name, unit, skip, limit }) => {
    const url = `${config.getMaterialIsuues}?material_name=${material_name || ''}&unit=${unit || ''}&skip=${skip}&limit=${limit}`;
    console.log("🔍 Fetching with material_name:", material_name); // Add this
    const res = await fetchData(url);
    console.log("✅ API Data:", res.data);
    return {
        data: res.data?.materialIssueDetails || [],
        count: res.data?.materialDetailsCount || 0,
    };
};

    return (
        <ReusableDataTable
            title="Material "
            fetchFunction={fetchMaterials}
            deleteFunction={(id) => deleteData(config.deleteStock(id))}
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
            actions={(rowData, { onDelete }) => (
                <>
                    <Link to={`/materialIssueForm?id=${rowData.id}`} className="btn btn-outline-info btn-sm">
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
    );
};

export default MaterialIssueTable;
