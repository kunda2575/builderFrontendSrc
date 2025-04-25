import React from 'react';
import ReusableTableForm from './ReusableTableForm';
import {
  getFundSources,
  createFundSource,
  updateFundSource,
  deleteFundSource
} from '../../../api/fundSourceApi'; // Your API functions

const fields = [
  { name: 'fundSource', label: 'Fund Source', type: 'text', required: true },

];


const FundSource = () => {

  return (
    <div className="container-fluid">
      <ReusableTableForm
        title="Fund Source"
        fields={fields}
        fetchData={getFundSources}
        createData={createFundSource}
        updateData={updateFundSource}
        deleteData={deleteFundSource}
      />
    </div>
  );
};

export default FundSource;