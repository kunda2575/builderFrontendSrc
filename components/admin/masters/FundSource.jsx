import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getFundSources, createFundSource, updateFundSource, deleteFundSource } from '../../../api/fundSourceApi';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const FundSource = () => {
  const [fundSources, setFundSources] = useState([]);
  const [form, setForm] = useState({ fundSource: '', id: null });

  useEffect(() => {
    fetchFundSources();
  }, []);

  const fetchFundSources = async () => {
    try {
      const res = await getFundSources();
      setFundSources(res.data);
    } catch (error) {
      toast.error('Failed to fetch Fund Sources');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (form.id) {
        await updateFundSource(form.id, form);
        toast.success('Fund Source updated successfully');
      } else {
        await createFundSource(form);
        toast.success('Fund Source created successfully');
      }
      setForm({  fundSource: '', id: null });
      fetchFundSources();
    } catch (error) {
      toast.error('Action failed');
    }
  };

  const handleEdit = (fundSource) => {
    setForm(fundSource);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure to delete this fund Source?')) return;
    try {
      await deleteFundSource(id);
      toast.success('Fund Source deleted successfully');
      fetchFundSources();
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
              <h4 className='text-center'>Fund Source Master</h4>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="card-body">
               
                <input
                  type="text"
                  placeholder="Fund Source"
                  value={form.fundSource}
                  onChange={(e) => setForm({ ...form, fundSource: e.target.value })}
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
                <th>Fund Source Name</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {fundSources.map((fundSource) => (
                <tr key={fundSource.id}>
                  <td>{fundSource.fundSource}</td>
                  <td className="d-flex justify-content-center">
                    <button
                      className="btn btn-sm btn-info me-1"
                      onClick={() => handleEdit(fundSource)}
                    >
                    <i className="pi pi-pen-to-square">  Edit </i>
                    </button>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => handleDelete(fundSource.id)}
                    >
                     <i className="pi pi-trash"> Delete </i> 
                    </button>
                  </td>
                </tr>
              ))}
              {fundSources.length === 0 && (
                <tr>
                  <td colSpan="4" className="text-center">No Fund Sources found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default FundSource;