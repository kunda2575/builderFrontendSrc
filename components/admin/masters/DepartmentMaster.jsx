import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { createDepartmentDetails, getDepartmentsDetails, updateDepartmentDetails, deleteDepartmentDetails } from '../../../api/departmentApi';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const DepartmentMaster = () => {
  const [departments, setDepartments] = useState([]);
  const [form, setForm] = useState({ departmentName: '', departmentID: null });

  useEffect(() => {
    fetchDepartments();
  }, []);

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
    try {
      if (form.departmentID) {
        await updateDepartmentDetails(form.departmentID, form);
        toast.success('Department updated successfully');
      } else {
        await createDepartmentDetails(form);
        toast.success('Department created successfully');
      }
      setForm({ departmentName: '', departmentID: null });
      fetchDepartments();
    } catch (error) {
      toast.error('Action failed');
    }
  };

  const handleEdit = (department) => {
    setForm(department);
  };

  const handleDelete = async (departmentID) => {
    if (!window.confirm('Are you sure to delete this department?')) return;
    try {
      await deleteDepartmentDetails(departmentID);
      toast.success('Department deleted successfully');
      fetchDepartments();
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
                <button type="submit" className="btn btn-primary btn-sm">
                  {form.departmentID ? 'Update' : 'Create'}
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
                      onClick={() => handleDelete(department.departmentID)}
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