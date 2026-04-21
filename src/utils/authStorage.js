export const saveAuthData = (token, roles) => {
  localStorage.setItem('token', token);
  localStorage.setItem('roles', JSON.stringify(roles || []));
};

export const getToken = () => localStorage.getItem('token');

export const getRoles = () => {
  const rolesStr = localStorage.getItem('roles');
  return rolesStr ? JSON.parse(rolesStr) : [];
};

export const hasRole = (role) => getRoles().includes(role);

export const isAdmin = () => hasRole('ROLE_ADMIN');

export const isCustomer = () => hasRole('ROLE_CUSTOMER');

export const isAuthenticated = () => !!getToken();

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('roles');
};