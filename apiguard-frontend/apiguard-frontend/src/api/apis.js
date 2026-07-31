import axiosClient from './axiosClient';

export const listApis = () => axiosClient.get('/admin/apis');
export const getApi = (id) => axiosClient.get(`/admin/apis/${id}`);
export const registerApi = (payload) => axiosClient.post('/admin/apis', payload);
export const toggleApi = (id) => axiosClient.patch(`/admin/apis/${id}/toggle`);
export const deleteApi = (id) => axiosClient.delete(`/admin/apis/${id}`);
