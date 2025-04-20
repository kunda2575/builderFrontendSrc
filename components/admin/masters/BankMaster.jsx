import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { createBankDetails, deleteBankDetails, getBankDetails, updateBankDetails } from '../../../api/banksApi';

const BankMaster = () => {
    const [banks, setBanks] = useState([]);
    const [form, setForm] = useState({ bankName: '', ifscCode: '', branch: '', id: null });

    const [loading, setLoading] = useState(false);
     const [confirmDeleteId, setConfirmDeleteId] = useState(null);
   
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

    
  const resetForm = () => {
    setForm({ bankName: '', ifscCode: '', branch: '', id: null });
  };

    const handleSubmit = async () => {
   

        if(!form.bankName|| !form.branch || !form.ifscCode){
             toast.error('Please fill in all fields');
            return;
        }
        setLoading(true)
        try {
            if (form.id) {
                await updateBankDetails(form.id, form);
                toast.success('Bank updated successfully');
            } else {
                await createBankDetails(form);
                toast.success('Bank created successfully');
            }
            resetForm()
            fetchBanks();
        } catch (error) {
                 toast.error(error.response?.data?.error || 'Action failed');
           
        }finally{
            setLoading(false)
        }
    };

    const handleEdit = (bank) => {
        setForm(bank);
    };

  const confirmDelete = async () => {
    if (!confirmDeleteId) return;

    try {
      await deleteBankDetails(confirmDeleteId);
      toast.success('Bank Details deleted successfully');
      resetForm();
      fetchBanks();
    } catch (error) {
      toast.error('Delete failed');
    } finally {
      setConfirmDeleteId(null);
    }
  };
    return (
        <div className="container-fluid mt-3">
            <div className='mb-2'>
                <Link className="text-decoration-none text-primary" to="/updateData"> <i className="pi pi-arrow-left"></i>  Back </Link>
            </div>
        
      {/* Confirmation Modal */}
      {confirmDeleteId && (
        <div className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50 d-flex justify-content-center align-items-center z-3">
          <div className="bg-white p-4 rounded shadow">
            <p className="mb-3">Are you sure you want to delete this block?</p>
            <div className="d-flex justify-content-end">
              <button className="btn btn-secondary btn-sm me-2" onClick={() => setConfirmDeleteId(null)}>
                Cancel
              </button>
              <button className="btn btn-danger btn-sm" onClick={confirmDelete}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

            <div className="row">
                <div className="col-lg-4 mb-3">
                    <div className="card">
                    <div className="card-header">
                            <h4 className='text-center'>Bank Master</h4>
                        </div>
                        <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>

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
                                <button onClick={handleSubmit} className="btn btn-primary btn-sm" disabled={loading}>
                                    {loading ? "Processing..." : form.id ? 'Update' : 'Create'}
                                </button>
                            </div>
                    </form>
                    </div>
                </div>
                <div className="col-lg-8 overflow-auto">
                    <table className="table table-sm table-bordered">
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
                                    <td className="d-flex justify-content-center">
                                        <button
                                            className="btn btn-sm btn-info me-1 rounded-circle"
                                            onClick={() => handleEdit(bank)}
                                        >
                                            <i className="pi pi-pen-to-square"> </i> 
                                        </button>
                                        <button
                                            className="btn btn-sm btn-danger rounded-circle"
                                            onClick={() => setConfirmDeleteId(bank.id)}
                                        >
                                            <i className="pi pi-trash"> </i> 
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