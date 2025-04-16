import {
  fetchData,
  putData,
  deleteData
} from './apiHandler';

import { postData } from './api';

const BASE_URL = 'http://localhost:2026/api/blocks';

const headers = {
  'Content-Type': 'application/json',
  // 'Authorization': `Bearer ${localStorage.getItem('usertoken')}`
};

export const getBlocks = () => fetchData(BASE_URL, headers);
export const createBlock = (data) => postData(BASE_URL, data, headers);
export const updateBlock = (id, data) => putData(`${BASE_URL}/${id}`, data, headers);
export const deleteBlock = (id) => deleteData(`${BASE_URL}/${id}`, headers); // ✅ Correct usage
