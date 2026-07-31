import axiosClient from './axiosClient';

export const listLogs = () => axiosClient.get('/logs');
export const listLogsByApi = (apiResourceId) => axiosClient.get(`/logs/by-api/${apiResourceId}`);
export const listLogsByKey = (apiKeyId) => axiosClient.get(`/logs/by-key/${apiKeyId}`);
