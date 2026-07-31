import axiosClient from './axiosClient';

export const getAnalyticsSummary = (daysBack = 7) =>
  axiosClient.get('/analytics/summary', { params: { daysBack } });
