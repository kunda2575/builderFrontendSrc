import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { fetchData, postData, putData } from '../../../api/apiHandler';
import { config } from '../../../api/config'
import { useSearchParams } from 'react-router-dom';
import { Calendar } from 'primereact/calendar';

const MaterialIssueForm = () => {
    // For GET data based on ID 
    const [searchParams] = useSearchParams();
    const editId = searchParams.get('id'); //Ex: This gets ?id=123 from the URL

    const [loading, setLoading] = useState(false);
    const [materialIssues, setMaterialIssues] = useState([]);
    const [unitTypes, setUnitTypes] = useState([]);
    const [materialNames, setMaterialNames] = useState([]);
    const [form, setForm] = useState({
        material_name: "",
        unit_type: "",
        quantity_issued : "",
        issued_by : "",
        issued_to : "",
        issue_date : "",
        id: null
    });

    useEffect(() => {
        fetchMaterialsIssues();
        fetchUnitTypes();
        fetchMaterialNames();

        if (editId) {
            fetchEditData(editId);
        }
    }, []);

    // Fetch materialIssues from API
    const fetchMaterialsIssues = async () => {
        try {
            const res = await fetchData(`${config.getMaterialIsuues}`);
            // console.log('Stocks Response:', res);  // Debugging the API response
            if (Array.isArray(res.data)) {
                setMaterialIssues(res.data);
            } else {
                setMaterialIssues([]);
            }
        } catch (error) {
            console.error("Error fetching materialIssues:", error);
            toast.error('Failed to fetch materialIssues');
        }
    };

    // Fetch material names
    const fetchMaterialNames = async () => {
        try {
            const res = await fetchData(`${config.material_Issue}`);
            // console.log('Material Names Response:', res);  // Debugging API response
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
            const res = await fetchData(`${config.unitType_Issue}`);
            // console.log('Unit Types Response:', res);  // Debugging API response
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
                // Update existing material issue
                await putData(config.updateMaterialIssue(form.id), formData);
                toast.success('Material Issue updated successfully');
            } else {
                // Create new material issue
                await postData(config.createMaterialIssue, formData);
                toast.success('Material Issue created successfully');
            }

            // Reset form
            setForm({
                material_name: "",
                unit_type: "",
                quantity_issued : "",
                issued_by : "",
                issued_to : "",
                issue_date : "",
                id: null
            });

            // Refetch materials list if needed
            fetchMaterialsIssues();

        } catch (error) {
            console.error('Error in form submission:', error);
            toast.error('Action failed');
        } finally {
            setLoading(false);
        }
    };

    const fetchEditData = async (id) => {
        try {
            const res = await fetchData(config.getMaterialIsuuesById(id)); // Update this to your actual API endpoint
            const materialIssues = res.data;

            if (materialIssues) {
                setForm({
                    material_name: materialIssues.material_name || "",
                    unit_type: materialIssues.unit_type || "",
                    quantity_issued: materialIssues.quantity_issued || "",
                    issued_by: materialIssues.issued_by || "",
                    issued_to: materialIssues.issued_to || "",
                    issue_date: materialIssues.issue_date ? new Date(materialIssues.issue_date) : "",
                    id: materialIssues.id || null
                });
            }
        } catch (error) {
            toast.error("Failed to load Material Issues data for editing");
            console.error("Error loading Material Issues by ID:", error);
        }
    };


    return (
        <div className="container-fluid mt-3">
            <div className='d-flex mb-1 justify-content-between'>
                <Link className="text-decoration-none text-primary" to="/transaction"> <i className="pi pi-arrow-left"> </i>  Back </Link>
                <Link className="text-decoration-none text-primary" to="/materialIssueTable"> <button className='btn btn-sm btn-primary'> Materials Management Table <i className="pi pi-arrow-right"> </i> </button> </Link>
            </div>

            <div className="row">
                <div className="col-lg-4 m-auto">
                    <div className="card">
                        <div className="card-header">
                            <h4 className='text-center'>Materials Issue Transactions</h4>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="card-body">
                                <div className="row">

                                    {/* Material Name */}
                                    <div className="col-lg-12 mb-1">
                                        <select
                                            name='material_name'
                                            value={form.material_name}
                                            onChange={(e) => setForm({ ...form, material_name: e.target.value })}
                                            className="form-select mb-1"
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
                                    <div className="col-lg-12 mb-1">
                                        <select
                                            name='unit_type'
                                            value={form.unit_type}
                                            onChange={(e) => setForm({ ...form, unit_type: e.target.value })}
                                            className="form-select mb-1"
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

                                    <div className="col-lg-12 mb-1">
                                        <input
                                            type="number"
                                            name="quantity_issued"
                                            placeholder="Quantity Issued"
                                            value={form.quantity_issued}
                                            onChange={(e) => setForm({ ...form, quantity_issued: e.target.value })}
                                            className="form-control mb-1"
                                            required
                                        />
                                    </div>

                                    <div className="col-lg-12 mb-1">
                                        <input
                                            type="text"
                                            name="issued_by"
                                            placeholder="Issued By"
                                            value={form.issued_by}
                                            onChange={(e) => setForm({ ...form, issued_by: e.target.value })}
                                            className="form-control mb-1"
                                            required
                                        />
                                    </div>

                                    <div className="col-lg-12 mb-1">
                                        <input
                                            type="text"
                                            name="issued_to"
                                            placeholder="Issued To"
                                            value={form.issued_to}
                                            onChange={(e) => setForm({ ...form, issued_to: e.target.value })}
                                            className="form-control mb-1"
                                            required
                                        />
                                    </div>

                                    <div className="col-lg-12 mb-1">
                                        <label className='mb-1'> Issue date </label>
                                        <Calendar
                                            value={form.issue_date}
                                            onChange={(e) => setForm({ ...form, issue_date: e.target.value })}
                                            showIcon
                                            dateFormat="dd-mm-yy"
                                            placeholder="Select a Date"
                                            className="w-100 mb-1 custom-calendar"  // Apply the custom class
                                            panelClassName='popup'
                                            required
                                            showButtonBar
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

export default MaterialIssueForm;
