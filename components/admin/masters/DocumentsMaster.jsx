import React from 'react';
// import ReusableForm_Table from './ReusableForm_Table';
import {
 getDocuments,
createDocument,
updateDocument,
deleteDocument
} from '../../../api/updateApis/documentsApi'; // Your API functions
import ReusableTableForm from './ReusableTableForm';

const fields = [
 
  { name: 'documentsUpload', label: ' Documents Upload', type: 'file', required: true },
  
 
];


const DocumentsMaster = () => {

  return (
    <div className="container-fluid">
      <ReusableTableForm
        title="Documents"
        fields={fields}
        fetchData={getDocuments}
        createData={createDocument}
        updateData={updateDocument}
        deleteData={deleteDocument}
      />
    </div>
  );
};

export default DocumentsMaster;