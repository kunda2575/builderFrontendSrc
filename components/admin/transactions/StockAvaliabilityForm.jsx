import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { fetchData, postData, putData } from '../../../api/apiHandler';
import { config } from '../../../api/config'
import { useSearchParams } from 'react-router-dom';

const MaterialForm = () => {
    // For GET data based on ID 
    const [searchParams] = useSearchParams();
    const editId = searchParams.get('id'); //Ex: This gets ?id=123 from the URL

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
    
        if (editId) {
            fetchEditData(editId);
        }
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const formData = { ...form };

            if (form.id) {
                // Update existing material
                await putData(config.updateStock(form.id), formData);
                toast.success('Material updated successfully');
            } else {
                // Create new material
                await postData(config.createStock, formData);
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

            // Refetch materials list if needed
            fetchMaterialsForm();

        } catch (error) {
            console.error('Error in form submission:', error);
            toast.error('Action failed');
        } finally {
            setLoading(false);
        }
    };

    const fetchEditData = async (id) => {
        try {
            const res = await fetchData(config.getStockById(id)); // Update this to your actual API endpoint
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
            console.error("Error loading stock by ID:", error);
        }
    };    


    return (
        <div className="container-fluid mt-4">
            <div className='d-flex mb-2 justify-content-between'>
                <Link className="text-decoration-none text-primary" to="/transaction"> <i className="pi pi-arrow-left"> </i>  Back </Link>
                <Link className="text-decoration-none text-primary" to="/stockAvailabilityTable"> <button className='btn btn-sm btn-primary'> Materials Management Table <i className="pi pi-arrow-right"> </i> </button> </Link>
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
                            <div className="card-footer text-center row d-flex justify-content-center">
                                <button type="submit" className="btn btn-primary btn-sm col-lg-4" disabled={loading}>
                                    {loading ? 'Processing...' : form.id ? 'Update' : 'Create'}
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
