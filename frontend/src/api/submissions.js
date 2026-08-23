import api from './axios';

export const getGroupSubmissions = (groupId) => api.get(`/submissions/group/${groupId}`);
export const getAssignmentSubmissions = (assignmentId) => api.get(`/submissions/assignment/${assignmentId}`);
export const confirmStep1 = (submissionId) => api.post(`/submissions/${submissionId}/step1`);
export const confirmStep2 = (submissionId) => api.post(`/submissions/${submissionId}/confirm`);
export const getAnalytics = () => api.get('/submissions/analytics');