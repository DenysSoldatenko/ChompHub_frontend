import apiClient from './apiClient';

export const initializePayment = async (orderId) => {
  const response = await apiClient.post(`/payments/order/${orderId}`);
  return response.data;
};

export const getPaymentByOrderId = async (orderId) => {
  const response = await apiClient.get(`/payments/order/${orderId}`);
  return response.data;
};

export const getPaymentById = async (id) => {
  const response = await apiClient.get(`/payments/${id}`);
  return response.data;
};

export const updatePaymentStatus = async (orderId, status) => {
  const response = await apiClient.put(`/payments/order/${orderId}/status`, {status: status,});
  return response.data;
};

// Admin endpoints
export const getAllPaymentsAdmin = async (page = 0, size = 10) => {
  const response = await apiClient.get('/payments/admin/all', {
    params: {page, size},
  });
  return response.data;
};