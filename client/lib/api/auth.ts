import apiClient from './client';

export const signinApi = async (email: string, password: string) => {
  const res = await apiClient.post('/signin/', { email, password });
  return res.data;
};
