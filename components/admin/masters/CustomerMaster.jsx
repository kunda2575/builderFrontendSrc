import { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import { getCustomerDetails, createCustomerDetails, updateCustomerDetails, deleteCustomerDetails } from '../../../api/customerApi'
import { toast } from "react-toastify"


const CustomerMaster = () => {
    const [customers, setCustomers] = useState([])
    const [form, setForm] = useState({
        customerName: '',
        customerPhone: '',
        customerEmail: '',
        customerAddress: '',
        customerProfession: '',
        languagesKnown: '',
        projectNameBlock: '',
        flatNo: '',
        customerId: null
    });

    useEffect(() => {
        fetchCustomers();
    }, []);

    const fetchCustomers = async () => {
        try {
            const res = await getCustomerDetails()
            setCustomers(res.data)
        } catch (error) {
            toast.error('Failed to fetch Customers');
        }
    }


    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (form.customerId) {
                await updateCustomerDetails(form.customerId, form);
                toast.success(`Customer updated successfully`);

            } else {
                await createCustomerDetails(form);
                toast.success(`Customer created successfully`)
            }
            setForm({
                customerName: '',
                customerPhone: '',
                customerEmail: '',
                customerAddress: '',
                customerProfession: '',
                languagesKnown: '',
                projectNameBlock: '',
                flatNo: '',
                customerId: null
            })
            fetchCustomers()
        } catch (error) {
            toast.error('Action Failed')
        }
    };
    const handleEdit = (customer) => {
        setForm(customer);
    };


    const handleDelete = async (customerId) => {
        if (!window.confirm('Are you sure to delete this Customer?')) return;
        try {
            await deleteCustomerDetails(customerId);
            toast.success('Customer deleted successfully');
            fetchCustomers();
        } catch (error) {
            toast.error('Delete failed');
        }
    };
    return (
        <>
            <div className="container">
                <div className='mb-2'>
                    <Link className="text-decoration-none text-primary" to="/updateData"> <i className="pi pi-arrow-left"></i>  Back </Link>
                </div>

                <div className="row mb-4">
                    <div className="col-lg-12 m-auto">
                        <div className="card mb-3">
                            <div className="card-header">
                                <h4 className="text-center">  Customer Master</h4>
                            </div>
                            <div className="card-body">
                                <form onSubmit={handleSubmit} className="row">
                                    <span className="col-lg-4 mb-2">
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Customer Name"
                                            onChange={(e) => setForm({ ...form, customerName: e.target.value })}
                                            value={form.customerName}
                                            required
                                        />
                                    </span>
                                    <div className="col-lg-4 mb-2">
                                        <input
                                            type="number"
                                            className="form-control"
                                            placeholder="Customer Phone"
                                            onChange={(e) => setForm({ ...form, customerPhone: e.target.value })}
                                            value={form.customerPhone}

                                        />
                                    </div>
                                    <div className="col-lg-4 mb-2">
                                        <input
                                            type="email"
                                            className="form-control"
                                            placeholder="Customer Email"
                                            onChange={(e) => setForm({ ...form, customerEmail: e.target.value })}
                                            value={form.customerEmail}
                                        />
                                    </div>
                                    <div className="col-lg-4 mb-2">
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Customer Profession"
                                            onChange={(e) => setForm({ ...form, customerProfession: e.target.value })}
                                            value={form.customerProfession}
                                        />
                                    </div>
                                    <div className="col-lg-4 mb-2">
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Languages Known"
                                            onChange={(e) => setForm({ ...form, languagesKnown: e.target.value })}
                                            value={form.languagesKnown}
                                        />
                                    </div>
                                    <div className="col-lg-4 mb-2">
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Project Name Block"
                                            onChange={(e) => setForm({ ...form, projectNameBlock: e.target.value })}
                                            value={form.projectNameBlock}
                                        />
                                    </div>
                                    <div className="col-lg-4 mb-2">
                                        <input
                                            type="number"
                                            className="form-control"
                                            placeholder="Flat No"
                                            onChange={(e) => setForm({ ...form, flatNo: e.target.value })}
                                            value={form.flatNo}
                                        />
                                    </div>
                                    <div className="col-lg-4 mb-2">
                                        <textarea
                                            type="text"
                                            className="form-control"
                                            onChange={(e) => setForm({ ...form, customerAddress: e.target.value })}
                                            value={form.customerAddress}
                                            placeholder="Enter Address"
                                            // rows={3}
                                        >
                                            {/* CustomerAddress */}
                                        </textarea>
                                    </div>
                                    <div className="text-center">
                                        <button type="submit" className="btn btn-primary btn-sm">
                                            {form.id ? 'Update' : 'Create'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-12 m-auto">
                        <table className="table table-bordered text-center flex-wrap">
                            <thead className="table-dark">
                                <tr>
                                    <th>Customer Name</th>
                                    <th>Mobile</th>
                                    <th>Email</th>
                                    <th>Profession</th>
                                    <th>Languages Known</th>
                                    <th>Project Name Block</th>
                                    <th>Flat No</th>
                                    <th>Address</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {customers.map((customer) => (
                                    <tr key={customer.customerId}>
                                        <td>{customer.customerName}</td>
                                        <td>{customer.customerPhone}</td>
                                        <td>{customer.customerEmail}</td>
                                        <td>{customer.customerProfession}</td>
                                        <td>{customer.languagesKnown}</td>
                                        <td>{customer.projectNameBlock}</td>
                                        <td>{customer.flatNo}</td>
                                        <td>{customer.customerAddress}</td>
                                        <td className="d-flex justify-content-evenly">
                                            <button
                                                className="btn btn-sm btn-info me-1"
                                                onClick={() => handleEdit(customer)}
                                            >
                                                <i className="pi pi-pen-to-square"> </i>
                                            </button>
                                            <button
                                                className="btn btn-sm btn-danger"
                                                onClick={() => handleDelete(customer.customerId)}
                                            >
                                                <i className="pi pi-trash"> </i>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {customers.length === 0 && (
                                    <tr>
                                        <td colSpan="4" className="text-center">No banks found</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    )
}
export default CustomerMaster