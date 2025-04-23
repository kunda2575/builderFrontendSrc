import React from 'react';
import ReusableTableForm from './ReusableTableForm';
import {
  getBlockDetails,
  createBlockDetails,
  updateBlockDetails,
  deleteBlockDetails
} from '../../../api/blocksApi'; // Your API functions

const fields = [
  { name: 'blockNO', label: 'Block Number', type: 'number', required: true },
    { name: 'blockName', label: 'Block Name', type: 'text', required: true },
  
];


const BlockMaster = () => {
 
  return (
    <ReusableTableForm
        title="Block"
        fields={fields}
        fetchData={getBlockDetails}
        createData={createBlockDetails}
        updateData={updateBlockDetails}
        deleteData={deleteBlockDetails}
    />
);
};

export default BlockMaster;