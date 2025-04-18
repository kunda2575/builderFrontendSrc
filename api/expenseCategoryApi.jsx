import {
  fetchData,
  putData,
  deleteData
} from './apiHandler';

import { postData } from './api';

const BASE_URL = 'http://localhost:2026/api/expenseCategorys';

export const getExpenseCategorys = () => fetchData(BASE_URL);
export const createExpenseCategory = (data) => postData(BASE_URL, data);
export const updateExpenseCategory = (id, data) => putData(`${BASE_URL}/${id}`, data);
export const deleteExpenseCategory = (id) => deleteData(`${BASE_URL}/${id}`); // ✅ Correct usage
