import {
  fetchData,
  putData,
  deleteData
} from './apiHandler';

import { postData } from './api';

const BASE_URL = 'http://localhost:2026/api/fundPurposes';

const headers = {
  'Content-Type': 'application/json',
  
};

export const getFundPurposes = () => fetchData(BASE_URL, headers);
export const createFundPurpose = (data) => postData(BASE_URL, data, headers);
export const updateFundPurpose = (id, data) => putData(`${BASE_URL}/${id}`, data, headers);
export const deleteFundPurpose = (id) => deleteData(`${BASE_URL}/${id}`, headers); // ✅ Correct usage
