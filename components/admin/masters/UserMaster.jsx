import React, { useEffect, useState } from 'react';
import ReusableTableForm from './ReusableTableForm';
import {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  getProjectDetails
} from '../../../api/updateApis/userMasterApi';

const UserMaster = () => {
  const [projectOptions, setProjectOptions] = useState([]);

  const fetchProjects = async () => {
    try {
      const res = await getProjectDetails();  // <-- Call the function here
      if (res?.data && Array.isArray(res.data)) {
        const formatted = res.data.map(project => ({
          label: project.projectName,  // Make sure this matches your API response
          value: project.projectName
        }));
        setProjectOptions(formatted);
      } else {
        console.log('No projects found or invalid data format.');
        setProjectOptions([]);
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const fields = [
    { name: 'userName', label: 'User Name', type: 'text', required: true },
    { name: 'password', label: 'Password', type: 'password', required: true },
    { name: 'role', label: 'Role', type: 'text', required: true },
    { name: 'phone', label: 'Phone', type: 'number', required: true },
    { name: 'email', label: 'Email', type: 'email', required: true },
    {
      name: 'projectName',
      label: 'Project',
      type: 'select',
      required: true,
      options: projectOptions
    }
  ];

  return (
    <div className="container-fluid">
      <ReusableTableForm
        title="User"
        fields={fields}
        fetchData={getUsers}
        createData={createUser}
        updateData={updateUser}
        deleteData={deleteUser}
      />
    </div>
  );
};

export default UserMaster;
