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

export {
    getDepartmentsApi,
    getDepartmentByIdApi,
    addNewDepartmentApi,
    updateDepartmentApi,
    deleteDepartmentApi,
};
