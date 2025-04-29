import {
  fetchData,
  putData,
  deleteData,
  postData
} from '../apiHandler';


import {host} from '../config'

const BASE_URL =` ${host}/api/expenseCategorys`;


export const getExpenseCategorys = () => fetchData(BASE_URL);
export const createExpenseCategory = (data) => postData(BASE_URL, data);
export const updateExpenseCategory = (id, data) => putData(`${BASE_URL}/${id}`, data);
export const deleteExpenseCategory = (id) => deleteData(`${BASE_URL}/${id}`); // ✅ Correct usage
