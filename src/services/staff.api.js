import api from './api'; // your axios instance

export const fetchAllStaff = () => api.get('/staff');
export const createStaff = (data) => api.post('/staff', data);
export const updateStaff = (id, data) => api.put(`/staff/${id}`, data);
export const deleteStaff = (id) => api.delete(`/staff/${id}`);
export const getStaffLeaves = (staffId) => api.get(`/${staffId}/leaves`);
export const requestLeave = (staffId, data) => api.post(`/leave/request`, data);
export const approveLeave = (id, data) => api.put(`/leave/approve/${id}`, data);
export const rejectLeave = (id, data) => api.put(`/leave/reject/${id}`, data);