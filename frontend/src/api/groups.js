import api from './axios';

export const createGroup = (name, courseId) => api.post('/groups', { name, courseId });
export const addGroupMember = (groupId, email) => api.post(`/groups/${groupId}/members`, { email });
export const getGroup = (groupId) => api.get(`/groups/${groupId}`);
export const getMyGroups = () => api.get('/groups');
export const getAllGroups = () => api.get('/groups/all');
export const removeGroupMember = (groupId, userId) => api.delete(`/groups/${groupId}/members/${userId}`);
export const transferLeadership = (groupId, newLeaderId) => api.patch(`/groups/${groupId}/leader`, { newLeaderId });