import axios from 'axios';

/**
 * The API Tester talks to the gateway directly with a raw axios call
 * (not the authenticated axiosClient) because gateway requests are
 * authenticated with X-API-KEY, not a JWT.
 */
const GATEWAY_BASE = (import.meta.env.VITE_API_BASE_URL || '/api') + '/gateway';

export const callGateway = ({ apiName, path, method, apiKey, body }) => {
  const url = `${GATEWAY_BASE}/${apiName}${path.startsWith('/') ? path : '/' + path}`;
  return axios({
    url,
    method,
    headers: { 'X-API-KEY': apiKey, 'Content-Type': 'application/json' },
    data: body || undefined,
    validateStatus: () => true, // we want to display 4xx/5xx responses, not throw
  });
};
