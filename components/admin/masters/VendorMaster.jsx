import React from 'react';
import ReusableTableForm from './ReusableTableForm';
import {
  getVendors,
  createVendor,
  updateVendor,
  deleteVendor,
  importVendor
} from '../../../api/updateApis/vendorsApi'; // Your API functions

const fields = [
  { name: 'vendorId', label: 'Vendor Id', type: 'number', required: true },
  { name: 'vendorName', label: 'Vendor Name', type: 'text', required: true },
  { name: 'services', label: 'Services', type: 'text', required: true },
  { name: 'phone', label: 'Phone Number', type: 'number', required: true },
  { name: 'city', label: 'City', type: 'text', required: true },
  // { name: 'address', label: 'Address', type: 'text', required: true },

  {
    name: 'address',
    label: 'Address',
    type: 'textarea',
    required: true
  },

];


const VendorMaster = () => {

  return (
    <div className="container-fluid">
      <ReusableTableForm
        title="Vendor"
        fields={fields}
          backend="vendors"
        fetchData={getVendors}
        createData={createVendor}
        updateData={updateVendor}
        deleteData={deleteVendor}
         importData={importVendor}
      />
    </div>
  );
};

export default VendorMaster;