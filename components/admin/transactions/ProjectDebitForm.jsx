import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { fetchData, postData, putData } from '../../../api/apiHandler';
import { config } from '../../../api/config';
import { Calendar } from 'primereact/calendar';
import 'react-toastify/dist/ReactToastify.css';

const ProjectDebitForm = () => {
    const [searchParams] = useSearchParams();
    const editID = searchParams.get('id');

    const [loading, setLoading] = useState(false);
    const [projectDebit, setProjectDebits] = useState([])
    const [vendorNames, setVendorName] = useState([]);
    const [payTo, setPayTo] = useState([]);
    const [paymentMode, setPaymentMode] = useState([]);
    const [paymentBank, setPaymentBank] = useState([]);

    const [form, setForm] = useState({
        date: "",
        vendor_name: '',
        payed_to: '',
        amount_inr: '',
        invoice_number: '',
        payment_mode: '',
        payment_bank: '',
       
        id: null
    });

    useEffect(() => {

        fetchProjectDebitsForm();
        fetchVendors()
        fetchPayTo()
        fetchPaymentModes()
        fetchPaymentBanks();
    
        if (editID) {
            fetchEditData(editID);
        }
    }, []);

    

    const fetchProjectDebitsForm = async () => {
        try {
            const res = await fetchData(`${config.getProjectDebits}`);
            // console.log('inventory Response:', res);  // Debugging the API response
            if (Array.isArray(res.data)) {
                setProjectDebits(res.data);
            } else {
                setProjectDebits([]);
            }
        } catch (error) {
            console.error("Error fetching projectDebit:", error);
            toast.error('Failed to fetch projectDebit');
        }
    };



    const fetchVendors = async () => {
        try {
            const res = await fetchData(`${config.getVendorNamePd}`);
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
    const fetchPayTo = async () => {
        try {
            const res = await fetchData(`${config.getPayToPd}`);
            if (res && res.data && Array.isArray(res.data)) {
                setPayTo(res.data);
            } else {
                console.log("No expense heads found or invalid data format.");
                setPayTo([]);
            }
        } catch (error) {
            console.error("Error fetching expense heads:", error);
            toast.error('Failed to fetch expense heads');
        }
    };

    // Fetch Payment Modes
    const fetchPaymentModes = async () => {
        try {
            const res = await fetchData(`${config.getPaymentModePd}`);
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
            const res = await fetchData(`${config.getPaymentBankPd}`);
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




    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
             const formData = { ...form };
            if (form.id) {
              await putData(config.updateProjectDebit(form.id), formData);
  toast.success("Updated successfully!");
            } else {
                await postData(`${config.createProjectDebit}`, formData);
                toast.success("Created successfully!");
            }
            setForm({
              date: null,
        vendor_name: '',
        payed_to: '',
        amount_inr: '',
        invoice_number: '',
        payment_mode: '',
        payment_bank: '',
        payment_reference: '',
        payment_evidence: '',
        id: null
            })
            fetchProjectDebitsForm();
        } catch (err) {
            toast.error("Submission failed.");
        } finally {
            setLoading(false);
        }
    };

   const fetchEditData = async (id) => {
    try {
        const res = await fetchData(config.getProjectDebitById(id)); // Make sure this is the correct projectDebit endpoint
        const data = res.data;

        if (data) {
            const formattedData = {
                date: data.date ? new Date(data.date) : "",
                vendor_name: data.vendor_name || '',         // Assuming these match your backend response
                payed_to: data.payed_to || '',
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
        toast.error("Failed to load projectDebit data for editing");
        console.error("Error loading projectDebit by ID:", error);
    }
};

    return (
        <div className="container-fluid mt-3">
            <div className='d-flex mb-2 justify-content-between'>
                <Link className="text-decoration-none text-primary" to="/transaction">
                    <i className="pi pi-arrow-left"></i> Back
                </Link>
                <Link className="text-decoration-none text-primary" to="/projectDebitTable">
                    <button className='btn btn-sm btn-primary'>
                        Project Debit  Table <i className="pi pi-arrow-right"></i>
                    </button>
                </Link>
            </div>

            <div className="row">
                <div className="col-lg-8 m-auto">
                    <div className="card">
                        <div className="card-header">
                            <h4 className='text-center'>Project Debit Transactions</h4>
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
                                        <label> </label>
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
                                   
                                        <select
                                            name='payed_to'
                                            value={form.payed_to}
                                            onChange={(e) => setForm({ ...form, payed_to: e.target.value })}
                                            className="form-select mb-1"
                                            required
                                        >
                                            <option value="">Select  Pay To </option>
                                            {payTo.map(pay => (
                                                <option key={pay.id} value={pay.vendorName}>
                                                    {pay.vendorName}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="col-lg-6 mb-1">
                                  
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
                                            value={form.invoice_number || ''}
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
                                            value={form.amount_inr || ''}
                                            onChange={(e) => setForm({ ...form, amount_inr: e.target.value })}
                                            className="form-control mb-1"
                                            required
                                        />
                                    </div>

                                  
                                </div>
                            </div>

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

export default ProjectDebitForm;
