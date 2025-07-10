import React, { useEffect, useState, useRef } from 'react';
import { toast } from 'react-toastify';
import { Dropdown } from 'primereact/dropdown';
import { Link } from 'react-router-dom';
import { MultiSelect } from 'primereact/multiselect';
import { FileUpload } from 'primereact/fileupload'; // ✅ Make sure this is imported
import { Paginator } from 'primereact/paginator';



const ReusableTableForm = ({
    title,
    fields,
    fetchData,
    createData,
    updateData,
    deleteData,
    fcolumnClass = "mb-2 col-lg-4",
    tcolumnClass = "mb-2 col-lg-8",
    ccolumnClass = "mb-2 col-lg-12"

}) => {
    const initialFormState = Object.fromEntries(fields.map(f => [f.name, f.type === 'checkbox' ? false : '']));
    const [items, setItems] = useState([]);
    const [form, setForm] = useState({ ...initialFormState, id: null });
    const [selectedItems, setSelectedItems] = useState([]);
    // const [rowsPerPage, setRowsPerPage] = useState(5);
    const [loading, setLoading] = useState(false);
    const [confirmDeleteId, setConfirmDeleteId] = useState(null);
    const [deleteType, setDeleteType] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const fileInputRefs = useRef({});

    const [selectedItem, setSelectedItem] = useState(null);
    const [showModal, setShowModal] = useState(false);


    // ✅ MISSING STATES FIXED:
    const [selectedFiles, setSelectedFiles] = useState({});
    const [hasUploadedFirstFile, setHasUploadedFirstFile] = useState({});

    const [currentPage, setCurrentPage] = useState(1); // 1-based index
    const [rowsPerPage, setRowsPerPage] = useState(10); // default

    const rowsPerPageOptions = [
        { label: '10 Rows', value: 10 },
        { label: '20 Rows', value: 20 },
        { label: '50 Rows', value: 50 },
        // { label: 'All', value: items.length }
    ];

    const totalRecords = items.length;

    // Adjusted for 0-based paginator
    const paginatedItems = items.slice(
        (currentPage - 1) * rowsPerPage,
        currentPage * rowsPerPage
    );


    useEffect(() => {
        getData();
    }, []);
    useEffect(() => {
        setCurrentPage(1);
    }, [rowsPerPage, items.length]);

    const getItemId = (item) => item?.id ?? item?.customerId;

    const getData = async () => {
        try {
            const res = await fetchData();
            setItems(res.data);
        } catch (error) {
            toast.error(`Failed to fetch ${title}`);
        }
    };

    const handleFileSelect = (event, field) => {
        const newFiles = event.files || [];

        const documentType = form.documentType;

        // ✅ Check if document type is selected
        if (!documentType) {
            toast.error("Please select a Document Type before uploading a file.");

            // Clear the file input to allow re-uploading
            if (fileInputRefs.current[field.name]) {
                fileInputRefs.current[field.name].clear();
            }
            return;
        }

        // Filter and structure new files
        const filteredNewFiles = newFiles
            .filter(f => f?.name)
            .map(f => ({
                file: f,
                documentType
            }));

        // Update form state
        setForm(prev => ({
            ...prev,
            [field.name]: [...(prev[field.name] || []), ...filteredNewFiles]
        }));

        // Prevent duplicate uploads
        setSelectedFiles(prev => {
            const existing = prev[field.name] || [];
            const existingNames = new Set(existing.map(f => f.file?.name || f.name));

            const uniqueFiles = newFiles
                .filter(f => !existingNames.has(f.name))
                .map(f => ({
                    file: f,
                    documentType
                }));

            const merged = [...existing, ...uniqueFiles];
            return { ...prev, [field.name]: merged };
        });

        // Mark that at least one file has been uploaded
        setHasUploadedFirstFile(prev => ({
            ...prev,
            [field.name]: true
        }));

        // Clear the file input again to allow same file re-upload
        if (fileInputRefs.current[field.name]) {
            fileInputRefs.current[field.name].clear();
        }
    };

    const handleRemoveFile = (fieldName, index) => {
        setSelectedFiles(prev => {
            const updated = [...(prev[fieldName] || [])];
            updated.splice(index, 1);
            return { ...prev, [fieldName]: updated };
        });

        setForm(prev => {
            const updated = [...(prev[fieldName] || [])];
            updated.splice(index, 1);
            return { ...prev, [fieldName]: updated };
        });
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
            const filesToUpload = [];
            const docTypesForUpload = [];
            const retainedFileKeys = [];

            fields.forEach(field => {
                if (field.type === 'file') {
                    const selected = selectedFiles[field.name] || [];

                    selected.forEach(fileObj => {
                        if (fileObj.file) {
                            filesToUpload.push(fileObj.file);
                            docTypesForUpload.push(fileObj.documentType || 'unknown');
                        } else if (fileObj.uploadedFileName) {
                            retainedFileKeys.push(fileObj.uploadedFileName);
                        }
                    });
                } else {
                    data.append(field.name, form[field.name]);
                }
            });

            // Append files and document types
            filesToUpload.forEach(file => data.append('documents', file));
            data.append('documentTypes', JSON.stringify(docTypesForUpload));
            data.append('retainedFiles', JSON.stringify(retainedFileKeys));

            const id = form.id ?? form.customerId;
            const res = id ? await updateData(id, data) : await createData(data);

            if (!res.success) {
                toast.error(res.message || "Something went wrong");
                return;
            }

            toast.success(`${title} ${id ? 'updated' : 'created'} successfully`);
            setForm({ ...initialFormState, id: null });
            setSelectedFiles({});
            setHasUploadedFirstFile({});

            fields.forEach(field => {
                if (field.type === 'file' && fileInputRefs.current[field.name]) {
                    fileInputRefs.current[field.name].clear();
                }
            });

            getData();
        } catch (err) {
            toast.error("Unexpected error during submit");
            console.error("Form Submit Error:", err);
        } finally {
            setLoading(false);
        }
    };




    const handleEdit = (item) => {
        const updatedForm = {};
        const updatedSelectedFiles = {};
        const updatedUploadStatus = {};

        fields.forEach(field => {
            const value = item[field.name];

            if (field.type === 'file') {
                let filesArray = [];

                if (typeof value === 'string') {
                    filesArray = value.split(',').filter(Boolean);
                } else if (Array.isArray(value)) {
                    filesArray = value;
                }

                updatedForm[field.name] = null;

                updatedSelectedFiles[field.name] = filesArray.map((url) => {
                    const segments = url.split('/');
                    const fileKey = segments[segments.length - 1]; // e.g., 'aadhaar-2025-07-04-uuid.pdf'

                    const docType = fileKey.split('-')[0];

                    return {
                        file: null,
                        uploadedFileName: fileKey,
                        documentType: docType,
                        name: fileKey // ✅ crucial for UI to display the file name
                    };
                });

                updatedUploadStatus[field.name] = true;
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
        setSelectedFiles(updatedSelectedFiles);
        setHasUploadedFirstFile(updatedUploadStatus);
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


            <div className={fcolumnClass}>
                <div className="card">
                    <div className="card-header text-center">
                        <h4>{title} Master</h4>
                    </div>
                    <form onSubmit={handleSubmit} encType="multipart/form-data">
                        <div className="card-body">
                            <div className="row">
                                {fields
                                    .filter((field) => field.showInForm !== false)
                                    .map((field) => {
                                        if (field.type === 'file') {
                                            return (

                                                <div className="row">
                                                    {fields
                                                        .filter(field => field.type === 'file' && field.showInForm !== false)
                                                        .map(field => {
                                                            return (
                                                                <div className=" row mb-3" key={field.name}>
                                                                    <div className="row mb-3">
                                                                        <div className="col-5 d-flex align-items-center">
                                                                            <label >{field.label}</label>
                                                                            <Dropdown
                                                                                value={form.documentType}
                                                                                options={[
                                                                                    { label: 'Aadhaar', value: 'aadhaar' },
                                                                                    { label: 'PAN', value: 'pan' },
                                                                                    { label: 'Voter ID', value: 'voterId' },
                                                                                    { label: 'Other', value: 'other' }
                                                                                ]}
                                                                                onChange={(e) => setForm(prev => ({ ...prev, documentType: e.value }))}
                                                                                placeholder="Document Type"
                                                                                className="w-100"
                                                                            />
                                                                        </div>

                                                                        <div className="col-6 d-flex align-items-center">
                                                                            <FileUpload
                                                                                name={field.name}
                                                                                customUpload
                                                                                multiple={true}
                                                                                accept="*"
                                                                                onSelect={(e) => handleFileSelect(e, field)}
                                                                                ref={(el) => (fileInputRefs.current[field.name] = el)}
                                                                                auto={false}
                                                                                chooseLabel={!hasUploadedFirstFile[field.name] ? "Browse File" : "Add +"}
                                                                                showUploadButton={false}
                                                                                showCancelButton={false}
                                                                                mode="basic"
                                                                                className="btn btn-sm"
                                                                            />
                                                                        </div>
                                                                    </div>

                                                                    {/* Uploaded File List */}
                                                                    {selectedFiles[field.name]?.length > 0 && (
                                                                        <div className="mt-2">
                                                                            <label className="form-label fw-bold">Uploaded Files:</label>
                                                                            <ul className="list-unstyled border rounded p-2">
                                                                                {selectedFiles[field.name].map((fileObj, idx) => {
                                                                                    const fileName = fileObj?.file?.name || fileObj?.name || fileObj?.uploadedFileName || 'unknown-file';
                                                                                    return (
                                                                                        <li key={`file-${idx}`} className="d-flex align-items-center justify-content-between py-1 border-bottom">
                                                                                            <div className="text-truncate" style={{ maxWidth: '75%' }} title={fileName}>
                                                                                                📄 <strong>

                                                                                                    {fileName}
                                                                                                </strong>
                                                                                                <span className="text-muted small ms-2">({fileObj.documentType})</span>
                                                                                            </div>
                                                                                            <button
                                                                                                type="button"
                                                                                                className="btn btn-sm btn-outline-danger ms-2"
                                                                                                onClick={() => handleRemoveFile(field.name, idx)}
                                                                                            >
                                                                                                ❌
                                                                                            </button>
                                                                                        </li>
                                                                                    );
                                                                                })}
                                                                            </ul>

                                                                        </div>
                                                                    )}
                                                                </div>
                                                            );
                                                        })}
                                                </div>


                                            );
                                        }
                                        else if (field.type === 'select') {
                                            return (
                                                <div key={field.name} className={ccolumnClass}>
                                                    <label className="form-label">{field.label}</label>
                                                    {field.multiple ? (
                                                        <MultiSelect
                                                            value={form[field.name] || []}
                                                            options={field.options || []}
                                                            onChange={(e) => {
                                                                const selectedValues = e.value;
                                                                if (field.onChange) {
                                                                    field.onChange(selectedValues, null, setForm); // Adjust if you need more details
                                                                } else {
                                                                    setForm({ ...form, [field.name]: selectedValues });
                                                                }
                                                            }}
                                                            optionLabel="label"
                                                            placeholder={`Select ${field.label}`}
                                                            className="w-100"
                                                            display="chip"
                                                        />
                                                    ) : (
                                                        <Dropdown
                                                            value={form[field.name] || null}
                                                            options={field.options || []}
                                                            onChange={(e) => {
                                                                const selectedValue = e.value;
                                                                const selectedObj = field.options?.find(opt => opt.value === selectedValue);

                                                                if (field.onChange) {
                                                                    field.onChange(selectedValue, selectedObj, setForm);
                                                                } else {
                                                                    setForm({ ...form, [field.name]: selectedValue });
                                                                }
                                                            }}
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
                                                <div className={ccolumnClass} key={field.name}>
                                                    <label className="form-label">{field.label}</label>
                                                    <textarea
                                                        placeholder={field.label}
                                                        name={field.name}
                                                        value={form[field.name]}
                                                        onChange={(e) => handleChange(e, field)}
                                                        className="form-control mb-2"
                                                        required={field.required}
                                                        rows={1}
                                                    />
                                                </div>
                                            );
                                        } else {
                                            return (
                                                <div className={ccolumnClass} key={field.name}>
                                                    <label className="form-label">{field.label}</label>
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
                            <button type="submit" className="btn btn-success btn-md col-3" disabled={loading}>
                                {loading ? 'Processing...' : form.id ? 'Update' : 'Create'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>



            {/* Table Column for modal */}

            {showModal && selectedItem && (
                <div className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50 d-flex justify-content-center align-items-center z-3">
                    <div
                        className="bg-white p-4 rounded shadow w-75"
                        style={{ maxHeight: '90vh', overflowY: 'auto' }}
                    >
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <h5 className="mb-0">{title} Details</h5>
                            <button className="btn-close" onClick={() => setShowModal(false)}></button>
                        </div>

                        <table className="table table-bordered table-sm">
                            <tbody>
                                {fields.map((field) => {
                                    const renderFiles = (files) => {
                                        if (
                                            !files ||
                                            (Array.isArray(files) && files.length === 0) ||
                                            (typeof files === 'string' && files.trim() === '')
                                        ) {
                                            return 'No File';
                                        }

                                        const filesArray = Array.isArray(files)
                                            ? files
                                            : typeof files === 'string'
                                                ? files.split(',').map((f) => f.trim()).filter((f) => f)
                                                : [];

                                        return filesArray.map((file, idx) => {
                                            const fileUrl = file.startsWith('http')
                                                ? file
                                                : `https://pub-029295a7436d410e9cb079b9c6f2c11c.r2.dev/${file}`;

                                            // Get filename or fallback to file key
                                            const urlParts = fileUrl.split('/');
                                            const fileName = urlParts[urlParts.length - 1] || `File-${idx + 1}`;

                                            return (
                                                <div key={idx} className="mb-1">
                                                    <a
                                                        href={fileUrl}
                                                        download
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="btn btn-sm btn-outline-primary"
                                                    >
                                                        {fileName}
                                                    </a>
                                                </div>
                                            );
                                        });
                                    };

                                    return (
                                        <tr key={field.name}>
                                            <th style={{ width: '30%' }}>{field.label}</th>
                                            <td>
                                                {field.type === 'file' ? (
                                                    renderFiles(selectedItem[field.name])
                                                ) : field.type === 'checkbox' ? (
                                                    selectedItem[field.name] ? 'Yes' : 'No'
                                                ) : field.type === 'select' ? (
                                                    field.options?.find((opt) => opt.value === selectedItem[field.name])
                                                        ?.label || selectedItem[field.name]
                                                ) : field.type === 'date' ? (
                                                    selectedItem[field.name]
                                                        ? new Date(selectedItem[field.name]).toISOString().slice(0, 10)
                                                        : ''
                                                ) : (
                                                    selectedItem[field.name]
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


            {/* Table Column */}
            <div className={tcolumnClass}>
                <div className="card p-2">

                    <div className="d-flex justify-content-between  align-items-center">
                        <div>
                            <h4 className='text-center'>
                                Displaying

                                - {paginatedItems.length} {title}

                            </h4>
                        </div>
                        <div>
                            <button
                                className="btn btn-danger btn-sm"
                                onClick={handleBulkDelete}
                                disabled={!selectedItems.length}
                            >
                                Delete Selected
                            </button>
                        </div>
                    </div>

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
                                        {fields
                                            .filter(field => field.type !== 'file') // exclude file fields like documents
                                            .map(field => (
                                                <th key={field.name}>{field.label}</th>
                                            ))}

                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody style={{ whiteSpace: 'nowrap' }}>
                                    {paginatedItems.map(item => (
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
                                            {fields
                                                .filter(field => field.showInTable !== false) // hide if explicitly disabled
                                                .map(field => (
                                                    <td key={field.name}>
                                                        {field.type === 'checkbox' ? (
                                                            item[field.name] ? 'Yes' : 'No'
                                                        ) : field.type === 'select' ? (
                                                            field.multiple
                                                                ? Array.isArray(item[field.name])
                                                                    ? item[field.name].join(', ')
                                                                    : String(item[field.name] || '') // fallback to string
                                                                : field.options?.find(opt => opt.value === item[field.name])?.label || item[field.name]
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
                                                    className="btn btn-sm btn-outline-primary me-1 rounded-circle"
                                                    onClick={() => {
                                                        setSelectedItem(item);
                                                        setShowModal(true);
                                                    }}
                                                >
                                                    <i className='pi pi-eye'></i>
                                                </button>
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
                                    {paginatedItems.length === 0 && (
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
                    {/* Pagination Footer */}

                    <div>
                        <Paginator
                            first={(currentPage - 1) * rowsPerPage}
                            rows={rowsPerPage}
                            totalRecords={totalRecords}
                            rowsPerPageOptions={rowsPerPageOptions.map(opt => opt.value)}
                            onPageChange={(e) => {
                                const newPage = Math.floor(e.first / e.rows) + 1;
                                setCurrentPage(newPage);
                                setRowsPerPage(e.rows);
                            }}
                            // template="PrevPageLink CurrentPageReport NextPageLink RowsPerPageDropdown"
                            currentPageReportTemplate={`Page ${currentPage} of ${Math.ceil(totalRecords / rowsPerPage)}`}
                        />

                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReusableTableForm;