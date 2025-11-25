import axios from "../axios.customize.js";

const getDepartmentsApi = () => {
  const URL_API = "/v1/api/departments";
  return axios.get(URL_API);
};

const getDepartmentByIdApi = (departmentId) => {
  const URL_API = `/v1/api/departments/${departmentId}`;
  return axios.get(URL_API);
};

const addNewDepartmentApi = (departmentName, description, managerId) => {
  const URL_API = "/v1/api/departments";
  const data = {
    departmentName: departmentName,
    description: description,
    managerId: managerId,
  };
  return axios.post(URL_API, data);
};

const updateDepartmentApi = (departmentId, updatedData) => {
  const URL_API = `/v1/api/departments/${departmentId}`;
  return axios.put(URL_API, updatedData);
};

const deleteDepartmentApi = (departmentId) => {
  const URL_API = `/v1/api/departments/${departmentId}`;
  return axios.delete(URL_API);
};

const getAvailableManagersApi = () => {
    const URL_API = "/v1/api/departments/staff/available-managers";
    return axios.get(URL_API);
};

const createDepartmentReviewApi = (departmentId, reviewData) => {
    const URL_API = `/v1/api/department-reviews/${departmentId}/reviews`;
    return axios.post(URL_API, reviewData);
};

const getDepartmentReviewsApi = (departmentId) => {
    const URL_API = `/v1/api/department-reviews/${departmentId}/reviews`;
    return axios.get(URL_API);
};

const getDepartmentReviewsByAdminApi = (month) => {
    const URL_API = `/v1/api/department-reviews/reviews/admin${month ? `?month=${month}` : ""}`;
    return axios.get(URL_API);
};

const updateDepartmentReviewApi = (reviewId, updatedData) => {
    const URL_API = `/v1/api/department-reviews/reviews/${reviewId}`;
    return axios.put(URL_API, updatedData);
};

const deleteDepartmentReviewApi = (reviewId) => {
    const URL_API = `/v1/api/department-reviews/reviews/${reviewId}`;
    return axios.delete(URL_API);
};

const getManagerDepartmentApi = () => {
    const URL_API = "/v1/api/departments/manager-department";
    return axios.get(URL_API);
};

export {
    getDepartmentsApi,
    getDepartmentByIdApi,
    addNewDepartmentApi,
    updateDepartmentApi,
    deleteDepartmentApi,
    getAvailableManagersApi,
    createDepartmentReviewApi,
    getDepartmentReviewsApi,
    getDepartmentReviewsByAdminApi,
    updateDepartmentReviewApi,
    deleteDepartmentReviewApi,
    getManagerDepartmentApi,
};
