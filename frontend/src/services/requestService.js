import axios from 'axios';

const API =
  import.meta.env.VITE_API_URL?.replace(/\/$/, '') ||
  'http://localhost:3000/api';

/* ────────────────────────────────────────────────────────── */
/*  Procurement-request endpoints                            */
/* ────────────────────────────────────────────────────────── */

export const getAllRequests = () =>
    axios.get(`${API}/requests`).then(r => r.data);
  
  export const updateRequestStatus = (id, status) =>
    axios.patch(`${API}/requests/${id}`, { status });
  
  export const createRequest = (payload) =>
    axios.post(`${API}/requests`, payload).then(r => r.data);

/* ────────────────────────────────────────────────────────── */
/*  PDF → JSON extraction                                    */
/* ────────────────────────────────────────────────────────── */

export const parsePdf = (file) => {
    const fd = new FormData();
    fd.append('pdf', file);
    return axios
      .post(`${API}/upload`, fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      .then(r => r.data);
};
