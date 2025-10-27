import axios from "../axios.customize.js";

const submitCVApi = (cvUrl) => {
    const URL_API = "/v1/api/candidate/submit-cv";
    return axios.post(URL_API, { cvUrl });
};

const getAllCandidatesApi = (status) => {
    const URL_API = `/v1/api/admin/candidates${status ? `?status=${status}` : ""}`;
    return axios.get(URL_API);
};

const updateCandidateStatusApi = (candidateId, status) => {
    const URL_API = `/v1/api/admin/candidates/${candidateId}/status`;
    return axios.put(URL_API, { status });
};

export {
    submitCVApi,
    getAllCandidatesApi,
    updateCandidateStatusApi,
};
