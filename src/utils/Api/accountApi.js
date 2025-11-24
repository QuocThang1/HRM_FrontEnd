import axios from "../axios.customize.js";

const getAccountApi = () => {
  const URL_API = "/v1/api/account";
  return axios.get(URL_API);
};

const signUpApi = (userData) => {
  const URL_API = "/v1/api/register";
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
  const URL_API = "/v1/api/profile";
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
  const URL_API = "/v1/api/login";
  const data = {
    email: email,
    password: password,
  };

  return axios.post(URL_API, data);
};

const forgotPasswordApi = (email, frontendUrl) => {
  const URL_API = "/v1/api/forgot-password";
  return axios.post(URL_API, { email, frontendUrl });
};

const resetPasswordApi = (token, newPassword) => {
  const URL_API = "/v1/api/reset-password";
  return axios.post(URL_API, { token, newPassword });
};

export {
  signUpApi,
  loginApi,
  updateProfileApi,
  getAccountApi,
  forgotPasswordApi,
  resetPasswordApi,
};
