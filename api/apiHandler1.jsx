// src/api/apiHandler.js
import axios from "axios";

// Common function to handle errors
const handleErrors = (error) => {
  console.error("📦 Axios Error:", error.response?.data);

  if (!error.response) {
    return { success: false, message: "Network error" };
  }

  const status = error.response.status;
  const backendMessage = error.response.data?.message || error.response.data?.error;
  const detail = error.response.data?.detail;

  let message = backendMessage || "Unexpected error occurred!";
  switch (status) {
    case 400: message = "Invalid input! Please check your details."; break;
    case 401: message = "Unauthorized! Please log in."; break;
    case 403: message = "Access Denied!"; break;
    case 404: message = "Resource not found!"; break;
    case 409: message = backendMessage || "Conflict! Resource already exists."; break;
    case 500: message = backendMessage || "Something went wrong! Please try again later."; break;
    case 503: message = "Service temporarily unavailable."; break;
  }

  return { success: false, message, detail }; // ✅ return `detail`
};



const getAuthHeaders = (isFormData = false) => {
  const token = localStorage.getItem('loginToken');
  const selectedProject = localStorage.getItem('selectedProject');

  let projectId = null;
  let projectName = null;

  if (selectedProject) {
    try {
      const parsed = JSON.parse(selectedProject);
      projectId = parsed?.id;
      projectName = parsed?.projectName; // ✅ Extract
    } catch (err) {
      console.error("Invalid project object in localStorage:", err);
    }
  }

  const headers = {
    Authorization: `Bearer ${token}`,
    ...(projectId && { 'project-id': projectId }),
    ...(projectName && { 'project-name': projectName }) // ✅ Include
  };

  if (!isFormData) {
    headers['Content-Type'] = 'application/json';
  }

  return headers;
};



const apiCall = async (method, url, data = null) => {
  try {
    const isFormData = data instanceof FormData;
    const headers = getAuthHeaders(isFormData); // ✅ Pass context here

    const config = {
      method,
      url,
      headers,
      ...(data !== null && { data }),
    };

    const response = await axios(config);
    return { success: true, data: response.data };
  } catch (error) {
    return handleErrors(error);
  }
};




export const fetchData = async (url) => apiCall("get", url);
export const postData = async (url, data) => apiCall("post", url, data);
export const putData = async (url, data) => apiCall("put", url, data);
export const deleteData = async (url) => apiCall("delete", url);
