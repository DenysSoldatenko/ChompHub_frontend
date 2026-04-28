import {useState} from 'react';
import {useNavigate, Link, useLocation} from 'react-router-dom';
import {useError} from '../../components/ErrorDisplay';
import {loginUser} from '../../api/userApi';
import {saveAuthData} from '../../utils/authStorage';
import {extractErrorMessage} from '../../utils/errorHandler';

const UserLogin = () => {
  const {RenderError, showError} = useError();
  const navigate = useNavigate();
  const {state} = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const redirectPath = state?.from?.pathname || '/home';

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    const {name, value} = e.target;
    setFormData((prev) => ({...prev, [name]: value}));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      showError('Email and password are required.');
      return;
    }

    setIsLoading(true);

    try {
      const authData = await loginUser(formData);
      saveAuthData(authData.token, authData.roles);
      navigate(redirectPath, {replace: true});
    } catch (error) {
      showError(extractErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  };

  return (
      <div className="login-page-food">
        {RenderError}
        <div className="login-card-food">
          <div className="login-header-food">
            <h2 className="login-title-food">Login</h2>
            <p className="login-description-food">Login to your account to order delicious food!</p>
          </div>
          <div className="login-content-food">
            <form className="login-form-food" onSubmit={handleSubmit}>
              <div className="login-form-group">
                <label htmlFor="email" className="login-label-food">Email</label>
                <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="Your Email Address"
                    className="login-input-food"
                />
              </div>
              <div className="login-form-group">
                <label htmlFor="password" className="login-label-food">Password</label>
                <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    placeholder="Password"
                    className="login-input-food"
                />
              </div>
              <div>
                <button
                    type="submit"
                    className="login-button-food"
                    disabled={isLoading}>{isLoading ? 'Logging in...' : 'Login'}
                </button>
              </div>
              <div className="already">
                <Link to="/register" className="register-link-food">Don't Have an Account? Register</Link>
              </div>
            </form>
          </div>
        </div>
      </div>
  );
};

export default UserLogin;