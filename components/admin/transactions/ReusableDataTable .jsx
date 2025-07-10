import React, { useEffect, useRef, useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { MultiSelect } from 'primereact/multiselect';
import { Paginator } from 'primereact/paginator';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import moment from 'moment';

const ReusableDataTable = ({
    title = '',
    fetchFunction,
    deleteFunction,
    filters = [],
    columns = [],
    actions,
    addButtonLink,
    backButtonLink,
    exportData = [], // ✅ Accept as prop
    ExportButtonComponent = null // ✅ Optional: allow dynamic export button

}) => {
    const [data, setData] = useState([]);
    const [totalRecords, setTotalRecords] = useState(0);
    const [first, setFirst] = useState(0);
    const [rows, setRows] = useState(10);
    const [loading, setLoading] = useState(false);

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteId, setDeleteId] = useState(null);

    const [viewData, setViewData] = useState(null); // New: Modal view data

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
            fetchData();
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

            setData(response.data || []);
            setTotalRecords(response.count || 0);
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

            <div className="d-flex justify-content-between my-2 flex-wrap gap-2">
                <div>Total Records: {totalRecords}</div>
                <div className="d-flex align-items-center gap-2 flex-wrap">
                    {filters.some(f => filterStates.current[f.field]?.length > 0) && (
                        <button className="btn btn-danger btn-sm" onClick={resetFilters}>
                            Reset Filters
                        </button>
                    )}
                    {ExportButtonComponent && (
                        <ExportButtonComponent data={exportData} />
                    )}
                    {addButtonLink && (
                        <Link to={addButtonLink} className="btn btn-primary btn-sm">
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

            {/* View Details Modal */}

            {viewData && (
                <div
                    className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50 d-flex justify-content-center align-items-center"
                    style={{ zIndex: 1050 }}
                >
                    <div className="bg-white p-4 rounded shadow w-75" style={{ maxHeight: '90vh', overflowY: 'auto' }}>
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <h5 className="mb-0">Details</h5>
                            <button className="btn-close" onClick={() => setViewData(null)}></button>
                        </div>

                        <table className="table table-sm table-bordered">
                            <tbody>
                                {Object.entries(viewData).map(([key, value]) => {
                                    const isDateKey = ['invoice_date', 'creation_date', 'created_at', 'expected_date'].includes(key);
                                    let counter = 1;

                                    // 🧹 Sanitize URL utility
                                    const sanitizeUrl = (url) => {
                                        if (!url) return '';
                                        if (url.includes('https://pub-029295a7436d410e9cb079b9c6f2c11c.r2.dev/https://')) {
                                            return url.substring(url.indexOf('https://pub-029295a7436d410e9cb079b9c6f2c11c.r2.dev/'));
                                        }
                                        return url.startsWith('http')
                                            ? url
                                            : `https://pub-029295a7436d410e9cb079b9c6f2c11c.r2.dev/${url}`;
                                    };

                                    return (
                                        <tr key={key}>
                                            <th style={{ textTransform: 'capitalize' }}>{key.replace(/_/g, ' ')}</th>
                                            <td>
                                                {isDateKey && value ? (
                                                    moment(value).format('DD-MM-YYYY')
                                                ) : Array.isArray(value) ? (
                                                    <div className="d-flex flex-wrap gap-2">
                                                        {value.map((v, i) => {
                                                            const rawUrl = typeof v === 'string' ? v : v?.url || '';
                                                            const fileUrl = sanitizeUrl(rawUrl);
                                                            const filename = typeof v === 'string'
                                                                ? rawUrl.split('/').pop()
                                                                : v?.filename || `File ${i + 1}`;

                                                            const isImage = /\.(jpg|jpeg|png|gif)$/i.test(filename);
                                                            const isPDF = /\.pdf$/i.test(filename);
                                                            const downloadLabel = isPDF ? `Download PDF ${counter}` : `Download ${counter}`;
                                                            counter++;

                                                            return (
                                                                <div key={i} className="position-relative text-center" style={{ width: '120px' }}>
                                                                    {isImage ? (
                                                                        <>
                                                                            <img
                                                                                src={fileUrl}
                                                                                alt={filename}
                                                                                className="img-thumbnail"
                                                                                style={{ width: '100%', height: 'auto', objectFit: 'cover' }}
                                                                            />
                                                                            <div
                                                                                className="position-absolute top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center bg-dark bg-opacity-50 text-white"
                                                                                style={{ opacity: 0, transition: 'opacity 0.3s' }}
                                                                                onMouseEnter={(e) => (e.currentTarget.style.opacity = 1)}
                                                                                onMouseLeave={(e) => (e.currentTarget.style.opacity = 0)}
                                                                            >
                                                                                <a href={fileUrl} target="_blank" download className="btn btn-sm btn-light">
                                                                                    {downloadLabel}
                                                                                </a>
                                                                            </div>
                                                                        </>
                                                                    ) : (
                                                                        <a
                                                                            href={fileUrl}
                                                                            target="_blank"
                                                                            rel="noopener noreferrer"
                                                                            className="btn btn-sm btn-outline-primary"
                                                                        >
                                                                            {downloadLabel}
                                                                        </a>
                                                                    )}
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                ) : typeof value === 'string' && /\.(jpg|jpeg|png|gif)$/i.test(value) ? (
                                                    <div className="position-relative text-center" style={{ width: '120px' }}>
                                                        <img
                                                            src={sanitizeUrl(value)}
                                                            alt="Attachment"
                                                            className="img-thumbnail"
                                                            style={{ width: '100%', objectFit: 'cover' }}
                                                        />
                                                        <div
                                                            className="position-absolute top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center bg-dark bg-opacity-50 text-white"
                                                            style={{ opacity: 0, transition: 'opacity 0.3s' }}
                                                            onMouseEnter={(e) => (e.currentTarget.style.opacity = 1)}
                                                            onMouseLeave={(e) => (e.currentTarget.style.opacity = 0)}
                                                        >
                                                            <a
                                                                href={sanitizeUrl(value)} target="_blank"
                                                                download
                                                                className="btn btn-sm btn-light"
                                                            >
                                                                Download 1
                                                            </a>
                                                        </div>
                                                    </div>
                                                ) : typeof value === 'string' && /\.pdf$/i.test(value) ? (
                                                    <a
                                                        href={sanitizeUrl(value)}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="btn btn-sm btn-outline-primary"
                                                    >
                                                        Download PDF 1
                                                    </a>
                                                ) : (
                                                    String(value)
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
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
                {columns
                    .filter(col =>
                        !['documents', 'payment_reference', 'payment_evidence'].includes(col.field) // ❌ exclude these
                    )
                    .map(col => (
                        <Column
                            key={col.field}
                            field={col.field}
                            header={col.header}
                            style={col.style || {}}
                            body={col.body}
                        />
                    ))}

                <Column
                    header="Actions"
                    body={rowData => (
                        <div className="d-flex justify-content-center gap-2">
                            {actions(rowData, {
                                onDelete: (id) => {
                                    setDeleteId(id);
                                    setShowDeleteModal(true);
                                },
                                onView: (row) => setViewData(row)
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
