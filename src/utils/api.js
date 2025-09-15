import axios from "./axios.customize.js";

const createStaffApi = (name, email, password, address, phone, gender) => {
  const URL_API = "/v1/api/register";
  const data = {
    name: name,
    email: email,
    password: password,
    address: address,
    phone: phone,
    gender: gender,
  };

  return axios.post(URL_API, data);
};

const updateProfileApi = (name, email, address, phone) => {
  const URL_API = "/v1/api/profile";
  const data = {
    name: name,
    email: email,
    address: address,
    phone: phone,
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

const getStaffApi = () => {
  const URL_API = "/v1/api/staff";
  return axios.get(URL_API);
};
export { createStaffApi, loginApi, getStaffApi, updateProfileApi };
