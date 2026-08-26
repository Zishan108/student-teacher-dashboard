import api from './axios';

export const createCourse = (data) => api.post('/courses', data);
export const enrollStudent = (courseId, email) => api.post(`/courses/${courseId}/enroll`, { email });
export const getTaughtCourses = () => api.get('/courses/taught');
export const getEnrolledCourses = () => api.get('/courses/enrolled');
export const getAllCourses = () => api.get('/courses/all');
export const getCourse = (id) => api.get(`/courses/${id}`);