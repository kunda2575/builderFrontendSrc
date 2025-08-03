import React from 'react';
import ReusableTableForm from './ReusableTableForm';
import {
  getUnitTypes,
  createUnitType,
  updateUnitType,
  deleteUnitType,
  importUnitType
} from '../../../api/updateApis/unitTypeApi'; // Your API functions

const fields = [
  { name: 'unit', label: 'Unit Name', type: 'text', required: true },



];


const UnitTypeMaster = () => {

  return (
    <div className="container-fluid">
      <ReusableTableForm
        title="Unit"
             backend="unittypes"
        fields={fields}
        fetchData={getUnitTypes}
        createData={createUnitType}
        updateData={updateUnitType}
        deleteData={deleteUnitType}
         importData={importUnitType}
      />
    </div>
  );
};

export default UnitTypeMaster;