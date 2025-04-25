import React from 'react';
import ReusableTableForm from './ReusableTableForm';
import {
  getUnitTypes,
  createUnitType,
  updateUnitType,
  deleteUnitType
} from '../../../api/unitTypeApi'; // Your API functions

const fields = [
  { name: 'unit', label: 'Unit Name', type: 'text', required: true },



];


const UnitTypeMaster = () => {

  return (
    <div className="container-fluid">
      <ReusableTableForm
        title="Unit"
        fields={fields}
        fetchData={getUnitTypes}
        createData={createUnitType}
        updateData={updateUnitType}
        deleteData={deleteUnitType}
      />
    </div>
  );
};

export default UnitTypeMaster;