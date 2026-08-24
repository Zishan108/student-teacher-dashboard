import api from './axios';

export const createGroup = (name) => api.post('/groups', { name });
export const addGroupMember = (groupId, email) => api.post(`/groups/${groupId}/members`, { email });
export const getGroup = (groupId) => api.get(`/groups/${groupId}`);
export const getMyGroups = () => api.get('/groups');
export const getAllGroups = () => api.get('/groups/all');
export const removeGroupMember = (groupId, userId) => api.delete(`/groups/${groupId}/members/${userId}`);