import React from 'react';
import ReusableTableForm from './ReusableTableForm';
import {
  getLeadSources,
  createLeadSource,
  updateLeadSource,
  deleteLeadSource
} from '../../../api/leadSourceApi'; // Your API functions

const fields = [
  { name: 'leadSource', label: 'Lead Source', type: 'text', required: true },

];


const LeadSource = () => {

  return (
    <div className="container-fluid">
      <ReusableTableForm
        title="Lead Source"
        fields={fields}
        fetchData={getLeadSources}
        createData={createLeadSource}
        updateData={updateLeadSource}
        deleteData={deleteLeadSource}
      />
    </div>
  );
};

export default LeadSource;