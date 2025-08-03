import React from 'react';
// import ReusableForm_Table from './ReusableForm_Table';
import {
  getDocuments,
  createDocument,
  updateDocument,
  deleteDocument,
  importDocument
} from '../../../api/updateApis/documentsApi'; // Your API functions
import ReusableTableForm from './ReusableTableForm';

const fields = [

  { name: 'documentsUpload', label: ' Documents Upload', type: 'file', required: true, showInTable: false },


];


const DocumentsMaster = () => {

  return (
    <div className="container-fluid">
      <ReusableTableForm
        title="Documents"
        backend="documents"
        fields={fields}
        fetchData={getDocuments}
        createData={createDocument}
        updateData={updateDocument}
        deleteData={deleteDocument}
        importData={importDocument}
        fcolumnClass="mb-2 col-lg-7 m-auto"
        tcolumnClass="mb-2 col-lg-9 m-auto"

      />
    </div>
  );
};

export default DocumentsMaster;