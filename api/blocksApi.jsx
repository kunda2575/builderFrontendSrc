import {
  fetchData,
  putData,
  deleteData,
  postData
} from './apiHandler';


import {host} from './config'

const BASE_URL =` ${host}/api/blocks`;



export const getBlocks = () => fetchData(BASE_URL );
export const createBlock = (data) => postData(BASE_URL, data );
export const updateBlock = (id, data) => putData(`${BASE_URL}/${id}`, data );
export const deleteBlock = (id) => deleteData(`${BASE_URL}/${id}` ); // ✅ Correct usage
