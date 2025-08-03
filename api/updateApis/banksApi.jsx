import {
  fetchData,
  putData,
  deleteData,
  postData
} from '../apiHandler';

import {host} from '../config'

const BASE_URL =` ${host}/api/banks`;


export const getBankDetails = () => fetchData(BASE_URL);
export const createBankDetails = (data) => postData(BASE_URL, data);
export const importBankDetails = (data) => postData(`${BASE_URL}/import`, data);
export const updateBankDetails = (id, data) => putData(`${BASE_URL}/${id}`, data);
export const deleteBankDetails = (id) => deleteData(`${BASE_URL}/${id}`); // ✅ Correct usage
