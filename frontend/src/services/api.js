import axios from 'axios';

const API_BASE_URL = `http://${window.location.hostname}:3000/api`;

export const sendMentorMessage = async (message, currentCode, errorMessage, history) => {
  const response = await axios.post(`${API_BASE_URL}/mentor`, {
    message,
    currentCode,
    errorMessage,
    history
  });
  return response.data;
};
