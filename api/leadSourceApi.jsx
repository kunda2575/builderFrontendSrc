import {
  fetchData,
  putData,
  deleteData
} from './apiHandler';

import { postData } from './api';

const BASE_URL = 'http://localhost:2026/api/leadSources';

const headers = {
  'Content-Type': 'application/json',
  
};

export const getLeadSources = () => fetchData(BASE_URL, headers);
export const createLeadSource = (data) => postData(BASE_URL, data, headers);
export const updateLeadSource = (id, data) => putData(`${BASE_URL}/${id}`, data, headers);
export const deleteLeadSource = (id) => deleteData(`${BASE_URL}/${id}`, headers); // ✅ Correct usage
