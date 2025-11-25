import axios from "../axios.customize.js";

const createMonthlySalaryApi = (
  staffId,
  month,
  year,
  bonus,
  deduction,
  note,
) => {
  const URL_API = "/v1/api/monthly-salaries";
  return axios.post(URL_API, { staffId, month, year, bonus, deduction, note });
};

const getAllMonthlySalariesApi = () => {
  const URL_API = "/v1/api/monthly-salaries";
  return axios.get(URL_API);
};

const getMonthlySalaryApi = (id) => {
  const URL_API = `/v1/api/monthly-salaries/${id}`;
  return axios.get(URL_API);
};

const getMonthlySalariesByStaffApi = (staffId) => {
  const URL_API = `/v1/api/monthly-salaries/staff/${staffId}`;
  return axios.get(URL_API);
};

const getMyMonthlySalariesApi = () => {
  const URL_API = "/v1/api/monthly-salaries/my-salaries";
  return axios.get(URL_API);
};

const getMonthlySalariesByMonthApi = (month, year) => {
  const URL_API = `/v1/api/monthly-salaries/month/${month}/year/${year}`;
  return axios.get(URL_API);
};

const updateMonthlySalaryApi = (id, bonus, deduction, note, status) => {
  const URL_API = `/v1/api/monthly-salaries/${id}`;
  return axios.put(URL_API, { bonus, deduction, note, status });
};

const deleteMonthlySalaryApi = (id) => {
  const URL_API = `/v1/api/monthly-salaries/${id}`;
  return axios.delete(URL_API);
};

const checkMonthlySalaryExistsApi = (staffId, month, year) => {
  const URL_API = `/v1/api/monthly-salaries/check/${staffId}/${month}/${year}`;
  return axios.get(URL_API);
};

export {
  createMonthlySalaryApi,
  getAllMonthlySalariesApi,
  getMonthlySalaryApi,
  getMonthlySalariesByStaffApi,
  getMyMonthlySalariesApi,
  getMonthlySalariesByMonthApi,
  updateMonthlySalaryApi,
  deleteMonthlySalaryApi,
  checkMonthlySalaryExistsApi,
};
