import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { Dropdown } from 'primereact/dropdown';
import { Link } from 'react-router-dom';

const ReusableTableForm = ({
    title,
    fields,
    fetchData,
    createData,
    updateData,
    deleteData
}) => {
    const initialFormState = Object.fromEntries(fields.map(f => [f.name, f.type === 'checkbox' ? false : '']));
    const [items, setItems] = useState([]);
    const [form, setForm] = useState({ ...initialFormState, id: null });
    const [selectedItems, setSelectedItems] = useState([]);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [loading, setLoading] = useState(false);
    const [confirmDeleteId, setConfirmDeleteId] = useState(null);
    const [deleteType, setDeleteType] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const rowsPerPageOptions = [
        { label: '5 Rows', value: 5 },
        { label: '10 Rows', value: 10 },
        { label: '20 Rows', value: 20 },
        { label: 'All', value: items.length }
    ];
    const bankBranches = {
        HDFC: [
          { label: 'Hyderabad Main', value: 'Hyderabad Main' },
          { label: 'Mumbai Andheri', value: 'Mumbai Andheri' },
          { label: 'Bangalore MG Road', value: 'Bangalore MG Road' }
        ],
        ICICI: [
          { label: 'Chennai T Nagar', value: 'Chennai T Nagar' },
          { label: 'Delhi Karol Bagh', value: 'Delhi Karol Bagh' }
        ],
        Axis: [
          { label: 'Kolkata Salt Lake', value: 'Kolkata Salt Lake' },
          { label: 'Pune Hinjewadi', value: 'Pune Hinjewadi' }
        ]
      };
      
    useEffect(() => {
        getData();
    }, []);

    const getData = async () => {
        try {
            const res = await fetchData();
            setItems(res.data);
        } catch (error) {
            toast.error(`Failed to fetch ${title}`);
        }
    };

    const handleChange = (e, field) => {
        const { name, value, checked, type, files } = e.target;
        if (type === 'checkbox') {
            setForm({ ...form, [name]: checked });
        } else if (type === 'file') {
            setForm({ ...form, [name]: files[0] });
        } else {
            setForm({ ...form, [name]: value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const data = new FormData();
            fields.forEach(field => data.append(field.name, form[field.name]));

            if (form.id) {
                await updateData(form.id, data);
                toast.success(`${title} updated`);
            } else {
                await createData(data);
                toast.success(`${title} created`);
            }

            setForm({ ...initialFormState, id: null });
            getData();
        } catch (error) {
            toast.error(error.response?.data?.error || 'Action failed');
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (item) => {
        const updatedForm = { ...item };
        fields.forEach(field => {
            if (field.type === 'file') updatedForm[field.name] = null;
            if (field.type === 'date' && item[field.name]) {
                updatedForm[field.name] = item[field.name].slice(0, 10)
            }
        });
        setForm(updatedForm);
    };

    const handleSingleDelete = (id) => {
        setConfirmDeleteId(id);
        setDeleteType("single");
        setShowDeleteModal(true);
    };

    const handleBulkDelete = () => {
        if (!selectedItems.length) {
            toast.warn('No items selected');
            return;
        }
        setDeleteType("bulk");
        setShowDeleteModal(true);
    };

    const confirmDelete = async () => {
        setLoading(true);
        try {
            if (deleteType === "single") {
                await deleteData(confirmDeleteId);
                toast.success(`${title} deleted successfully`);
            } else if (deleteType === "bulk") {
                for (let item of selectedItems) {
                    await deleteData(item.id);
                }
                toast.success('Selected items deleted');
                setSelectedItems([]);
            }
            getData();
        } catch (error) {
            toast.error('Delete failed');
        } finally {
            setConfirmDeleteId(null);
            setDeleteType(null);
            setShowDeleteModal(false);
            setLoading(false);
        }
    };

    return (
        <div className="row">
            <div className='mb-2'>
                <Link className="text-decoration-none text-primary" to="/updateData">
                    <i className="pi pi-arrow-left"></i> Back
                </Link>
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
                                {/* Delete */}
                                {loading ? 'Deleting...' : 'Delete'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Form Column */}
            <div className="col-lg-4 mb-3">
                <div className="card">
                    <div className="card-header text-center">
                        <h4>{title} Master</h4>
                    </div>
                    <form onSubmit={handleSubmit} encType="multipart/form-data">
                        <div className="card-body">
                            {fields.map(field => {
                                if (field.type === 'radio') {
                                    return (
                                        <div key={field.name} className="mb-2">
                                            <label className="d-block">{field.label}</label>
                                            {field.options.map(option => (
                                                <div className="form-check form-check-inline" key={option}>
                                                    <input
                                                        className="form-check-input"
                                                        type="radio"
                                                        name={field.name}
                                                        value={option}
                                                        checked={form[field.name] === option}
                                                        onChange={(e) => handleChange(e, field)}
                                                    />
                                                    <label className="form-check-label">{option}</label>
                                                </div>
                                            ))}
                                        </div>
                                    );
                                } else if (field.type === 'checkbox') {
                                    return (
                                        <div key={field.name} className="form-check mb-2">
                                            <input
                                                className="form-check-input"
                                                type="checkbox"
                                                name={field.name}
                                                checked={form[field.name]}
                                                onChange={(e) => handleChange(e, field)}
                                            />
                                            <label className="form-check-label">{field.label}</label>
                                        </div>
                                    );
                                } 
                                
                                else if (field.type === 'textarea') {
                                    return (
                                        <div  key={field.name}>
                                            <textarea
                                                placeholder={field.label}
                                                name={field.name}
                                                value={form[field.name]}
                                                onChange={(e) => handleChange(e, field)}
                                                className="form-control mb-2"
                                                required={field.required}
                                                rows={3}
                                            />
                                        </div>
                                    );
                                }
                                else if (field.type === 'file') {
                                    return (
                                        <div key={field.name} className="mb-2">
                                            <label className="form-label">{field.label}</label>
                                            <input
                                                className="form-control"
                                                type="file"
                                                name={field.name}
                                                onChange={(e) => handleChange(e, field)}
                                            />
                                        </div>
                                    );
                                } else if (field.type === 'select') {
                                    return (
                                        <div key={field.name} className="mb-2">
                                            <label className="form-label">{field.label}</label>
                                            <Dropdown
                                                value={form[field.name]}
                                                options={field.options}
                                                onChange={(e) => setForm({ ...form, [field.name]: e.value })}
                                                optionLabel="label"
                                                placeholder={`Select ${field.label}`}
                                                className="w-100"
                                            />
                                        </div>
                                    );
                                } else {
                                    return (
                                        <input
                                            key={field.name}
                                            type={field.type || "text"}
                                            placeholder={field.label}
                                            name={field.name}
                                            value={form[field.name]}
                                            onChange={(e) => handleChange(e, field)}
                                            className="form-control mb-2"
                                            required={field.required}
                                        />
                                    );
                                }
                            })}
                        </div>
                        <div className="card-footer text-center">
                            <button type="submit" className="btn btn-primary btn-sm" disabled={loading}>
                                {loading ? 'Processing...' : form.id ? 'Update' : 'Create'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {/* Table Column */}
            <div className="col-lg-8">
                <div className="card p-2">
                    <h4 className='text-center'>{title} Table</h4>
                    <div className="card-body p-0" >
                        <div className="table-responsive">
                            <table className="table table-bordered">
                                <thead className="table-secondary text-center" style={{ whiteSpace: 'nowrap' }}>
                                    <tr>
                                        <th>
                                            <input
                                                title='Select All'
                                                type="checkbox"
                                                onChange={(e) => {
                                                    if (e.target.checked) {
                                                        setSelectedItems(items);
                                                    } else {
                                                        setSelectedItems([]);
                                                    }
                                                }}
                                                checked={selectedItems.length === items.length && items.length > 0}
                                            />
                                        </th>
                                        {fields.map(field => (
                                            <th key={field.name}>{field.label}</th>
                                        ))}
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody style={{ whiteSpace: 'nowrap' }}>
                                    {items.slice(0, rowsPerPage).map(item => (
                                        <tr key={item.id}>
                                            <td className='text-center'>
                                                <input
                                                    type="checkbox"
                                                    checked={selectedItems.some(i => i.id === item.id)}
                                                    onChange={(e) => {
                                                        if (e.target.checked) {
                                                            setSelectedItems(prev => [...prev, item]);
                                                        } else {
                                                            setSelectedItems(prev => prev.filter(i => i.id !== item.id));
                                                        }
                                                    }}
                                                />
                                            </td>
                                            {fields.map(field => (
                                                <td key={field.name}>
                                                    {field.type === 'checkbox'
                                                        ? item[field.name] ? 'Yes' : 'No'
                                                        : field.type === 'file'
                                                            ? item[field.name]
                                                                ? <a href={item[field.name]} target="_blank" rel="noreferrer">View</a>
                                                                : 'No File'
                                                            : field.type === 'select'
                                                                ? (field.options.find(opt => opt.value === item[field.name])?.label || item[field.name])
                                                                : field.type === 'date' ? item[field.name] ? new Date(item[field.name]).toISOString().slice(0, 10) : ''
                                                                    : item[field.name]}
                                                </td>
                                            ))}
                                            <td className='d-flex justify-content-center'>
                                                <button
                                                    id="btn-focus"
                                                    className="btn btn-sm btn-outline-info me-1 rounded-circle"
                                                    onClick={() => handleEdit(item)}
                                                >
                                                    <i className='pi pi-pencil'></i>
                                                </button>
                                                <button
                                                    className="btn btn-sm btn-outline-danger rounded-circle"
                                                    onClick={() => handleSingleDelete(item.id)}
                                                >
                                                    <i className='pi pi-trash'></i>
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    {items.length === 0 && (
                                        <tr>
                                            <td colSpan="12" className="text-center">
                                                No {title}s found
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className="d-flex justify-content-around align-items-center">
                        <div>
                            <button
                                className="btn btn-danger btn-sm"
                                onClick={handleBulkDelete}
                                disabled={!selectedItems.length}
                            >
                                Delete Selected
                            </button>
                        </div>
                        <div className="d-flex align-items-center">
                            <span className="me-2">Rows per page:</span>
                            <select
                                className="form-select form-select-sm"
                                value={rowsPerPage}
                                onChange={(e) => setRowsPerPage(Number(e.target.value))}
                                style={{ width: 'auto' }}
                            >
                                {rowsPerPageOptions.map(opt => (
                                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default ReusableTableForm;
