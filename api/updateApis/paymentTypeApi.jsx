import {
  fetchData,
  putData,
  deleteData,
  postData
} from '../apiHandler';
import {host} from '../config'

const BASE_URL =` ${host}/api/paymentType`;


export const getpaymentTypes = () => fetchData(BASE_URL);
export const createpaymentType = (data) => postData(BASE_URL, data);
export const updatepaymentType = (id, data) => putData(`${BASE_URL}/${id}`, data);
export const deletepaymentType = (id) => deleteData(`${BASE_URL}/${id}`); // ✅ Correct usage
