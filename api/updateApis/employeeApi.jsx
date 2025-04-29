import {
  fetchData,
  putData,
  deleteData,postData
} from '../apiHandler';


import {host} from '../config'

const BASE_URL =` ${host}/api/employees`;

export const getEmployeeDetails = () => fetchData(BASE_URL);
export const createEmployeeDetails = (data) => postData(BASE_URL, data);
export const updateEmployeeDetails = (employeeID, data) => putData(`${BASE_URL}/${employeeID}`, data);
export const deleteEmployeeDetails = (employeeID) => deleteData(`${BASE_URL}/${employeeID}`); // ✅ Correct usage
