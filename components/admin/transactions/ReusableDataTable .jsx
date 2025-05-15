import React, { useEffect, useRef, useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { MultiSelect } from 'primereact/multiselect';
import { Paginator } from 'primereact/paginator';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';


const ReusableDataTable = ({
    title = '',
    fetchFunction,
    deleteFunction,
    filters = [],
    columns = [],
    actions,
    addButtonLink,
    backButtonLink
}) => {
    const [data, setData] = useState([]);
    const [totalRecords, setTotalRecords] = useState(0);
    const [first, setFirst] = useState(0);
    const [rows, setRows] = useState(10);
    const [loading, setLoading] = useState(false);

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteId, setDeleteId] = useState(null);

    const filterStates = useRef({});

    filters.forEach(f => {
        if (!filterStates.current[f.field]) {
            filterStates.current[f.field] = [];
        }
    });
    const handleDelete = async () => {
        if (!deleteId) {
            toast.error("Invalid ID to delete");
            return;
        }

        setLoading(true);
        try {
            await deleteFunction(deleteId);
            toast.success('Deleted successfully');
            fetchData(); // Refresh after delete
        } catch (err) {
            console.error("Error deleting item:", err);
            toast.error('Failed to delete');
        } finally {
            setShowDeleteModal(false);
            setLoading(false);
        }
    };
    const fetchData = async () => {
        setLoading(true);
        try {
            const filterParams = {};
            filters.forEach(f => {
                const selected = filterStates.current[f.field];
                if (selected?.length > 0) {
                    filterParams[f.queryKey] = selected.map(item => item[f.optionValue]).join(',');
                }
            });

            const response = await fetchFunction({ ...filterParams, skip: first, limit: rows });
            setData(response.data);
            setTotalRecords(response.count);
        } catch (err) {
            toast.error('Error fetching data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [first, rows]);

    const onFilterChange = (field, value) => {
        filterStates.current[field] = value;
        fetchData();
    };

    const resetFilters = () => {
        filters.forEach(f => {
            filterStates.current[f.field] = [];
        });
        fetchData();
    };

    return (
        <div className="container-fluid mt-2">
            {backButtonLink && (
                <Link to={backButtonLink} className="text-primary text-decoration-none mb-2 d-inline-block">
                    <i className="pi pi-arrow-left" /> Back
                </Link>
            )}

            <h3 className="text-center">{title}</h3>

            <div className="d-flex justify-content-between my-2">
                <div>Total Records: {totalRecords}</div>
                <div>
                    {filters.some(f => filterStates.current[f.field]?.length > 0) && (
                        <button className="btn btn-danger btn-sm" onClick={resetFilters}>
                            Reset Filters
                        </button>
                    )}
                    {addButtonLink && (

                        <Link to={addButtonLink} className="btn btn-primary btn-sm ms-2">
                            Add Details <i className="pi pi-plus" />
                        </Link>
                    )}
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <div className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50 d-flex justify-content-center align-items-center z-3">
                    <div className="bg-white p-4 rounded shadow">
                        <p className="mb-3">Are you sure you want to delete this item?</p>
                        <div className="d-flex justify-content-end">
                            <button className="btn btn-secondary btn-sm me-2" onClick={() => setShowDeleteModal(false)}>Cancel</button>
                            <button className="btn btn-danger btn-sm" onClick={handleDelete} disabled={loading}>
                                {loading ? 'Deleting...' : 'Delete'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <DataTable
                value={data}
                stripedRows
                loading={loading}
                scrollable
                emptyMessage={<h6 className="text-center">No data available.</h6>}
            >
                {filters.map(f => (
                    <Column
                        key={f.field}
                        field={f.field}
                        header={() => (
                            <label>
                                {f.header} <br />
                                <MultiSelect
                                    filter
                                    value={filterStates.current[f.field]}
                                    options={f.options}
                                    optionLabel={f.optionLabel}
                                    onChange={e => onFilterChange(f.field, e.value)}
                                    className="w-100"
                                    placeholder={`Select ${f.header}`}
                                    maxSelectedLabels={0}
                                    selectedItemsLabel={`${filterStates.current[f.field]?.length || 0} selected`}
                                />

                            </label>
                        )}
                        style={{ minWidth: '12rem' }}
                    />
                ))}
                {columns.map(col => (
                    <Column key={col.field} field={col.field} header={col.header} style={col.style || {}} />
                ))}
                <Column
                    header="Actions"
                    body={rowData => (
                        <div className="d-flex justify-content-center gap-2">
                            {actions(rowData, {
                                onDelete: (id) => {
                                    setDeleteId(id);
                                    setShowDeleteModal(true);
                                }
                            })}
                        </div>
                    )}
                    style={{ minWidth: '10rem' }}
                />
            </DataTable>

            <Paginator
                className='mt-3'
                first={first}
                rows={rows}
                totalRecords={totalRecords}
                onPageChange={(e) => {
                    setFirst(e.first);
                    setRows(e.rows);
                }}
                rowsPerPageOptions={[10, 25, 50, 100, totalRecords]}
            />
        </div>
    );
};

export default ReusableDataTable;
