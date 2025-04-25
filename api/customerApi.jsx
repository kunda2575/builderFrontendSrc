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
export const updateCustomerDetails = (id, data) => putData(`${BASE_URL}/${id}`, data);
export const deleteCustomerDetails = (id) => deleteData(`${BASE_URL}/${id}`);
