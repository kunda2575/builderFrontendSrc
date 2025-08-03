// src/api/apiHandler.js
import axios from "axios";

const handleErrors = (error) => {
  console.error("📦 Axios Error:", error.response?.data);

  if (!error.response) {
    return { success: false, message: "Network error" };
  }

  
  const status = error.response.status;
  const backendMessage = error.response.data?.message || error.response.data?.error;
  console.log("handle error",backendMessage)

  if (backendMessage) {
    return { success: false, message: backendMessage };
  }

  // fallback
  let message = "Unexpected error occurred!";
  switch (status) {
    case 400:
      message = "Invalid input! Please check your details."; break;
    case 401:
      message = "Unauthorized! Please log in."; break;
    case 403:
      message = "Access Denied!"; break;
    case 404:
      message = "Resource not found!"; break;
    case 409:
      message = "Conflict! Resource already exists."; break;
    case 500:
      message = "Something went wrong! Please try again later."; break;
    case 503:
      message = "Service temporarily unavailable."; break;
  }

  return { success: false, message };
};


// // Always get the latest token when needed
// const getAuthHeaders = () => {
//   const token = localStorage.getItem('loginToken');
//   const selectedProject = localStorage.getItem('selectedProject');
  
//   let projectId = null;

//   if (selectedProject) {
//     try {
//       const parsed = JSON.parse(selectedProject);
//       projectId = parsed?.id;
    
//     } catch (err) {
//       console.error("Invalid project object in localStorage:", err);
//     }
//   }

//   return {
//     'Content-Type': 'application/json',
//     'Authorization': `Bearer ${token}`,
//     ...(projectId && { 'project-id': projectId })  // Add only if projectId exists
//   };
// };



const getAuthHeaders = () => {
  const token = localStorage.getItem('loginToken');
  const selectedProject = localStorage.getItem('selectedProject');

  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };

  if (selectedProject) {
    try {
      const parsed = JSON.parse(selectedProject);

      if (parsed.id) {
        headers['project-id'] = parsed.id;
      }

      if (parsed.projectName) {
        headers['project-name'] = parsed.projectName;
      }

    } catch (err) {
      console.error("Invalid selectedProject in localStorage:", err);
    }
  }

  return headers;
};


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
// export const postData = async (url, data) => apiCall("post", url, data);
export const postData = async (url, data) => {
  try {
    const headers = getAuthHeaders(); // ✅ Get token and project-id
    const response = await axios.post(url, data, { headers }); // ✅ Pass headers
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    const status = error.response?.status;
    const backendMessage = error.response?.data?.message || error.response?.data?.error;

    return {
      success: false,
      message: backendMessage || "Unexpected error occurred!",
      data: error.response?.data || {},  // Include detailed error data
    };
  }
};


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