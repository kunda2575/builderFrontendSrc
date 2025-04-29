import {
  fetchData,
  putData,
  deleteData,
  postData
} from '../apiHandler';
import {host} from '../config'

const BASE_URL =` ${host}/api/leadSources`;


export const getLeadSources = () => fetchData(BASE_URL);
export const createLeadSource = (data) => postData(BASE_URL, data);
export const updateLeadSource = (id, data) => putData(`${BASE_URL}/${id}`, data);
export const deleteLeadSource = (id) => deleteData(`${BASE_URL}/${id}`); // ✅ Correct usage
