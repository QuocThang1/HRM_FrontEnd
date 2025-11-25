import axios from "../axios.customize.js";

const getAllPoliciesApi = () => {
    const URL_API = "/v1/api/policies";
    return axios.get(URL_API);
};

const getPolicyByIdApi = (policyId) => {
    const URL_API = `/v1/api/policies/${policyId}`;
    return axios.get(URL_API);
};

const getPoliciesByCategoryApi = (category) => {
    const URL_API = `/v1/api/policies/category/${category}`;
    return axios.get(URL_API);
};

const createPolicyApi = (title, category, content) => {
    const URL_API = "/v1/api/policies";
    const data = {
        title: title,
        category: category,
        content: content,
    };
    return axios.post(URL_API, data);
};

const updatePolicyApi = (policyId, updatedData) => {
    const URL_API = `/v1/api/policies/${policyId}`;
    return axios.put(URL_API, updatedData);
};

const deletePolicyApi = (policyId) => {
    const URL_API = `/v1/api/policies/${policyId}`;
    return axios.delete(URL_API);
};

export {
    getAllPoliciesApi,
    getPolicyByIdApi,
    createPolicyApi,
    updatePolicyApi,
    deletePolicyApi,
    getPoliciesByCategoryApi,
};