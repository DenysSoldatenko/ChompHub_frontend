import apiClient from './apiClient';

export const getCart = async () => {
  const resp = await apiClient.get('/cart');
  return resp.data;
};

export const addItemToCart = async (cartDTO) => {
  const resp = await apiClient.post('/cart/items', cartDTO);
  return resp.data;
};

export const incrementItem = async (productId) => {
  const resp = await apiClient.put(`/cart/items/${productId}/increment`);
  return resp.data;
};

export const decrementItem = async (productId) => {
  const resp = await apiClient.put(`/cart/items/${productId}/decrement`);
  return resp.data;
};

export const removeItem = async (cartItemId) => {
  const resp = await apiClient.delete(`/cart/items/${cartItemId}`);
  return resp.data;
};

export const clearCart = async () => {
  const resp = await apiClient.delete('/cart');
  return resp.data;
};