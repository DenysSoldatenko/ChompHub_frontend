import apiClient from './apiClient';

export const placeOrder = async () => {
  const response = await apiClient.post('/orders');
  return response.data;
};

export const getMyOrders = async () => {
  const response = await apiClient.get('/orders');
  return response.data;
};

export const getOrderById = async (id) => {
  const response = await apiClient.get(`/orders/${id}`);
  return response.data;
};

export const getOrderItemById = async (itemId) => {
  const response = await apiClient.get(`/orders/items/${itemId}`);
  return response.data;
};

// Admin endpoints
export const getAllOrdersAdmin = async (status = null, page = 0, size = 10) => {
  const params = {page, size};
  if (status) {
    params.status = status;
  }
  const response = await apiClient.get('/orders/all', {params});
  return response.data;
};

export const updateOrderStatusAdmin = async (id, status) => {
  const response = await apiClient.patch(`/orders/${id}/status`, null, {
    params: {status},
  });
  return response.data;
};

export const countUniqueCustomers = async () => {
  const response = await apiClient.get('/orders/customers/count');
  return response.data;
};