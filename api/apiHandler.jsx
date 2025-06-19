// src/api/apiHandler.js
import axios from "axios";

// Common function to handle errors
const handleErrors = (error) => {
  if (!error.response) {
    return { success: false, message: "Network error" };
  }

  const status = error.response.status;
  const backendMessage = error.response.data?.error;

  // Prioritize backend message if it exists
  if (backendMessage) {
    return { success: false, message: backendMessage };
  }

  // Default messages by status code
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
  }

  return { success: false, message };
};


// Always get the latest token when needed
const getAuthHeaders = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${localStorage.getItem('loginToken')}`
});

// Generic API call using Axios
const apiCall = async (method, url, data = null) => {
  try {
    const headers = getAuthHeaders();
    const response = await axios({ method, url, data, headers, withCredentials: true });
    return { success: true, data: response.data };
  } catch (error) {
    return handleErrors(error);
  }
};



// Exported functions
export const login = async (url, data) => apiCall("post", url, data);
export const register = async (url, data) => apiCall("post", url, data);

export const fetchData = async (url) => apiCall("get", url);
export const postData = async (url, data) => apiCall("post", url, data);
export const putData = async (url, data) => apiCall("put", url, data);
export const deleteData = async (url) => {
  try {
    const headers = getAuthHeaders();
    const response = await axios.delete(url, { headers });
    return { success: true, data: response.data };
  } catch (error) {
    return handleErrors(error);
  }
};