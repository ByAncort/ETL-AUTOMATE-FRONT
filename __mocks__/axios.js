const mockAxiosInstance = {
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
  patch: jest.fn(),
  delete: jest.fn(),
  interceptors: {
    request: { use: jest.fn() },
    response: { use: jest.fn() },
  },
  defaults: {},
};

const axios = {
  create: jest.fn(() => mockAxiosInstance),
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
  patch: jest.fn(),
  delete: jest.fn(),
  interceptors: {
    request: { use: jest.fn() },
    response: { use: jest.fn() },
  },
  isCancel: jest.fn().mockReturnValue(false),
  all: jest.fn(),
  spread: jest.fn(),
  defaults: {},
  ...mockAxiosInstance,
};

module.exports = axios;
module.exports.default = axios;
module.exports.mockAxiosInstance = mockAxiosInstance;
