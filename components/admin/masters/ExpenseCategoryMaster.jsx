import React from 'react';
import ReusableTableForm from './ReusableTableForm';
import {
  getExpenseCategorys,
  createExpenseCategory,
  updateExpenseCategory,
  deleteExpenseCategory
} from '../../../api/updateApis/expenseCategoryApi'; // Your API functions

const fields = [
  { name: 'expenseCategory', label: 'Expense Category', type: 'text', required: true },
  { name: 'expenseHead', label: 'Expense Head', type: 'text', required: true }

];


const ExpenseCategoryMaster = () => {

  return (
    <div className="container-fluid">
      <ReusableTableForm
        title="Expense Category"
        fields={fields}
        fetchData={getExpenseCategorys}
        createData={createExpenseCategory}
        updateData={updateExpenseCategory}
        deleteData={deleteExpenseCategory}
      />
    </div>
  );
};

export default ExpenseCategoryMaster;