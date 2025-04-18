import {
  fetchData,
  putData,
  deleteData
} from './apiHandler';

import { postData } from './api';

const BASE_URL = 'http://localhost:2026/api/departments';

export const getDepartmentsDetails = () => fetchData(BASE_URL);
export const createDepartmentDetails = (data) => postData(BASE_URL, data);
export const updateDepartmentDetails  = (departmentID, data) => putData(`${BASE_URL}/${departmentID}`, data);
export const deleteDepartmentDetails = (departmentID) => deleteData(`${BASE_URL}/${departmentID}`); // ✅ Correct usage
