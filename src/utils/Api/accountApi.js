import axios from "../axios.customize.js";

const getAccountApi = () => {
  const URL_API = "/v1/api/account/get-account";
  return axios.get(URL_API);
};

const signUpApi = (userData) => {
  const URL_API = "/v1/api/account/register";
  return axios.post(URL_API, userData);
};

const updateProfileApi = (
  name,
  email,
  address,
  phone,
  citizenId,
  gender,
  dob,
) => {
  const URL_API = "/v1/api/account/profile";
  const data = {
    name: name,
    email: email,
    address: address,
    phone: phone,
    citizenId: citizenId,
    gender: gender,
    dob: dob,
  };
  return axios.put(URL_API, data);
};

const loginApi = (email, password) => {
  const URL_API = "/v1/api/account/login";
  const data = {
    email: email,
    password: password,
  };

  return axios.post(URL_API, data);
};

const forgotPasswordApi = (email, frontendUrl) => {
  const URL_API = "/v1/api/account/forgot-password";
  return axios.post(URL_API, { email, frontendUrl });
};

const resetPasswordApi = (email, otp, newPassword) => {
  const URL_API = "/v1/api/account/reset-password";
  return axios.post(URL_API, { email, otp, newPassword });
};

const verifyOtpApi = (email, code) => {
  const URL_API = "/v1/api/account/verify-otp";
  return axios.post(URL_API, { email, code });
};

const refreshTokenApi = (refresh_token) => {
  const URL_API = "/v1/api/account/refresh-token";
  return axios.post(URL_API, { refresh_token });
};

export {
  signUpApi,
  loginApi,
  updateProfileApi,
  getAccountApi,
  forgotPasswordApi,
  resetPasswordApi,
  verifyOtpApi,
  refreshTokenApi,
};
