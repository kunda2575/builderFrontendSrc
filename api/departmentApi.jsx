import {
  fetchData,
  putData,
  deleteData,
  postData
} from './apiHandler';

import {host} from './config'

const BASE_URL =` ${host}/api/departments`;

export const getDepartmentsDetails = () => fetchData(BASE_URL);
export const createDepartmentDetails = (data) => postData(BASE_URL, data);
export const updateDepartmentDetails  = (departmentID, data) => putData(`${BASE_URL}/${departmentID}`, data);
export const deleteDepartmentDetails = (departmentID) => deleteData(`${BASE_URL}/${departmentID}`); // ✅ Correct usage
