import {
  fetchData,
  putData,
  deleteData
} from './apiHandler';

import { postData } from './api';

const BASE_URL = 'http://localhost:2026/api/builders';


export const getBuilders = () => fetchData(BASE_URL);
export const createBuilder = (data) => postData(BASE_URL, data);
export const updateBuilder = (id, data) => putData(`${BASE_URL}/${id}`, data);
export const deleteBuilder = (id) => deleteData(`${BASE_URL}/${id}`); // ✅ Correct usage