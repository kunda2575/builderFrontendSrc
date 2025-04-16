import {
  fetchData,
  putData,
  deleteData
} from './apiHandler';

import { postData } from './api';

const BASE_URL = 'http://localhost:2026/api/employees';

const headers = {
  'Content-Type': 'application/json',
  // 'Authorization': `Bearer ${localStorage.getItem('usertoken')}`
};

export const getEmployeeDetails = () => fetchData(BASE_URL, headers);
export const createEmployeeDetails = (data) => postData(BASE_URL, data, headers);
export const updateEmployeeDetails = (employeeID, data) => putData(`${BASE_URL}/${employeeID}`, data, headers);
export const deleteEmployeeDetails = (employeeID) => deleteData(`${BASE_URL}/${employeeID}`, headers); // ✅ Correct usage
