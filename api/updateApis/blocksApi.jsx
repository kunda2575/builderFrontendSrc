import {
  fetchData,
  putData,
  deleteData,
  postData
} from '../apiHandler';


import {host} from '../config'

const BASE_URL =` ${host}/api/blocks`;



export const getBlockDetails = () => fetchData(BASE_URL );
export const createBlockDetails = (data) => postData(BASE_URL, data );
export const importBlockDetails = (data) => postData(`${BASE_URL}/import`, data );
export const updateBlockDetails = (id, data) => putData(`${BASE_URL}/${id}`, data );
export const deleteBlockDetails = (id) => deleteData(`${BASE_URL}/${id}` ); // ✅ Correct usage
