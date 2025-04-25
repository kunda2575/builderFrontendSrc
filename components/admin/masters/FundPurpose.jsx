import React from 'react';
import ReusableTableForm from './ReusableTableForm';
import {
  getFundPurposes,
  createFundPurpose,
  updateFundPurpose,
  deleteFundPurpose
} from '../../../api/fundPurposeApi'; // Your API functions

const fields = [
  { name: 'fundPurpose', label: 'Fund Purpose', type: 'text', required: true },

];


const FundPurpose = () => {

  return (
    <div className="container-fluid">
      <ReusableTableForm
        title="Fund Pourpose"
        fields={fields}
        fetchData={getFundPurposes}
        createData={createFundPurpose}
        updateData={updateFundPurpose}
        deleteData={deleteFundPurpose}
      />
    </div>
  );
};

export default FundPurpose;