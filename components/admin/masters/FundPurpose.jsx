import React from 'react';
import ReusableTableForm from './ReusableTableForm';
import {
  getFundPurposes,
  createFundPurpose,
  updateFundPurpose,
  deleteFundPurpose,
  importFundPurpose
} from '../../../api/updateApis/fundPurposeApi'; // Your API functions

const fields = [
  { name: 'fundPurpose', label: 'Fund Purpose', type: 'text', required: true },

];


const FundPurpose = () => {

  return (
    <div className="container-fluid">
      <ReusableTableForm
        title="Fund Pourpose"
           backend="purposes"
        fields={fields}
        fetchData={getFundPurposes}
        createData={createFundPurpose}
        updateData={updateFundPurpose}
        deleteData={deleteFundPurpose}
         importData={importFundPurpose}
      />
    </div>
  );
};

export default FundPurpose;