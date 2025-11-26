import axios from "../axios.customize.js";

const getAllContractsApi = () => {
  const URL_API = "/v1/api/contracts";
  return axios.get(URL_API);
};

const getMyContractsApi = () => {
  const URL_API = "/v1/api/contracts/my-contract";
  return axios.get(URL_API);
};

const getContractByIdApi = (contractId) => {
  const URL_API = `/v1/api/contracts/${contractId}`;
  return axios.get(URL_API);
};

const getContractByStaffIdApi = (staffId) => {
  const URL_API = `/v1/api/contracts/staff/${staffId}`;
  return axios.get(URL_API);
};

const getContractsByStatusApi = (status) => {
  const URL_API = `/v1/api/contracts/status/${status}`;
  return axios.get(URL_API);
};

const getExpiringContractsApi = (days = 30) => {
  const URL_API = `/v1/api/contracts/expiring?days=${days}`;
  return axios.get(URL_API);
};

const createContractApi = (staffId, content, fromDate, toDate) => {
  const URL_API = "/v1/api/contracts";
  const data = {
    staffId: staffId,
    content: content,
    fromDate: fromDate,
    toDate: toDate,
  };
  return axios.post(URL_API, data);
};

const updateContractApi = (contractId, updatedData) => {
  const URL_API = `/v1/api/contracts/${contractId}`;
  return axios.put(URL_API, updatedData);
};

const updateContractStatusApi = (contractId, status) => {
  const URL_API = `/v1/api/contracts/${contractId}/status`;
  const data = {
    status: status,
  };
  return axios.patch(URL_API, data);
};

const deleteContractApi = (contractId) => {
  const URL_API = `/v1/api/contracts/${contractId}`;
  return axios.delete(URL_API);
};

export {
  getAllContractsApi,
  getContractByIdApi,
  getContractByStaffIdApi,
  getContractsByStatusApi,
  getExpiringContractsApi,
  createContractApi,
  updateContractApi,
  updateContractStatusApi,
  deleteContractApi,
  getMyContractsApi,
};
