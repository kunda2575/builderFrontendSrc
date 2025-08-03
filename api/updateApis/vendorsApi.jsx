import {
  fetchData,
  putData,
  deleteData,
  postData
} from '../apiHandler';
import {host} from '../config'

const BASE_URL =` ${host}/api/vendors`;


export const getVendors = () => fetchData(BASE_URL);
export const createVendor = (data) => postData(BASE_URL, data);
export const importVendor = (data) => postData(`${BASE_URL}/import`, data);
export const updateVendor = (id, data) => putData(`${BASE_URL}/${id}`, data);
export const deleteVendor = (id) => deleteData(`${BASE_URL}/${id}`); // ✅ Correct usage
