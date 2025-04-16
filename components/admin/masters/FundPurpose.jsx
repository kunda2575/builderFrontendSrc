import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getFundPurposes, createFundPurpose, updateFundPurpose, deleteFundPurpose } from '../../../api/fundPurposeApi';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const FundPurpose = () => {
  const [fundPurposes, setFundPurposes] = useState([]);
  const [form, setForm] = useState({ fundPurpose: '', id: null });

  useEffect(() => {
    fetchFundPurposes();
  }, []);

  const fetchFundPurposes = async () => {
    try {
      const res = await getFundPurposes();
      setFundPurposes(res.data);
    } catch (error) {
      toast.error('Failed to fetch Fund Purposes');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (form.id) {
        await updateFundPurpose(form.id, form);
        toast.success('Fund Purpose updated successfully');
      } else {
        await createFundPurpose(form);
        toast.success('Fund Purpose created successfully');
      }
      setForm({  fundPurpose: '', id: null });
      fetchFundPurposes();
    } catch (error) {
      toast.error('Action failed');
    }
  };

  const handleEdit = (fundPurpose) => {
    setForm(fundPurpose);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure to delete this fund Purpose?')) return;
    try {
      await deleteFundPurpose(id);
      toast.success('Fund Purpose deleted successfully');
      fetchFundPurposes();
    } catch (error) {
      toast.error('Delete failed');
    }
  };

  return (
    <div className="container mt-3">
      <div className='mb-2'>
        <Link className="text-decoration-none text-primary" to="/updateData"> <i className="pi pi-arrow-left"></i>  Back </Link>
      </div>

      <div className="row">
        <div className="col-lg-4 mb-3">
          <div className="card">
            <div className="card-header">
              <h4 className='text-center'>Fund Purpose Master</h4>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="card-body">
               
                <input
                  type="text"
                  placeholder="Fund Purpose"
                  value={form.fundPurpose}
                  onChange={(e) => setForm({ ...form, fundPurpose: e.target.value })}
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
        <div className="col-lg-8 overflow-auto">
          <table className="table table-sm table-bordered text-center" >
            <thead className="table-dark">
              <tr>
                <th>Fund Purpose Name</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {fundPurposes.map((fundPurpose) => (
                <tr key={fundPurpose.id}>
                  <td>{fundPurpose.fundPurpose}</td>
                  <td className="d-flex justify-content-center">
                    <button
                      className="btn btn-sm btn-info me-1"
                      onClick={() => handleEdit(fundPurpose)}
                    >
                    <i className="pi pi-pen-to-square">  Edit </i>
                    </button>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => handleDelete(fundPurpose.id)}
                    >
                     <i className="pi pi-trash"> Delete </i> 
                    </button>
                  </td>
                </tr>
              ))}
              {fundPurposes.length === 0 && (
                <tr>
                  <td colSpan="4" className="text-center">No Fund Purposes found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default FundPurpose;