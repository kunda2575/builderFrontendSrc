import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getBuilders, createBuilder, updateBuilder, deleteBuilder } from '../../../api/builderApi';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const BuilderMaster = () => {
  const [builders, setBuilders] = useState([]);
  const [form, setForm] = useState({ builderMaster: '', id: null });

  useEffect(() => {
    fetchBuilders();
  }, []);

  const fetchBuilders = async () => {
    try {
      const res = await getBuilders();
      setBuilders(res.data);
    } catch (error) {
      toast.error('Failed to fetch builders');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (form.id) {
        await updateBuilder(form.id, form);
        toast.success('Builder updated successfully');
      } else {
        await createBuilder(form);
        toast.success('Builder created successfully');
      }
      setForm({ builderMaster: '', id: null });
      fetchBuilders();
    } catch (error) {
      toast.error('Action failed');
    }
  };

  const handleEdit = (Builder) => {
    setForm(Builder);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure to delete this Builder?')) return;
    try {
      await deleteBuilder(id);
      toast.success('Builder deleted successfully');
      fetchBuilders();
    } catch (error) {
      toast.error('Delete failed');
    }
  };

  return (
    <div className="container-fluid mt-3">
      <div className='mb-2 '>
        <Link className="text-decoration-none text-primary" to="/updateData"> <i className="pi pi-arrow-left"></i>  Back </Link>
      </div>
      <div className="row">
        <div className="col-lg-5 mb-3">
          <div className="card">
            <div className="card-header">
              <h4 className='text-center'>Builder Master</h4>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="card-body">


                <input
                  type="text"
                  placeholder="Builder Name"
                  value={form.builderMaster}
                  onChange={(e) => setForm({ ...form, builderMaster: e.target.value })}
                  className="form-control mb-2"
                  required
                />
                
              </div>
              <div className="text-center card-footer">
                <button type="submit" className="btn btn-primary btn-sm">
                  {form.id ? 'Update' : 'Create'}
                </button>
              </div>
            </form>

          </div>
        </div>

        <div className="col-lg-7 overflow-auto">
          <table className="table table-sm table-bordered text-center">
            <thead className="table-dark">
              <tr>
                <th>Builder Name</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {builders.map((Builder) => (
                <tr key={Builder.id}>
                  <td>{Builder.builderMaster}</td>
                  <td className='d-flex justify-content-center'>
                    <button
                      className="btn btn-sm btn-info me-1 rounded-circle"
                      onClick={() => handleEdit(Builder)}
                    >
                      <i className="pi pi-pen-to-square ">  </i>
                    </button>
                    <button
                      className="btn btn-sm btn-danger rounded-circle"
                      onClick={() => handleDelete(Builder.id)}
                    >
                      <i className="pi pi-trash">  </i>
                    </button>
                  </td>
                </tr>
              ))}
              {builders.length === 0 && (
                <tr>
                  <td colSpan="2" className="text-center">No builders found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default BuilderMaster;