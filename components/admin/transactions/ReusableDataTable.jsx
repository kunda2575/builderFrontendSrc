import React, { useEffect, useState, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { MultiSelect } from 'primereact/multiselect';
import { Paginator } from 'primereact/paginator';
import { toast } from 'react-toastify';
import { Link, useNavigate } from 'react-router-dom';

const ReusableDataTable = ({
  title,
  addButtonLink,
  columnsConfig,
  fetchDataApi,
  deleteApi,
  filterOptions,
  rowKey = 'id',
  backButtonLink = null,
  editPath = '/edit', // optional
}) => {
  const [data, setData] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [loading, setLoading] = useState(true);
  const [first, setFirst] = useState(0);
  const [rows, setRows] = useState(10);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [filterState, setFilterState] = useState({});

  const filtersRef = useRef({});
  const navigate = useNavigate();

  const fetchTableData = async () => {
    setLoading(true);
    try {
      const query = Object.entries(filtersRef.current)
        .filter(([_, value]) => Array.isArray(value) && value.length > 0)
        .map(([key, value]) => `${key}=${encodeURIComponent(value.join(','))}`)
        .join('&');

      const res = await fetchDataApi(`${query}&skip=${first}&limit=${rows}`);
      setData(res.data?.materialDetails || []);
      setTotalRecords(res.data?.materialDetailsCount || 0);
    } catch (err) {
      toast.error('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setLoading(true);
    try {
      const res = await deleteApi(deleteId);
      toast.success(res.data?.message || 'Deleted successfully');
      fetchTableData(); // Refresh data after delete
    } catch {
      toast.error('Failed to delete');
    } finally {
      setDeleteId(null);
      setShowDeleteModal(false);
      setLoading(false);
    }
  };

  const onFilterChange = (key, selectedOptions) => {
    const values = selectedOptions.map(opt => opt[filterOptions[key]?.labelField || 'label']);
    filtersRef.current[key] = values;

    setFilterState((prev) => ({
      ...prev,
      [key]: selectedOptions,
    }));

    fetchTableData();
  };

  const resetFilters = () => {
    filtersRef.current = {};
    setFilterState({});
    fetchTableData();
  };

  const actionBodyTemplate = (rowData) => (
    <div className="d-flex gap-2 justify-content-center">
      <button
        className="btn btn-sm btn-warning"
        onClick={() => navigate(`${editPath}/${rowData[rowKey]}`)}
      >
        Edit
      </button>
      <button
        className="btn btn-sm btn-danger"
        onClick={() => {
          setDeleteId(rowData[rowKey]);
          setShowDeleteModal(true);
        }}
      >
        Delete
      </button>
    </div>
  );

  useEffect(() => {
    fetchTableData();
  }, [first, rows]);

  return (
    <div className="container-fluid mt-2">
      {backButtonLink && (
        <Link className="text-decoration-none text-primary" to={backButtonLink}>
          <i className="pi pi-arrow-left"></i> Back
        </Link>
      )}

      <h3 className="text-center mb-3">{title}</h3>

      <div className="text-end mb-2">
        <Link to={addButtonLink} className="btn btn-primary btn-sm">
          Add Details <i className="pi pi-plus"></i>
        </Link>
      </div>

      <div className="row mb-2">
        <div className="col-6">
          <h5>Total Records: {totalRecords}</h5>
        </div>
        <div className="col-6 text-end">
          {Object.keys(filtersRef.current).length > 0 && (
            <button className="btn btn-danger btn-sm" onClick={resetFilters}>
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50 d-flex justify-content-center align-items-center z-3">
          <div className="bg-white p-4 rounded shadow">
            <p>Are you sure you want to delete this item?</p>
            <div className="d-flex justify-content-end">
              <button className="btn btn-secondary btn-sm me-2" onClick={() => setShowDeleteModal(false)}>Cancel</button>
              <button className="btn btn-danger btn-sm" onClick={handleDelete}>
                {loading ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      <DataTable
        value={data}
        loading={loading}
        stripedRows
        scrollable
        emptyMessage={<h6 className="text-center">No data available.</h6>}
        style={{ textAlign: 'center' }}
        dataKey={rowKey}
      >
        {columnsConfig.map(col => (
          <Column
            key={col.field}
            field={col.field}
            header={
              col.filterable ? (
                <label>
                  {col.header} <br />
                  <MultiSelect
                    value={filterState[col.filterKey] || []}
                    options={filterOptions[col.filterKey]?.options}
                    optionLabel={filterOptions[col.filterKey]?.labelField}
                    onChange={(e) => onFilterChange(col.filterKey, e.value)}
                    placeholder={`Select ${col.header}`}
                    display="chip"
                    style={{ width: '100%' }}
                  />
                </label>
              ) : col.header
            }
            style={{ minWidth: '12rem' }}
          />
        ))}

        <Column header="Actions" body={actionBodyTemplate} style={{ minWidth: '10rem' }} />
      </DataTable>

      <div className="mt-3">
        <Paginator
          first={first}
          rows={rows}
          totalRecords={totalRecords}
          rowsPerPageOptions={[10, 25, 50, 100, totalRecords]}
          onPageChange={(e) => {
            setFirst(e.first);
            setRows(e.rows);
          }}
        />
      </div>
    </div>
  );
};

export default ReusableDataTable;
