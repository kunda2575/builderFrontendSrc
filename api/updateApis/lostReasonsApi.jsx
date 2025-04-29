import {
  fetchData,
  putData,
  deleteData,
  postData
} from '../apiHandler';
import {host} from '../config'

const BASE_URL =` ${host}/api/lostReasons`;


export const getLostReasons = () => fetchData(BASE_URL);
export const createLostReason = (data) => postData(BASE_URL, data);
export const updateLostReason = (id, data) => putData(`${BASE_URL}/${id}`, data);
export const deleteLostReason = (id) => deleteData(`${BASE_URL}/${id}`); // ✅ Correct usage
