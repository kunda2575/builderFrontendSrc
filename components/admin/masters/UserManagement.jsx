// src/pages/UserManagement.jsx

import ReusableTableForm from '../components/ReusableTableForm';
import {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  importUser,
  getProjectDetails,
} from '../api/userService';

const UserManagement = () => {
  const fields = [
    { name: 'fullname', label: 'Full Name', type: 'text' },
    { name: 'email', label: 'Email', type: 'text' },
    { name: 'mobilenumber', label: 'Mobile Number', type: 'text' },
    {
      name: 'profile',
      label: 'Profile',
      type: 'select',
      options: ['user', 'Admin', 'Super Admin']
    },
    {
      name: 'project',
      label: 'Project',
      type: 'select',
      multiple: true,
      optionsSource: 'api',
      fetchOptions: getProjectDetails,
      optionLabel: 'projectName',
      optionValue: 'id'
    },
    {
      name: 'password',
      label: 'Password',
      type: 'password',
      onlyForCreate: true
    },
  ];

  return (
    <ReusableTableForm
      title="User"
      backend="user"
      fetchData={getUsers}
      createData={createUser}
      updateData={updateUser}
      deleteData={deleteUser}
      importData={importUser}
      fields={fields}
    />
  );
};

export default UserManagement;
