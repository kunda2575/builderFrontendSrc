import React from 'react';
import ReusableTableForm from './ReusableTableForm';
import {
  getVendors,
  createVendor,
  updateVendor,
  deleteVendor
} from '../../../api/vendorsApi'; // Your API functions

const fields = [
  { name: 'vendorId', label: 'Vendor Id', type: 'number', required: true },
  { name: 'vendorName', label: 'Vendor Name', type: 'text', required: true },
  { name: 'services', label: 'Services', type: 'text', required: true },
  { name: 'phone', label: 'Phone Number', type: 'number', required: true },
  { name: 'address', label: 'Address', type: 'text', required: true },
  { name: 'city', label: 'City', type: 'text', required: true },



];


const VendorMaster = () => {

  return (
    <div className="container-fluid">
      <ReusableTableForm
        title="Vendor"
        fields={fields}
        fetchData={getVendors}
        createData={createVendor}
        updateData={updateVendor}
        deleteData={deleteVendor}
      />
    </div>
  );
};

export default VendorMaster;