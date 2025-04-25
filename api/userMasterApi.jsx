import {
  fetchData,
  putData,
  deleteData,
  postData
} from './apiHandler';
import {host} from './config'

const BASE_URL =` ${host}/api/userMaster`;


export const getUsers = () => fetchData(BASE_URL);
export const createUser = (data) => postData(BASE_URL, data);
export const updateUser = (id, data) => putData(`${BASE_URL}/${id}`, data);
export const deleteUser = (id) => deleteData(`${BASE_URL}/${id}`); // ✅ Correct usage
