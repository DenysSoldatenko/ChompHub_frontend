import apiClient from './apiClient';

export const getReviewsByProductId = async (productId) => {
  const response = await apiClient.get(`/reviews/product/${productId}`);
  return response.data;
};

export const createProductReview = async (reviewDto) => {
  const response = await apiClient.post('/reviews', reviewDto);
  return response.data;
};