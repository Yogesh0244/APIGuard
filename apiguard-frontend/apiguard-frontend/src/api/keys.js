import axiosClient from './axiosClient';

export const listMyKeys = () => axiosClient.get('/keys');
export const generateKey = (payload) => axiosClient.post('/keys', payload);
export const revokeKey = (id) => axiosClient.delete(`/keys/${id}`);
