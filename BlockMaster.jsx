import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getBlocks, createBlock, updateBlock, deleteBlock } from '../../../api/blocksApi';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const BlockMaster = () => {
  const [blocks, setBlocks] = useState([]);
  const [form, setForm] = useState({ blockNO: '', blockName: '', id: null });
  const [loading, setLoading] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

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

  const resetForm = () => {
    setForm({ blockNO: '', blockName: '', id: null });
  };

  const handleSubmit = async () => {
    if (!form.blockNO || !form.blockName.trim()) {
      toast.error('Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      if (form.id) {
        await updateBlock(form.id, form );
        toast.success('Block updated successfully');
      } else {
        await createBlock(form);
        toast.success('Block created successfully');
      }

      resetForm();
      fetchBlocks();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Action failed');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (block) => {
    setForm(block);
  };

  const confirmDelete = async () => {
    if (!confirmDeleteId) return;

    try {
      await deleteBlock(confirmDeleteId);
      toast.success('Block deleted successfully');
      resetForm();
      fetchBlocks();
    } catch (error) {
      toast.error('Delete failed');
    } finally {
      setConfirmDeleteId(null);
    }
  };

  return (
    <div className="container-fluid mt-3">
      <div className="mb-2">
        <Link className="text-decoration-none text-primary" to="/updateData">
          <i className="pi pi-arrow-left"></i> Back
        </Link>
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
              <h4 className="text-center">Block Master</h4>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
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
          <table className="table table-sm table-bordered text-center">
            <thead className="table-dark">
              <tr>
                <th>Block No</th>
                <th>Block Name</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {blocks.map((block) => (
                <tr key={block.id}>
                  <td>{block.blockNO}</td>
                  <td>{block.blockName}</td>
                  <td className="d-flex justify-content-center">
                    <button
                      className="btn btn-sm btn-info me-1 rounded-circle"
                      onClick={() => handleEdit(block)}
                    >
                      <i className="pi pi-pen-to-square" />
                    </button>
                    <button
                      className="btn btn-sm btn-danger rounded-circle"
                      onClick={() => setConfirmDeleteId(block.id)}
                    >
                      <i className="pi pi-trash" />
                    </button>
                  </td>
                </tr>
              ))}
              {blocks.length === 0 && (
                <tr>
                  <td colSpan="3" className="text-center">
                    No blocks found
                  </td>
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
