import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getExpenseCategorys, createExpenseCategory, updateExpenseCategory, deleteExpenseCategory } from '../../../api/expenseCategoryApi';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ExpenseCategoryMaster = () => {
  const [expenseCategorys, setExpenseCategorys] = useState([]);
  const [form, setForm] = useState({ expenseCategory: '', expenseHead: '', id: null });

  useEffect(() => {
    fetchExpenseCategorys();
  }, []);

  const fetchExpenseCategorys = async () => {
    try {
      const res = await getExpenseCategorys();
      setExpenseCategorys(res.data);
    } catch (error) {
      toast.error('Failed to fetch expenseCategorys');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (form.id) {
        await updateExpenseCategory(form.id, form);
        toast.success('ExpenseCategory updated successfully');
      } else {
        await createExpenseCategory(form);
        toast.success('ExpenseCategory created successfully');
      }
      setForm({ expenseCategory: '', expenseHead: '', id: null });
      fetchExpenseCategorys();
    } catch (error) {
      toast.error('Action failed');
    }
  };

  const handleEdit = (expenseCategory) => {
    setForm(expenseCategory);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure to delete this expenseCategory?')) return;
    try {
      await deleteExpenseCategory(id);
      toast.success('ExpenseCategory deleted successfully');
      fetchExpenseCategorys();
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
              <h4 className='text-center'>ExpenseCategory Master</h4>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="card-body">
                <input
                  type="text"
                  placeholder="Expense Category "
                  value={form.expenseCategory}
                  onChange={(e) => setForm({ ...form, expenseCategory: e.target.value })}
                  className="form-control mb-2"
                  required
                />
                <input
                  type="text"
                  placeholder="Expense Category Head"
                  value={form.expenseHead}
                  onChange={(e) => setForm({ ...form, expenseHead: e.target.value })}
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
                <th>Expense Category </th>
                <th>Expense Category Head</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {expenseCategorys.map((expenseCategory) => (
                <tr key={expenseCategory.id}>
                  <td>{expenseCategory.expenseCategory}</td>
                  <td>{expenseCategory.expenseHead}</td>
                  <td className="d-flex justify-content-center">
                    <button
                      className="btn btn-sm btn-info me-1 rounded-circle"
                      onClick={() => handleEdit(expenseCategory)}
                    >
                    <i className="pi pi-pen-to-square">   </i>
                    </button>
                    <button
                      className="btn btn-sm btn-danger rounded-circle"
                      onClick={() => handleDelete(expenseCategory.id)}
                    >
                     <i className="pi pi-trash">  </i> 
                    </button>
                  </td>
                </tr>
              ))}
              {expenseCategorys.length === 0 && (
                <tr>
                  <td colSpan="4" className="text-center">No Expense Categorys found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ExpenseCategoryMaster;