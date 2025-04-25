import React from 'react';
import ReusableTableForm from './ReusableTableForm';
import {
  getLostReasons,
  createLostReason,
  updateLostReason,
  deleteLostReason
} from '../../../api/lostReasonsApi'; // Your API functions

const fields = [
  { name: 'lostReason', label: 'Lost Reason', type: 'text', required: true },


];


const LostReason = () => {

  return (
    <div className="container-fluid">
      <ReusableTableForm
        title="Lost Reason"
        fields={fields}
        fetchData={getLostReasons}
        createData={createLostReason}
        updateData={updateLostReason}
        deleteData={deleteLostReason}
      />
    </div>
  );
};

export default LostReason;