import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { fetchData, postData, putData } from '../../../api/apiHandler';
import { config } from '../../../api/config';
import { Calendar } from 'primereact/calendar';
import 'react-toastify/dist/ReactToastify.css';

const ExpenditureForm = () => {
    const [searchParams] = useSearchParams();
    const editID = searchParams.get('id');

    const [loading, setLoading] = useState(false);
    const [vendorName, setVendorName] = useState([]);
    const [expenseHeads, setExpenseHeads] = useState([]);
    const [paymentMode, setPaymentMode] = useState([]);
    const [paymentBank, setPaymentBank] = useState([]);

    const [form, setForm] = useState({
        date: "",
        vendor_name: "",
        expense_head: "",
        amount_inr: "",
        invoice_number: "",
        payment_mode: "",
        payment_bank: "",
        payment_reference: "",
        payment_evidence: "",
        id: null
    });

    useEffect(() => {
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
                    <i className="pi pi-arrow-left"></i> Back
                </Link>
                <Link className="text-decoration-none text-primary" to="/expenditureTable">
                    <button className='btn btn-sm btn-primary'>
                        Inventory Entry Table <i className="pi pi-arrow-right"></i>
                    </button>
                </Link>
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
                                       <label></label>
                                        <select
                                            name='vendor_name'
                                            value={form.vendor_name}
                                            onChange={(e) => setForm({ ...form, vendor_name: e.target.value })}
                                            className="form-select mb-1"
                                            required
                                        >
                                            <option value="">Select Vendor name</option>
                                            {vendorName.map(vendor => (
                                                <option key={vendor.id} value={vendor.vendorName}>
                                                    {vendor.vendorName}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="col-lg-6 mb-1">
                                      
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
                                            value={form.invoice_number}
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
                                            value={form.amount_inr}
                                            onChange={(e) => setForm({ ...form, amount_inr: e.target.value })}
                                            className="form-control mb-1"
                                            required
                                        />
                                    </div>

                                    <div className="col-lg-6 mb-1">
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

export default ExpenditureForm;
