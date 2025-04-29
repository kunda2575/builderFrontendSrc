import {
  fetchData,
  putData,
  deleteData,
  postData
} from '../apiHandler';

import {host} from '../config'

const BASE_URL =` ${host}/api/leads`;


export const getleadDetails = () => fetchData(BASE_URL);
export const getleadSourceDetails = () => fetchData(`${BASE_URL}/leadSource`);
export const getleadStageDetails = () => fetchData(`${BASE_URL}/leadStage`);
export const getteamMemberDetails = () => fetchData(`${BASE_URL}/teamMember`);
export const createleadDetails = (data) => postData(BASE_URL, data);

