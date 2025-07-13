import React, { useEffect, useState, useRef } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { fetchData, postData, putData } from '../../../api/apiHandler1';
import { config } from '../../../api/config';
import { Calendar } from 'primereact/calendar';
import { FileUpload } from 'primereact/fileupload';
import { Dropdown } from 'primereact/dropdown';
import 'react-toastify/dist/ReactToastify.css';

const DOCUMENT_TYPE_OPTIONS = ["Invoice", "Receipt", "GST", "PAN", "Other"];

const ExpenditureForm = () => {
    const [searchParams] = useSearchParams();
    const editID = searchParams.get('id');

    const [loading, setLoading] = useState(false);
    const [vendorNames, setVendorName] = useState([]);
    const [expenseHeads, setExpenseHeads] = useState([]);
    const [paymentMode, setPaymentMode] = useState([]);
    const [paymentBank, setPaymentBank] = useState([]);

    const fileInputRefs = useRef({});

    const [form, setForm] = useState({
        date: "",
        vendor_name: '',
        expense_head: '',
        amount_inr: '',
        invoice_number: '',
        payment_mode: '',
        payment_bank: '',
        payment_reference: [],
        payment_evidence: [],
        id: null,
        documentTypeTemp: {
            payment_reference: '',
            payment_evidence: ''
        }
    });

    useEffect(() => {
        fetchVendors();
        fetchExpenseHeads();
        fetchPaymentModes();
        fetchPaymentBanks();
        if (editID) fetchEditData(editID);
    }, []);



    const sanitizeUrl = (url) => {
        if (!url) return '';
        const prefix = 'https://pub-029295a7436d410e9cb079b9c6f2c11c.r2.dev/';
        if (url.includes(prefix + prefix)) {
            return url.substring(url.indexOf(prefix));
        }
        return url.startsWith('http') ? url : prefix + url;
    };

    const normalizeFileField = (field, defaultType) => {
        if (!field) return [];
        if (Array.isArray(field)) {
            return field.map(url => ({ file: sanitizeUrl(url), documentType: defaultType }));
        }
        if (typeof field === 'string') {
            return field
                .split(',')
                .filter(url => url)
                .map(url => ({ file: sanitizeUrl(url.trim()), documentType: defaultType }));
        }
        return [];
    };

    const fetchEditData = async (id) => {
        try {
            const res = await fetchData(config.getExpenditureById(id));
            const data = res.data.data;
            if (data) {
                setForm((prev) => ({
                    ...prev,
                    date: data.date ? new Date(data.date) : "",
                    vendor_name: data.vendor_name || '',
                    expense_head: data.expense_head || '',
                    amount_inr: data.amount_inr || '',
                    invoice_number: data.invoice_number || '',
                    payment_mode: data.payment_mode || '',
                    payment_bank: data.payment_bank || '',
                    payment_reference: normalizeFileField(data.payment_reference, 'Invoice'),
                    payment_evidence: normalizeFileField(data.payment_evidence, 'Receipt'),
                    id: data.id || null
                }));
            }
        } catch {
            toast.error("Failed to load expenditure data for editing");
        }
    };



    const uniqueFiles = (docs) => {
        const seen = new Set();
        return docs.filter(doc => {
            const key = `${doc.file.name}-${doc.file.size}`;
            if (seen.has(key)) return false;
            seen.add(key);
            return true;
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const payment_reference = uniqueFiles(form.payment_reference);
        const payment_evidence = uniqueFiles(form.payment_evidence);

        if ((payment_reference.length && !form.documentTypeTemp.payment_reference) ||
            (payment_evidence.length && !form.documentTypeTemp.payment_evidence)) {
            toast.error("Please select a document type for each uploaded file.");
            setLoading(false);
            return;
        }

        const formData = new FormData();
        formData.append("date", form.date?.toISOString() || "");
        formData.append("vendor_name", form.vendor_name);
        formData.append("expense_head", form.expense_head);
        formData.append("amount_inr", form.amount_inr);
        formData.append("invoice_number", form.invoice_number);
        formData.append("payment_mode", form.payment_mode);
        formData.append("payment_bank", form.payment_bank);
        formData.append("documentTypes", JSON.stringify(payment_reference.map(f => f.documentType)));
        formData.append("documentTypes1", JSON.stringify(payment_evidence.map(f => f.documentType)));

        payment_reference.forEach(doc => formData.append("payment_reference_files", doc.file));
        payment_evidence.forEach(doc => formData.append("payment_evidence_files", doc.file));

        try {
            const response = form.id
                ? await putData(config.updateExpenditure(form.id), formData)
                : await postData(config.createExpenditure, formData);

            if (response.success) {
                toast.success(form.id ? "Updated successfully!" : "Created successfully!");
                setForm({
                    date: "",
                    vendor_name: "",
                    expense_head: "",
                    amount_inr: "",
                    invoice_number: "",
                    payment_mode: "",
                    payment_bank: "",
                    payment_reference: [],
                    payment_evidence: [],
                    id: null,
                    documentTypeTemp: {
                        payment_reference: '',
                        payment_evidence: ''
                    }
                });
            } else {
                toast.error(response.message || "Submission failed.");
            }
        } catch (err) {
            toast.error(err.message || "Something went wrong.");
        } finally {
            setLoading(false);
        }
    };

   const handleFileUpload = async (e, field) => {
    const files = e.files || [];
    const selectedDocType = form.documentTypeTemp[field];

    if (!selectedDocType) {
        toast.error("Please select a document type first.");
        fileInputRefs.current[field]?.clear();
        return;
    }

    // Prevent duplicate file names + sizes
    const existingFileMap = new Set(
        form[field].map(doc => `${doc.filename}-${doc.size}`)
    );

    const newDocs = [];

    for (const file of files) {
        const fileKey = `${file.name}-${file.size}`;
        if (existingFileMap.has(fileKey)) {
            continue;
        }

        try {
            // 🔐 Get signed upload URL from backend (replace with your actual logic)
            const res = await fetch(`/api/upload-url?filename=${encodeURIComponent(file.name)}&type=${file.type}`);
            const { uploadUrl, publicUrl } = await res.json();

            // ⬆️ Upload to R2 directly
            await fetch(uploadUrl, {
                method: 'PUT',
                headers: {
                    'Content-Type': file.type,
                },
                body: file
            });

            // ✅ Add to form state with uploaded public URL
            newDocs.push({
                file: publicUrl,
                filename: file.name,
                size: file.size,
                documentType: selectedDocType
            });

        } catch (err) {
            console.error("Upload failed:", err);
            toast.error(`Failed to upload file: ${file.name}`);
        }
    }

    if (newDocs.length > 0) {
        setForm(prev => ({
            ...prev,
            [field]: [...prev[field], ...newDocs]
        }));
    } else {
        toast.warning("No new files added.");
    }

    fileInputRefs.current[field]?.clear();
};



    const renderPaymentReferenceUpload = () => (
        <div className="col-lg-12 mb-3">
            <label className="form-label fw-bold">Upload Payment Reference</label>
            <div className="row align-items-center">
                <div className="col-md-5">
                    <Dropdown
                        value={form.documentTypeTemp.payment_reference}
                        options={DOCUMENT_TYPE_OPTIONS.map(type => ({ label: type, value: type }))}
                        onChange={(e) =>
                            setForm((prev) => ({
                                ...prev,
                                documentTypeTemp: {
                                    ...prev.documentTypeTemp,
                                    payment_reference: e.value,
                                }
                            }))
                        }
                        placeholder="Select Document Type"
                        className="w-100"
                    />
                </div>
                <div className="col-md-7">
                    <FileUpload
                        name="payment_reference"
                        customUpload
                        multiple
                        accept="image/*,application/pdf"
                        disabled={!form.documentTypeTemp.payment_reference}
                        onSelect={(e) => handleFileUpload(e, 'payment_reference')}
                        ref={(el) => (fileInputRefs.current['payment_reference'] = el)}
                        showUploadButton={false}
                        showCancelButton={false}
                        chooseLabel="Add File"
                        mode="basic"
                        className="w-100"
                    />
                </div>
            </div>

            {form.payment_reference.length > 0 && (
                <div className="mt-2">
                    <ul className="list-unstyled border rounded p-2">
                        {form.payment_reference.map((doc, index) => {
                            const isFile = doc.file instanceof File;
                            const fileName = isFile ? doc.file.name : doc.file.split('/').pop();
                            const fileUrl = isFile ? URL.createObjectURL(doc.file) : doc.file;

                            return (
                                <li key={index} className="d-flex align-items-center justify-content-between py-1 border-bottom">
                                    <div>
                                        📄 <a href={fileUrl} target="_blank" rel="noopener noreferrer"><strong>{fileName}</strong></a>
                                        <span className="text-muted small ms-2">({doc.documentType})</span>
                                    </div>
                                    <button
                                        type="button"
                                        className="btn btn-sm btn-outline-danger"
                                        onClick={() => {
                                            setForm((prev) => {
                                                const updated = [...prev.payment_reference];
                                                updated.splice(index, 1);
                                                return { ...prev, payment_reference: updated };
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
    );
    const renderPaymentEvidenceUpload = () => (
        <div className="col-lg-12 mb-3">
            <label className="form-label fw-bold">Upload Payment Evidence</label>
            <div className="row align-items-center">
                <div className="col-md-5">
                    <Dropdown
                        value={form.documentTypeTemp.payment_evidence}
                        options={DOCUMENT_TYPE_OPTIONS.map(type => ({ label: type, value: type }))}
                        onChange={(e) =>
                            setForm((prev) => ({
                                ...prev,
                                documentTypeTemp: {
                                    ...prev.documentTypeTemp,
                                    payment_evidence: e.value,
                                }
                            }))
                        }
                        placeholder="Select Document Type"
                        className="w-100"
                    />
                </div>
                <div className="col-md-7">
                    <FileUpload
                        name="payment_evidence"
                        customUpload
                        multiple
                        accept="image/*,application/pdf"
                        disabled={!form.documentTypeTemp.payment_evidence}
                        onSelect={(e) => handleFileUpload(e, 'payment_evidence')}
                        ref={(el) => (fileInputRefs.current['payment_evidence'] = el)}
                        showUploadButton={false}
                        showCancelButton={false}
                        chooseLabel="Add File"
                        mode="basic"
                        className="w-100"
                    />
                </div>
            </div>

           {form.payment_evidence.length > 0 && (
  <div className="mt-2">
    <ul className="list-unstyled border rounded p-2">
      {form.payment_evidence.map((doc, index) => {
        const isFile = doc.file instanceof File;
        const fileName = isFile ? doc.file.name : doc.file.split('/').pop();
        const fileUrl = isFile ? URL.createObjectURL(doc.file) : doc.file;
        const isImage = /\.(jpg|jpeg|png|gif|webp)$/i.test(fileName);
        const isPDF = /\.pdf$/i.test(fileName);

        return (
          <li
            key={index}
            className="d-flex flex-column flex-md-row align-items-start justify-content-between py-2 border-bottom gap-2"
          >
            <div className="flex-grow-1">
              <div className="fw-bold">
                {isImage ? '🖼️' : '📄'} {fileName}
              </div>
              <div className="text-muted small mb-2">({doc.documentType})</div>

              {/* Inline Preview */}
              {isImage && (
                <img
                  src={fileUrl}
                  alt={fileName}
                  className="img-thumbnail"
                  style={{ maxWidth: '200px', maxHeight: '150px', objectFit: 'contain' }}
                />
              )}
              {isPDF && (
                <iframe
                  src={fileUrl}
                  title={fileName}
                  width="100%"
                  height="200px"
                  style={{ border: '1px solid #ccc' }}
                />
              )}
            </div>

            <div className="d-flex flex-column gap-2">
              {/* ✅ Download button (safe for both blob and URL) */}
              <a
                href={fileUrl}
                download={fileName}
                className="btn btn-sm btn-outline-primary"
              >
                Download
              </a>

              {/* ❌ Remove button */}
              <button
                type="button"
                className="btn btn-sm btn-outline-danger"
                onClick={() => {
                  setForm((prev) => {
                    const updated = [...prev.payment_evidence];
                    updated.splice(index, 1);
                    return { ...prev, payment_evidence: updated };
                  });
                }}
              >
                Remove
              </button>
            </div>
          </li>
        );
      })}
    </ul>
  </div>
)}


        </div>
    );



    const fetchVendors = async () => {
        try {
            const res = await fetchData(`${config.getVendorNameEx}`);
            // console.log('vendor Response:', res);  // Debugging API response
            if (res && res.data && Array.isArray(res.data)) {
                setVendorName(res.data);
            } else {
                console.log("No unit types found or invalid data format.");
                setVendorName([]);
            }
        } catch (error) {
            console.error("Error fetching vendors:", error);
            toast.error('Failed to fetch vendors');
        }
    };
    // Fetch Expense Heads
    const fetchExpenseHeads = async () => {
        try {
            const res = await fetchData(`${config.getExpenseHeadEx}`);
            if (res && res.data && Array.isArray(res.data)) {
                setExpenseHeads(res.data);
            } else {
                console.log("No expense heads found or invalid data format.");
                setExpenseHeads([]);
            }
        } catch (error) {
            console.error("Error fetching expense heads:", error);
            toast.error('Failed to fetch expense heads');
        }
    };

    // Fetch Payment Modes
    const fetchPaymentModes = async () => {
        try {
            const res = await fetchData(`${config.getPaymentModeEx}`);
            if (res && res.data && Array.isArray(res.data)) {
                setPaymentMode(res.data);
            } else {
                console.log("No payment modes found or invalid data format.");
                setPaymentMode([]);
            }
        } catch (error) {
            console.error("Error fetching payment modes:", error);
            toast.error('Failed to fetch payment modes');
        }
    };

    // Fetch Payment Banks
    const fetchPaymentBanks = async () => {
        try {
            const res = await fetchData(`${config.getPaymentBankEx}`);
            if (res && res.data && Array.isArray(res.data)) {
                setPaymentBank(res.data);
            } else {
                console.log("No payment banks found or invalid data format.");
                setPaymentBank([]);
            }
        } catch (error) {
            console.error("Error fetching payment banks:", error);
            toast.error('Failed to fetch payment banks');
        }
    };



    return (
        <div className="container-fluid mt-3">
            <div className='d-flex mb-2 justify-content-between'>
                <Link className="text-decoration-none text-primary" to="/transaction">
                    <i className="pi pi-arrow-left"></i> Back
                </Link>
                <Link className="text-decoration-none text-primary" to="/expenditureTable">
                    <button className='btn btn-sm btn-primary'>
                        Expenditure  Table <i className="pi pi-arrow-right"></i>
                    </button>
                </Link>
            </div>

            <div className="row">
                <div className="col-lg-8 m-auto">
                    <div className="card">
                        <div className="card-header">
                            <h4 className='text-center'>Expenditure Transactions</h4>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="card-body">
                                <div className="row">
                                    <div className="col-lg-6 mb-1">
                                        <label className='mb-1'>Date</label>
                                        <Calendar
                                            value={form.date}
                                            onChange={(e) => setForm({ ...form, date: e.value })}
                                            showIcon
                                            dateFormat="dd-mm-yy"
                                            placeholder="Select a Date"
                                            className="w-100 mb-2 custom-calendar"
                                            panelClassName='popup'
                                            required
                                            showButtonBar
                                        />
                                    </div>

                                    <div className="col-lg-6 mb-1">
                                        <label>Vendor name </label>
                                        <select
                                            name='vendor_name'
                                            value={form.vendor_name}
                                            onChange={(e) => setForm({ ...form, vendor_name: e.target.value })}
                                            className="form-select mb-1"
                                            required
                                        >
                                            <option value="">Select Vendor name</option>
                                            {vendorNames.map(vendor => (
                                                <option key={vendor.id} value={vendor.vendorName}>
                                                    {vendor.vendorName}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="col-lg-6 mb-1">
                                        <label>Expense Head </label>
                                        <select
                                            name='expense_head'
                                            value={form.expense_head}
                                            onChange={(e) => setForm({ ...form, expense_head: e.target.value })}
                                            className="form-select mb-1"
                                            required
                                        >
                                            <option value="">Select Expense Head</option>
                                            {expenseHeads.map(expense => (
                                                <option key={expense.id} value={expense.expenseHead}>
                                                    {expense.expenseHead}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="col-lg-6 mb-1">
                                        <label>Payment Mode </label>
                                        <select
                                            name='payment_mode'
                                            value={form.payment_mode}
                                            onChange={(e) => setForm({ ...form, payment_mode: e.target.value })}
                                            className="form-select mb-1"
                                            required
                                        >
                                            <option value="">Select Payment Mode</option>
                                            {paymentMode.map(mode => (
                                                <option key={mode.id} value={mode.paymentMode}>
                                                    {mode.paymentMode}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="col-lg-6 mb-1">
                                        <label>Payment Bank </label>
                                        <select
                                            name='payment_bank'
                                            value={form.payment_bank}
                                            onChange={(e) => setForm({ ...form, payment_bank: e.target.value })}
                                            className="form-select mb-1"
                                            required
                                        >
                                            <option value="">Select Payment Bank</option>
                                            {paymentBank.map(bank => (
                                                <option key={bank.id} value={bank.bankName}>
                                                    {bank.bankName}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="col-lg-6 mb-1">
                                        <label>Invoice Number </label>
                                        <input
                                            type="text"
                                            name="invoice_number"
                                            placeholder="Invoice Number"
                                            value={form.invoice_number || ''}
                                            onChange={(e) => setForm({ ...form, invoice_number: e.target.value })}
                                            className="form-control mb-1"
                                            required
                                        />
                                    </div>
                                    <div className="col-lg-6 mb-1">
                                        <label> Amount INR</label>
                                        <input
                                            type="text"
                                            name="amount_inr"
                                            placeholder="Amount INR"
                                            value={form.amount_inr || ''}
                                            onChange={(e) => setForm({ ...form, amount_inr: e.target.value })}
                                            className="form-control mb-1"
                                            required
                                        />
                                    </div>
                                    {renderPaymentReferenceUpload()}
                                    {renderPaymentEvidenceUpload()}

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
            </div >
        </div >
    );
};

export default ExpenditureForm;
