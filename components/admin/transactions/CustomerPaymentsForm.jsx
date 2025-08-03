import React, { useEffect, useState, useRef } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { fetchData, postData, putData } from '../../../api/apiHandler1';
import { config } from '../../../api/config';
import { Calendar } from 'primereact/calendar';
import 'react-toastify/dist/ReactToastify.css';
import { MultiSelect } from 'primereact/multiselect';
import 'primereact/resources/themes/saga-blue/theme.css'; // Or your theme
import 'primereact/resources/primereact.min.css';
import { FileUpload } from 'primereact/fileupload';
import { Dropdown } from 'primereact/dropdown';
const CustomerPaymentsForm = () => {
    const [searchParams] = useSearchParams();
    const editID = searchParams.get('id');

    console.log("edit id  uuuu ", editID)

    const [loading, setLoading] = useState(false);
    const [customerPayment, setCustomerPayments] = useState([]);
    const [paymentType, setPaymentType] = useState([]);
    const [verifiedBy, setVerifiedBy] = useState([]);
    const [fundingBank, setFundingBank] = useState([])
    const [paymentMode, setPaymentMode] = useState([]);


    const [customer, setCustomer] = useState([]);

    const [selectedFiles, setSelectedFiles] = useState({});
    const [hasUploadedFirstFile, setHasUploadedFirstFile] = useState({});
    const fileInputRefs = useRef({});


    const [form, setForm] = useState({
        customer_id: "",
        customer_name: "",
        contact_number: "",
        email: "",
        profession: "",
        native_language: [],
        project_name: "",
        block_name: "",
        flat_no: "",
        agreed_price: "",
        installment_no: "",
        amount_received: "",
        payment_mode: "",
        payment_type: "",
        verified_by: "",
        funding_bank: "",
        documents: "",
        flat_hand_over_date: "",
        flat_area: "",
        no_of_bhk: "",
        id: null
    });

    useEffect(() => {
        // Fetch all static dropdown data & customers
        fetchCustomerPaymentssForm();
        fetchPaymentTypes();
        fetchVerifiedBy();
        fetchPaymentModes();
        fetchFundingBank();
        fetchCustomer(); // This must run before fetching edit data
    }, []);

    // ✅ Wait for customer list to load before fetching edit data
    useEffect(() => {
        if (editID && customer.length > 0) {
            fetchEditData(editID);
        }
    }, [editID, customer]);




    const fetchCustomerPaymentssForm = async () => {
        try {
            const res = await fetchData(`${config.getCustomerPayments}`);
            // console.log('inventory Response:', res);  // Debugging the API response
            if (Array.isArray(res.data)) {
                setCustomerPayments(res.data);
            } else {
                setCustomerPayments([]);
            }
        } catch (error) {
            console.error("Error fetching customerPayment:", error);
            toast.error('Failed to fetch customerPayment');
        }
    };



    const fetchPaymentTypes = async () => {
        try {
            const res = await fetchData(`${config.getPaymentTypeCp}`);
            // console.log('paymentType Response:', res);  // Debugging API response
            if (res && res.data && Array.isArray(res.data)) {
                setPaymentType(res.data);
            } else {
                console.log("No paymentType found or invalid data format.");
                setPaymentType([]);
            }
        } catch (error) {
            console.error("Error fetching paymentType:", error);
            toast.error('Failed to fetch paymentType');
        }
    };
    const fetchCustomer = async () => {
        try {
            const res = await fetchData(`${config.getCustomerCp}`);

            if (res && res.data && Array.isArray(res.data)) {
                setCustomer(res.data);
            } else {
                console.log("No customer found or invalid data format.");
                setCustomer([]);
            }
        } catch (error) {
            console.error("Error fetching CUSTOMER:", error);
            toast.error('Failed to fetch CUSTOMER');
        }
    };
    // Fetch Expense Heads
    const fetchVerifiedBy = async () => {
        try {
            const res = await fetchData(`${config.getVerifiedByCp}`);
            if (res && res.data && Array.isArray(res.data)) {
                setVerifiedBy(res.data);
            } else {
                console.log("No verifiedBy found or invalid data format.");
                setVerifiedBy([]);
            }
        } catch (error) {
            console.error("Error fetching verifiedBy:", error);
            toast.error('Failed to fetch verifiedBy');
        }
    };
    const fetchFundingBank = async () => {
        try {
            const res = await fetchData(`${config.getFundingBankCp}`);
            if (res && res.data && Array.isArray(res.data)) {
                setFundingBank(res.data);
            } else {
                console.log("No funding bank found or invalid data format.");
                setFundingBank([]);
            }
        } catch (error) {
            console.error("Error fetching funding bank :", error);
            toast.error('Failed to fetch funding bank ');
        }
    };

    // Fetch Payment Modes
    const fetchPaymentModes = async () => {
        try {
            const res = await fetchData(`${config.getPaymentModeCp}`);
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
    // At the top
    const [retainedDocuments, setRetainedDocuments] = useState([]);
    const [documentTypes, setDocumentTypes] = useState([]);

    // Inside handleFileSelect
    const handleFileSelect = (event, field) => {
        const newFiles = event.files || [];

        setForm(prev => ({
            ...prev,
            [field.name]: [...(prev[field.name] || []), ...newFiles]
        }));

        setSelectedFiles(prev => ({
            ...prev,
            [field.name]: [...(prev[field.name] || []), ...newFiles]
        }));

        setHasUploadedFirstFile(prev => ({ ...prev, [field.name]: true }));

        if (fileInputRefs.current[field.name]) {
            fileInputRefs.current[field.name].clear();
        }

        // Optional: Prompt user to specify document types
        setDocumentTypes(prev => [...prev, ...newFiles.map(() => "receipt")]); // or dynamically assign
    };

    const handleRemoveFile = (fieldName, index) => {
        const removedFile = selectedFiles[fieldName][index];

        if (typeof removedFile === "string") {
            setRetainedDocuments(prev => prev.filter((_, i) => i !== index));
        }

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

        setDocumentTypes(prev => {
            const updated = [...prev];
            updated.splice(index, 1);
            return updated;
        });
    };
const resetForm = {
  customer_id: "",
  customer_name: "",
  contact_number: "",
  email: "",
  profession: "",
  native_language: [],
  project_name: "",
  block_name: "",
  flat_no: "",
  agreed_price: "",
  installment_no: "",
  amount_received: "",
  payment_mode: "",
  payment_type: "",
  verified_by: "",
  funding_bank: "",
  documents: "",
  flat_hand_over_date: "",
  flat_area: "",
  no_of_bhk: "",
  id: null
};

    // 🆕 Handle form submit
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const formData = new FormData();

            Object.entries(form).forEach(([key, value]) => {
                if (key !== "documents") {
                    formData.append(key, Array.isArray(value) ? value.join(", ") : value);
                }
            });

            // Files
            selectedFiles["documents"]?.forEach((docObj) => {
                if (docObj.file) {
                    formData.append("documents", docObj.file);
                } else if (typeof docObj === "string") {
                    // Probably a retained URL, skip (handled separately)
                }
            });


            // Append retained file keys
            formData.append("retainedFiles", JSON.stringify(retainedDocuments));
            const uploadedDocTypes = selectedFiles["documents"]
                ?.filter(doc => doc.file) // only new uploads
                .map(doc => doc.documentType || "unknown");

            formData.append("documentTypes", JSON.stringify(uploadedDocTypes));

            let response;
            if (form.id) {
                response = await putData(config.updateCustomerPayment(form.id), formData);
            } else {
                response = await postData(config.createCustomerPayment, formData);
            }

            if (response.success) {
                toast.success(form.id ? "Updated successfully!" : "Created successfully!");
                // Reset
                setForm({
                     customer_id: "",
  customer_name: "",
  contact_number: "",
  email: "",
  profession: "",
  native_language: [],
  project_name: "",
  block_name: "",
  flat_no: "",
  agreed_price: "",
  installment_no: "",
  amount_received: "",
  payment_mode: "",
  payment_type: "",
  verified_by: "",
  funding_bank: "",
  documents: "",
  flat_hand_over_date: "",
  flat_area: "",
  no_of_bhk: "",
  id: null
                 });
                
                setSelectedFiles({});
                setRetainedDocuments([]);
                setDocumentTypes([]);
            } else {
                toast.error(response.message || "Submission failed.");
            }
        } catch (err) {
            console.error(err);
            toast.error(err.message || "Something went wrong.");
        } finally {
            setLoading(false);
        }
    };


  const fetchEditData = async (id) => {
    try {
        const res = await fetchData(config.getCustomerPaymentById(id));
        const data = res.data;

        if (data) {
            const documentArray = Array.isArray(data.documents)
                ? data.documents
                : typeof data.documents === 'string'
                    ? data.documents.split(',').map(doc => doc.trim())
                    : [];

            const formattedData = {
                customer_id: data.customer_id || "",
                customer_name: data.customer_name || "",
                contact_number: data.contact_number || "",
                email: data.email || "",
                profession: data.profession || "",
                native_language: typeof data.native_language === 'string'
                    ? data.native_language.split(',').map(item => item.trim())
                    : Array.isArray(data.native_language)
                        ? data.native_language
                        : [],
                project_name: data.project_name || "",
                block_name: data.block_name || "",
                flat_no: data.flat_no || "",
                agreed_price: data.agreed_price || "",
                installment_no: data.installment_no || "",
                amount_received: data.amount_received || "",
                payment_mode: data.payment_mode || "",
                payment_type: data.payment_type || "",
                verified_by: data.verified_by || "",
                funding_bank: data.funding_bank || "",
                documents: documentArray,
                flat_hand_over_date: data.flat_hand_over_date ? new Date(data.flat_hand_over_date) : "",
                flat_area: data.flat_area || "",
                no_of_bhk: data.no_of_bhk || "",
                id: data.id || null,
            };

            setForm(formattedData);
            setSelectedFiles({ documents: documentArray });
            setRetainedDocuments(documentArray);
        }
    } catch (error) {
        toast.error("Failed to load customer Payment data for editing");
        console.error("Error loading customer Payment by ID:", error);
    }
};





    return (
        <div className="container-fluid mt-3">
            <div className='d-flex mb-2 justify-content-between'>
                <Link className="text-decoration-none text-primary" to="/transaction">
                    <i className="pi pi-arrow-left"></i> Back
                </Link>
                <Link className="text-decoration-none text-primary" to="/customerPaymentsTable">
                    <button className='btn btn-sm btn-primary'>
                        Customer Payments  Table <i className="pi pi-arrow-right"></i>
                    </button>
                </Link>
            </div>

            <div className="row">
                <div className="col-lg-10 m-auto">
                    <div className="card">
                        <div className="card-header">
                            <h4 className='text-center'> Customer Payments Transactions</h4>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="card-body">
                                <div className="row">
                                    {/* DATE */}
                                    <div className="col-lg-4 mb-2">
                                        <label>Date</label>
                                        <Calendar
                                            value={form.flat_hand_over_date}
                                            onChange={(e) => setForm({ ...form, flat_hand_over_date: e.value })}
                                            showIcon
                                            dateFormat="dd-mm-yy"
                                            className="w-100 mb-2 custom-calendar"
                                            panelClassName='popup'
                                            required
                                            showButtonBar
                                            placeholder="Select Handover Date"
                                        />

                                    </div>



                                    {/* customer ID*/}


                                    <div className="col-lg-4 mb-2">
                                        <label> Customer Id </label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={form.customer_id}
                                            onChange={(e) => setForm({ ...form, customer_id: e.target.value })}
                                            placeholder='Customer Id'
                                        />
                                    </div>

                                    {/* CUSTOMER NAME SELECT */}
                                    <div className="col-lg-4 mb-2">
                                        <label> Select Customer Name </label>
                                        <select
                                            className="form-select"
                                            value={form.customer_id}
                                            onChange={(e) => {
                                                const selectedId = parseInt(e.target.value); // convert to number
                                                const selectedCustomer = customer.find(c => c.customerId === selectedId);

                                                if (selectedCustomer) {
                                                    setForm({
                                                        ...form,
                                                        customer_id: selectedCustomer.customerId,
                                                        customer_name: selectedCustomer.customerName || "",
                                                        contact_number: selectedCustomer.customerPhone || "",
                                                        email: selectedCustomer.customerEmail || ""
                                                    });
                                                } else {
                                                    setForm({
                                                        ...form,
                                                        customer_id: "",
                                                        customer_name: "",
                                                        contact_number: "",
                                                        email: ""
                                                    });
                                                }
                                            }}
                                        >
                                            <option value="">Select Customer</option>
                                            {customer.map(c => (
                                                <option key={c.customerId} value={c.customerId}>
                                                    {c.customerName}
                                                </option>
                                            ))}
                                        </select>
                                    </div>



                                    {/* CONTACT NUMBER */}
                                    <div className="col-lg-4 mb-2">
                                        <label>Contact Number  </label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            value={form.contact_number}
                                            onChange={(e) => setForm({ ...form, contact_number: e.target.value })}
                                            placeholder='Contact Number'
                                        />
                                    </div>

                                    {/* EMAIL */}
                                    <div className="col-lg-4 mb-2">
                                        <label>Email </label>
                                        <input
                                            type="email"
                                            className="form-control"
                                            value={form.email}
                                            onChange={(e) => setForm({ ...form, email: e.target.value })}
                                            placeholder='Email Id'
                                        />
                                    </div>

                                    {/* PROFESSION */}
                                    <div className="col-lg-4 mb-2">
                                        <label>Profession </label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={form.profession}
                                            onChange={(e) => setForm({ ...form, profession: e.target.value })}
                                            placeholder='Profession'
                                        />
                                    </div>

                                    {/* NATIVE LANGUAGE */}
                                    <div className="col-lg-4 mb-2">
                                        <label>Native  Language</label>
                                        <MultiSelect
                                            value={Array.isArray(form.native_language) ? form.native_language : []}
                                            onChange={(e) => setForm({ ...form, native_language: e.value })}
                                            options={[
                                                { label: 'Telugu', value: 'Telugu' },
                                                { label: 'English', value: 'English' },
                                                { label: 'Hindi', value: 'Hindi' }
                                            ]}
                                            placeholder="Select Languages"
                                            display="chip"
                                            className="w-100"
                                        />
                                    </div>


                                    {/* PROJECT NAME */}
                                    <div className="col-lg-4 mb-2">
                                        <label> Project Name  </label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={form.project_name}
                                            onChange={(e) => setForm({ ...form, project_name: e.target.value })}
                                            placeholder='Project Name'
                                        />
                                    </div>

                                    {/* BLOCK NAME */}
                                    <div className="col-lg-4 mb-2">
                                        <label> Block Name</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={form.block_name}
                                            onChange={(e) => setForm({ ...form, block_name: e.target.value })}
                                            placeholder='Block Name'
                                        />
                                    </div>

                                    {/* FLAT NO */}
                                    <div className="col-lg-4 mb-2">
                                        <label>Flat No  </label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={form.flat_no}
                                            onChange={(e) => setForm({ ...form, flat_no: e.target.value })}
                                            placeholder='Flat No'
                                        />
                                    </div>

                                    {/* AGREED PRICE */}
                                    <div className="col-lg-4 mb-2">
                                        <label>Agreed Price  </label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            value={form.agreed_price}
                                            onChange={(e) => setForm({ ...form, agreed_price: e.target.value })}
                                            placeholder='Agreed Price'
                                        />
                                    </div>

                                    {/* INSTALLMENT NO */}
                                    <div className="col-lg-4 mb-2">
                                        <label>Installment No </label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={form.installment_no}
                                            onChange={(e) => setForm({ ...form, installment_no: e.target.value })}
                                            placeholder='Installment No'
                                        />
                                    </div>

                                    {/* AMOUNT RECEIVED */}
                                    <div className="col-lg-4 mb-2">
                                        <label>Amount Received  </label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            value={form.amount_received}
                                            onChange={(e) => setForm({ ...form, amount_received: e.target.value })}
                                            placeholder='Amount Received'
                                        />
                                    </div>



                                    {/* PAYMENT MODE */}
                                    <div className="col-lg-4 mb-2">
                                        <label>Payment Mode</label>
                                        <select
                                            className="form-select"
                                            value={form.payment_mode}
                                            onChange={(e) => setForm({ ...form, payment_mode: e.target.value })}
                                        >
                                            <option value="">Select Payment Mode</option>
                                            {paymentMode.map(mode => (
                                                <option key={mode.id} value={mode.paymentMode}>
                                                    {mode.paymentMode}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* PAYMENT TYPE */}
                                    <div className="col-lg-4 mb-2">
                                        <label>Payment Type</label>
                                        <select
                                            className="form-select"
                                            value={form.payment_type}
                                            onChange={(e) => setForm({ ...form, payment_type: e.target.value })}
                                        >
                                            <option value="">Select Payment Type</option>
                                            {paymentType.map(type => (
                                                <option key={type.id} value={type.paymentType}>
                                                    {type.paymentType}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* VERIFIED BY */}
                                    <div className="col-lg-4 mb-2">
                                        <label>Verfied By</label>
                                        <select
                                            className="form-select"
                                            value={form.verified_by}
                                            onChange={(e) => setForm({ ...form, verified_by: e.target.value })}
                                        >
                                            <option value="">Select Verified By</option>
                                            {verifiedBy.map(verifier => (
                                                <option key={verifier.id} value={verifier.employeeName}>
                                                    {verifier.employeeName}
                                                </option>
                                            ))}
                                        </select>
                                    </div>


                                    {/* FUNDING BANK */}
                                    <div className="col-lg-4 mb-2">
                                        <label> Funding Bank</label>
                                        <select
                                            className="form-select"
                                            value={form.funding_bank}
                                            onChange={(e) => setForm({ ...form, funding_bank: e.target.value })}
                                        >
                                            <option value="">Select Funding Bank</option>
                                            {[...new Set(fundingBank.map(bank => bank.bankName))].map((uniqueBankName, index) => (
                                                <option key={index} value={uniqueBankName}>
                                                    {uniqueBankName}
                                                </option>
                                            ))}
                                        </select>
                                    </div>


                                    {/* DOCUMENTS */}




                                    {/* FLAT AREA */}
                                    <div className="col-lg-4 mb-2">
                                        <label>Flat Area</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={form.flat_area}
                                            onChange={(e) => setForm({ ...form, flat_area: e.target.value })}
                                            placeholder='Flat Area'
                                        />
                                    </div>
                                    <div className="col-lg-4 mb-2">
                                        <label> Number of BHK</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={form.no_of_bhk}
                                            onChange={(e) => setForm({ ...form, no_of_bhk: e.target.value })}
                                            placeholder='Number of BHK'
                                        />
                                    </div>


                                    <div className="col-lg-12 mb-3">
                                        <label className="form-label">Documents</label>
                                        <div className="row align-items-center">
                                            <div className="col-md-3">
                                                <Dropdown
                                                    value={form.documentType}
                                                    options={[
                                                        { label: 'Invoice', value: 'Invoice' },
                                                        { label: 'Delivery Note', value: 'Delivery Note' },
                                                        { label: 'Packing Slip', value: 'Packing Slip' },
                                                        { label: 'Purchase Order', value: 'Purchase Order' },
                                                    ]}
                                                    onChange={(e) => setForm({ ...form, documentType: e.value })}
                                                    placeholder="Document Type"
                                                    className="w-100"
                                                />
                                            </div>
                                            <div className="col-md-9">
                                                <FileUpload
                                                    name="documents"
                                                    customUpload
                                                    multiple
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
                                                            documents: [...(prev.documents || []), ...newEntries],
                                                        }));

                                                        setSelectedFiles((prev) => ({
                                                            ...prev,
                                                            documents: [...(prev.documents || []), ...newEntries],
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

                                        {selectedFiles["documents"]?.length > 0 && (
                                            <ul className="mt-3 list-unstyled">
                                                {selectedFiles["documents"].map((item, idx) => {
                                                    const isString = typeof item === 'string';
                                                    const fileName = isString ? item.split('/').pop() : item.file.name;
                                                    const fileUrl = isString
                                                        ? item
                                                        : URL.createObjectURL(item.file);

                                                    return (
                                                        <li key={idx} className="d-flex align-items-center justify-content-between mb-2">
                                                            <div className="d-flex flex-column">
                                                                <a href={fileUrl} target="_blank" rel="noopener noreferrer" className="fw-semibold">
                                                                    {fileName}
                                                                </a>
                                                                <small className="text-muted">
                                                                    {isString ? item.documentType || 'Uploaded' : item.documentType}
                                                                </small>
                                                            </div>
                                                            <button
                                                                type="button"
                                                                className="btn btn-sm btn-outline-danger"
                                                                onClick={() => handleRemoveFile("documents", idx)}
                                                            >
                                                                ❌
                                                            </button>
                                                        </li>
                                                    );
                                                })}
                                            </ul>
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
            </div >
        </div >
    );
};

export default CustomerPaymentsForm;
