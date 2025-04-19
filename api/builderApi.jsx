import {
  fetchData,
  putData,
  deleteData,
  postData
} from './apiHandler';


import {host} from './config'

const BASE_URL =` ${host}/api/builders`;
export const getBuilders = () => fetchData(BASE_URL);
export const createBuilder = (data) => postData(BASE_URL, data);
export const updateBuilder = (id, data) => putData(`${BASE_URL}/${id}`, data);
export const deleteBuilder = (id) => deleteData(`${BASE_URL}/${id}`); // ✅ Correct usage