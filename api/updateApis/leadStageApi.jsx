import {
  fetchData,
  putData,
  deleteData,
  postData
} from '../apiHandler';
import {host} from '../config'

const BASE_URL =`${host}/api/leadStages`;


export const getLeadStages = () => fetchData(BASE_URL);
export const createLeadStage = (data) => postData(BASE_URL, data);
export const updateLeadStage = (id, data) => putData(`${BASE_URL}/${id}`, data);
export const deleteLeadStage = (id) => deleteData(`${BASE_URL}/${id}`); // ✅ Correct usage
