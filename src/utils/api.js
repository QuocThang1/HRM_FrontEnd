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

const addNewEmployeeApi = (username, password, fullName, email, phone, address) => {
  const URL_API = "/v1/api/add-employee";
  const data = {
    username: username,
    password: password,
    fullName: fullName,
    email: email,
    phone: phone,
    address: address,
  };

  return axios.post(URL_API, data);
};

const deleteEmployeeApi = (staffId) => {
  const URL_API = `/v1/api/${staffId}`;
  return axios.delete(URL_API);
};

const detailEmployeeApi = (staffId) => {
  const URL_API = `/v1/api/detail-employee/${staffId}`;
  return axios.get(URL_API);
}

const updateEmployeeApi = (staffId, updatedData) => {
  const URL_API = `/v1/api/${staffId}`;
  return axios.put(URL_API, updatedData);
};
export { createStaffApi, loginApi, getStaffApi, updateProfileApi, addNewEmployeeApi, deleteEmployeeApi, detailEmployeeApi, updateEmployeeApi };
