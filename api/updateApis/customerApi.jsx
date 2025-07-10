import {
  fetchData,
  putData,
  deleteData,
  postData
} from '../apiHandler1';

import { host } from '../config';

const BASE_URL = `${host}/api/customers`;

export const getCustomerDetails = () => fetchData(BASE_URL);

export const getLeadDetails = () => fetchData(`${BASE_URL}/lead`);

export const getCustomerById = (customerId) =>
  fetchData(`${BASE_URL}/${customerId}`);

export const createCustomerDetails = (data) => postData(BASE_URL, data);
export const updateCustomerDetails = (customerId, data) => putData(`${BASE_URL}/${customerId}`, data);
export const deleteCustomerDetails = (customerId) => deleteData(`${BASE_URL}/${customerId}`);
