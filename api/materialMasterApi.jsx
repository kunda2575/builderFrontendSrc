import {
  fetchData,
  putData,
  deleteData,
  postData
} from './apiHandler';
import {host} from './config'

const BASE_URL =` ${host}/api/materialMaster`;


export const getMaterialMasters = () => fetchData(BASE_URL);
export const createMaterialMaster = (data) => postData(BASE_URL, data);
export const updateMaterialMaster = (id, data) => putData(`${BASE_URL}/${id}`, data);
export const deleteMaterialMaster = (id) => deleteData(`${BASE_URL}/${id}`); // ✅ Correct usage
