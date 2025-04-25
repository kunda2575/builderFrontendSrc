import React from 'react';
import ReusableTableForm from './ReusableTableForm';
import {
    getUsers,
    createUser,
    updateUser,
    deleteUser
} from '../../../api/userMasterApi'; // Your API functions

const fields = [
    { name: 'userName', label: 'User Name', type: 'text', required: true },
    { name: 'password', label: 'Password', type: 'password', required: true },
    { name: 'role', label: 'Role', type: 'text', required: true },
    { name: 'phone', label: 'Phone', type: 'number', required: true },
    { name: 'email', label: 'Email', type: 'email', required: true },




];


const UserMaster = () => {

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