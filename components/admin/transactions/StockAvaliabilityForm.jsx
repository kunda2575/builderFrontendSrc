import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { fetchData, postData, putData } from '../../../api/apiHandler';
import { config } from '../../../api/config';

const MaterialForm = () => {
    const [searchParams] = useSearchParams();
    const editId = searchParams.get('id');

    const [loading, setLoading] = useState(false);
    const [unitTypes, setUnitTypes] = useState([]);
    const [materialNames, setMaterialNames] = useState([]);
    const [form, setForm] = useState({
        material_id: "",
        material_name: "",
        unit_type: "",
        available_stock: "",
        id: null
    });

    useEffect(() => {
        fetchUnitTypes();
        fetchMaterialNames();
        if (editId) fetchEditData(editId);
    }, []);

    const fetchMaterialNames = async () => {
        try {
            const res = await fetchData(config.material);
            setMaterialNames(Array.isArray(res.data) ? res.data : []);
        } catch (error) {
            toast.error('Failed to fetch material names');
        }
    };

    const fetchUnitTypes = async () => {
        try {
            const res = await fetchData(config.unitType);
            setUnitTypes(Array.isArray(res.data) ? res.data : []);
        } catch (error) {
            toast.error('Failed to fetch unit types');
        }
    };

    const fetchEditData = async (id) => {
        try {
            const res = await fetchData(config.getStockById(id));
            const stock = res.data;
            if (stock) {
                setForm({
                    material_id: stock.material_id || "",
                    material_name: stock.material_name || "",
                    unit_type: stock.unit_type || "",
                    available_stock: stock.available_stock || "",
                    id: stock.id || null
                });
            }
        } catch (error) {
            toast.error("Failed to load stock data for editing");
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };
const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
        let response;
        if (form.id) {
            response = await putData(config.updateStock(form.id), form);
            if (response?.success) {
                toast.success('Material updated successfully');
                setForm({
                    material_id: "",
                    material_name: "",
                    unit_type: "",
                    available_stock: "",
                    id: null
                });
            } else {
                toast.error(response?.message || 'Update failed');
            }
        } else {
            response = await postData(config.createStock, form);
            if (response?.success) {
                toast.success('Material created successfully');
                setForm({
                    material_id: "",
                    material_name: "",
                    unit_type: "",
                    available_stock: "",
                    id: null
                });
            } else {
                toast.error(response?.message || 'Creation failed');
            }
        }
    } catch (error) {
        console.error('Submission error:', error);
        toast.error(error.message || 'Action failed');
    } finally {
        setLoading(false);
    }
};

    const formFields = [
        {
            name: 'material_id',
            label: 'Material ID',
            type: 'select',
            placeholder: 'Select Material ID',
            required: true,
            options: materialNames.map(m => ({ value: m.material_id, label: m.material_id }))
        },
        {
            name: 'material_name',
            label: 'Material Name',
            type: 'select',
            placeholder: 'Select Material Name',
            required: true,
            options: materialNames.map(m => ({ value: m.material_name, label: m.materialName }))
        },
        {
            name: 'unit_type',
            label: 'Unit Type',
            type: 'select',
            placeholder: 'Select Unit Type',
            required: true,
            options: unitTypes.map(u => ({ value: u.unit_type, label: u.unit }))
        },
        {
            name: 'available_stock',
            label: 'Available Stock',
            type: 'number',
            placeholder: 'Enter Available Stock',
            required: true
        }
    ];

    return (
        <div className="container-fluid mt-4">
            <div className='d-flex mb-2 justify-content-between'>
                <Link className="text-decoration-none text-primary" to="/transaction">
                    <i className="pi pi-arrow-left" /> Back
                </Link>
                <Link className="text-decoration-none text-primary" to="/stockAvailabilityTable">
                    <button className='btn btn-sm btn-primary'>
                        Materials Management Table <i className="pi pi-arrow-right" />
                    </button>
                </Link>
            </div>

            <div className="row">
                <div className="col-lg-4 m-auto">
                    <div className="card">
                        <div className="card-header">
                            <h4 className='text-center'>Materials Form Transactions</h4>
                        </div>

                        {/* Merged Reusable Form Here */}
                        <form onSubmit={handleSubmit}>
                            <div className="card-body">
                                <div className="row">
                                    {formFields.map(field => (
                                        <div className="col-lg-12 mb-2" key={field.name}>
                                            <label className="form-label">{field.label}</label>
                                            {field.type === 'select' ? (
                                                <select
                                                    name={field.name}
                                                    value={form[field.name]}
                                                    onChange={handleChange}
                                                    className="form-select"
                                                    required={field.required}
                                                >
                                                    <option value="">{field.placeholder}</option>
                                                    {field.options.map(option => (
                                                        <option key={option.value} value={option.value}>
                                                            {option.label}
                                                        </option>
                                                    ))}
                                                </select>
                                            ) : (
                                                <input
                                                    type={field.type}
                                                    name={field.name}
                                                    placeholder={field.placeholder}
                                                    value={form[field.name]}
                                                    onChange={handleChange}
                                                    className="form-control"
                                                    required={field.required}
                                                />
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="card-footer text-center">
                                <button type="submit" className="btn btn-primary btn-sm" disabled={loading}>
                                    {loading ? 'Processing...' : form.id ? "Update" : "Create"}
                                </button>
                            </div>
                        </form>
                        {/* End of Merged Form */}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MaterialForm;
