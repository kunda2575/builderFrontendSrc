import React from 'react';
import ReusableTableForm from './ReusableTableForm';
import {
  getRoles,
  createRole,
  updateRole,
  deleteRole
} from '../../../api/updateApis/rolesMasterApi'; // Your API functions

const fields = [
  { name: 'rolesName', label: 'Role Name', type: 'text', required: true },


];


const RoleMaster = () => {

  return (
    <div className="container-fluid">
      <ReusableTableForm
        title="Role"
        fields={fields}
        fetchData={getRoles}
        createData={createRole}
        updateData={updateRole}
        deleteData={deleteRole}
      />
    </div>
  );
};

export default RoleMaster;