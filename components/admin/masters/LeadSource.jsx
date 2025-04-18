import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getLeadSources, createLeadSource, updateLeadSource, deleteLeadSource } from '../../../api/leadSourceApi';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const LeadSource = () => {
  const [leadSources, setLeadSources] = useState([]);
  const [form, setForm] = useState({ leadSource: '', id: null });

  useEffect(() => {
    fetchLeadSources();
  }, []);

  const fetchLeadSources = async () => {
    try {
      const res = await getLeadSources();
      setLeadSources(res.data);
    } catch (error) {
      toast.error('Failed to fetch Lead Sources');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (form.id) {
        await updateLeadSource(form.id, form);
        toast.success('Lead Source updated successfully');
      } else {
        await createLeadSource(form);
        toast.success('Lead Source created successfully');
      }
      setForm({  leadSource: '', id: null });
      fetchLeadSources();
    } catch (error) {
      toast.error('Action failed');
    }
  };

  const handleEdit = (leadSource) => {
    setForm(leadSource);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure to delete this lead Source?')) return;
    try {
      await deleteLeadSource(id);
      toast.success('Lead Source deleted successfully');
      fetchLeadSources();
    } catch (error) {
      toast.error('Delete failed');
    }
  };

  return (
    <div className="container-fluid mt-3">
      <div className='mb-2'>
        <Link className="text-decoration-none text-primary" to="/updateData"> <i className="pi pi-arrow-left"></i>  Back </Link>
      </div>

      <div className="row">
        <div className="col-lg-4 mb-3">
          <div className="card">
            <div className="card-header">
              <h4 className='text-center'>Lead Source Master</h4>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="card-body">
               
                <input
                  type="text"
                  placeholder="Lead Source"
                  value={form.leadSource}
                  onChange={(e) => setForm({ ...form, leadSource: e.target.value })}
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
                <th>Lead Source Name</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {leadSources.map((leadSource) => (
                <tr key={leadSource.id}>
                  <td>{leadSource.leadSource}</td>
                  <td className="d-flex justify-content-center">
                    <button
                      className="btn btn-sm btn-info me-1 rounded-circle"
                      onClick={() => handleEdit(leadSource)}
                    >
                    <i className="pi pi-pen-to-square">   </i>
                    </button>
                    <button
                      className="btn btn-sm btn-danger rounded-circle"
                      onClick={() => handleDelete(leadSource.id)}
                    >
                     <i className="pi pi-trash">  </i> 
                    </button>
                  </td>
                </tr>
              ))}
              {leadSources.length === 0 && (
                <tr>
                  <td colSpan="4" className="text-center">No Lead Sources found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default LeadSource;