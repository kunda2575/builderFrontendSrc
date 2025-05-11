import React, { useEffect, useState } from 'react';
import { MultiSelect } from 'primereact/multiselect';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Link } from 'react-router-dom';
import { Paginator } from 'primereact/paginator';
import { toast } from 'react-toastify';
import { fetchData, deleteData } from '../../../api/apiHandler';

const ReusableDataTable = ({
    title,
    addLink,
    fetchUrl,
    deleteUrl,
    filtersConfig = [],
    columns = []
}) => {
    const [data, setData] = useState([]);
    const [totalRecords, setTotalRecords] = useState(0);
    const [first, setFirst] = useState(0);
    const [rows, setRows] = useState(10);
    const [loading, setLoading] = useState(true);

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteId, setDeleteId] = useState(null);
    const [filters, setFilters] = useState({});

    useEffect(() => {
        fetchTableData();
    }, [filters, first, rows]);

    const fetchTableData = async () => {
        setLoading(true);
        const params = new URLSearchParams();
        params.append('skip', first);
        params.append('limit', rows);

        filtersConfig.forEach((configItem) => {
            const field = configItem.field;
            const queryKey = configItem.queryKey || field;
            const selectedValues = filters[field];

            if (selectedValues && selectedValues.length > 0) {
                selectedValues.forEach((item) => {
                    const value = item[configItem.optionKey];
                    params.append(queryKey, value);
                });
            }
        });

        try {
            const response = await fetchData(`${fetchUrl}?${params.toString()}`);
            setData(response.data || []);
            setTotalRecords(response.total || 0);
        } catch (err) {
            toast.error('Failed to fetch data.');
        } finally {
            setLoading(false);
        }
    };

    const onPageChange = (e) => {
        setFirst(e.first);
        setRows(e.rows);
    };

    const onFilterChange = (e, field) => {
        const value = e.value;
        setFilters((prevFilters) => ({
            ...prevFilters,
            [field]: value
        }));
    };

    const resetFilters = () => {
        setFilters({});
    };

    const confirmDelete = async () => {
        if (!deleteId) return;
        setLoading(true);
        try {
            await deleteData(deleteUrl(deleteId));
            toast.success('Deleted successfully');
            fetchTableData();
        } catch {
            toast.error('Failed to delete');
        } finally {
            setDeleteId(null);
            setShowDeleteModal(false);
            setLoading(false);
        }
    };

    return (
        <div className="container-fluid mt-3">
            <Link to="/transaction" className="text-primary text-decoration-none mb-2 d-block">
                <i className="pi pi-arrow-left"></i> Back
            </Link>
            <div className="d-flex justify-content-between align-items-center mb-2">
                <h3>{title}</h3>
                <Link to={addLink}>
                    <button className="btn btn-primary btn-sm">
                        Add Details <i className="pi pi-plus"></i>
                    </button>
                </Link>
            </div>

            <div className="text-end mb-2">
                <button className="btn btn-danger btn-sm" onClick={resetFilters}>
                    Reset All Filters
                </button>
            </div>

            <DataTable value={data} stripedRows loading={loading} rows={rows} first={first}>
                {filtersConfig.map(config => (
                    <Column
                        key={config.field}
                        field={config.field}
                        header={() => (
                            <label>
                                {config.label} <br />
                                <MultiSelect
                                    filter
                                    value={filters[config.field] || []}
                                    options={config.options}
                                    optionLabel={config.optionLabel}
                                    optionValue={config.optionKey}
                                    onChange={(e) => onFilterChange(e, config.field)}
                                    placeholder={`Select ${config.label}`}
                                    className="w-100"
                                    maxSelectedLabels={0}
                                    selectedItemsLabel={`${filters[config.field]?.length || 0} selected`}
                                />
                            </label>
                        )}
                        style={{ minWidth: '13rem' }}
                    />
                ))}
                {columns.map(col => (
                    <Column key={col.field} field={col.field} header={col.header} />
                ))}
                <Column
                    header="Actions"
                    body={(rowData) => (
                        <div className="d-flex gap-2 justify-content-center">
                            <Link to={`${addLink}?id=${rowData.id}`} className="btn btn-outline-info btn-sm">
                                <i className="pi pi-pencil"></i>
                            </Link>
                            <button className="btn btn-outline-danger btn-sm" onClick={() => {
                                setDeleteId(rowData.id);
                                setShowDeleteModal(true);
                            }}>
                                <i className="pi pi-trash"></i>
                            </button>
                        </div>
                    )}
                />
            </DataTable>

            <Paginator
                first={first}
                rows={rows}
                totalRecords={totalRecords}
                rowsPerPageOptions={[10, 25, 50, 100, totalRecords]}
                onPageChange={onPageChange}
                className="mt-3"
            />

            {showDeleteModal && (
                <div className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50 d-flex justify-content-center align-items-center z-3">
                    <div className="bg-white p-4 rounded shadow">
                        <p className="mb-3">Are you sure you want to delete this item?</p>
                        <div className="d-flex justify-content-end">
                            <button className="btn btn-secondary btn-sm me-2" onClick={() => setShowDeleteModal(false)}>
                                Cancel
                            </button>
                            <button className="btn btn-danger btn-sm" onClick={confirmDelete} disabled={loading}>
                                {loading ? 'Deleting...' : 'Delete'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ReusableDataTable;
