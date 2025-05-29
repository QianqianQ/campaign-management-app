import { signinApi } from '../lib/api/auth';
import apiClient from '../lib/api/client';

// Mock apiClient
jest.mock('../lib/api/client', () => ({
  __esModule: true,
  default: {
    post: jest.fn(),
    get: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
  },
}));

const mockedApiClient = apiClient as jest.Mocked<typeof apiClient>;

test('logs in and receives auth response', async () => {
  const mockResponse = {
    data: {
      user: {
        id: 1,
        email: 'test@example.com',
        username: 'test@example.com',
      },
      refresh_token: 'refresh_token',
      access_token: 'access_token',
    },
  };

  mockedApiClient.post.mockResolvedValueOnce(mockResponse);

  const resData = await signinApi('test@example.com', 'Password123!');

  expect(resData).toEqual(mockResponse.data);
});
