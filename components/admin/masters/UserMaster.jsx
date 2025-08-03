import React, { useState, useEffect } from 'react';
import ReusableTableForm from './ReusableTableForm';
import {
  getUsers,
  updateUser,
  deleteUser,
  importUser
} from '../../../api/updateApis/userMasterApi';

import Signup from '../../auth/signup/signup';

const UserMaster = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [userData, setUserData] = useState([]);

  // ✅ Refresh users from API
  const fetchUserData = async () => {
    try {
      const res = await getUsers();
      setUserData(res.data);
    } catch (err) {
      console.error("Error fetching users", err);
    }
  };

  useEffect(() => {
    fetchUserData(); // Load data on mount
  }, []);

  const fields = [
    { name: 'fullname', label: 'Full Name' },
    { name: 'username', label: 'Username' },
    { name: 'mobilenumber', label: 'Mobile Number' },
    { name: 'email', label: 'Email' },
    { name: 'password', label: 'Password' },
    { name: 'profile', label: 'Profile Image' },
    { name: 'projectName', label: 'Project Name' }
  ];

  return (
    <div className="container-fluid">
      <Signup
        userToEdit={selectedUser}
        setUserToEdit={setSelectedUser}
        onCancelEdit={() => setSelectedUser(null)}
        updateData={fetchUserData} // ✅ passed here
      />

      <ReusableTableForm
        title="Users"
        backend="users"
        fields={fields}
        fetchData={getUsers}
        updateData={updateUser}
        deleteData={deleteUser}
        createData={() => {}}
        importData={importUser}
        onEditUser={setSelectedUser}
        tableData={userData}         // ✅ pass the current data
        tcolumnClass=" mb-2 col-lg-12 "
      />
    </div>
  );
};

export default UserMaster;
