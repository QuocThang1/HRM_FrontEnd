import axios from "../axios.customize.js";

const getStaffApi = (role) => {
  const URL_API = `/v1/api/staff${role ? `?role=${role}` : ""}`;
  return axios.get(URL_API);
};

const addNewStaffApi = (password, fullName, email, phone, address, citizenId, gender, dob) => {
    const URL_API = "/v1/api/staff/add-employee";
    const data = {
        password: password,
        fullName: fullName,
        email: email,
        phone: phone,
        address: address,
        citizenId: citizenId,
        gender: gender,
        dob: dob
    };

  return axios.post(URL_API, data);
};

const deleteStaffApi = (staffId) => {
    const URL_API = `/v1/api/staff/${staffId}`;
    return axios.delete(URL_API);
};

const detailStaffApi = (staffId) => {
    const URL_API = `/v1/api/staff/detail-employee/${staffId}`;
    return axios.get(URL_API);
}

const updateStaffApi = (staffId, updatedData) => {
    const URL_API = `/v1/api/staff/${staffId}`;
    return axios.put(URL_API, updatedData);
};

// Lấy danh sách nhân viên theo phòng ban
const getStaffByDepartmentApi = (departmentId) => {
  const URL_API = `/v1/api/staff/departments/${departmentId}/`;
  return axios.get(URL_API);
};

// Gán nhân viên vào phòng ban
const assignStaffToDepartmentApi = (staffId, departmentId) => {
  const URL_API = "/v1/api/staff/assign-department";
  const data = {
    staffId: staffId,
    departmentId: departmentId,
  };
  return axios.put(URL_API, data);
};

const getStaffNotInDepartmentApi = (departmentId) => {
  const URL_API = `/v1/api/staff/not-in-department/${departmentId}`;
  return axios.get(URL_API);
};

const removeStaffFromDepartmentApi = (staffId) => {
  const URL_API = "/v1/api/staff/remove-from-department";
  return axios.put(URL_API, { staffId });
};

export {
  getStaffApi,
  addNewStaffApi,
  deleteStaffApi,
  detailStaffApi,
  updateStaffApi,
  getStaffByDepartmentApi,
  assignStaffToDepartmentApi,
  getStaffNotInDepartmentApi,
  removeStaffFromDepartmentApi,
};
