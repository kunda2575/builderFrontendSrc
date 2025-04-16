import {
  fetchData,
  putData,
  deleteData
} from './apiHandler';

import { postData } from './api';

const BASE_URL = 'http://localhost:2026/api/expenseCategorys';

const headers = {
  'Content-Type': 'application/json',
  // 'Authorization': `Bearer ${localStorage.getItem('usertoken')}`
};

export const getExpenseCategorys = () => fetchData(BASE_URL, headers);
export const createExpenseCategory = (data) => postData(BASE_URL, data, headers);
export const updateExpenseCategory = (id, data) => putData(`${BASE_URL}/${id}`, data, headers);
export const deleteExpenseCategory = (id) => deleteData(`${BASE_URL}/${id}`, headers); // ✅ Correct usage
