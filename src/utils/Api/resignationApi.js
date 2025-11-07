import axios from "../axios.customize.js";

const submitResignationApi = (reason, approvedBy) => {
    const URL_API = "/v1/api/resignations";
    return axios.post(URL_API, { reason, approvedBy });
};

const getMyResignationsApi = () => {
    const URL_API = "/v1/api/resignations/my-resignations";
    return axios.get(URL_API);
};

const getResignationsByApproverApi = () => {
    const URL_API = "/v1/api/resignations/approver";
    return axios.get(URL_API);
};

const getAllResignationsApi = () => {
    const URL_API = "/v1/api/resignations";
    return axios.get(URL_API);
};

const updateResignationStatusApi = (id, status, adminNote) => {
    const URL_API = `/v1/api/resignations/${id}/status`;
    return axios.put(URL_API, { status, adminNote });
};

const deleteResignationApi = (id) => {
    const URL_API = `/v1/api/resignations/${id}`;
    return axios.delete(URL_API);
};

export {
    submitResignationApi,
    getMyResignationsApi,
    getResignationsByApproverApi,
    getAllResignationsApi,
    updateResignationStatusApi,
    deleteResignationApi,
};  