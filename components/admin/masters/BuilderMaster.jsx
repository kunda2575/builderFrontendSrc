import React from 'react';
import ReusableTableForm from './ReusableTableForm';
import {
  getBuilders,
  createBuilder,
  updateBuilder,
  deleteBuilder
} from '../../../api/builderApi'; // Your API functions

const fields = [
  { name: 'builderMaster', label: 'Builder Name', type: 'text', required: true },

];

const BuilderMaster = () => {

  return (
    <div className="container-fluid">
      <ReusableTableForm
        title="Builder"
        fields={fields}
        fetchData={getBuilders}
        createData={createBuilder}
        updateData={updateBuilder}
        deleteData={deleteBuilder}
      />
    </div>
  );
};

export default BuilderMaster;