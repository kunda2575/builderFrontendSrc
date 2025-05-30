import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { fetchData, postData, putData } from '../../../api/apiHandler1';
import { config } from '../../../api/config';
import { Calendar } from 'primereact/calendar';

const InventoryEntryForm = () => {
  const [searchParams] = useSearchParams();
  const editId = searchParams.get("id");

  const [loading, setLoading] = useState(false);
  const [unitTypes, setUnitTypes] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [vendors, setVendors] = useState([]);

  const [form, setForm] = useState({
    material_id: "",
    material_name: "",
    vendor_name: "",
    invoice_number: "",
    invoice_date: null,
    invoice_cost_incl_gst: "",
    unit_type: "",
    quantity_received: "",
    invoice_attachment: [],
    entered_by: "",
    id: null,
  });

  useEffect(() => {
    fetchUnitTypes();
    fetchMaterials();
    fetchVendors();

    if (editId) {
      fetchEditData(editId);
    }
  }, [editId]);

  const fetchMaterials = async () => {
    try {
      const res = await fetchData(config.getMaterial);
      if (Array.isArray(res.data)) setMaterials(res.data);
    } catch (error) {
      toast.error("Failed to fetch materials");
    }
  };

  const fetchUnitTypes = async () => {
    try {
      const res = await fetchData(config.getUnitType);
      if (Array.isArray(res.data)) setUnitTypes(res.data);
    } catch (error) {
      toast.error("Failed to fetch unit types");
    }
  };

  const fetchVendors = async () => {
    try {
      const res = await fetchData(config.getVendorName);
      if (Array.isArray(res.data)) setVendors(res.data);
    } catch (error) {
      toast.error("Failed to fetch vendors");
    }
  };

  const fetchEditData = async (id) => {
    try {
      const res = await fetchData(config.getInventoriesById(id));
      const inv = res.data;
      if (inv) {
        setForm({
          material_id: inv.material_id || "",
          material_name: inv.material_name || "",
          vendor_name: inv.vendor_name || "",
          invoice_number: inv.invoice_number || "",
          invoice_date: inv.invoice_date ? new Date(inv.invoice_date) : null,
          invoice_cost_incl_gst: inv.invoice_cost_incl_gst || "",
          unit_type: inv.unit_type || "",
          quantity_received: inv.quantity_received || "",
          invoice_attachment: [],
          entered_by: inv.entered_by || "",
          id: inv.id || null,
        });
      }
    } catch (error) {
      toast.error("Failed to load inventory data");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length < 1 || files.length > 5) {
      toast.error("Please upload between 1 and 5 invoice attachments.");
      return;
    }
    setForm((prev) => ({
      ...prev,
      invoice_attachment: files,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      if (key === "invoice_attachment") return;
      if (key === "invoice_date" && value) {
        formData.append(key, value.toISOString());
      } else {
        formData.append(key, value);
      }
    });

    form.invoice_attachment.forEach((file) => {
      formData.append("invoice_attachment", file);
    });

    try {
      if (form.id) {
        await putData(config.updateInventory(form.id), formData);
        toast.success("Inventory updated successfully");
      } else {
        await postData(config.createInventory, formData);
        toast.success("Inventory created successfully");
      }

      setForm({
        material_id: "",
        material_name: "",
        vendor_name: "",
        invoice_number: "",
        invoice_date: null,
        invoice_cost_incl_gst: "",
        unit_type: "",
        quantity_received: "",
        invoice_attachment: [],
        entered_by: "",
        id: null,
      });
    } catch (error) {
      toast.error("Action failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid mt-3">
      <div className="d-flex mb-2 justify-content-between">
        <Link className="text-decoration-none text-primary" to="/transaction">
          <i className="pi pi-arrow-left"></i> Back
        </Link>
        <Link className="text-decoration-none text-primary" to="/inventoryEntryTable">
          <button className="btn btn-sm btn-primary">
            Inventory Entry Table <i className="pi pi-arrow-right"></i>
          </button>
        </Link>
      </div>

      <div className="row">
        <div className="col-lg-8 m-auto">
          <div className="card">
            <div className="card-header">
              <h4 className="text-center">Inventory Transactions</h4>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="card-body">
                <div className="row">
                  {/* Material ID */}
                  <div className="col-lg-6 mb-1">
                    <select
                      name="material_id"
                      value={form.material_id}
                      onChange={(e) => setForm({ ...form, material_id: e.target.value })}
                      className="form-select mb-1"
                      required
                    >
                      <option value="">Select Material Id</option>
                      {materials.map((material) => (
                        <option key={material.material_id || material.id} value={material.material_id || material.id}>
                          {material.material_id || material.id}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Material Name */}
                  <div className="col-lg-6 mb-1">
                    <select
                      name="material_name"
                      value={form.material_name}
                      onChange={(e) => setForm({ ...form, material_name: e.target.value })}
                      className="form-select mb-1"
                      required
                    >
                      <option value="">Select Material Name</option>
                      {materials.map((material) => (
                        <option key={material.material_id || material.id} value={material.material_name || material.materialName}>
                          {material.material_name || material.materialName}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Vendor */}
                  <div className="col-lg-6 mb-1">
                    <select
                      name="vendor_name"
                      value={form.vendor_name}
                      onChange={(e) => setForm({ ...form, vendor_name: e.target.value })}
                      className="form-select mb-1"
                      required
                    >
                      <option value="">Select Vendor Name</option>
                      {vendors.map((vendor) => (
                        <option key={vendor.id} value={vendor.vendor_name || vendor.vendorName}>
                          {vendor.vendor_name || vendor.vendorName}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Invoice Number */}
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

                  {/* Invoice Date */}
                  <div className="col-lg-6 mb-1">
                    <label className="mb-1">Invoice Date</label>
                    <Calendar
                      value={form.invoice_date}
                      onChange={(e) => setForm({ ...form, invoice_date: e.value })}
                      showIcon
                      dateFormat="dd-mm-yy"
                      placeholder="Select a Date"
                      className="w-100 mb-2 custom-calendar"
                      panelClassName="popup"
                      required
                      showButtonBar
                    />
                  </div>

                  {/* Invoice Cost Incl Gst */}
                  <div className="col-lg-6 mb-1">
                    <input
                      type="number"
                      name="invoice_cost_incl_gst"
                      placeholder="Invoice Cost Incl Gst"
                      value={form.invoice_cost_incl_gst}
                      onChange={(e) => setForm({ ...form, invoice_cost_incl_gst: e.target.value })}
                      className="form-control mb-1"
                      required
                    />
                  </div>

                  {/* Quantity Received */}
                  <div className="col-lg-6 mb-1">
                    <input
                      type="number"
                      name="quantity_received"
                      placeholder="Quantity Received"
                      value={form.quantity_received}
                      onChange={(e) => setForm({ ...form, quantity_received: e.target.value })}
                      className="form-control mb-1"
                      required
                    />
                  </div>

                  {/* Unit Type */}
                  <div className="col-lg-6 mb-1">
                    <select
                      name="unit_type"
                      value={form.unit_type}
                      onChange={(e) => setForm({ ...form, unit_type: e.target.value })}
                      className="form-select mb-1"
                      required
                    >
                      <option value="">Select Unit Type</option>
                      {unitTypes.map((unit) => (
                        <option key={unit.id} value={unit.unit_type || unit.unit}>
                          {unit.unit_type || unit.unit}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Entered By */}
                  <div className="col-lg-6 mb-1">
                    <input
                      type="text"
                      name="entered_by"
                      placeholder="Entered By"
                      value={form.entered_by}
                      onChange={(e) => setForm({ ...form, entered_by: e.target.value })}
                      className="form-control mb-1"
                      required
                    />
                  </div>

                  {/* File Upload */}
                  {/* File Upload */}
                  <div className="col-lg-6 mb-1">
                    <input
                      type="file"
                      accept="image/*,application/pdf"
                      multiple
                      onChange={handleFileChange} // ✅ Use the correct handler
                      className="form-control mb-1"
                    />
                    {form.invoice_attachment.length > 0 && (
                      <small>{form.invoice_attachment.length} file(s) selected</small>
                    )}
                  </div>

                </div>
              </div>

              <div className="card-footer">
                <button type="submit" className="btn btn-primary w-100" disabled={loading}>
                  {loading ? 'Saving...' : form.id ? 'Update Inventory' : 'Add Inventory'}
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
