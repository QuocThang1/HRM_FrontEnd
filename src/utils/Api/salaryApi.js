import axios from "../axios.customize.js";

const createSalaryApi = (staffId, hourlyRate) => {
    const URL_API = "/v1/api/salaries";
    return axios.post(URL_API, { staffId, hourlyRate });
};

const getAllSalariesApi = () => {
    const URL_API = "/v1/api/salaries";
    return axios.get(URL_API);
};

const getSalaryApi = (id) => {
    const URL_API = `/v1/api/salaries/${id}`;
    return axios.get(URL_API);
};

const getSalaryByStaffApi = (staffId) => {
    const URL_API = `/v1/api/salaries/staff/${staffId}`;
    return axios.get(URL_API);
};

const getMySalaryApi = () => {
    const URL_API = "/v1/api/salaries/my-salary";
    return axios.get(URL_API);
};

const updateSalaryApi = (id, hourlyRate) => {
    const URL_API = `/v1/api/salaries/${id}`;
    return axios.put(URL_API, { hourlyRate });
};

const deleteSalaryApi = (id) => {
    const URL_API = `/v1/api/salaries/${id}`;
    return axios.delete(URL_API);
};

export {
    createSalaryApi,
    getAllSalariesApi,
    getSalaryApi,
    getSalaryByStaffApi,
    getMySalaryApi,
    updateSalaryApi,
    deleteSalaryApi,
};