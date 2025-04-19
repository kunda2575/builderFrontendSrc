import {
  fetchData,
  putData,
  deleteData,
  postData
} from './apiHandler';


import {host} from './config'

const BASE_URL =` ${host}/api/customers`;

export const getCustomerDetails = () => fetchData(BASE_URL);
export const createCustomerDetails = (data) => postData(BASE_URL, data);
export const updateCustomerDetails = (customerId, data) => putData(`${BASE_URL}/${customerId}`, data);
export const deleteCustomerDetails = (customerId) => deleteData(`${BASE_URL}/${customerId}`);
