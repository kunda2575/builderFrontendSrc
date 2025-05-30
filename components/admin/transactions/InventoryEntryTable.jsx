import React, { useEffect, useState, useRef } from 'react';
import { MultiSelect } from 'primereact/multiselect';
import { toast } from 'react-toastify';
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import { Link } from 'react-router-dom';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { fetchData, deleteData } from '../../../api/apiHandler';
import { config } from '../../../api/config';
import { Paginator } from 'primereact/paginator';

const InventoryEntryTable = () => {
    const [loading, setLoading] = useState(true);

    // for delete actions
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [confirmDeleteId, setConfirmDeleteId] = useState(null);
    const [deleteType, setDeleteType] = useState(null);


    const [filteredInventory, setFilteredInventory] = useState([]);
    const [materialDetails, setMaterialDetails] = useState([]);
    const [unitType, setUnitType] = useState([]);
    const [vendorName, setVendorName] = useState([]);

    const [selectedMaterialId, setSelectedMaterialId] = useState([]);
    const [selectedMaterialName, setSelectedMaterialName] = useState([]);
    const [selectedUnitType, setSelectedUnitType] = useState([]);
    const [selectedVendorName, setSelectedVendorName] = useState([]);

    const selectedMaterialIdRef = useRef([]);
    const selectedMaterialNameRef = useRef([])
    const selectedUnitTypeRef = useRef([]);
    const selectedVendorNameRef = useRef([]);

    const [first, setFirst] = useState(0);
    const [rows, setRows] = useState(10);
    const [totalRecords, setTotalRecords] = useState(0);
    const skipValue = useRef(0);
    const limitValue = useRef(10);

    useEffect(() => {
        getMaterialDetails();
        getUnitTypeDetails();
        getInventory();
        getVendorDetails();
    }, []);

    const onPageChange = (event) => {
        setFirst(event.first);
        setRows(event.rows);
        skipValue.current = event.first;
        limitValue.current = event.rows;
        getInventory();
    };


    const getInventory = async () => {
        setLoading(true);
        let material_id = [];
        let materialName = []
        let unit = [];
        let vendorName = [];


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
        if (selectedVendorNameRef.current?.length > 0) {
            const vendorNames = selectedVendorNameRef.current.map(item => item.vendorName);
            vendorName = vendorNames
        }

        const queryParams = new URLSearchParams();

        if (material_id.length > 0) queryParams.append('material_id', material_id.join(','));
        if (materialName.length > 0) queryParams.append('materialName', materialName.join(','));
        if (unit.length > 0) queryParams.append('unit', unit.join(','));
        if (vendorName.length > 0) queryParams.append('vendorName', vendorName.join(','));

        queryParams.append('skip', skipValue.current);
        queryParams.append('limit', limitValue.current);

        try {
            const res = await fetchData(`${config.getInventories}?${queryParams.toString()}`);
            setFilteredInventory(res.data?.inventoryDetails || []);
            setTotalRecords(res.data?.inventoryDetailsCount || 0);
        } catch (error) {
            toast.error("Error fetching stock data");
        } finally {
            setLoading(false);
        }

        // try {
        //     const res = await fetchData(
        //         `${config.getInventories}?material_id=${material_id}&materialName=${materialName}&unit=${unit}&vendorName=${vendorName}&skip=${skipValue.current}&limit=${limitValue.current}`
        //     );
        //     setFilteredInventory(res.data?.inventoryDetails || []);
        //     setTotalRecords(res.data?.inventoryDetailsCount || 0);
        // } catch (error) {
        //     toast.error("Error fetching stock data");
        // } finally {
        //     setLoading(false);
        // }
    };


    const getMaterialDetails = async () => {
        try {
            const res = await fetchData(config.getMaterial);
            setMaterialDetails(Array.isArray(res.data) ? res.data : []);
        } catch {
            setMaterialDetails([]);
        }
    };

    const getUnitTypeDetails = async () => {
        try {
            const res = await fetchData(config.getUnitType);
            setUnitType(Array.isArray(res.data) ? res.data : []);
        } catch {
            setUnitType([]);
        }
    };

    const getVendorDetails = async () => {
        try {
            const res = await fetchData(config.getVendorName);
            setVendorName(Array.isArray(res.data) ? res.data : []);
        } catch {
            setVendorName([]);
        }
    };

    const resetFilters = () => {
        setSelectedMaterialId([]);
        setSelectedUnitType([]);
        setSelectedMaterialName([]);
        setSelectedVendorName([]);
        selectedMaterialIdRef.current = [];
        selectedMaterialNameRef.current = [];
        selectedUnitTypeRef.current = [];
        selectedVendorNameRef.current = [];
        getInventory();
    };

    const confirmDelete = async () => {
        if (!confirmDeleteId) return;
        setLoading(true);
        try {
            const res = await deleteData(config.deleteInventory(confirmDeleteId));
            toast.success(res.data?.message || "Inventory deleted successfully.");
            getInventory(); // Refresh data
        } catch (error) {
            toast.error("Failed to delete material");
        } finally {
            setConfirmDeleteId(null);
            setShowDeleteModal(false);
            setDeleteType(null);
            setLoading(false);
        }
    };


    return (
        <div className="container-fluid mt-2">
            <Link className="text-decoration-none text-primary" to="/transaction"> <i className="pi pi-arrow-left"></i>  Back </Link>
            <h3 className="text-center mb-3">Inventory Management</h3>
            <div className="text-end">
                <Link className="text-decoration-none text-primary" to="/inventoryEntryForm"> <button className='btn btn-primary btn-sm mb-2'> Add Details  <i className="pi pi-arrow-right"></i> </button>  </Link>
            </div>

            <div className='row mb-3'>
                <div className='col-6'>
                    <h5>Total Records: {totalRecords}</h5>
                </div>
                <div className='col-6 text-end'>
                    {(selectedMaterialIdRef.current.length > 0 || selectedMaterialNameRef.current.length > 0 || selectedUnitTypeRef.current.length > 0 || selectedVendorNameRef.current.length > 0) && (
                        <button className='btn btn-danger btn-sm rounded-0' onClick={resetFilters}>
                            Reset All Filters
                        </button>
                    )}
                </div>
            </div>

            {/* Confirmation Modal */}
            {showDeleteModal && (
                <div className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50 d-flex justify-content-center align-items-center z-3">
                    <div className="bg-white p-4 rounded shadow">
                        <p className="mb-3">Are you sure you want to delete {deleteType === "bulk" ? "selected items?" : "this item?"}</p>
                        <div className="d-flex justify-content-end">
                            <button className="btn btn-secondary btn-sm me-2" onClick={() => {
                                setConfirmDeleteId(null);
                                setShowDeleteModal(false);
                                setDeleteType(null);
                            }}>
                                Cancel
                            </button>
                            <button className="btn btn-danger btn-sm" onClick={() => { confirmDelete() }} disabled={loading}>
                                {loading ? 'Deleting...' : 'Delete'}
                            </button>
                        </div>
                    </div>
                </div>
            )}


            <DataTable
                value={filteredInventory}
                stripedRows
                loading={loading}
                loadingIcon="pi pi-spinner"
                scrollable
                emptyMessage={
                    <h6 className="text-center" >
                        No Inventory data available.
                    </h6>
                }
                // showClear={true}
                style={{ textAlign: 'center' }}
            >
                <Column field="material_id" header={() => (
                    <label>
                        Material Id<br />
                        <MultiSelect
                            filter
                            value={selectedMaterialId}
                            options={materialDetails}
                            optionLabel="material_id"
                            onChange={e => {
                                setSelectedMaterialId(e.value);
                                selectedMaterialIdRef.current = e.value;
                                getInventory();
                            }}
                            style={{ textAlign: 'center' }}
                            placeholder="Select Material Id"
                            className="small-multiselect w-100"
                            maxSelectedLabels={0}
                            selectedItemsLabel={`${selectedMaterialId.length} selected`}
                        />
                    </label>
                )} style={{ minWidth: '13rem' }} />

                <Column field="material_name" header={() => (
                    <label>
                        Material Name <br />
                        <MultiSelect
                            filter
                            value={selectedMaterialName}
                            options={materialDetails}
                            optionLabel="materialName"
                            onChange={e => {
                                setSelectedMaterialName(e.value);
                                selectedMaterialNameRef.current = e.value;
                                getInventory();
                            }}
                            placeholder="Select Material Name"
                            className="small-multiselect w-100"
                            maxSelectedLabels={0}
                            selectedItemsLabel={`${selectedMaterialName.length} selected`}
                        />
                    </label>
                )} style={{ minWidth: '13rem' }} />

                <Column field="vendor_name" header={() => (    // model name
                    <label>
                        Vendor Name<br />
                        <MultiSelect
                            filter
                            value={selectedVendorName}
                            options={vendorName}   // state variable 
                            optionLabel="vendorName"
                            onChange={e => {
                                setSelectedVendorName(e.value);
                                selectedVendorNameRef.current = e.value;
                                getInventory();
                            }}
                            placeholder="Select Vendor Name"
                            className="small-multiselect w-100"
                            maxSelectedLabels={0}
                            selectedItemsLabel={`${selectedVendorName.length} selected`}
                        />
                    </label>
                )} style={{ minWidth: '13rem' }} />

                <Column field="invoice_number" header="Invoice Number" style={{ minWidth: '13rem' }} />
                <Column field="invoice_date" header="Invoice Date" style={{ minWidth: '13rem' }} />
                <Column field="invoice_cost_incl_gst" header="Invoice_Cost_Incl_Gst" style={{ minWidth: '13rem' }} />
                <Column field="quantity_received" header="Quantity Received" style={{ minWidth: '13rem' }} />
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
                                getInventory();
                            }}
                            placeholder="Select Unit Type"
                            className="small-multiselect w-100"
                            maxSelectedLabels={0}
                            selectedItemsLabel={`${selectedUnitType.length} selected`}
                        />
                    </label>
                )} style={{ minWidth: '13rem' }} />
                {/* <Column field="invoice_attachment" header="Invoice Attachment" style={{ minWidth: '13rem' }} /> */}
                

               <Column
                    header="Invoice Attachment"
                    body={(rowData) => {
                        const files = rowData.invoice_attachment
                            ? rowData.invoice_attachment.split(',')
                            : [];

                        return files.length > 0 ? (
                            <div className="flex flex-col gap-1">
                                {files.map((file, index) => (
                                    <a
                                                key={index}

                                                href={`http://localhost:2026/uploads/${file}`}
                                                target='blank'
                                                download
                                                className="btn btn-sm btn-outline-primary"
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                Download PDF {index + 1}
                                            </a>

                                ))}
                            </div>
                        ) : (
                            <span className="text-muted">No Attachment</span>
                        );
                    }}
                    style={{ minWidth: '13rem' }}
                /> 


                <Column field="entered_by" header="Entered By" style={{ minWidth: '13rem' }} />

                <Column
                    header="Actions"
                    body={(rowData) => (
                        <div className="d-flex gap-2 justify-content-center">
                            {/* <Link to={`/inventoryEntryForm?id=${rowData.id}`} className="btn btn-outline-info btn-sm">
                                <i className="pi pi-pencil"></i>
                            </Link> */}
                            <button
                                className="btn btn-outline-danger btn-sm"
                                onClick={() => {
                                    setConfirmDeleteId(rowData.id);
                                    setDeleteType("single");
                                    setShowDeleteModal(true);
                                }}
                            >
                                <i className="pi pi-trash"></i>
                            </button>
                        </div>
                    )}
                    style={{ minWidth: '10rem' }}
                />


            </DataTable>
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

export default InventoryEntryTable;
