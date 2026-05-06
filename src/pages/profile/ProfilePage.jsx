import {useState, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import {useError} from "../../components/ErrorDisplay";
import {getMyProfile} from "../../api/userApi";

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const {RenderError, showError} = useError();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const userData = await getMyProfile();
        if (userData) {
          setUser(userData);
        }
      } catch (error) {
        const backendError = error.response?.data?.detail || error.response?.data?.message;
        showError(backendError || "Failed to load profile. Please try logging in again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  const navigateToEditPage = () => navigate('/update');
  const navigateToOrderHistory = () => navigate('/my-order-history');

  if (isLoading) {
    return (<div className="profile-container loading-state">
          <div className="loading-spinner">Loading profile...</div>
        </div>);
  }

  if (!user) {
    return (<div className="profile-container">
          {RenderError}
          <div className="error-message">Could not retrieve user data.</div>
        </div>);
  }

  return (<div className="profile-container">
        {RenderError}
        <h1 className="profile-title">User Profile</h1>
        <div className="profile-card">
          <div className="profile-card-header">
            <div className="profile-card-title">
              <div className="profile-avatar">
                {user.profileUrl ? (<img
                        className="avatar-image"
                        src={user.profileUrl}
                        alt={user.name}
                    />) : (<div className="avatar-fallback">
                      {user.name ? user.name.substring(0, 2).toUpperCase() : 'U'}
                    </div>)}
              </div>
              <span className="profile-name">{user.name}</span>
            </div>
          </div>
          <div className="profile-card-content">
            <div className="profile-info">
              <p>
                <span className="profile-info-label">Email:</span>
                <span>{user.email}</span>
              </p>
              <p>
                <span className="profile-info-label">Phone:</span>
                <span>{user.phoneNumber || 'Not provided'}</span>
              </p>
              <p>
                <span className="profile-info-label">Address:</span>
                <span>{user.address || 'Not provided'}</span>
              </p>
              <p>
                <span className="profile-info-label">Status:</span>
                <span
                    className={user.status === 'ACTIVE' || user.active ? 'profile-status-active' : 'profile-status-inactive'}>
                                {user.status || (user.active ? 'ACTIVE' : 'INACTIVE')}
                            </span>
              </p>
            </div>
            <div className="profile-actions">
              <button onClick={navigateToEditPage} className="profile-edit-button">Edit Profile</button>
              <button onClick={navigateToOrderHistory} className="profile-orders-button">View Orders</button>
            </div>
          </div>
        </div>
      </div>);
};

export default ProfilePage;