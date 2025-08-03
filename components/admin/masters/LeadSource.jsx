import React from 'react';
import ReusableTableForm from './ReusableTableForm';
import {
  getLeadSources,
  createLeadSource,
  updateLeadSource,
  deleteLeadSource,
  importLeadSource
} from '../../../api/updateApis/leadSourceApi'; // Your API functions

const fields = [
  { name: 'leadSource', label: 'Lead Source', type: 'text', required: true },

];


const LeadSource = () => {

  return (
    <div className="container-fluid">
      <ReusableTableForm
        title="Lead Source"
         backend="sources"
        fields={fields}
        fetchData={getLeadSources}
        createData={createLeadSource}
        updateData={updateLeadSource}
        deleteData={deleteLeadSource}
         importData={importLeadSource}
      />
    </div>
  );
};

export default LeadSource;