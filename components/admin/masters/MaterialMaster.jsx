import React from 'react';
import ReusableTableForm from './ReusableTableForm';
import {
  getMaterialMasters,
  createMaterialMaster,
  updateMaterialMaster,
  deleteMaterialMaster
} from '../../../api/materialMasterApi'; // Your API functions

const fields = [
  { name: 'material_id', label: 'Material Id', type: 'number', required: true },
  { name: 'materialName', label: 'Material Name', type: 'text', required: true },


];


const MaterialMaster = () => {

  return (
    <div className="container-fluid">
      <ReusableTableForm
        title="Material Name"
        fields={fields}
        fetchData={getMaterialMasters}
        createData={createMaterialMaster}
        updateData={updateMaterialMaster}
        deleteData={deleteMaterialMaster}
      />
    </div>
  );
};

export default MaterialMaster;