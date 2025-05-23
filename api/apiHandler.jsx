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



const getAuthHeaders = () => ({
  'Authorization': `Bearer ${localStorage.getItem('loginToken')}`
});

const apiCall = async (method, url, data = null) => {
  try {
    const isFormData = data instanceof FormData;
    const headers = isFormData
      ? getAuthHeaders()
      : { ...getAuthHeaders(), 'Content-Type': 'application/json' };

    const response = await axios({
      method,
      url,
      data,
      headers,
      withCredentials: true,
    });

    return { success: true, data: response.data };
  } catch (error) {
    return handleErrors(error);
  }
};


export const fetchData = async (url) => apiCall("get", url);
export const postData = async (url, data) => apiCall("post", url, data);
export const putData = async (url, data) => apiCall("put", url, data);
export const deleteData = async (url) => apiCall("delete", url);
