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

const MaterialIssueTable = () => {
    const [loading, setLoading] = useState(true);

    // for delete actions
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [confirmDeleteId, setConfirmDeleteId] = useState(null);
    const [deleteType, setDeleteType] = useState(null);


    const [filteredMaterialIsuue, setFilteredMaterialIsuue] = useState([]);
    const [materialDetails, setMaterialDetails] = useState([]);
    const [unitType, setUnitType] = useState([]);

    const [selectedMaterialName, setSelectedMaterialName] = useState([]);
    const [selectedUnitType, setSelectedUnitType] = useState([]);

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
        getMaterialIssues();
    }, []);

    const onPageChange = (event) => {
        setFirst(event.first);
        setRows(event.rows);
        skipValue.current = event.first;
        limitValue.current = event.rows;
        getMaterialIssues();
    };


    const getMaterialIssues = async () => {
        setLoading(true);
        let materialName = []
        let unit = [];

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
                `${config.getMaterialIsuues}?materialName=${materialName}&unit=${unit}&skip=${skipValue.current}&limit=${limitValue.current}`
            );
            setFilteredMaterialIsuue(res.data?.materialIssueDetails || []);
            setTotalRecords(res.data?.materialDetailsCount || 0);
        } catch (error) {
            toast.error("Error fetching stock data");
        } finally {
            setLoading(false);
        }
    };


    const getMaterialDetails = async () => {
        try {
            const res = await fetchData(config.material_Issue);
            setMaterialDetails(Array.isArray(res.data) ? res.data : []);
        } catch {
            setMaterialDetails([]);
        }
    };

    const getUnitTypeDetails = async () => {
        try {
            const res = await fetchData(config.unitType_Issue);
            setUnitType(Array.isArray(res.data) ? res.data : []);
        } catch {
            setUnitType([]);
        }
    };

    const resetFilters = () => {
        setSelectedUnitType([]);
        setSelectedMaterialName([])
        selectedMaterialNameRef.current = [];
        selectedUnitTypeRef.current = [];
        getMaterialIssues();
    };

    const confirmDelete = async () => {
        if (!confirmDeleteId) return;
        setLoading(true);
        try {
            const res = await deleteData(config.deleteMaterialIssue(confirmDeleteId));
            toast.success(res.data?.message || "Material Issue deleted successfully.");
            getMaterialIssues(); // Refresh data
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
            <h3 className="text-center mb-3"> Material Issue Management</h3>
            <div className="text-end">
                <Link className="text-decoration-none text-primary" to="/materialIssueForm"> <button className='btn btn-primary btn-sm'> Add Details  <i className="pi pi-arrow-right"></i> </button>  </Link>
            </div>

            <div className='row mb-3'>
                <div className='col-6'>
                    <h5>Total Records: {totalRecords}</h5>
                </div>
                <div className='col-6 text-end'>
                    {(selectedMaterialNameRef.current.length > 0 || selectedUnitTypeRef.current.length > 0) && (
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
                value={filteredMaterialIsuue}
                stripedRows
                loading={loading}
                loadingIcon="pi pi-spinner"
                scrollable
                emptyMessage={
                    <h6 className="text-center" >
                        No stock data available.
                    </h6>
                }
                showClear={true}
                style={{ textAlign: 'center' }}
            >
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
                                getMaterialIssues();
                            }}
                            placeholder="Select Material Name"
                            className="small-multiselect w-100"
                            maxSelectedLabels={0}
                            selectedItemsLabel={`${selectedMaterialName.length} selected`}
                        />
                    </label>
                )}  style={{ minWidth: '13rem' }} />

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
                                getMaterialIssues();
                            }}
                            placeholder="Select Unit Type"
                            style={{ textAlign: 'center' }}
                            maxSelectedLabels={0}
                            selectedItemsLabel={`${selectedUnitType.length} selected`}
                        />
                    </label>
                )}  style={{ minWidth: '13rem' }} />

                <Column field="quantity_issued" header="Quantity Issued" headerClassName="text-center" />
                <Column field="issued_by" header="Issued By" />
                <Column field="issued_to" header="Issued To" />
                <Column field="issue_date" header="Issue Date" />

                <Column
                    header="Actions"
                    body={(rowData) => (
                        <div className="d-flex gap-2 justify-content-center">
                            <Link to={`/materialIssueForm?id=${rowData.id}`} className="btn btn-outline-info btn-sm">
                                <i className="pi pi-pencil"></i>
                            </Link>
                            <button className="btn btn-outline-danger btn-sm" onClick={() => {
                                setConfirmDeleteId(rowData.id);
                                setDeleteType("single");
                                setShowDeleteModal(true);
                            }}>
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

export default MaterialIssueTable;
