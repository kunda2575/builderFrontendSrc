import React from 'react';
import ReusableForm_Table from './ReusableForm_Table';
import {
  getEmployeeDetails,
  createEmployeeDetails,
  updateEmployeeDetails,
  deleteEmployeeDetails
} from '../../../api/updateApis/employeeApi'; // Your API functions

const fields = [
  { name: 'employeeID', label: 'Employee Id', type: 'number', required: true },
  { name: 'employeeName', label: 'Employee Name', type: 'text', required: true },
  { name: 'employeePhone', label: 'Mobile', type: 'number', required: true },
  { name: 'employeeEmail', label: 'Email', type: 'email', required: true },
  { name: 'idType', label: 'Id type', type: 'text', required: true },
  { name: 'idProof1', label: 'Id Proof 1', type: 'text', required: true },
  { name: 'employeeSalary', label: 'Employee Salary', type: 'number', required: true },
  { name: 'department', label: 'Department', type: 'text', required: true },
  {
    name: 'customerAddress',
    label: 'Address',
    type: 'textarea',
    required: true
  },
];


const EmployeeMaster = () => {

  return (
    <div className="container-fluid">
      <ReusableForm_Table
        title="Employee"
        fields={fields}
        fetchData={getEmployeeDetails}
        createData={createEmployeeDetails}
        updateData={updateEmployeeDetails}
        deleteData={deleteEmployeeDetails}
      />
    </div>
  );
};

export default EmployeeMaster;