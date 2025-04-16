// src/api/apiHandler.js
import axios from "axios";

// Common function to handle errors
const handleErrors = (error) => {
  if (!error.response) {
    return { success: false, message: "Network error" };
  }

  const status = error.response.status;
  let message = "Unexpected error occurred!";

  switch (status) {
    case 400:
      message = "Invalid input! Please check your details.";
      break;
    case 401:
      message = "Unauthorized! Please log in.";
      window.location.href = "/login";
      break;
    case 403:
      message = "Access Denied! You don't have permission.";
      break;
    case 404:
      message = "Resource not found!";
      break;
    case 500:
      message = "Something went wrong! Please try again later.";
      break;
    case 503:
      message = "Service temporarily unavailable. Try again later.";
      break;
    default:
      message = "Unexpected error occurred!";
  }

  return { success: false, message };
};

// Generic API call function
const apiCall = async (method, url, data, headers) => {
  try {
    const response = await axios({ method, url, data, headers, withCredentials: true });
    return { success: true, data: response.data };
  } catch (error) {
    return handleErrors(error);
  }
};

// Auth APIs
export const login = async (url, data, headers) => apiCall("post", url, data, headers);
export const register = async (url, data, headers) => apiCall("post", url, data, headers);

// CRUD APIs
export const fetchData = async (url, headers) => apiCall("get", url, null, headers);

export const putData = async (url, data, headers) => apiCall("put", url, data, headers);

export const deleteData = (url, headers = {}) => axios.delete(url, { headers }); // ✅ Fixed