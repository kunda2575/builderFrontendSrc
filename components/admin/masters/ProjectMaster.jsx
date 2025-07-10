import React from 'react';
import {
  getProjects,
  createProject,
  updateProject,
  deleteProject
} from '../../../api/updateApis/projectMaterialApi'; // Your API functions
import ReusableTableForm from './ReusableTableForm';

const fields = [
  { name: 'projectName', label: 'Project Name', type: 'text', required: true },
  { name: 'projectOwner', label: 'Project Owner', type: 'text', required: true },
  { name: 'projectContact', label: 'Contact', type: 'text', required: true },
  { name: 'expectedStartDate', label: 'Expected Start Date', type: 'date', required: true },
  { name: 'expectedEndDate', label: 'Expected End Date', type: 'date', required: true },
  {
    name: 'projectAddress',
    label: 'Address',
    type: 'textarea',
    required: true
  },
  { name: 'projectBrouchers', label: 'Brouchers', type: 'file', required: true,showInTable: false },
  

];


const ProjectMaster = () => {

  return (
    <div className="container-fluid">
      <ReusableTableForm
        title="Project"
        fields={fields}
        fetchData={getProjects}
        createData={createProject}
        updateData={updateProject}
        deleteData={deleteProject}
         fcolumnClass="mb-2 col-lg-12"
        tcolumnClass=" mb-2 col-lg-12"
        ccolumnClass="mb-2 col-lg-4"
      />
    </div>
  );
};

export default ProjectMaster;