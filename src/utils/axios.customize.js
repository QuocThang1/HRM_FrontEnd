import axios from "axios";
// Set config defaults when creating the instance
const instance = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
});

// Alter defaults after instance has been created

// Add a request interceptor
instance.interceptors.request.use(
  function (config) {
    // Do something before request is sent
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      // Ensure no malformed bearer header is sent
      delete config.headers.Authorization;
    }
    return config;
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error);
  },
);

// Add a response interceptor
let refreshTokenRequest = null;

instance.interceptors.response.use(
  function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    if (response && response.data) {
      return response.data;
    }
    return response;
  },
  async function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error

    const originalRequest = error.config;

    // Check if error is 401 (Unauthorized) and not from refresh-token endpoint
    if (
      error?.response?.status === 401 &&
      originalRequest.url !== "/v1/api/account/refresh-token" &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      // Prevent multiple refresh token requests
      if (!refreshTokenRequest) {
        const refresh_token = localStorage.getItem("refresh_token");

        if (refresh_token) {
          refreshTokenRequest = instance
            .post("/v1/api/account/refresh-token", { refresh_token })
            .then((res) => {
              if (res && res.access_token) {
                // Update the access token in localStorage
                localStorage.setItem("access_token", res.access_token);

                // Retry the original request with the new token
                originalRequest.headers.Authorization = `Bearer ${res.access_token}`;
                return instance(originalRequest);
              }
              throw new Error("Failed to refresh token");
            })
            .catch((refreshError) => {
              console.error("Token refresh failed:", refreshError);
              // Clear tokens and redirect to login
              localStorage.removeItem("access_token");
              localStorage.removeItem("refresh_token");
              window.location.href = "/login";
              return Promise.reject(refreshError);
            })
            .finally(() => {
              refreshTokenRequest = null;
            });

          return refreshTokenRequest;
        } else {
          // No refresh token, redirect to login
          localStorage.removeItem("access_token");
          window.location.href = "/login";
        }
      }

      return refreshTokenRequest;
    }

    if (error?.response?.data) {
      return error?.response?.data;
    }
    return Promise.reject(error);
  },
);

export default instance;
