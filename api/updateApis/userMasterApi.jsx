import {
  fetchData,
  putData,
  deleteData,
  postData
} from '../apiHandler';
import { config, host } from '../config';

const BASE_URL = `${host}/api/userMaster`;

// Get all users, with formatted project names
export const getUsers = async () => {
  try {
    const res = await fetch(config.getUsers);
    if (!res.ok) throw new Error(`Error: ${res.status}`);
    const json = await res.json();

    console.log("User fetched:", json);

    const users = Array.isArray(json.users) ? json.users : [];

    const formatted = users.map(user => ({
      ...user,
      projectName: user.projects?.map(p => p.projectName).join(', ') || 'N/A'
    }));

    return { data: formatted };
  } catch (error) {
    console.error('Failed to fetch users:', error);
    return { data: [], error: error.message };
  }
};


// Update user by ID
export const updateUser = (id, data) => putData(`${config.updateUsers}/${id}`, data);

// Get project details (used for populating project dropdowns etc)
export const getProjectDetails = () => fetchData(config.getProject);

// Create new user
export const createUser = (data) => postData(BASE_URL, data);

// Import multiple users
export const importUser = (data) => postData(config.importUsers,data);

// Delete user by ID
export const deleteUser = (id) => deleteData(`${config.deleteUser}/${id}`);

