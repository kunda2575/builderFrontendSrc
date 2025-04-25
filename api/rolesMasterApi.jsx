import {
  fetchData,
  putData,
  deleteData,
  postData
} from './apiHandler';
import {host} from './config'

const BASE_URL =` ${host}/api/roles`;


export const getRoles = () => fetchData(BASE_URL);
export const createRole = (data) => postData(BASE_URL, data);
export const updateRole = (id, data) => putData(`${BASE_URL}/${id}`, data);
export const deleteRole = (id) => deleteData(`${BASE_URL}/${id}`); // ✅ Correct usage
