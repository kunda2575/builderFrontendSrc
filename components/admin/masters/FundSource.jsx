import React from 'react';
import ReusableTableForm from './ReusableTableForm';
import {
  getFundSources,
  createFundSource,
  updateFundSource,
  deleteFundSource,
  importFundSource
} from '../../../api/updateApis/fundSourceApi'; // Your API functions

const fields = [
  { name: 'fundSource', label: 'Fund Source', type: 'text', required: true },

];


const FundSource = () => {

  return (
    <div className="container-fluid">
      <ReusableTableForm
        title="Fund Source"
           backend="source"
        fields={fields}
        fetchData={getFundSources}
        createData={createFundSource}
        updateData={updateFundSource}
        deleteData={deleteFundSource}
         importData={importFundSource}
      />
    </div>
  );
};

export default FundSource;