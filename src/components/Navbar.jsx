import { useNavigate, Link } from "react-router-dom";

import { isAuthenticated, isCustomer, logout } from '../utils/auth';

const Navbar = () => {
  const navigate = useNavigate();

  const isAuth = isAuthenticated();
  const isCustomerUser = isCustomer();

  const handleLogout = () => {
    const isLogoutConfirmed = window.confirm("Are you sure you want to logout?");
    if (isLogoutConfirmed) {
      logout();
      navigate("/login");
    }
  };

  return (
      <nav>
        <div className="logo">
          <Link to="/" className="logo-link">ChompHub</Link>
        </div>

        <div className="desktop-nav">
          <Link to="/home" className="nav-link">Home</Link>
          <Link to="/menu" className="nav-link">Menu</Link>
          <Link to="/categories" className="nav-link">Categories</Link>

          {isAuth ? (
              <>
                {isCustomerUser && (
                    <>
                      <Link to="/orders" className="nav-link">Orders</Link>
                      <Link to="/cart" className="nav-link">Cart</Link>
                    </>
                )}
                <Link to="/profile" className="nav-link">Profile</Link>
                <button className="nav-button" onClick={handleLogout}>
                  Logout
                </button>
              </>
          ) : (
              <>
                <Link to="/login" className="nav-link">Login</Link>
                <Link to="/register" className="nav-link">Register</Link>
              </>
          )}
        </div>
      </nav>
  );
};

export default Navbar;