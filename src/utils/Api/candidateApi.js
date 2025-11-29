import axios from "../axios.customize.js";

const submitCVApi = (cvUrl) => {
  const URL_API = "/v1/api/candidates/submit-cv";
  return axios.post(URL_API, { cvUrl });
};

const getAllCandidatesApi = (status) => {
  const URL_API = `/v1/api/candidates${status ? `?status=${status}` : ""}`;
  return axios.get(URL_API);
};

const updateCandidateStatusApi = (candidateId, status) => {
  const URL_API = `/v1/api/candidates/${candidateId}/status`;
  return axios.put(URL_API, { status });
};

const autoScreenCVApi = (candidateId, requiredFields) => {
  const URL_API = `/v1/api/candidates/${candidateId}/auto-screen`;
  const data = { requiredFields };
  return axios.post(URL_API, data);
};

const deleteCVApi = (candidateId) => {
  const URL_API = `/v1/api/candidates/${candidateId}/delete-cv`;
  return axios.delete(URL_API);
}

export { submitCVApi, getAllCandidatesApi, updateCandidateStatusApi, autoScreenCVApi, deleteCVApi };