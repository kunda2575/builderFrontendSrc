import React, { useEffect, useState, useRef } from 'react';
import { MultiSelect } from 'primereact/multiselect';
import { toast } from 'react-toastify';
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import { Link } from 'react-router-dom';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { fetchData } from '../../../api/apiHandler';
import { config } from '../../../api/config';
import { Paginator } from 'primereact/paginator';

const StockAvailabilityTable = () => {
    const [loading, setLoading] = useState(true);

    const [filteredStocks, setFilteredStocks] = useState([]);
    const [materialDetails, setMaterialDetails] = useState([]);
    const [unitType, setUnitType] = useState([]);

    const [selectedMaterial, setSelectedMaterial] = useState([]);
    const [selectedMaterialId, setSelectedMaterialId] = useState([]);
    const [selectedMaterialName, setSelectedMaterialName] = useState([]);
    const [selectedUnitType, setSelectedUnitType] = useState([]);

    const selectedMaterialIdRef = useRef([]);
    const selectedMaterialNameRef = useRef([])
    const selectedUnitTypeRef = useRef([]);

    const [first, setFirst] = useState(0);
    const [rows, setRows] = useState(10);
    const [totalRecords, setTotalRecords] = useState(0);
    const skipValue = useRef(0);
    const limitValue = useRef(10);

    useEffect(() => {
        getMaterialDetails();
        getUnitTypeDetails();
        getStockDetails();
    }, []);

    const onPageChange = (event) => {
        setFirst(event.first);
        setRows(event.rows);
        skipValue.current = event.first;
        limitValue.current = event.rows;
        getStockDetails();
    };


    const getStockDetails = async () => {
        setLoading(true);
        let material_id = [];
        let materialName = []
        let unit = [];
        // Extract selected IDs and names
        if (selectedMaterialIdRef.current?.length > 0) {
            const materialIds = selectedMaterialIdRef.current.map(item => item.material_id);
            material_id = materialIds
        }
        if (selectedMaterialNameRef.current?.length > 0) {
            const materialNames = selectedMaterialNameRef.current.map(item => item.materialName);
            materialName = materialNames
        }
        if (selectedUnitTypeRef.current?.length > 0) {
            const unitTypes = selectedUnitTypeRef.current.map(item => item.unit);
            unit = unitTypes
        }

        try {
            const res = await fetchData(
                `${config.getStocks}?material_id=${material_id}&materialName=${materialName}&unit=${unit}&skip=${skipValue.current}&limit=${limitValue.current}`
            );
            setFilteredStocks(res.data?.materialDetails || []);
            setTotalRecords(res.data?.materialDetailsCount || 0);
        } catch (error) {
            toast.error("Error fetching stock data");
        } finally {
            setLoading(false);
        }
    };


    const getMaterialDetails = async () => {
        try {
            const res = await fetchData(config.material);
            setMaterialDetails(Array.isArray(res.data) ? res.data : []);
        } catch {
            setMaterialDetails([]);
        }
    };

    const getUnitTypeDetails = async () => {
        try {
            const res = await fetchData(config.unitType);
            setUnitType(Array.isArray(res.data) ? res.data : []);
        } catch {
            setUnitType([]);
        }
    };

    const resetFilters = () => {
        setSelectedMaterial([]);
        setSelectedUnitType([]);
        setSelectedMaterialName([])
        selectedMaterialIdRef.current = [];
        selectedMaterialNameRef.current = [];
        selectedUnitTypeRef.current = [];
        getStockDetails();
    };

    return (
        <div className="container-fluid mt-4">
            <div className="d-flex justify-content-between">
                <Link className="text-decoration-none text-primary" to="/transaction">
                    <i className="pi pi-arrow-left"></i> Back
                </Link>
                <h3 className="text-center mb-4">Stock Availability Management</h3>
                <Link className="text-decoration-none text-primary" to="/stockAvailabilityForm">
                    Add Details <i className="pi pi-arrow-right"></i>
                </Link>
            </div>

            <div className='row mb-3'>
                <div className='col-6'>
                    <h5>Total Records: {totalRecords}</h5>
                </div>
                <div className='col-6 text-end'>
                    {(selectedMaterialIdRef.current.length > 0 || selectedUnitTypeRef.current.length > 0) && (
                        <button className='btn btn-danger btn-sm rounded-0' onClick={resetFilters}>
                            Reset All Filters
                        </button>
                    )}
                </div>
            </div>
            <div className="d-flex justify-content-center">
                <DataTable
                    value={filteredStocks}
                    stripedRows
                    className="custom-bordered-table"
                    loading={loading}
                    loadingIcon="pi pi-spinner"
                    scrollable
                    resizableColumns
                    emptyMessage={
                        <h6 className="p-4 text-center" >
                            No stock data available.
                        </h6>
                    }
                    showClear
                    style={{ textAlign: 'center' }}
                >
                    <Column field="material_id" header={() => (
                        <label>
                            Material Id<br />
                            <MultiSelect
                                filter
                                value={selectedMaterial}
                                options={materialDetails}
                                optionLabel="material_id"
                                onChange={e => {
                                    setSelectedMaterial(e.value);
                                    selectedMaterialIdRef.current = e.value;
                                    getStockDetails();
                                }}
                                style={{ textAlign: 'center' }}
                                placeholder="Select Material Id"
                                className="small-multiselect w-100"
                                maxSelectedLabels={0}
                                selectedItemsLabel={`${selectedMaterial.length} selected`}
                                
                            />
                        </label>
                    )} style={{ minWidth: '13rem' }} />


                    <Column field="material_name" header={() => (
                        <label>
                            Material Name<br />
                            <MultiSelect
                                filter
                                value={selectedMaterialName}
                                options={materialDetails}
                                optionLabel="materialName"
                                onChange={e => {
                                    setSelectedMaterialName(e.value);
                                    selectedMaterialNameRef.current = e.value;
                                    getStockDetails();
                                }}
                                placeholder="Select Material Name"
                                className="small-multiselect w-100"
                                maxSelectedLabels={0}
                                selectedItemsLabel={`${selectedMaterialName.length} selected`}
                                // showClear
                            />
                        </label>
                    )} style={{ minWidth: '13rem' }} />

                    <Column field="unit_type" header={() => (    // model name
                        <label>
                            Unit Type<br />
                            <MultiSelect
                                filter
                                value={selectedUnitType}
                                options={unitType}   // state variable 
                                optionLabel="unit"
                                onChange={e => {
                                    setSelectedUnitType(e.value);
                                    selectedUnitTypeRef.current = e.value;
                                    getStockDetails();
                                }}
                                placeholder="Select Unit Type"
                                className="small-multiselect w-100"
                                maxSelectedLabels={0}
                                selectedItemsLabel={`${selectedUnitType.length} selected`}

                            />
                        </label>
                    )} style={{ minWidth: '13rem' }} />

                    <Column field="available_stock" header="Available Stock" style={{ minWidth: '13rem' }} />
                    
                </DataTable>
            </div>
            <div className='mt-3'>
                <Paginator
                    first={first}
                    rows={rows}
                    totalRecords={totalRecords}
                    rowsPerPageOptions={[10, 25, 50, 100, 200, totalRecords]}
                    onPageChange={onPageChange}
                />
            </div>
        </div>
    );
};

export default StockAvailabilityTable;
