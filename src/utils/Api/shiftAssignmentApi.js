import axios from "../axios.customize.js";

const createShiftAssignmentApi = (assignmentData) => {
    const URL_API = "/v1/api/shift-assignments";
    return axios.post(URL_API, assignmentData);
};

const getAllShiftAssignmentsApi = (departmentId, staffId) => {
    let URL_API = "/v1/api/shift-assignments";
    const params = [];
    if (departmentId) params.push(`departmentId=${departmentId}`);
    if (staffId) params.push(`staffId=${staffId}`);
    if (params.length > 0) URL_API += `?${params.join("&")}`;
    return axios.get(URL_API);
};

const getShiftAssignmentApi = (id) => {
    const URL_API = `/v1/api/shift-assignments/${id}`;
    return axios.get(URL_API);
};

const getShiftAssignmentByStaffIdApi = () => {
    const URL_API = `/v1/api/shift-assignments/shift-schedule`;
    return axios.get(URL_API);
};

const updateShiftAssignmentApi = (id, updateData) => {
    const URL_API = `/v1/api/shift-assignments/${id}`;
    return axios.put(URL_API, updateData);
};

const deleteShiftAssignmentApi = (id) => {
    const URL_API = `/v1/api/shift-assignments/${id}`;
    return axios.delete(URL_API);
};

export {
    createShiftAssignmentApi,
    getAllShiftAssignmentsApi,
    getShiftAssignmentApi,
    updateShiftAssignmentApi,
    deleteShiftAssignmentApi,
    getShiftAssignmentByStaffIdApi,
};
