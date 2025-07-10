import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { fetchData, postData, putData } from '../../../api/apiHandler1';
import { config } from '../../../api/config';
import { Calendar } from 'primereact/calendar';
import { useRef } from 'react';
import { FileUpload } from 'primereact/fileupload';
import { Dropdown } from 'primereact/dropdown';

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
    documents: [],       // <--- add here
    documentType: "",
    entered_by: "",
    id: null,
  });

  const fileInputRefs = useRef({});
  const [hasUploadedFirstFile, setHasUploadedFirstFile] = useState({
    invoice_attachment: false,
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
    const inv = res.data.data;

    if (inv) {
      // Parse invoice_attachment (as string or array)
      const urls = Array.isArray(inv.invoice_attachment)
        ? inv.invoice_attachment
        : typeof inv.invoice_attachment === 'string'
          ? inv.invoice_attachment.split(',').map(u => u.trim())
          : [];

      // Parse documentTypes (as array or JSON stringified array)
      let types = [];
      if (Array.isArray(inv.documentTypes)) {
        types = inv.documentTypes;
      } else if (typeof inv.documentTypes === 'string') {
        try {
          const parsed = JSON.parse(inv.documentTypes);
          types = Array.isArray(parsed) ? parsed : inv.documentTypes.split(',').map(t => t.trim());
        } catch {
          types = inv.documentTypes.split(',').map(t => t.trim());
        }
      }

      // Pair files and document types
      const docs = urls.map((u, i) => ({
        file: u,
        documentType: types[i] || 'Invoice'  // Default to 'Invoice' or any other sensible default
      }));

      setForm(prev => ({
        ...prev,
        material_id: inv.material_id || "",
        material_name: inv.material_name || "",
        vendor_name: inv.vendor_name || "",
        invoice_number: inv.invoice_number || "",
        invoice_date: inv.invoice_date ? new Date(inv.invoice_date) : null,
        invoice_cost_incl_gst: inv.invoice_cost_incl_gst || "",
        unit_type: inv.unit_type || "",
        quantity_received: inv.quantity_received || "",
        entered_by: inv.entered_by || "",
        documents: docs,
        id: inv.id || null
      }));
    }
  } catch (err) {
    toast.error("Failed to load data");
    console.error(err);
  }
};




  const handleFileSelect = (event, fieldName) => {
    const newFile = event.files?.[0]; // Only allow one file
    if (!newFile) return;

    setForm(prev => ({
      ...prev,
      [fieldName]: [newFile],
    }));

    setHasUploadedFirstFile(prev => ({
      ...prev,
      [fieldName]: true,
    }));

    if (fileInputRefs.current[fieldName]) {
      fileInputRefs.current[fieldName].clear();
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();

    // Add other fields
    Object.entries(form).forEach(([key, value]) => {
      if (["documents", "documentType", "invoice_attachment"].includes(key)) return;
      if (key === "invoice_date" && value) {
        formData.append(key, value.toISOString());
      } else {
        formData.append(key, value);
      }
    });

    // Add files + types
    form.documents.forEach((doc) => {
      formData.append("documents", doc.file);
    });
    formData.append("documentTypes", JSON.stringify(form.documents.map(d => d.documentType)));

    try {
      if (form.id) {
        await putData(config.updateInventory(form.id), formData);
        toast.success("Inventory updated successfully");
      } else {
        await postData(config.createInventory, formData);
        toast.success("Inventory created successfully");
      }

      // Reset
      setForm({
        material_id: "",
        material_name: "",
        vendor_name: "",
        invoice_number: "",
        invoice_date: null,
        invoice_cost_incl_gst: "",
        unit_type: "",
        quantity_received: "",
        documents: [],
        documentType: "",
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
                    <label>Material ID </label>
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
                    <label> Material Name</label>
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
                    <label> Vendor Name </label>
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
                    <label> Invoice Number</label>
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
                    <label> Invoice Cost Incl Gst </label>
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
                    <label> Quantity Received </label>
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
                    <label>Unit Type </label>
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
                    <label>Entered By </label>
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


                  <div className="col-lg-12 mb-3">
                    <label className="form-label fw-bold">Upload Document</label>
                    <div className="row align-items-center">
                      <div className="col-md-5">
                        <Dropdown
                          value={form.documentType}
                          options={[
                            { label: 'Invoice', value: 'Invoice' },
                            { label: 'Delivery Note', value: 'Delivery Note' },
                            { label: 'Packing Slip', value: 'Packing Slip' },
                            { label: 'Purchase Order', value: 'Purchase Order' },
                          ]}
                          onChange={(e) => setForm({ ...form, documentType: e.value })}
                          placeholder="Select Document Type"
                          className="w-100"
                        />
                      </div>
                      <div className="col-md-7">
                        <FileUpload
                          name="documents"
                          customUpload
                          multiple={true}
                          accept="image/*,application/pdf"
                          onSelect={(e) => {
                            const files = e.files || [];

                            if (!form.documentType) {
                              toast.error("Please select a document type first.");
                              fileInputRefs.current["documents"]?.clear();
                              return;
                            }

                            const newEntries = files.map((file) => ({
                              file,
                              documentType: form.documentType,
                            }));

                            setForm((prev) => ({
                              ...prev,
                              documents: [...prev.documents, ...newEntries],
                            }));

                            fileInputRefs.current["documents"]?.clear();
                          }}
                          ref={(el) => (fileInputRefs.current["documents"] = el)}
                          showUploadButton={false}
                          showCancelButton={false}
                          chooseLabel="Add File"
                          mode="basic"
                          className="w-100"
                        />
                      </div>
                    </div>

                    {form.documents?.length > 0 && (
                      <div className="mt-2">
                        <ul className="list-unstyled border rounded p-2">
                          {form.documents.map((doc, index) => {
                            const isFileObject = doc.file instanceof File;
                            const fileName = isFileObject ? doc.file.name : doc.file.split('/').pop();
                            const fileUrl = isFileObject ? URL.createObjectURL(doc.file) : doc.file;

                            return (
                              <li
                                key={index}
                                className="d-flex align-items-center justify-content-between py-1 border-bottom"
                              >
                                <div>
                                  📄{" "}
                                  <a href={fileUrl} target="_blank" rel="noopener noreferrer">
                                    <strong>{fileName}</strong>
                                  </a>
                                  <span className="text-muted small ms-2">
                                    ({doc.documentType || "Uploaded"})
                                  </span>
                                </div>
                                <button
                                  type="button"
                                  className="btn btn-sm btn-outline-danger"
                                  onClick={() => {
                                    setForm((prev) => {
                                      const updatedDocs = [...(prev.documents || [])];
                                      updatedDocs.splice(index, 1);
                                      return { ...prev, documents: updatedDocs };
                                    });
                                  }}
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




                </div>
              </div>

              <div className="card-footer text-center row d-flex justify-content-center">
                <button type="submit" className="btn btn-primary btn-sm col-lg-2" disabled={loading}>
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
