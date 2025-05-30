import React from 'react';
import ReusableTableForm from './ReusableTableForm';
import {
  getLeadStages,
  createLeadStage,
  updateLeadStage,
  deleteLeadStage
} from '../../../api/updateApis/leadStageApi'; // Your API functions

const fields = [
  { name: 'leadStage', label: 'Lead Stage', type: 'text', required: true },


];


const LeadStage = () => {

  return (
    <div className="container-fluid">
      <ReusableTableForm
        title="Lead Stage"
        fields={fields}
        fetchData={getLeadStages}
        createData={createLeadStage}
        updateData={updateLeadStage}
        deleteData={deleteLeadStage}
      />
    </div>
  );
};

export default LeadStage;