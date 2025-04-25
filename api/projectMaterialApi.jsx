import {
  fetchData,
  putData,
  deleteData,
  postData
} from './apiHandler';
import {host} from './config'

const BASE_URL =` ${host}/api/projects`;


export const getProjects = () => fetchData(BASE_URL);
export const createProject = (data) => postData(BASE_URL, data);
export const updateProject = (id, data) => putData(`${BASE_URL}/${id}`, data);
export const deleteProject = (id) => deleteData(`${BASE_URL}/${id}`); // ✅ Correct usage
