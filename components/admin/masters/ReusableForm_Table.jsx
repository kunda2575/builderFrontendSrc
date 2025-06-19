import React, { useEffect, useState, useRef } from 'react';
import { toast } from 'react-toastify';
import { Dropdown } from 'primereact/dropdown';
import { Link } from 'react-router-dom';
import { MultiSelect } from 'primereact/multiselect';

const ReusableForm_Table = ({
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
    const fileInputRefs = useRef({});
    const rowsPerPageOptions = [
        { label: '5 Rows', value: 5 },
        { label: '10 Rows', value: 10 },
        { label: '20 Rows', value: 20 },
        { label: 'All', value: items.length }
    ];

    useEffect(() => {
        getData();
    }, []);

    const getItemId = (item) => item?.id ?? item?.customerId;

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
            setForm({ ...form, [name]: files }); // ✅ Support multiple files
        } else {
            setForm({ ...form, [name]: value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const data = new FormData();
            fields.forEach(field => {
                if (field.type === 'file' && form[field.name]) {
                    Array.from(form[field.name]).forEach(file => {
                        data.append(field.name, file); // ✅ Append each file
                    });
                } else {
                    data.append(field.name, form[field.name]);
                }
            });

            let res;
            const id = form.id ?? form.customerId;

            if (id) {
                res = await updateData(id, data);
            } else {
                res = await createData(data);
            }

            if (!res.success) {
                toast.error(res.message);
                return;
            }

            toast.success(`${title} ${id ? 'updated' : 'created'} successfully`);
            setForm({ ...initialFormState, id: null });

            // ✅ Reset file inputs
            fields.forEach(field => {
                if (field.type === 'file' && fileInputRefs.current[field.name]) {
                    fileInputRefs.current[field.name].value = '';
                }
            });
            getData();
        } catch (error) {
            toast.error("Unexpected failure. Check your console.");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (item) => {
        const updatedForm = { ...form, ...item };

        fields.forEach(field => {
            const value = item[field.name];
            if (field.type === 'file') {
                updatedForm[field.name] = null;
            } else if (field.type === 'date' && value) {
                updatedForm[field.name] = value.slice(0, 10);
            } else if (field.type === 'select' && field.multiple && typeof value === 'string') {
                updatedForm[field.name] = value.split(',');
            } else {
                updatedForm[field.name] = value;
            }
        });

        updatedForm.id = getItemId(item);
        setForm(updatedForm);
    };

    const handleSingleDelete = (item) => {
        setConfirmDeleteId(getItemId(item));
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
                    await deleteData(getItemId(item));
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
            <div className="col-lg-12 mb-3">
                <div className="card">
                    <div className="card-header text-center">
                        <h4>{title} Master</h4>
                    </div>
                    <form onSubmit={handleSubmit} encType="multipart/form-data">
                        <div className="card-body">
                            <div className="row">                            {fields.map(field => {
                                if (field.type === 'radio') {
                                    return (
                                        <div key={field.name} className="mb-2 col-lg-4">
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
                                        <div key={field.name} className="form-check mb-2 col-lg-4">
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
                                } else if (field.type === 'file') {
                                    return (
                                        <div key={field.name} className="mb-2 col-lg-4">
                                            <label className="form-label">{field.label}</label>
                                            <input
                                                className="form-control"
                                                multiple
                                                type="file"
                                                name={field.name}
                                                onChange={(e) => handleChange(e, field)}
                                                ref={(el) => (fileInputRefs.current[field.name] = el)}
                                            />
                                        </div>
                                    );
                                } else if (field.type === 'select') {
                                    return (
                                        <div key={field.name} className="mb-2 col-lg-4">
                                            {/* <label className="form-label">{field.label}</label> */}
                                            {field.multiple ? (
                                                <MultiSelect
                                                    value={form[field.name]}
                                                    options={field.options}
                                                    onChange={(e) => setForm({ ...form, [field.name]: e.value })}
                                                    optionLabel="label"
                                                    placeholder={`Select ${field.label}`}
                                                    display="chip"
                                                    className="w-100"
                                                />
                                            ) : (
                                                <Dropdown
                                                    value={form[field.name]}
                                                    options={field.options}
                                                    onChange={(e) => setForm({ ...form, [field.name]: e.value })}
                                                    optionLabel="label"
                                                    placeholder={`Select ${field.label}`}
                                                    className="w-100"
                                                />
                                            )}
                                        </div>
                                    );


                                }


                                else if (field.type === 'textarea') {
                                    return (
                                        <div className="col-lg-4" key={field.name}>
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
                                else {
                                    return (
                                        <div className="col-lg-4" key={field.name}>
                                            {field.type === 'date' && (
                                                <label className="form-label">{field.label}</label>
                                            )}
                                            <input
                                                type={field.type || "text"}
                                                placeholder={field.label}
                                                name={field.name}
                                                value={form[field.name]}
                                                onChange={(e) => handleChange(e, field)}
                                                className="form-control mb-2"
                                                required={field.required}
                                                disabled={field.disabled || false}
                                            />
                                        </div>
                                    );
                                }

                            })}
                            </div>

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
            <div className="col-lg-12">
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
                                                    {field.type === 'file' ? (
                                                        (() => {
                                                            const files = item[field.name];

                                                            if (Array.isArray(files) && files.length > 0) {
                                                                return files.map((file, idx) => {
                                                                    const isString = typeof file === 'string';
                                                                    const fileUrl = isString && file.startsWith("http")
                                                                        ? file
                                                                        : `http://localhost:2026/uploads/${file}`;

                                                                    return (
                                                                        <div key={idx} className="mb-2">
                                                                            <a
                                                                                href={fileUrl}
                                                                                target="_blank"
                                                                                rel="noreferrer"
                                                                                download
                                                                                className="d-block text-primary"
                                                                            >
                                                                                {/* 📎 {file} */}
                                                                                Download
                                                                            </a>

                                                                            {/\.(jpg|jpeg|png|gif|webp)$/i.test(file) && (
                                                                                <img
                                                                                    src={fileUrl}
                                                                                    alt="preview"
                                                                                    width="80"
                                                                                    className="mt-1 border rounded"
                                                                                />
                                                                            )}
                                                                        </div>
                                                                    );
                                                                });
                                                            }

                                                            if (typeof files === 'string' && files !== '') {
                                                                const splitFiles = files.split(',');
                                                                return splitFiles.map((file, idx) => {
                                                                    const fileUrl = file.startsWith("http")
                                                                        ? file
                                                                        : `http://localhost:2026/uploads/${file}`;

                                                                    return (
                                                                        <div key={idx} className="mb-2">
                                                                            <a
                                                                                href={fileUrl}
                                                                                target="_blank"
                                                                                rel="noreferrer"
                                                                                download
                                                                                className="d-block text-primary"
                                                                            >
                                                                                Download
                                                                            </a>

                                                                            {/\.(jpg|jpeg|png|gif|webp)$/i.test(file) && (
                                                                                <img
                                                                                    src={fileUrl}
                                                                                    alt="preview"
                                                                                    width="80"
                                                                                    className="mt-1 border rounded"
                                                                                />
                                                                            )}
                                                                        </div>
                                                                    );
                                                                });
                                                            }

                                                            return 'No File';
                                                        })()
                                                    ) : field.type === 'checkbox' ? (
                                                        item[field.name] ? 'Yes' : 'No'
                                                    ) : field.type === 'select' ? (
                                                        field.options?.find(opt => opt.value === item[field.name])?.label || item[field.name]
                                                    ) : field.type === 'date' ? (
                                                        item[field.name]
                                                            ? new Date(item[field.name]).toISOString().slice(0, 10)
                                                            : ''
                                                    ) : (
                                                        item[field.name]
                                                    )}
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
                                                    onClick={() => handleSingleDelete(item)}
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

export default ReusableForm_Table;