import {
  fetchData,
  putData,
  deleteData,
  postData
} from '../apiHandler';
import {host} from '../config'

const BASE_URL =` ${host}/api/paymentModes`;


export const getpaymentModes = () => fetchData(BASE_URL);
export const createpaymentMode = (data) => postData(BASE_URL, data);
export const updatepaymentMode = (id, data) => putData(`${BASE_URL}/${id}`, data);
export const deletepaymentMode = (id) => deleteData(`${BASE_URL}/${id}`); // ✅ Correct usage
