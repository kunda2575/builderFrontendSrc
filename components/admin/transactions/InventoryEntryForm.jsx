
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { fetchData, postData, putData } from '../../../api/apiHandler';
import { config } from '../../../api/config';
import { Calendar } from 'primereact/calendar';
import { useSearchParams } from 'react-router-dom';

const InventoryEntryForm = () => {
    // For GET data based on ID 
    const [searchParams] = useSearchParams();
    const editId = searchParams.get('id'); //Ex: This gets ?id=123 from the URL

    const [loading, setLoading] = useState(false);
    const [inventorys, setInventorys] = useState([]);
    const [unitTypes, setUnitTypes] = useState([]);
    const [materials, setMaterials] = useState([]);
    const [vendors, setVendors] = useState([])
    const [form, setForm] = useState({
        material_id: "",
        material_name: "",
        vendor_name: "",
        invoice_number: "",
        invoice_date: "",
        invoice_cost_incl_gst: "",
        unit_type: "",
        quantity_received: "",
        invoice_attachment: "",
        entered_by: "",
        id: null
    });

    useEffect(() => {
        fetchInventorysForm();
        fetchUnitTypes();
        fetchMaterials();
        fetchVendors();

        if (editId) {
            fetchEditData(editId);
        }
    }, []);

    // Fetch inventorys from API
    const fetchInventorysForm = async () => {
        try {
            const res = await fetchData(`${config.getInventories}`);
            // console.log('inventory Response:', res);  // Debugging the API response
            if (Array.isArray(res.data)) {
                setInventorys(res.data);
            } else {
                setInventorys([]);
            }
        } catch (error) {
            console.error("Error fetching inventorys:", error);
            toast.error('Failed to fetch inventorys');
        }
    };

    // Fetch material 
    const fetchMaterials = async () => {
        try {
            const res = await fetchData(`${config.getMaterial}`);
            // console.log('Material Names Response:', res);  // Debugging API response
            if (res && res.data && Array.isArray(res.data)) {
                setMaterials(res.data);
            } else {
                console.log("No material  found or invalid data format.");
                setMaterials([]);
            }
        } catch (error) {
            console.error("Error fetching material :", error);
            toast.error('Failed to fetch material ');
        }
    };

    // Fetch unit types
    const fetchUnitTypes = async () => {
        try {
            const res = await fetchData(`${config.getUnitType}`);
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
    const fetchVendors = async () => {
        try {
            const res = await fetchData(`${config.getVendorName}`);
            // console.log('vendor Response:', res);  // Debugging API response
            if (res && res.data && Array.isArray(res.data)) {
                setVendors(res.data);
            } else {
                console.log("No unit types found or invalid data format.");
                setVendors([]);
            }
        } catch (error) {
            console.error("Error fetching vendors:", error);
            toast.error('Failed to fetch vendors');
        }
    };


    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const formData = { ...form };

            if (form.id) {
                // Update existing material
                await putData(config.updateInventory(form.id), formData); // Using create URL to add the Inventory
                toast.success('Inventory updated successfully');
            } else {
                // Create new material
                await postData(config.createInventory, formData); // Create new Inventory
                toast.success('Inventory created successfully');
            }

            // Reset form
            setForm({
                material_id: "",
                material_name: "",
                vendor_name: "",
                invoice_number: "",
                invoice_date: "",
                invoice_cost_incl_gst: "",
                unit_type: "",
                quantity_received: "",
                invoice_attachment: "",
                entered_by: "",
                id: null
            });

            // Refetch inventorys after submit
            fetchInventorysForm();
        } catch (error) {
            console.error('Error in form submission:', error);
            toast.error('Action failed');
        } finally {
            setLoading(false);
        }
    };

    const fetchEditData = async (id) => {
        try {
            const res = await fetchData(config.getInventoriesById(id)); // Update this to your actual API endpoint
            const inventory = res.data;

            if (inventory) {
                setForm({
                    material_id: inventory.material_id || "",
                    material_name: inventory.material_name || "",
                    unit_type: inventory.unit_type || "",
                    vendor_name: inventory.vendor_name || "",
                    invoice_number: inventory.invoice_number || "",
                    invoice_date: inventory.invoice_date ? new Date(inventory.invoice_date) : "",
                    invoice_cost_incl_gst: inventory.invoice_cost_incl_gst || "",
                    quantity_received: inventory.quantity_received || "",
                    invoice_attachment: inventory.invoice_attachment || "",
                    entered_by: inventory.entered_by || "",
                    id: inventory.id || null
                });
            }
        } catch (error) {
            toast.error("Failed to load inventory data for editing");
            console.error("Error loading inventory by ID:", error);
        }
    };

    return (
        <div className="container-fluid mt-3">
            {/* <div className='mb-1'>
                <Link className="text-decoration-none text-primary" to="/inventoryEntry">
                    <i className="pi pi-arrow-left"></i> Inventory Entry Table
                </Link>
            </div> */}
            <div className='d-flex mb-2 justify-content-between'>
                <Link className="text-decoration-none text-primary" to="/transaction"> <i className="pi pi-arrow-left"> </i>  Back </Link>
                <Link className="text-decoration-none text-primary" to="/inventoryEntryTable"> <button className='btn btn-sm btn-primary'> Inventory Entry Table <i className="pi pi-arrow-right"> </i> </button> </Link>
            </div>

            <div className="row">
                <div className="col-lg-8 m-auto">
                    <div className="card">
                        <div className="card-header">
                            <h4 className='text-center'>Inventory Transactions</h4>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="card-body">
                                <div className="row">
                                    {/* Material ID */}
                                    <div className="col-lg-6 mb-1">
                                        <select
                                            name='material_id'
                                            value={form.material_id}
                                            onChange={(e) => setForm({ ...form, material_id: e.target.value })}
                                            className="form-select mb-1"
                                            required
                                        >
                                            <option value="">Select Material Id</option>
                                            {
                                                materials.map(material => (
                                                    <option key={material.material_id} value={material.material_id}>
                                                        {material.material_id}
                                                    </option>
                                                ))
                                            }
                                        </select>
                                    </div>

                                    {/* Material Name */}
                                    <div className="col-lg-6 mb-1">
                                        <select
                                            name='material_name'
                                            value={form.material_name}
                                            onChange={(e) => setForm({ ...form, material_name: e.target.value })}
                                            className="form-select mb-1"
                                            required
                                        >
                                            <option value="">Select Material Name</option>
                                            {
                                                materials.map(material => (
                                                    <option key={material.id} value={material.material_name}>
                                                        {material.materialName}
                                                    </option>
                                                ))
                                            }
                                        </select>
                                    </div>

                                    {  /* vendor */}
                                    <div className="col-lg-6 mb-1">
                                        <select
                                            name='vendor_name'
                                            value={form.vendor_name}
                                            onChange={(e) => setForm({ ...form, vendor_name: e.target.value })}
                                            className="form-select mb-1"
                                            required
                                        >
                                            <option value="">Select vendor Name</option>
                                            {
                                                vendors.map(vendor => (
                                                    <option key={vendor.id} value={vendor.vendor_name}>
                                                        {vendor.vendorName}
                                                    </option>
                                                ))
                                            }
                                        </select>
                                    </div>



                                    {/* Available Stock */}
                                    <div className="col-lg-6 mb-1">
                                        <input
                                            type="number"
                                            name="invoice_number"
                                            placeholder="Invoice Number"
                                            value={form.invoice_number}
                                            onChange={(e) => setForm({ ...form, invoice_number: e.target.value })}
                                            className="form-control mb-1"
                                            required
                                        />
                                    </div>

                                    <div className="col-lg-6 mb-1">
                                        {/* <input
                                            type="date"
                                            name="invoice_date"
                                            placeholder="Invoice Date "
                                            value={form.invoice_date}
                                            onChange={(e) => setForm({ ...form, invoice_date: e.target.value })}
                                            className="form-control mb-1"
                                            required
                                        /> */}
                                        <label className='mb-1'> Invoice date </label>

                                        <Calendar
                                            value={form.invoice_date}
                                            onChange={(e) => setForm({ ...form, invoice_date: e.target.value })}
                                            showIcon
                                            dateFormat="dd-mm-yy"
                                            placeholder="Select a Date"
                                            className="w-100 mb-2 custom-calendar"  // Apply the custom class
                                            panelClassName='popup'
                                            required
                                            showButtonBar
                                        />
                                    </div>
                                    <div className="col-lg-6 mb-1">
                                        <label className="mb-2"> </label>
                                        <input
                                            type="number"
                                            name="invoice_cost_incl_gst"
                                            placeholder="Invoice cost Incl Gst  "
                                            value={form.invoice_cost_incl_gst}
                                            onChange={(e) => setForm({ ...form, invoice_cost_incl_gst: e.target.value })}
                                            className="form-control mb-1"
                                            required
                                        />
                                    </div>

                                    <div className="col-lg-6 mb-1">
                                        <input
                                            type="number"
                                            name="quantity_received"
                                            placeholder=" Quantity Received "
                                            value={form.quantity_received}
                                            onChange={(e) => setForm({ ...form, quantity_received: e.target.value })}
                                            className="form-control mb-1"
                                            required
                                        />
                                    </div>

                                    <div className="col-lg-6 mb-1">
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

                                    <div className="col-lg-6 mb-1">
                                        <input
                                            type="text"
                                            name="invoice_attachment"
                                            placeholder="Invoice Attachment "
                                            value={form.invoice_attachment}
                                            onChange={(e) => setForm({ ...form, invoice_attachment: e.target.value })}
                                            className="form-control mb-1"
                                            required
                                        />
                                    </div>
                                    <div className="col-lg-6 mb-1">
                                        <input
                                            type="text"
                                            name="entered_by"
                                            placeholder="Entered By "
                                            value={form.entered_by}
                                            onChange={(e) => setForm({ ...form, entered_by: e.target.value })}
                                            className="form-control mb-1"
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

export default InventoryEntryForm;
