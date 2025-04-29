import React from 'react';
import ReusableForm_Table from './ReusableForm_Table';
import {
  getProjects,
  createProject,
  updateProject,
  deleteProject
} from '../../../api/updateApis/projectMaterialApi'; // Your API functions

const fields = [
  
  { name: 'projectName', label: 'Project Name', type: 'text', required: true },
  { name: 'projectOwner', label: 'Project Owner', type: 'text', required: true },
  { name: 'projectContact', label: 'Contact', type: 'text', required: true },
  { name: 'projectStartDate', label: 'Start Date', type: 'date', required: true },
  { name: 'projectEndDate', label: 'End Date', type: 'date', required: true },
  {
    name: 'projectAddress',
    label: 'Address',
    type: 'textarea',
    required: true
  },
  { name: 'projectBrouchers', label: 'Brouchers', type: 'text', required: true },
  

];


const ProjectMaster = () => {

  return (
    <div className="container-fluid">
      <ReusableForm_Table
        title="Project"
        fields={fields}
        fetchData={getProjects}
        createData={createProject}
        updateData={updateProject}
        deleteData={deleteProject}
      />
    </div>
  );
};

export default ProjectMaster;