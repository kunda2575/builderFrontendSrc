import {
  fetchData,
  putData,
  deleteData,
  postData
} from '../apiHandler';
import {host} from '../config'

const BASE_URL =` ${host}/api/teamMembers`;


export const getTeamMembers = () => fetchData(BASE_URL);
export const createTeamMember = (data) => postData(BASE_URL, data);
export const importTeamMember = (data) => postData(`${BASE_URL}/import`, data);
export const updateTeamMember = (id, data) => putData(`${BASE_URL}/${id}`, data);
export const deleteTeamMember = (id) => deleteData(`${BASE_URL}/${id}`); // ✅ Correct usage
