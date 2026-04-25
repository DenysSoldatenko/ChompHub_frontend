export const extractErrorMessage = (error) => {
  const data = error.response?.data;

  if (!data) {
    return error.message || 'Network error occurred. Check your connection.';
  }

  if (data.invalid_fields && Array.isArray(data.invalid_fields)) {
    return data.invalid_fields
        .map((err) => `${err.field}: ${err.message}`)
        .join('\n');
  }

  if (data.detail) {
    return data.detail;
  }

  return data.title || `Error: ${error.response.status}`;
};