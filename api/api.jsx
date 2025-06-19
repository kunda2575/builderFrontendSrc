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
            // window.location.href = "/404";
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

//---------------------------------------------------------------------------------------------------------

// Generic API call function
const apiCall = async (method, url, data, headers) => {
    try {
        const response = await axios({ method, url, data, headers, withCredentials: true });
        return { success: true, data: response.data };
    } catch (error) {
        return handleErrors(error);
    }
};

//---------------------------------------------------------------------------------------------------------

// Login API
export const login = async (url, data, headers) => apiCall("post", url, data, headers);


// Register API
export const register = async (url, data, headers) => apiCall("post", url, data, headers);


// Fetch Data (GET)
export const fetchData = async (url, headers) => apiCall("get", url, null, headers);


export const postData = async (url, payload) => {
    const token = localStorage.getItem("loginToken");

    const res = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
             'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload),
    });

    const data = await res.json();
    return data;
};


export const putData = async (url, data) => {
  const response = await fetch(url, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  return response.json();
};


// Delete Data (DELETE)
export const deleteData = async (url, headers) => apiCall("delete", url, null, headers);

