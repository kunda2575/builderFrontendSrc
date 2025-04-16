import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { createBankDetails, deleteBankDetails, getBankDetails, updateBankDetails } from '../../../api/banksApi';

const BankMaster = () => {
    const [banks, setBanks] = useState([]);
    const [form, setForm] = useState({ bankName: '', ifscCode: '', branch: '', id: null });

    useEffect(() => {
        fetchBanks();
    }, []);

    const fetchBanks = async () => {
        try {
            const res = await getBankDetails();
            setBanks(res.data);
        } catch (error) {
            toast.error('Failed to fetch Banks');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (form.id) {
                await updateBankDetails(form.id, form);
                toast.success('Bank updated successfully');
            } else {
                await createBankDetails(form);
                toast.success('Bank created successfully');
            }
            setForm({ bankName: '', ifscCode: '', branch: '', id: null });
            fetchBanks();
        } catch (error) {
            toast.error('Action failed');
        }
    };

    const handleEdit = (bank) => {
        setForm(bank);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure to delete this Bank?')) return;
        try {
            await deleteBankDetails(id);
            toast.success('Bank deleted successfully');
            fetchBanks();
        } catch (error) {
            toast.error('Delete failed');
        }
    };

    return (
        <div className="container mt-4">
            <div className='mb-2'>
                <Link className="text-decoration-none text-primary" to="/updateData"> <i className="pi pi-arrow-left"></i>  Back </Link>
            </div>

            <div className="row">
                <div className="col-lg-4 mb-2">
                    <div className="card">
                        <div className="card-header">
                            <h4 className='text-center'>Bank Master</h4>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="card-body">
                                <input
                                    type="text"
                                    placeholder="Bank Name"
                                    value={form.bankName}
                                    onChange={(e) => setForm({ ...form, bankName: e.target.value })}
                                    className="form-control mb-2"
                                    required
                                />
                                <input
                                    type="text"
                                    placeholder="Ifsc code"
                                    value={form.ifscCode}
                                    onChange={(e) => setForm({ ...form, ifscCode: e.target.value })}
                                    className="form-control mb-2"
                                    required
                                />
                                <input
                                    type="text"
                                    placeholder="Branch"
                                    value={form.branch}
                                    onChange={(e) => setForm({ ...form, branch: e.target.value })}
                                    className="form-control mb-2"
                                    required
                                />
                            </div>
                            <div className="card-footer text-center">
                                <button type="submit" className="btn btn-primary btn-sm">
                                    {form.id ? 'Update' : 'Create'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
                <div className="col-lg-8  ">
                    <table className="table table-bordered text-center">
                        <thead className="table-dark">
                            <tr>
                                <th>Bank Name</th>
                                <th>IFSC Code</th>
                                <th>Branch</th>
                                <th> Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {banks.map((bank) => (
                                <tr key={bank.id}>
                                    <td>{bank.bankName}</td>
                                    <td>{bank.ifscCode}</td>
                                    <td>{bank.branch}</td>
                                    <td>
                                        <button
                                            className="btn btn-sm btn-info me-2"
                                            onClick={() => handleEdit(bank)}
                                        >
                                            <i className="pi pi-pen-to-square me-1"> </i> Edit
                                        </button>
                                        <button
                                            className="btn btn-sm btn-danger"
                                            onClick={() => handleDelete(bank.id)}
                                        >
                                            <i className="pi pi-trash me-1"> </i> Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {banks.length === 0 && (
                                <tr>
                                    <td colSpan="4" className="text-center">No banks found</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default BankMaster;