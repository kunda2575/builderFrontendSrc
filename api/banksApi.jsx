import {
  fetchData,
  putData,
  deleteData,
  postData
} from './apiHandler';

// import { postData } from './api';

const BASE_URL = 'http://localhost:2026/api/banks';


export const getBankDetails = () => fetchData(BASE_URL);
export const createBankDetails = (data) => postData(BASE_URL, data);
export const updateBankDetails = (id, data) => putData(`${BASE_URL}/${id}`, data);
export const deleteBankDetails = (id) => deleteData(`${BASE_URL}/${id}`); // ✅ Correct usage
