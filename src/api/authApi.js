import apiClient from './apiClient';

export const registerUser = async (registrationData) => {
  await apiClient.post('/auth/register', registrationData);
};

export const loginUser = async (credentials) => {
  const response = await apiClient.post('/auth/login', credentials);
  return response.data;
};

export const getMyProfile = async () => {
  const response = await apiClient.get('/users/me');
  return response.data;
};

export const updateMyProfile = async (profileData) => {
  const response = await apiClient.put('/users/me', profileData);
  return response.data;
};

export const updateProfilePicture = async (file) => {
  const formData = new FormData();
  formData.append('imageFile', file);

  const response = await apiClient.put('/users/me/avatar', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const deactivateMyAccount = async () => {
  await apiClient.delete('/users/me');
};

export const getAllUsersAdmin = async () => {
  const response = await apiClient.get('/users');
  return response.data;
};