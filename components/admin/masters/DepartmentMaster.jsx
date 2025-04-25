import React from 'react';
import ReusableTableForm from './ReusableTableForm';
import {
  getDepartmentsDetails,
  createDepartmentDetails,
  updateDepartmentDetails,
  deleteDepartmentDetails
} from '../../../api/departmentApi'; // Your API functions

const fields = [
  { name: 'departmentID', label: 'Department Id', type: 'number', required: true },
  { name: 'departmentName', label: 'Department Name', type: 'text', required: true }

];


const DepartmentMaster = () => {

  return (
    <div className="container-fluid">
      <ReusableTableForm
        title="Department"
        fields={fields}
        fetchData={getDepartmentsDetails}
        createData={createDepartmentDetails}
        updateData={updateDepartmentDetails}
        deleteData={deleteDepartmentDetails}
      />
    </div>
  );
};

export default DepartmentMaster;