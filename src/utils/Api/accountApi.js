import axios from "../axios.customize.js";

const getAccountApi = () => {
    const URL_API = "/v1/api/account/get-account";
    return axios.get(URL_API);
};

const signUpApi = (userData) => {
    const URL_API = "/v1/api/account/register";
    return axios.post(URL_API, userData);
};

const updateProfileApi = (name, email, address, phone, citizenId, gender, dob) => {
    const URL_API = "/v1/api/account/profile";
    const data = {
        name: name,
        email: email,
        address: address,
        phone: phone,
        citizenId: citizenId,
        gender: gender,
        dob: dob,
    };
    return axios.put(URL_API, data);
};

const loginApi = (email, password) => {
    const URL_API = "/v1/api/account/login";
    const data = {
        email: email,
        password: password,
    };

    return axios.post(URL_API, data);
};

export { signUpApi, loginApi, updateProfileApi, getAccountApi };