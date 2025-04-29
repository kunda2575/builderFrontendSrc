import {
  fetchData,
  putData,
  deleteData,
  postData
} from '../apiHandler';

import {host} from '../config'

const BASE_URL =` ${host}/api/departments`;

export const getDepartmentsDetails = () => fetchData(BASE_URL);
export const createDepartmentDetails = (data) => postData(BASE_URL, data);
export const updateDepartmentDetails  = (id, data) => putData(`${BASE_URL}/${id}`, data);
export const deleteDepartmentDetails = (id) => deleteData(`${BASE_URL}/${id}`); // ✅ Correct usage
