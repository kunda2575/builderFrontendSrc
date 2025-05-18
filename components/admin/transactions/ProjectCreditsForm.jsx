import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { fetchData, postData, putData } from '../../../api/apiHandler';
import { config } from '../../../api/config';
import { Calendar } from 'primereact/calendar';
import 'react-toastify/dist/ReactToastify.css';

const ProjectreditsForm = () => {
    const [searchParams] = useSearchParams();
    const editID = searchParams.get('id');

    const [loading, setLoading] = useState(false);
    const [projectCredit, setProjectCredits] = useState([]);
    const [source, setSource] = useState([]);
    const [purpose, setPurpose] = useState([]);
    const [paymentMode, setPaymentMode] = useState([]);


    const [form, setForm] = useState({
        date: "",
        source: '',
        deposit_bank_purpose: '',
        amount_inr: '',
        payment_mode: '',
        id: null
    });

    useEffect(() => {

        fetchProjectCreditssForm();
        fetchSources()
        fetchPurpose()
        fetchPaymentModes()

        if (editID) {
            fetchEditData(editID);
        }
    }, []);



    const fetchProjectCreditssForm = async () => {
        try {
            const res = await fetchData(`${config.getProjectCredits}`);
            // console.log('inventory Response:', res);  // Debugging the API response
            if (Array.isArray(res.data)) {
                setProjectCredits(res.data);
            } else {
                setProjectCredits([]);
            }
        } catch (error) {
            console.error("Error fetching projectCredit:", error);
            toast.error('Failed to fetch projectCredit');
        }
    };



    const fetchSources = async () => {
        try {
            const res = await fetchData(`${config.getSource}`);
            // console.log('source Response:', res);  // Debugging API response
            if (res && res.data && Array.isArray(res.data)) {
                setSource(res.data);
            } else {
                console.log("No source found or invalid data format.");
                setSource([]);
            }
        } catch (error) {
            console.error("Error fetching source:", error);
            toast.error('Failed to fetch source');
        }
    };
    // Fetch Expense Heads
    const fetchPurpose = async () => {
        try {
            const res = await fetchData(`${config.getPurpose}`);
            if (res && res.data && Array.isArray(res.data)) {
                setPurpose(res.data);
            } else {
                console.log("No purpose found or invalid data format.");
                setPurpose([]);
            }
        } catch (error) {
            console.error("Error fetching purpose:", error);
            toast.error('Failed to fetch purpose');
        }
    };

    // Fetch Payment Modes
    const fetchPaymentModes = async () => {
        try {
            const res = await fetchData(`${config.getPaymentModePc}`);
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


    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const formData = { ...form };
            if (form.id) {
                await putData(config.updateProjectCredits(form.id), formData);
                toast.success("Updated successfully!");
            } else {
                await postData(`${config.createProjectCredits}`, formData);
                toast.success("Created successfully!");
            }
            setForm({
                date: null,
                source: '',
                deposit_bank_purpose: '',
                amount_inr: '',
                payment_mode: '',
                id: null
            })
            fetchProjectCreditssForm();
        } catch (err) {
            toast.error("Submission failed.");
        } finally {
            setLoading(false);
        }
    };

    const fetchEditData = async (id) => {
        try {
            const res = await fetchData(config.getProjectCreditsById(id)); // Make sure this is the correct projectCredit endpoint
            const data = res.data;

            if (data) {
                const formattedData = {
                    date: data.date ? new Date(data.date) : "",
                    source: data.source || '',         // Assuming these match your backend response
                    deposit_bank_purpose: data.deposit_bank_purpose || '',
                    amount_inr: data.amount_inr || '',
                    payment_mode: data.payment_mode || '',
                    id: data.id || null,
                };
                setForm(formattedData);
            }
        } catch (error) {
            toast.error("Failed to load projectCredit data for editing");
            console.error("Error loading projectCredit by ID:", error);
        }
    };

    return (
        <div className="container-fluid mt-3">
            <div className='d-flex mb-2 justify-content-between'>
                <Link className="text-decoration-none text-primary" to="/transaction">
                    <i className="pi pi-arrow-left"></i> Back
                </Link>
                <Link className="text-decoration-none text-primary" to="/projectCreditTable">
                    <button className='btn btn-sm btn-primary'>
                        Project Credits  Table <i className="pi pi-arrow-right"></i>
                    </button>
                </Link>
            </div>

            <div className="row">
                <div className="col-lg-8 m-auto">
                    <div className="card">
                        <div className="card-header">
                            <h4 className='text-center'>Project Credits Transactions</h4>
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
                                            name='source'
                                            value={form.source}
                                            onChange={(e) => setForm({ ...form, source: e.target.value })}
                                            className="form-select mb-1"
                                            required
                                        >
                                            <option value="">Select Source name</option>
                                            {source.map(source => (
                                                <option key={source.id} value={source.fundSource}>
                                                    {source.fundSource}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="col-lg-6 mb-1">

                                        <select
                                            name='deposit_bank_purpose'
                                            value={form.deposit_bank_purpose}
                                            onChange={(e) => setForm({ ...form, deposit_bank_purpose: e.target.value })}
                                            className="form-select mb-1"
                                            required
                                        >
                                            <option value="">Select Expense Head</option>
                                            {purpose.map(purpose => (
                                                <option key={purpose.id} value={purpose.fundPurpose}>
                                                    {purpose.fundPurpose}
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

export default ProjectreditsForm;
