import axios from "../axios.customize.js";

const getStaffApi = () => {
    const URL_API = "/v1/api/staff";
    return axios.get(URL_API);
};

const addNewStaffApi = (username, password, fullName, email, phone, address) => {
    const URL_API = "/v1/api/add-employee";
    const data = {
        username: username,
        password: password,
        fullName: fullName,
        email: email,
        phone: phone,
        address: address,
    };

    return axios.post(URL_API, data);
};

const deleteStaffApi = (staffId) => {
    const URL_API = `/v1/api/${staffId}`;
    return axios.delete(URL_API);
};

const detailStaffApi = (staffId) => {
    const URL_API = `/v1/api/detail-employee/${staffId}`;
    return axios.get(URL_API);
}

const updateStaffApi = (staffId, updatedData) => {
    const URL_API = `/v1/api/${staffId}`;
    return axios.put(URL_API, updatedData);
};

export { getStaffApi, addNewStaffApi, deleteStaffApi, detailStaffApi, updateStaffApi };