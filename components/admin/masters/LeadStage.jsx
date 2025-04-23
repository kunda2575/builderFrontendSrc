import React from 'react';
import ReusableTableForm from './ReusableTableForm';
import {
    getLeadStages,
    createLeadStage,
  updateLeadStage,
  deleteLeadStage
} from '../../../api/leadStageApi'; // Your API functions

const fields = [
  { name: 'leadStage', label: 'Lead Stage', type: 'text', required: true },

  
];


const LeadStage = () => {
 
  return (
    <ReusableTableForm
        title="Lead Stage"
        fields={fields}
        fetchData={getLeadStages}
        createData={createLeadStage}
        updateData={updateLeadStage}
        deleteData={deleteLeadStage}
    />
);
};

export default LeadStage;