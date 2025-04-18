import {
  fetchData,
  putData,
  deleteData
} from './apiHandler';

import { postData } from './api';

const BASE_URL = 'http://localhost:2026/api/customers';

export const getCustomerDetails = () => fetchData(BASE_URL);
export const createCustomerDetails = (data) => postData(BASE_URL, data);
export const updateCustomerDetails = (customerId, data) => putData(`${BASE_URL}/${customerId}`, data);
export const deleteCustomerDetails = (customerId) => deleteData(`${BASE_URL}/${customerId}`);
