import {
  fetchData,
  putData,
  deleteData,
  postData
} from '../apiHandler';

import {host} from '../config'

const BASE_URL =` ${host}/api/fundSources`;


export const getFundSources = () => fetchData(BASE_URL);
export const createFundSource = (data) => postData(BASE_URL, data);
export const updateFundSource = (id, data) => putData(`${BASE_URL}/${id}`, data);
export const deleteFundSource = (id) => deleteData(`${BASE_URL}/${id}`); // ✅ Correct usage
