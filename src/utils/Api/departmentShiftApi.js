import axios from "../axios.customize.js";

const addShiftToDepartmentApi = (departmentId, shiftTypeId) => {
    const URL_API = "/v1/api/department-shifts";
    return axios.post(URL_API, { departmentId, shiftTypeId });
};

const getDepartmentShiftsApi = (departmentId) => {
    const URL_API = `/v1/api/department-shifts${departmentId ? `?departmentId=${departmentId}` : ""}`;
    return axios.get(URL_API);
};

const deleteDepartmentShiftApi = (id) => {
    const URL_API = `/v1/api/department-shifts/${id}`;
    return axios.delete(URL_API);
};

const updateDepartmentShiftStatusApi = (id, isActive) => {
    const URL_API = `/v1/api/department-shifts/${id}/status`;
    return axios.put(URL_API, { isActive });
};

const getAvailableShiftsForDepartmentApi = (departmentId) => {
    const URL_API = `/v1/api/department-shifts/available/${departmentId}`;
    return axios.get(URL_API);
};


export {
    addShiftToDepartmentApi,
    getDepartmentShiftsApi,
    deleteDepartmentShiftApi,
    getAvailableShiftsForDepartmentApi,
    updateDepartmentShiftStatusApi,
};
