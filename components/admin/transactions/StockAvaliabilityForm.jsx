import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { fetchData, postData } from '../../../api/apiHandler';
import { config } from '../../../api/config';

const MaterialForm = () => {
    const [loading, setLoading] = useState(false);
    const [stocks, setStocks] = useState([]);
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
        fetchMaterialsForm();
        fetchUnitTypes();
        fetchMaterialNames();
    }, []);

    // Fetch stocks from API
    const fetchMaterialsForm = async () => {
        try {
            const res = await fetchData(`${config.stocks}`);
            console.log('Stocks Response:', res);  // Debugging the API response
            if (Array.isArray(res.data)) {
                setStocks(res.data);
            } else {
                setStocks([]);
            }
        } catch (error) {
            console.error("Error fetching stocks:", error);
            toast.error('Failed to fetch stocks');
        }
    };

    // Fetch material names
    const fetchMaterialNames = async () => {
        try {
            const res = await fetchData(`${config.material}`);
            console.log('Material Names Response:', res);  // Debugging API response
            if (res && res.data && Array.isArray(res.data)) {
                setMaterialNames(res.data);
            } else {
                console.log("No material names found or invalid data format.");
                setMaterialNames([]);
            }
        } catch (error) {
            console.error("Error fetching material names:", error);
            toast.error('Failed to fetch material names');
        }
    };

    // Fetch unit types
    const fetchUnitTypes = async () => {
        try {
            const res = await fetchData(`${config.unitType}`);
            console.log('Unit Types Response:', res);  // Debugging API response
            if (res && res.data && Array.isArray(res.data)) {
                setUnitTypes(res.data);
            } else {
                console.log("No unit types found or invalid data format.");
                setUnitTypes([]);
            }
        } catch (error) {
            console.error("Error fetching unit types:", error);
            toast.error('Failed to fetch unit types');
        }
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const formData = { ...form };

            if (form.id) {
                await postData(`${config.create}`, formData); // Using create URL to add the material
                toast.success('Material updated successfully');
            } else {
                await postData(`${config.create}`, formData); // Create new material
                toast.success('Material created successfully');
            }

            // Reset form
            setForm({
                material_id: "",
                material_name: "",
                unit_type: "",
                available_stock: "",
                id: null
            });

            // Refetch stocks after submit
            fetchMaterialsForm();
        } catch (error) {
            console.error('Error in form submission:', error);
            toast.error('Action failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container-fluid mt-3">
            <div className='mb-2'>
                <Link className="text-decoration-none text-primary" to="/stockAvailability">
                    <i className="pi pi-arrow-left"></i> Materials Management Table
                </Link>
            </div>

            <div className="row">
                <div className="col-lg-4 m-auto">
                    <div className="card">
                        <div className="card-header">
                            <h4 className='text-center'>Materials Form Transactions</h4>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="card-body">
                                <div className="row">
                                    {/* Material ID */}
                                    <div className="col-lg-12 mb-2">
                                        <select
                                            name='material_id'
                                            value={form.material_id}
                                            onChange={(e) => setForm({ ...form, material_id: e.target.value })}
                                            className="form-select mb-2"
                                            required
                                        >
                                            <option value="">Select Material Id</option>
                                            {
                                                materialNames.map(material => (
                                                    <option key={material.material_id} value={material.material_id}>
                                                        {material.material_id}
                                                    </option>
                                                ))
                                            }
                                        </select>
                                    </div>

                                    {/* Material Name */}
                                    <div className="col-lg-12 mb-2">
                                        <select
                                            name='material_name'
                                            value={form.material_name}
                                            onChange={(e) => setForm({ ...form, material_name: e.target.value })}
                                            className="form-select mb-2"
                                            required
                                        >
                                            <option value="">Select Material Name</option>
                                            {
                                                materialNames.map(material => (
                                                    <option key={material.id} value={material.material_name}>
                                                        {material.materialName}
                                                    </option>
                                                ))
                                            }
                                        </select>
                                    </div>

                                    {/* Unit Type */}
                                    <div className="col-lg-12 mb-2">
                                        <select
                                            name='unit_type'
                                            value={form.unit_type}
                                            onChange={(e) => setForm({ ...form, unit_type: e.target.value })}
                                            className="form-select mb-2"
                                            required
                                        >
                                            <option value="">Select Unit Type</option>
                                            {
                                                unitTypes.map(unit => (
                                                    <option key={unit.id} value={unit.unit_type}>
                                                        {unit.unit}
                                                    </option>
                                                ))
                                            }
                                        </select>
                                    </div>

                                    {/* Available Stock */}
                                    <div className="col-lg-12 mb-2">
                                        <input
                                            type="number"
                                            name="available_stock"
                                            placeholder="Available Stock"
                                            value={form.available_stock}
                                            onChange={(e) => setForm({ ...form, available_stock: e.target.value })}
                                            className="form-control mb-2"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Submit Button */}
                            <div className="card-footer text-center">
                                <button type="submit" className="btn btn-primary btn-sm" disabled={loading}>
                                    {loading ? 'Processing...' : 'Submit'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MaterialForm;
