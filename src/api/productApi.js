import apiClient from './apiClient';

export const getAllProducts = async () => {
  const response = await apiClient.get('/products');
  return response.data;
};

export const getProductById = async (id) => {
  const response = await apiClient.get(`/products/${id}`);
  return response.data;
};

// Admin endpoints
export const addProduct = async (productDto) => {
  const response = await apiClient.post('/products', productDto);
  return response.data;
};

export const updateProduct = async (id, productDto) => {
  const response = await apiClient.put(`/products/${id}`, productDto);
  return response.data;
};

export const updateProductImage = async (id, file) => {
  const formData = new FormData();
  formData.append('imageFile', file);

  const response = await apiClient.put(`/products/${id}/image`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const deleteProduct = async (id) => {
  await apiClient.delete(`/products/${id}`);
};