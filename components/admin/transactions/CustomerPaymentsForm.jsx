import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { fetchData, postData, putData } from '../../../api/apiHandler';
import { config } from '../../../api/config';
import { Calendar } from 'primereact/calendar';
import 'react-toastify/dist/ReactToastify.css';
import { MultiSelect } from 'primereact/multiselect';
import 'primereact/resources/themes/saga-blue/theme.css'; // Or your theme
import 'primereact/resources/primereact.min.css';


const CustomerPaymentsForm = () => {
    const [searchParams] = useSearchParams();
    const editID = searchParams.get('id');

    const [loading, setLoading] = useState(false);
    const [customerPayment, setCustomerPayments] = useState([]);
    const [paymentType, setPaymentType] = useState([]);
    const [verifiedBy, setVerifiedBy] = useState([]);
    const [fundingBank, setFundingBank] = useState([])
    const [paymentMode, setPaymentMode] = useState([]);


    const [customer, setCustomer] = useState([]);


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

        fetchCustomerPaymentssForm();
        fetchPaymentTypes()
        fetchVerifiedBy()
        fetchPaymentModes()
        fetchFundingBank()
        fetchCustomer()
        if (editID) {
            fetchEditData(editID);
        }
    }, []);



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


    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            // const formData = { ...form };
            const formData = {
                ...form,
                native_language: Array.isArray(form.native_language)
                    ? form.native_language.join(', ')
                    : form.native_language,
            };
            if (form.id) {
                await putData(config.updateCustomerPayment(form.id), formData);
                toast.success("Updated successfully!");
            } else {
                await postData(`${config.createCustomerPayment}`, formData);
                toast.success("Created successfully!");
            }
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
            })
            fetchCustomerPaymentssForm();
        } catch (err) {
            toast.error("Submission failed.");
        } finally {
            setLoading(false);
        }
    };

    const fetchEditData = async (id) => {
        try {
            const res = await fetchData(config.getCustomerPaymentById(id)); // Make sure this is the correct customerPayment endpoint
            const data = res.data;

            if (data) {
                const formattedData = {
                    customer_id: data.customer_id || "",
                    customer_name: data.customer_name || "",
                    contact_number: data.contact_number || "",
                    email: data.email || "",
                    profession: data.profession || "",

                    // ✅ Convert string to array for MultiSelect
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
                    payment_type: data.payment_type || "",            // changed from paymentType
                    verified_by: data.verified_by || "",              // changed from deposit_bank_verifiedBy
                    funding_bank: data.funding_bank || "",
                    documents: data.documents || "",
                    flat_hand_over_date: data.flat_hand_over_date ? new Date(data.flat_hand_over_date) : "",
                    flat_area: data.flat_area || "",
                    no_of_bhk: data.no_of_bhk || "",
                    id: data.id || null,
                };

                setForm(formattedData);
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
                                        <label></label>
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
                                                        customer_id: selectedId,
                                                        customer_name: "",
                                                        contact_number: "",
                                                        email: ""
                                                    });
                                                }
                                            }}

                                        >
                                            <option value="">Select customer</option>
                                            {customer.map(type => (
                                                <option key={type.id} value={type.customerId}>
                                                    {type.customerId}
                                                </option>
                                            ))}
                                        </select>

                                    </div>

                                    {/* CUSTOMER NAME */}
                                    <div className="col-lg-4 mb-2">
                                        <label></label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={form.customer_name}
                                            onChange={(e) => setForm({ ...form, customer_name: e.target.value })}
                                            placeholder='Customer Name'
                                        />
                                    </div>

                                    {/* CONTACT NUMBER */}
                                    <div className="col-lg-4 mb-2">

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
                                        <label>Native Language</label>
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
                                        {/* <label>Payment Mode</label> */}
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
                                        {/* <label>Payment Type</label> */}
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
                                        {/* <label>Verified By</label> */}
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
                                    {/* <div className="col-lg-4 mb-2">
                                
                                         <select
                                            className="form-select"
                                            value={form.funding_bank}
                                            onChange={(e) => setForm({ ...form, funding_bank: e.target.value })}
                                        >
                                            <option value="">Select Funding Bank</option>
                                            {fundingBank.map(bank => (
                                                <option key={bank.id} value={bank.bankName}>
                                                    {bank.bankName}
                                                </option>
                                            ))}
                                        </select>
                                    </div> */}

                                    {/* FUNDING BANK */}
                                    <div className="col-lg-4 mb-2">
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
                                    <div className="col-lg-4 mb-2">

                                        <input
                                            type="text"
                                            className="form-control"
                                            value={form.documents}
                                            onChange={(e) => setForm({ ...form, documents: e.target.value })}
                                            placeholder='Documents'
                                        />
                                    </div>

                                    {/* FLAT AREA */}
                                    <div className="col-lg-4 mb-2">

                                        <input
                                            type="text"
                                            className="form-control"
                                            value={form.flat_area}
                                            onChange={(e) => setForm({ ...form, flat_area: e.target.value })}
                                            placeholder='Flat Area'
                                        />
                                    </div>
                                    <div className="col-lg-4 mb-2">
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={form.no_of_bhk}
                                            onChange={(e) => setForm({ ...form, no_of_bhk: e.target.value })}
                                            placeholder='Number of BHK'
                                        />
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
