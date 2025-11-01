import axios from "../axios.customize.js";

const createShiftTypeApi = (shiftData) => {
    const URL_API = "/v1/api/shift-types";
    return axios.post(URL_API, shiftData);
};

const getAllShiftTypesApi = () => {
    const URL_API = "/v1/api/shift-types";
    return axios.get(URL_API);
};

const getShiftTypeApi = (id) => {
    const URL_API = `/v1/api/shift-types/${id}`;
    return axios.get(URL_API);
};

const updateShiftTypeApi = (id, shiftData) => {
    const URL_API = `/v1/api/shift-types/${id}`;
    return axios.put(URL_API, shiftData);
};

const deleteShiftTypeApi = (id) => {
    const URL_API = `/v1/api/shift-types/${id}`;
    return axios.delete(URL_API);
};

export {
    createShiftTypeApi,
    getAllShiftTypesApi,
    getShiftTypeApi,
    updateShiftTypeApi,
    deleteShiftTypeApi,
};
