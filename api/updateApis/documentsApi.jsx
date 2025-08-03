import {
  fetchData,
  putData,
  deleteData,
  postData
} from '../apiHandler1';
import {host} from '../config'

const BASE_URL =`${host}/api/documents`;

export const getDocuments = () => fetchData(BASE_URL);
export const createDocument = (data) => postData(BASE_URL, data);
export const importDocument = (data) => postData(`${BASE_URL}/import`, data);
export const updateDocument = (id, data) => putData(`${BASE_URL}/${id}`, data);
export const deleteDocument = (id) => deleteData(`${BASE_URL}/${id}`); // ✅ Correct usage
