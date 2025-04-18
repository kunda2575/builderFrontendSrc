import {
  fetchData,
  putData,
  deleteData
} from './apiHandler';

import { postData } from './api';

const BASE_URL = 'http://localhost:2026/api/fundSources';


export const getFundSources = () => fetchData(BASE_URL);
export const createFundSource = (data) => postData(BASE_URL, data);
export const updateFundSource = (id, data) => putData(`${BASE_URL}/${id}`, data);
export const deleteFundSource = (id) => deleteData(`${BASE_URL}/${id}`); // ✅ Correct usage
