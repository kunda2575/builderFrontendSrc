import {
  fetchData,
  putData,
  deleteData
} from './apiHandler';

import { postData } from './api';

const BASE_URL = 'http://localhost:2026/api/leadSources';

export const getLeadSources = () => fetchData(BASE_URL);
export const createLeadSource = (data) => postData(BASE_URL, data);
export const updateLeadSource = (id, data) => putData(`${BASE_URL}/${id}`, data);
export const deleteLeadSource = (id) => deleteData(`${BASE_URL}/${id}`); // ✅ Correct usage
