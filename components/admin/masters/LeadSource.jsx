import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getLeadSources, createLeadSource, updateLeadSource, deleteLeadSource } from '../../../api/leadSourceApi';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const LeadSource = () => {
  const [leadSources, setLeadSources] = useState([]);
  const [form, setForm] = useState({ leadSource: '', id: null });
 const [loading, setLoading] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

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
const resetForm = ()=>{
  setForm({  leadSource: '', id: null });
}
  const handleSubmit = async (e) => {
    e.preventDefault();
    if(!form.leadSource) {
          toast.error('Please fill in all fields');
          return;
        }
    
        setLoading(true);
    try {
      if (form.id) {
        await updateLeadSource(form.id, form);
        toast.success('Lead Source updated successfully');
      } else {
        await createLeadSource(form);
        toast.success('Lead Source created successfully');
      }
   resetForm()
      fetchLeadSources();
    }catch (error) {
          toast.error(error.response?.data?.error || 'Action failed');
        } finally {
          setLoading(false);
        }
  };

  const handleEdit = (leadSource) => {
    setForm(leadSource);
  };
const confirmDelete = async () => {
    if (!confirmDeleteId) return;

    try {
      await deleteLeadSource(confirmDeleteId);
      toast.success('Lead Source deleted successfully');
      resetForm();
      fetchLeadSources();
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
                <button
                  className="btn btn-primary btn-sm"
                  type="submit"
                  disabled={loading}
                >
                  {loading ? 'Processing...' : form.id ? 'Update' : 'Create'}
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
                      onClick={() => setConfirmDeleteId(leadSource.id)}
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