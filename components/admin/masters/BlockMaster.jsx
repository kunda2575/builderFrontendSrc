import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getBlocks, createBlock, updateBlock, deleteBlock } from '../../../api/blocksApi';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const BlockMaster = () => {
  const [blocks, setBlocks] = useState([]);
  const [form, setForm] = useState({ blockNO: '', blockName: '', id: null });

  useEffect(() => {
    fetchBlocks();
  }, []);

  const fetchBlocks = async () => {
    try {
      const res = await getBlocks();
      setBlocks(res.data);
    } catch (error) {
      toast.error('Failed to fetch blocks');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (form.id) {
        await updateBlock(form.id, form);
        toast.success('Block updated successfully');
      } else {
        await createBlock(form);
        toast.success('Block created successfully');
      }
      setForm({ blockNO: '', blockName: '', id: null });
      fetchBlocks();
    } catch (error) {
      toast.error('Action failed');
    }
  };

  const handleEdit = (block) => {
    setForm(block);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure to delete this block?')) return;
    try {
      await deleteBlock(id);
      toast.success('Block deleted successfully');
      fetchBlocks();
    } catch (error) {
      toast.error('Delete failed');
    }
  };

  return (
    <div className="container mt-4">
      <div className='mb-2'>
        <Link className="text-decoration-none text-primary" to="/updateData"> <i className="pi pi-arrow-left"></i>  Back </Link>
      </div>

      <div className="row mb-4">
        <div className="col-lg-4">
          <div className="card">
            <div className="card-header">
              <h4 className='text-center'>Block Master</h4>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="card-body">
                <input
                  type="number"
                  placeholder="Block No"
                  value={form.blockNO}
                  onChange={(e) => setForm({ ...form, blockNO: e.target.value })}
                  className="form-control mb-2"
                  required
                />
                <input
                  type="text"
                  placeholder="Block Name"
                  value={form.blockName}
                  onChange={(e) => setForm({ ...form, blockName: e.target.value })}
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
        <div className="col-lg-8">
          <table className="table table-bordered text-center" >
            <thead className="table-dark">
              <tr>
                <th>ID</th>
                <th>Block No</th>
                <th>Block Name</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {blocks.map((block) => (
                <tr key={block.id}>
                  <td>{block.id}</td>
                  <td>{block.blockNO}</td>
                  <td>{block.blockName}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-info me-2"
                      onClick={() => handleEdit(block)}
                    >
                    <i className="pi pi-pen-to-square me-1"> </i> Edit
                    </button>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => handleDelete(block.id)}
                    >
                     <i className="pi pi-trash me-1"> </i> Delete
                    </button>
                  </td>
                </tr>
              ))}
              {blocks.length === 0 && (
                <tr>
                  <td colSpan="4" className="text-center">No blocks found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default BlockMaster;