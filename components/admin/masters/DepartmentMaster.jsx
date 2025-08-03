import React from 'react';
import ReusableTableForm from './ReusableTableForm';
import {
  getDepartmentsDetails,
  createDepartmentDetails,
  updateDepartmentDetails,
  deleteDepartmentDetails,
  importDepartmentDetails
} from '../../../api/updateApis/departmentApi'; // Your API functions

const fields = [
  { name: 'departmentMaster', label: 'Department Master', type: 'text', required: true },
  { name: 'departmentID', label: 'Department Id', type: 'number', required: true },

];


const DepartmentMaster = () => {

  return (
    <div className="container-fluid">
      <ReusableTableForm
        title="Department"
         backend="department"
        fields={fields}
        fetchData={getDepartmentsDetails}
        createData={createDepartmentDetails}
        updateData={updateDepartmentDetails}
        deleteData={deleteDepartmentDetails}
         importData={importDepartmentDetails}
      />
    </div>
  );
};

export default DepartmentMaster;