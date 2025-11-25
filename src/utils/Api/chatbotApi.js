import axios from "../axios.customize.js";

const chatWithBotApi = (message) => {
  const URL_API = "/v1/api/chatbot/chat";
  const data = {
    message: message,
  };
  return axios.post(URL_API, data);
};

export { chatWithBotApi };
