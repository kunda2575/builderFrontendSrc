import {
  fetchData,
  putData,
  deleteData
} from './apiHandler';

import { postData } from './api';

const BASE_URL = 'http://localhost:2026/api/fundPurposes';


export const getFundPurposes = () => fetchData(BASE_URL);
export const createFundPurpose = (data) => postData(BASE_URL, data);
export const updateFundPurpose = (id, data) => putData(`${BASE_URL}/${id}`, data);
export const deleteFundPurpose = (id) => deleteData(`${BASE_URL}/${id}`); // ✅ Correct usage
