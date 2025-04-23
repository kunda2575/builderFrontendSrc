import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';

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

    const rowsPerPageOptions = [
        { label: '5 Rows', value: 5 },
        { label: '10 Rows', value: 10 },
        { label: '20 Rows', value: 20 },
        { label: 'All', value: items.length }
    ];

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
        } catch {
            toast.error('Action failed');
        }
    };

    const handleEdit = (item) => {
        const updatedForm = { ...item };
        fields.forEach(field => {
            if (field.type === 'file') updatedForm[field.name] = null;
        });
        setForm(updatedForm);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Confirm delete?')) return;
        try {
            await deleteData(id);
            toast.success(`${title} deleted`);
            getData();
        } catch {
            toast.error('Delete failed');
        }
    };

    const handleBulkDelete = async () => {
        if (!selectedItems.length) return toast.warn('No items selected');
        if (!window.confirm('Delete selected items?')) return;
        try {
            for (let item of selectedItems) await deleteData(item.id);
            toast.success('Selected items deleted');
            setSelectedItems([]);
            getData();
        } catch {
            toast.error('Bulk delete failed');
        }
    };

    return (
        <div className="row">
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
                                } else if (field.type === 'file') {
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
                            <button type="submit" className="btn btn-primary btn-sm">
                                {form.id ? 'Update' : 'Create'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {/* Table Column */}
            <div className="col-lg-8">
                <div className="card">
                    <div className="card-header text-center">
                        <h4>{title} Table</h4>
                    </div>
                    <div className="card-body">
                        <DataTable
                            value={items}
                            selection={selectedItems}
                            onSelectionChange={(e) => setSelectedItems(e.value)}
                            dataKey="id"
                            paginator
                            rows={rowsPerPage}
                            rowsPerPageOptions={[5, 10, 20, items.length]}
                            responsiveLayout="scroll"
                            selectionMode="checkbox"
                        >
                            <Column selectionMode="multiple" headerStyle={{ width: '3rem' }} />
                            {fields.map(field => (
                                <Column
                                    key={field.name}
                                    field={field.name}
                                    header={field.label}
                                    body={(rowData) => {
                                        if (field.type === 'checkbox') {
                                            return rowData[field.name] ? 'Yes' : 'No';
                                        } else if (field.type === 'file') {
                                            return rowData[field.name] ? (
                                                <a href={rowData[field.name]} target="_blank" rel="noreferrer">View</a>
                                            ) : 'No File';
                                        } else if (field.type === 'select') {
                                            const opt = field.options.find(opt => opt.value === rowData[field.name]);
                                            return opt ? opt.label : rowData[field.name];
                                        } else {
                                            return rowData[field.name];
                                        }
                                    }}
                                />
                            ))}
                            <Column
                                header="Actions"
                                body={(rowData) => (
                                    <div className="d-flex gap-2">
                                        <Button
                                            icon="pi pi-pencil"
                                            className="p-button-sm p-button-info"
                                            onClick={() => handleEdit(rowData)}
                                            rounded
                                            text
                                        />
                                        <Button
                                            icon="pi pi-trash"
                                            className="p-button-sm p-button-danger"
                                            onClick={() => handleDelete(rowData.id)}
                                            rounded
                                            text
                                        />
                                    </div>
                                )}
                            />
                        </DataTable>
                    </div>
                    <div className="card-footer d-flex justify-content-between align-items-center">
                        <Button
                            label="Delete Selected"
                            icon="pi pi-trash"
                            severity="danger"
                            onClick={handleBulkDelete}
                            disabled={!selectedItems.length}
                            className="p-button-sm"
                        />
                        <div className="d-flex align-items-center">
                            <span className="me-2">Rows per page:</span>
                            <Dropdown
                                value={rowsPerPage}
                                options={rowsPerPageOptions}
                                onChange={(e) => setRowsPerPage(e.value)}
                                className="p-inputtext-sm"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Table Column */}
{/* <div className="col-lg-8">
    <div className="card">
        <div className="card-header text-center">
            <h4>{title} Table</h4>
        </div>
        <div className="card-body table-responsive">
            <table className="table table-bordered">
                <thead>
                    <tr>
                        <th>
                            <input
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
                <tbody>
                    {items.slice(0, rowsPerPage).map(item => (
                        <tr key={item.id}>
                            <td>
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
                                                : item[field.name]}
                                </td>
                            ))}
                            <td>
                                <button
                                    className="btn btn-sm btn-info me-1"
                                    onClick={() => handleEdit(item)}
                                >
                                    Edit
                                </button>
                                <button
                                    className="btn btn-sm btn-danger"
                                    onClick={() => handleDelete(item.id)}
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
        <div className="card-footer d-flex justify-content-between align-items-center">
            <button
                className="btn btn-danger btn-sm"
                onClick={handleBulkDelete}
                disabled={!selectedItems.length}
            >
                Delete Selected
            </button>
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
</div> */}

        </div>
    );
};

export default ReusableTableForm;
