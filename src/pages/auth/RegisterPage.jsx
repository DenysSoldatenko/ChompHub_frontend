import {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {useError} from '../../components/ErrorDisplay';
import {registerUser} from '../../api/userApi';

const UserRegistration = () => {
  const {RenderError, showError} = useError();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phoneNumber: '',
    address: '',
    roles: []
  });

  const handleChange = (e) => {
    const {name, value} = e.target;
    setFormData(prev => ({...prev, [name]: value}));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.password || !formData.phoneNumber || !formData.address) {
      showError('All fields except roles are required');
      return;
    }

    setIsLoading(true);

    try {
      await registerUser(formData);
      navigate('/login');
    } catch (error) {
      const backendError =
          error.response?.data?.detail ||
          error.response?.data?.message ||
          (error.response?.data?.errors && Object.values(error.response.data.errors).join(', '));

      showError(backendError || error.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
      <div className="user-register-page">
        <div className="user-register-card">
          <div className="user-register-header">
            <h2 className="user-register-title">Register New User</h2>
            <p className="user-register-description">Create a new user account with specific roles</p>
          </div>
          <div className="user-register-content">
            <form className="user-register-form" onSubmit={handleSubmit}>

              <div className="user-form-group">
                <label className="user-label">Name</label>
                <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="user-input"
                    placeholder="John Doe"
                />
              </div>

              <div className="user-form-group">
                <label className="user-label">Email</label>
                <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="user-input"
                    placeholder="example@mail.com"
                />
              </div>

              <div className="user-form-group">
                <label className="user-label">Password</label>
                <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="user-input"
                    placeholder="••••••••"
                />
              </div>

              <div className="user-form-group">
                <label className="user-label">Phone Number</label>
                <input
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    className="user-input"
                    placeholder="+380..."
                />
              </div>

              <div className="user-form-group">
                <label className="user-label">Address</label>
                <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className="user-input"
                    placeholder="Street, City, Postal Code"
                />
              </div>

              {RenderError}

              <button
                  type="submit"
                  className="user-register-button"
                  disabled={isLoading}
              >
                {isLoading ? 'Registering User...' : 'Register User'}
              </button>
            </form>
          </div>
        </div>
      </div>
  );
};

export default UserRegistration;