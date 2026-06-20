jest.mock('axios');

import api from '../api';
import axios from 'axios';

// Capture at module load (before clearMocks clears call history between tests)
// Use `api` directly — calling axios.create() returns a different auto-mocked instance
const apiRequestUse = api.interceptors.request.use as jest.Mock;
const apiResponseUse = api.interceptors.response.use as jest.Mock;
const axiosConfig = (axios.create as jest.Mock).mock.calls[0][0];
const requestSuccessHandler = apiRequestUse.mock.calls[0][0];
const requestErrorHandler = apiRequestUse.mock.calls[0][1];
const responseSuccessHandler = apiResponseUse.mock.calls[0][0];
const responseErrorHandler = apiResponseUse.mock.calls[0][1];

beforeEach(() => {
  localStorage.clear();
});

describe('api (axios instance)', () => {
  it('should create axios instance with base URL', () => {
    expect(axiosConfig).toEqual({
      baseURL: 'http://localhost:8080',
      headers: { 'Content-Type': 'application/json' },
    });
  });

  it('should inject Authorization header when token exists', () => {
    localStorage.setItem('token', 'test-jwt');

    const config = { headers: {} };
    const result = requestSuccessHandler(config);

    expect(result.headers.Authorization).toBe('Bearer test-jwt');
  });

  it('should not inject Authorization header without token', () => {
    const config = { headers: {} };
    const result = requestSuccessHandler(config);

    expect(result.headers.Authorization).toBeUndefined();
  });

  it('should handle request error', () => {
    const testError = new Error('Request failed');
    expect(requestErrorHandler(testError)).rejects.toThrow('Request failed');
  });

  it('should redirect to /auth on 401 for protected routes', () => {
    const error = { response: { status: 401 } };
    responseErrorHandler(error).catch(() => {});

    expect(localStorage.getItem('token')).toBeNull();
    expect(localStorage.getItem('username')).toBeNull();
    expect(localStorage.getItem('viewAdmin')).toBe('false');
  });

  it('should not redirect on 401 for public auth paths', () => {
    window.history.replaceState({}, '', '/auth');

    const error = { response: { status: 401 } };
    localStorage.setItem('token', 'some-token');

    responseErrorHandler(error).catch(() => {});

    expect(localStorage.getItem('token')).toBe('some-token');
  });

  it('should reject on response error', async () => {
    const error = { response: { status: 500 } };
    await expect(responseErrorHandler(error)).rejects.toEqual(error);
  });

  it('should pass successful responses through', () => {
    const response = { data: { id: 1 } };
    expect(responseSuccessHandler(response)).toBe(response);
  });
});
