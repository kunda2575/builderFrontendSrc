import {
  fetchData,
  putData,
  deleteData
} from './apiHandler';

import { postData } from './api';

const BASE_URL = 'http://localhost:2026/api/customers';

const headers = {
  'Content-Type': 'application/json',
  // 'Authorization': `Bearer ${localStorage.getItem('usertoken')}`
};

export const getCustomerDetails = () => fetchData(BASE_URL, headers);
export const createCustomerDetails = (data) => postData(BASE_URL, data, headers);
export const updateCustomerDetails = (customerId, data) => putData(`${BASE_URL}/${customerId}`, data, headers);
export const deleteCustomerDetails = (customerId) => deleteData(`${BASE_URL}/${customerId}`, headers);
