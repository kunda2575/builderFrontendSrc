import React from 'react';
import ReusableTableForm from './ReusableTableForm';
import {
  getBlockDetails,
  createBlockDetails,
  updateBlockDetails,
  deleteBlockDetails,
  importBlockDetails
} from '../../../api/updateApis/blocksApi'; // Your API functions

const fields = [
  { name: 'blockNoOrName', label: 'Block No/Name', type: 'text', required: true },
  
];


const BlockMaster = () => {

  return (
    <div className="container-fluid">
      <ReusableTableForm
        title="Block"
         backend="block"
        fields={fields}
        fetchData={getBlockDetails}
        createData={createBlockDetails}
        updateData={updateBlockDetails}
        deleteData={deleteBlockDetails}
         importData={importBlockDetails}
      />
    </div>
  );
};

export default BlockMaster;