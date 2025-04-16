import {
  fetchData,
  putData,
  deleteData
} from './apiHandler';

import { postData } from './api';

const BASE_URL = 'http://localhost:2026/api/departments';

const headers = {
  'Content-Type': 'application/json',
  // 'Authorization': `Bearer ${localStorage.getItem('usertoken')}`
};

export const getDepartmentsDetails = () => fetchData(BASE_URL, headers);
export const createDepartmentDetails = (data) => postData(BASE_URL, data, headers);
export const updateDepartmentDetails  = (departmentID, data) => putData(`${BASE_URL}/${departmentID}`, data, headers);
export const deleteDepartmentDetails = (departmentID) => deleteData(`${BASE_URL}/${departmentID}`, headers); // ✅ Correct usage
