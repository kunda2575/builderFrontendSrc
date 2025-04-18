import {
  fetchData,
  putData,
  deleteData
} from './apiHandler';

import { postData } from './api';

const BASE_URL = 'http://localhost:2026/api/builders';

const headers = {
  'Content-Type': 'application/json',
  
};

export const getBuilders = () => fetchData(BASE_URL, headers);
export const createBuilder = (data) => postData(BASE_URL, data, headers);
export const updateBuilder = (id, data) => putData(`${BASE_URL}/${id}`, data, headers);
export const deleteBuilder = (id) => deleteData(`${BASE_URL}/${id}`, headers); // ✅ Correct usage