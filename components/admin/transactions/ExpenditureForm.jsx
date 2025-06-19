import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
<<<<<<< HEAD
import { fetchData, postData, putData } from '../../../api/apiHandler';
=======
import { fetchData, postData, putData } from '../../../api/apiHandler1';
>>>>>>> master
import { config } from '../../../api/config';
import { Calendar } from 'primereact/calendar';
import 'react-toastify/dist/ReactToastify.css';

const ExpenditureForm = () => {
    const [searchParams] = useSearchParams();
    const editID = searchParams.get('id');

    const [loading, setLoading] = useState(false);
<<<<<<< HEAD
    const [vendorName, setVendorName] = useState([]);
=======
    const [expenditure, setExpenditures] = useState([])
    const [vendorNames, setVendorName] = useState([]);
>>>>>>> master
    const [expenseHeads, setExpenseHeads] = useState([]);
    const [paymentMode, setPaymentMode] = useState([]);
    const [paymentBank, setPaymentBank] = useState([]);

    const [form, setForm] = useState({
        date: "",
<<<<<<< HEAD
        vendor_name: "",
        expense_head: "",
        amount_inr: "",
        invoice_number: "",
        payment_mode: "",
        payment_bank: "",
        payment_reference: "",
        payment_evidence: "",
=======
        vendor_name: '',
        expense_head: '',
        amount_inr: '',
        invoice_number: '',
        payment_mode: '',
        payment_bank: '',
        payment_reference: [],
        payment_evidence: [],
>>>>>>> master
        id: null
    });

    useEffect(() => {
<<<<<<< HEAD
        fetchInitialData();
        if (editID) {
            fetchExpenditureById(editID);
        }
    }, [editID]);

    const fetchInitialData = async () => {
        try {
            const [vendorRes, expenseRes, modeRes, bankRes] = await Promise.all([
                fetchData(`${config.getVendor}`),
                fetchData(`${config.getExpenseHead}`),
                fetchData(`${config.getPaymentMode}`),
                fetchData(`${config.getPaymentBank}`)
            ]);

            setVendorName(vendorRes.data || []);
            setExpenseHeads(expenseRes.data || []);
            setPaymentMode(modeRes.data || []);
            setPaymentBank(bankRes.data || []);
        } catch (err) {
            toast.error("Failed to fetch dropdown data.");
        }
    };

    const fetchExpenditureById = async (id) => {
        try {
            const res = await fetchData(`${config.getExpenditure}/${id}`);
            if (res.data) {
                setForm(res.data);
            }
        } catch (err) {
            toast.error("Failed to fetch expenditure data.");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (form.id) {
                await putData(`${config.updateExpenditure}/${form.id}`, form);
                toast.success("Updated successfully!");
            } else {
                await postData(`${config.createExpenditure}`, form);
                toast.success("Created successfully!");
            }
        } catch (err) {
            toast.error("Submission failed.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container-fluid mt-3">
            <div className='d-flex mb-2 justify-content-between'>
                <Link className="text-decoration-none text-primary" to="/expenditure">
=======

        fetchExpendituresForm();
        fetchVendors()
        fetchExpenseHeads()
        fetchPaymentModes()
        fetchPaymentBanks();

        if (editID) {
            fetchEditData(editID);
        }
    }, []);



    const fetchExpendituresForm = async () => {
        try {
            const res = await fetchData(`${config.getExpenditures}`);
            // console.log('inventory Response:', res);  // Debugging the API response
            if (Array.isArray(res.data)) {
                setExpenditures(res.data);
            } else {
                setExpenditures([]);
            }
        } catch (error) {
            console.error("Error fetching expenditure:", error);
            toast.error('Failed to fetch expenditure');
        }
    };



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


    // handleFileChange (update it to handle field-specific file input)
    const handleFileChange = (e) => {
        const fieldName = e.target.id; // "paymentReference" or "paymentEvidence"
        const files = Array.from(e.target.files);
        setForm(prev => ({
            ...prev,
            [fieldName === 'paymentReference' ? 'payment_reference' : 'payment_evidence']: files
        }));
    };

    // const handleSubmit = async (e) => {
    //     e.preventDefault();
    //     setLoading(true);


    //     const formData = new FormData();
    //     Object.entries(form).forEach(([key, value]) => {
    //         if (key === "payment_reference") return;
    //         if (key === "payment_evidence" && value) {
    //             formData.append(key, value.toISOString());
    //         } else {
    //             formData.append(key, value);
    //         }
    //     });

    //     form.invoice_attachment.forEach((file) => {
    //         formData.append("invoice_attachment", file);
    //     });

    //     try {
    //         const formData = { ...form };
    //         if (form.id) {
    //             await putData(config.updateExpenditure(form.id), formData);
    //             toast.success("Updated successfully!");
    //         } else {
    //             await postData(`${config.createExpenditure}`, formData);
    //             toast.success("Created successfully!");
    //         }
    //         setForm({
    //             date: null,
    //             vendor_name: '',
    //             expense_head: '',
    //             amount_inr: '',
    //             invoice_number: '',
    //             payment_mode: '',
    //             payment_bank: '',
    //             payment_reference: [],
    //             payment_evidence: [],
    //             id: null
    //         })
    //         fetchExpendituresForm();
    //     } catch (err) {
    //         toast.error("Submission failed.");
    //     } finally {
    //         setLoading(false);
    //     }
    // };

    const fetchEditData = async (id) => {
        try {
            const res = await fetchData(config.getExpenditureById(id)); // Make sure this is the correct expenditure endpoint
            const data = res.data.data; // ✅ fix here

            if (data) {
                const formattedData = {
                    date: data.date ? new Date(data.date) : "",
                    vendor_name: data.vendor_name || '',         // Assuming these match your backend response
                    expense_head: data.expense_head || '',
                    amount_inr: data.amount_inr || '',
                    invoice_number: data.invoice_number || '',
                    payment_mode: data.payment_mode || '',
                    payment_bank: data.payment_bank || '',
                    payment_reference: data.payment_reference || '',
                    payment_evidence: data.payment_evidence || '',
                    id: data.id || null,
                };
                setForm(formattedData);
            }
        } catch (error) {
            toast.error("Failed to load expenditure data for editing");
            console.error("Error loading expenditure by ID:", error);
        }
    };
const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append("date", form.date?.toISOString() || "");
    formData.append("vendor_name", form.vendor_name);
    formData.append("expense_head", form.expense_head);
    formData.append("amount_inr", form.amount_inr);
    formData.append("invoice_number", form.invoice_number);
    formData.append("payment_mode", form.payment_mode);
    formData.append("payment_bank", form.payment_bank);

    // Append each file individually (for multiple files)
    form.payment_reference.forEach((file) => {
        formData.append("payment_reference", file);
    });

    form.payment_evidence.forEach((file) => {
        formData.append("payment_evidence", file);
    });

    try {
        if (form.id) {
            await putData(config.updateExpenditure(form.id), formData, true); // true indicates multipart/form-data
            toast.success("Updated successfully!");
        } else {
            await postData(`${config.createExpenditure}`, formData, true);
            toast.success("Created successfully!");
        }

        // Reset form after submission
        setForm({
            date: "",
            vendor_name: '',
            expense_head: '',
            amount_inr: '',
            invoice_number: '',
            payment_mode: '',
            payment_bank: '',
            payment_reference: [],
            payment_evidence: [],
            id: null
        });
        fetchExpendituresForm();
    } catch (err) {
        toast.error("Submission failed.");
        console.error(err);
    } finally {
        setLoading(false);
    }
};


    return (
        <div className="container-fluid mt-3">
            <div className='d-flex mb-2 justify-content-between'>
                <Link className="text-decoration-none text-primary" to="/transaction">
>>>>>>> master
                    <i className="pi pi-arrow-left"></i> Back
                </Link>
                <Link className="text-decoration-none text-primary" to="/expenditureTable">
                    <button className='btn btn-sm btn-primary'>
<<<<<<< HEAD
                        Inventory Entry Table <i className="pi pi-arrow-right"></i>
=======
                        Expenditure  Table <i className="pi pi-arrow-right"></i>
>>>>>>> master
                    </button>
                </Link>
            </div>

            <div className="row">
                <div className="col-lg-8 m-auto">
                    <div className="card">
                        <div className="card-header">
<<<<<<< HEAD
                            <h4 className='text-center'>Inventory Transactions</h4>
=======
                            <h4 className='text-center'>Expenditure Transactions</h4>
>>>>>>> master
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
<<<<<<< HEAD
                                       <label></label>
=======
                                        <label> </label>
>>>>>>> master
                                        <select
                                            name='vendor_name'
                                            value={form.vendor_name}
                                            onChange={(e) => setForm({ ...form, vendor_name: e.target.value })}
                                            className="form-select mb-1"
                                            required
                                        >
                                            <option value="">Select Vendor name</option>
<<<<<<< HEAD
                                            {vendorName.map(vendor => (
=======
                                            {vendorNames.map(vendor => (
>>>>>>> master
                                                <option key={vendor.id} value={vendor.vendorName}>
                                                    {vendor.vendorName}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="col-lg-6 mb-1">
<<<<<<< HEAD
                                      
=======

>>>>>>> master
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
<<<<<<< HEAD
                                       
=======

>>>>>>> master
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
<<<<<<< HEAD
                                       
=======

>>>>>>> master
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
                                        <input
                                            type="text"
                                            name="invoice_number"
                                            placeholder="Invoice Number"
<<<<<<< HEAD
                                            value={form.invoice_number}
=======
                                            value={form.invoice_number || ''}
>>>>>>> master
                                            onChange={(e) => setForm({ ...form, invoice_number: e.target.value })}
                                            className="form-control mb-1"
                                            required
                                        />
                                    </div>
                                    <div className="col-lg-6 mb-1">
                                        <input
                                            type="text"
                                            name="amount_inr"
                                            placeholder="Amount INR"
<<<<<<< HEAD
                                            value={form.amount_inr}
=======
                                            value={form.amount_inr || ''}
>>>>>>> master
                                            onChange={(e) => setForm({ ...form, amount_inr: e.target.value })}
                                            className="form-control mb-1"
                                            required
                                        />
                                    </div>

                                    <div className="col-lg-6 mb-1">
<<<<<<< HEAD
                                        <input
                                            type="text"
                                            name="payment_reference"
                                            placeholder="Payment Reference"
                                            value={form.payment_reference}
                                            onChange={(e) => setForm({ ...form, payment_reference: e.target.value })}
                                            className="form-control mb-1"
                                            required
                                        />
                                    </div>

                                    <div className="col-lg-6 mb-1">
                                        <input
                                            type="text"
                                            name="payment_evidence"
                                            placeholder="Payment Evidence"
                                            value={form.payment_evidence}
                                            onChange={(e) => setForm({ ...form, payment_evidence: e.target.value })}
                                            className="form-control mb-1"
                                            required
                                        />
                                    </div>
=======
                                        <div className="input-group">
                                            <label htmlFor="paymentReference" className="btn btn-outline-secondary">
                                                Payment Reference
                                            </label>
                                            <input
                                                id="paymentReference"
                                                type="file"
                                                accept="image/*,application/pdf"
                                                multiple
                                                // onChange={handleFileChange}
                                                  onChange={(e) => setForm({ ...form, payment_reference: Array.from(e.target.files) })}
                     
                                                style={{ display: 'none' }}
                                            />
                                            <input
                                                type="text"
                                                className="form-control"
                                                placeholder="Choose file"
                                                value={
                                                    form.payment_reference?.length > 0
                                                        ? form.payment_reference.map(file => file.name).join(', ')
                                                        : ''
                                                }
                                                readOnly
                                            />
                                        </div>
                                    </div>

                                    <div className="col-lg-6 mb-1">
                                        <div className="input-group">
                                            <label htmlFor="paymentEvidence" className="btn btn-outline-secondary">
                                                Payment Evidence
                                            </label>
                                            <input
                                                id="paymentEvidence"
                                                type="file"
                                                accept="image/*,application/pdf"
                                                multiple
                                                onChange={handleFileChange}
                                                style={{ display: 'none' }}
                                            />
                                            <input
                                                type="text"
                                                className="form-control"
                                                placeholder="Choose file"
                                                value={
                                                    form.payment_evidence?.length > 0
                                                        ? form.payment_evidence.map(file => file.name).join(', ')
                                                        : ''
                                                }
                                                readOnly
                                            />
                                        </div>
                                    </div>

>>>>>>> master
                                </div>
                            </div>

                            <div className="card-footer text-center row d-flex justify-content-center">
<<<<<<< HEAD
                                <button type="submit" className="btn btn-primary btn-sm col-lg-4" disabled={loading}>
=======
                                <button type="submit" className="btn btn-primary btn-sm col-lg-2" disabled={loading}>
>>>>>>> master
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

export default ExpenditureForm;
