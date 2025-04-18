import {
  fetchData,
  putData,
  deleteData
} from './apiHandler';

import { postData } from './api';

const BASE_URL = 'http://localhost:2026/api/blocks';

export const getBlocks = () => fetchData(BASE_URL );
export const createBlock = (data) => postData(BASE_URL, data );
export const updateBlock = (id, data) => putData(`${BASE_URL}/${id}`, data );
export const deleteBlock = (id) => deleteData(`${BASE_URL}/${id}` ); // ✅ Correct usage
