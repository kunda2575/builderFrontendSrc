import {
  fetchData,
  putData,
  deleteData
} from './apiHandler';

import { postData } from './api';

const BASE_URL = 'http://localhost:2026/api/employees';


export const getEmployeeDetails = () => fetchData(BASE_URL);
export const createEmployeeDetails = (data) => postData(BASE_URL, data);
export const updateEmployeeDetails = (employeeID, data) => putData(`${BASE_URL}/${employeeID}`, data);
export const deleteEmployeeDetails = (employeeID) => deleteData(`${BASE_URL}/${employeeID}`); // ✅ Correct usage
