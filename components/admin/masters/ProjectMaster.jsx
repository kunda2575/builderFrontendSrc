import React from 'react';
import ReusableTableForm from './ReusableTableForm';
import {
  getProjects,
  createProject,
  updateProject,
  deleteProject
} from '../../../api/projectMaterialApi'; // Your API functions

const fields = [
  { name: 'projectName', label: 'Project Name', type: 'text', required: true },
  { name: 'projectOwner', label: 'Project Owner', type: 'text', required: true },
  { name: 'projectContact', label: 'Contact', type: 'text', required: true },
  { name: 'projectAddress', label: 'Address', type: 'text', required: true },
  { name: 'projectBrouchers', label: 'Brouchers', type: 'text', required: true },
  { name: 'projectStartDate', label: 'StartDate', type: 'date', required: true },
  { name: 'projectEndDate', label: 'EndDate', type: 'date', required: true },


];


const ProjectMaster = () => {

  return (
    <div className="container-fluid">
      <ReusableTableForm
        title="Projects"
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