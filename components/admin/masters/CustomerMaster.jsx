import { useEffect, useState } from 'react';
import {
  getCustomerDetails,
  createCustomerDetails,
  updateCustomerDetails,
  deleteCustomerDetails,
  getLeadDetails
} from '../../../api/updateApis/customerApi';

import ReusableTableForm from './ReusableTableForm';

const CustomerMaster = () => {
  const [customerList, setCustomerList] = useState([]);

  const fetchCustomer = async () => {
    try {
      const res = await getLeadDetails();
      if (res?.data && Array.isArray(res.data)) {
        const formatted = res.data.map(c => ({
          label: c.contact_name,
          value: c.contact_name,
          phone: c.contact_phone,
          email: c.contact_email,
          language: c.native_language,
          address: c.address,
          profession: c.customer_profession
        }));
        setCustomerList(formatted);
      } else {
        console.log("No customer found or invalid data format.");
        setCustomerList([]);
      }
    } catch (error) {
      console.error("Error fetching CUSTOMER:", error);
    }
  };

  useEffect(() => {
    fetchCustomer();
  }, []);

  const fields = [
    {
      name: 'customerName',
      label: 'Customer Name',
      type: 'select',
      required: false,
      options: customerList,
      onChange: (selectedValue, selectedObj, setForm) => {
        const languages = selectedObj?.language
          ? selectedObj.language.split(',').map(l => l.trim())
          : [];

        setForm(prev => ({
          ...prev,
          customerName: selectedValue,
      
          customerPhone: selectedObj?.phone || '',
          customerEmail: selectedObj?.email || '',
          customerAddress: selectedObj?.address || '',
          customerProfession: selectedObj?.profession || '',
          languagesKnown: languages
        }));
      }
    },

    { name: 'customerPhone', label: 'Mobile', type: 'number', required: true },
    { name: 'customerEmail', label: 'Email', type: 'email', required: true },
    { name: 'customerProfession', label: 'Profession', type: 'text', required: true },

    {
      name: 'languagesKnown',
      label: 'Languages Known',
      type: 'select',
      multiple: true,
      required: true,
      options: [
        { label: 'Telugu', value: 'Telugu' },
        { label: 'Hindi', value: 'Hindi' },
        { label: 'English', value: 'English' }
      ]
    },

    { name: 'blockNo', label: 'Block No', type: 'number', required: true },
    { name: 'flatNo', label: 'Flat No', type: 'number', required: true },

    {
      name: 'customerAddress',
      label: 'Address',
      type: 'textarea',
      required: true
    },

// {
//   name: 'documentType',
//   label: 'Document Type',
//   type: 'select',
//   required: true,
//   options: [
//     { label: 'Aadhaar', value: 'aadhaar' },
//     { label: 'PAN', value: 'pan' },
//     { label: 'Voter ID', value: 'voterId' }
//   ],
//   onChange: (value, _, setForm) => {
//     setForm(prev => ({
//       ...prev,
//       documentType: value
//     }));
//   }
// },

{
  name: 'documents',
  label: 'Upload Document',
  type: 'file',
  required: false,
  showInTable: false
}

  ];

  return (
    <div className="container-fluid">
      <ReusableTableForm
        title="Customer"
        fields={fields}
        fetchData={getCustomerDetails}
        createData={createCustomerDetails}
        updateData={updateCustomerDetails}
        deleteData={deleteCustomerDetails}
        fcolumnClass="col-lg-12 mb-3"
        tcolumnClass="col-lg-12 mb-3"
        ccolumnClass="col-lg-4 mb-3"
             dcolumnClass="col-lg-12 mb-3"
      />
    </div>
  );
};

export default CustomerMaster;
