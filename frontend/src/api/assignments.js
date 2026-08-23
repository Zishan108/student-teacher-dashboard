import api from './axios';

export const createAssignment = (data) => api.post('/assignments', data);
export const editAssignment = (id, data) => api.patch(`/assignments/${id}`, data);
export const getAssignments = () => api.get('/assignments');
export const getAssignment = (id) => api.get(`/assignments/${id}`);