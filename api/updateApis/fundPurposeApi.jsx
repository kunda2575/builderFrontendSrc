import {
  fetchData,
  putData,
  deleteData,
  postData
} from '../apiHandler';


import {host} from '../config'

const BASE_URL =` ${host}/api/fundPurposes`;

export const getFundPurposes = () => fetchData(BASE_URL);
export const createFundPurpose = (data) => postData(BASE_URL, data);
export const updateFundPurpose = (id, data) => putData(`${BASE_URL}/${id}`, data);
export const deleteFundPurpose = (id) => deleteData(`${BASE_URL}/${id}`); // ✅ Correct usage
