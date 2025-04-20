import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { createDepartmentDetails, getDepartmentsDetails, updateDepartmentDetails, deleteDepartmentDetails } from '../../../api/departmentApi';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const DepartmentMaster = () => {
  const [departments, setDepartments] = useState([]);
  const [form, setForm] = useState({ departmentName: '', departmentID: null });

  const [loading, setLoading] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  
  useEffect(() => {
    fetchDepartments();
  }, []);
const resetForm = ()=>{
  setForm({ departmentName: '', departmentID: null });

}
  const fetchDepartments = async () => {
    try {
      const res = await getDepartmentsDetails();
      setDepartments(res.data);
    } catch (error) {
      toast.error('Failed to fetch departments');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
if( !form.departmentName){
    toast.error('Please fill in all fields');
    return;
}
setLoading()
    try {
      if (form.departmentID) {
        await updateDepartmentDetails(form.departmentID, form);
        toast.success('Department updated successfully');
      } else {
        await createDepartmentDetails(form);
        toast.success('Department created successfully');
      }
      resetForm()
      fetchDepartments();
    } catch (error) {
          toast.error(error.response?.data?.error || 'Action failed');
        } finally {
          setLoading(false);
        }
  };

  const handleEdit = (department) => {
    setForm(department);
  };


  const confirmDelete = async () => {
    if (!confirmDeleteId) return;

    try {
      await deleteDepartmentDetails(confirmDeleteId);
      toast.success('Department Details deleted successfully');
      resetForm();
      fetchDepartments();
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
        <div className="col-lg-4">
          <div className="card">
            <div className="card-header">
              <h4 className='text-center'>Department Master</h4>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="card-body">
                <input
                  type="text"
                  placeholder="Department Name"
                  value={form.departmentName}
                  onChange={(e) => setForm({ ...form, departmentName: e.target.value })}
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
                <th>Department Name</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {departments.map((department) => (
                <tr key={department.departmentID}>
                  <td>{department.departmentName}</td>
                  <td className='d-flex justify-content-center'>
                    <button
                      className="btn btn-sm btn-info me-1 rounded-circle"
                      onClick={() => handleEdit(department)}
                    >
                    <i className="pi pi-pen-to-square">  </i> 
                    </button>
                    <button
                      className="btn btn-sm btn-danger rounded-circle"
                      onClick={() => setConfirmDeleteId(department.departmentID)}
                    >
                     <i className="pi pi-trash ">  </i> 
                    </button>
                  </td>
                </tr>
              ))}
              {departments.length === 0 && (
                <tr>
                  <td colSpan="2" className="text-center">No departments found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DepartmentMaster;