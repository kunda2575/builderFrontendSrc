import {
  fetchData,
  putData,
  deleteData
} from './apiHandler';

import { postData } from './api';

const BASE_URL = 'http://localhost:2026/api/fundSources';

const headers = {
  'Content-Type': 'application/json',
  
};

export const getFundSources = () => fetchData(BASE_URL, headers);
export const createFundSource = (data) => postData(BASE_URL, data, headers);
export const updateFundSource = (id, data) => putData(`${BASE_URL}/${id}`, data, headers);
export const deleteFundSource = (id) => deleteData(`${BASE_URL}/${id}`, headers); // ✅ Correct usage
