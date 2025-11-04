import axios from "../axios.customize.js";

const checkInApi = (location) => {
    const URL_API = "/v1/api/attendances/check-in";
    return axios.post(URL_API, { location });
};

const checkOutApi = (location) => {
    const URL_API = "/v1/api/attendances/check-out";
    return axios.post(URL_API, { location });
};

const getTodayAttendanceApi = () => {
    const URL_API = "/v1/api/attendances/today";
    return axios.get(URL_API);
};

const getMyAttendancesApi = (startDate, endDate) => {
    let URL_API = "/v1/api/attendances/my-attendances";
    const params = [];
    if (startDate) params.push(`startDate=${startDate}`);
    if (endDate) params.push(`endDate=${endDate}`);
    if (params.length > 0) URL_API += `?${params.join("&")}`;
    return axios.get(URL_API);
};

const getAttendancesByDepartmentApi = (departmentId, startDate, endDate) => {
    let URL_API = `/v1/api/attendances/department/${departmentId}`;
    const params = [];
    if (startDate) params.push(`startDate=${startDate}`);
    if (endDate) params.push(`endDate=${endDate}`);
    if (params.length > 0) URL_API += `?${params.join("&")}`;
    return axios.get(URL_API);
};

const getAllAttendancesApi = (startDate, endDate) => {
    let URL_API = "/v1/api/attendances";
    const params = [];
    if (startDate) params.push(`startDate=${startDate}`);
    if (endDate) params.push(`endDate=${endDate}`);
    if (params.length > 0) URL_API += `?${params.join("&")}`;
    return axios.get(URL_API);
};

export {
    checkInApi,
    checkOutApi,
    getTodayAttendanceApi,
    getMyAttendancesApi,
    getAttendancesByDepartmentApi,
    getAllAttendancesApi,
};