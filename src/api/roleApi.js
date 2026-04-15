import apiClient from './apiClient';

// Admin endpoints
export const getAllRoles = async () => {
  const response = await apiClient.get('/roles');
  return response.data;
};

export const createRole = async (roleDto) => {
  const response = await apiClient.post('/roles', roleDto);
  return response.data;
};

export const updateRole = async (id, roleDto) => {
  const response = await apiClient.put(`/roles/${id}`, roleDto);
  return response.data;
};

export const deleteRole = async (id) => {
  await apiClient.delete(`/roles/${id}`);
};