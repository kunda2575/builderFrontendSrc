import {
  fetchData,
  putData,
  deleteData,
  postData
} from './apiHandler';
import {host} from './config'

const BASE_URL =` ${host}/api/unitTypes`;


export const getUnitTypes = () => fetchData(BASE_URL);
export const createUnitType = (data) => postData(BASE_URL, data);
export const updateUnitType = (id, data) => putData(`${BASE_URL}/${id}`, data);
export const deleteUnitType = (id) => deleteData(`${BASE_URL}/${id}`); // ✅ Correct usage
