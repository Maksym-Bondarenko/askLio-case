import axios from 'axios';

const API_BASE = 'http://localhost:3000/api'; // adjust if needed

export const getAllRequests = async () => {
  const response = await axios.get(`${API_BASE}/requests`);
  return response.data;
};

export const updateRequestStatus = async (id, status) => {
  const response = await axios.patch(`${API_BASE}/requests/${id}`, { status });
  return response.data;
};
