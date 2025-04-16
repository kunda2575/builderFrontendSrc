import {
  fetchData,
  putData,
  deleteData
} from './apiHandler';

import { postData } from './api';

const BASE_URL = 'http://localhost:2026/api/banks';

const headers = {
  'Content-Type': 'application/json',
  // 'Authorization': `Bearer ${localStorage.getItem('usertoken')}`
};

export const getBankDetails = () => fetchData(BASE_URL, headers);
export const createBankDetails = (data) => postData(BASE_URL, data, headers);
export const updateBankDetails = (id, data) => putData(`${BASE_URL}/${id}`, data, headers);
export const deleteBankDetails = (id) => deleteData(`${BASE_URL}/${id}`, headers); // ✅ Correct usage
