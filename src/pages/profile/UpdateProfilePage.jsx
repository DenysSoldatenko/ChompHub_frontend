import {useState, useEffect, useRef} from 'react';
import {useNavigate} from 'react-router-dom';
import {useError} from '../../components/ErrorDisplay';
import {getMyProfile, updateProfile, updateProfilePicture, deactivateAccount} from '../../api/userApi';
import {logout} from '../../utils/authStorage';

const UpdateProfilePage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [address, setAddress] = useState('');
  const [profileImage, setProfileImage] = useState(null);
  const [previewImage, setPreviewImage] = useState('');

  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const {RenderError, showError} = useError();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const userData = await getMyProfile();
        if (userData) {
          setName(userData.name || '');
          setEmail(userData.email || '');
          setPhoneNumber(userData.phoneNumber || '');
          setAddress(userData.address || '');
          setPreviewImage(userData.profileUrl || '');
        }
      } catch (error) {
        showError(error.response?.data?.detail || error.response?.data?.message || error.message);
      }
    };

    fetchUserProfile();
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();

    if (!window.confirm('Are you sure you want to update your profile?')) {
      return;
    }

    try {
      await updateProfile({
        name, email, password, phoneNumber, address
      });

      if (profileImage) {
        await updateProfilePicture(profileImage);
      }

      navigate('/profile');
    } catch (error) {
      showError(error.response?.data?.detail || error.response?.data?.message || 'Failed to update profile. Ensure password has at least 8 chars, 1 uppercase, 1 digit, 1 special char.');
    }
  };

  const handleDeactivateProfile = async () => {
    if (!window.confirm('Are you sure you want to close your account? This action cannot be undone.')) {
      return;
    }

    try {
      await deactivateAccount();
      logout();
      navigate('/home');
    } catch (error) {
      showError(error.response?.data?.detail || error.response?.data?.message || error.message);
    }
  };

  return (<div className="profile-container">
        {RenderError}
        <h1 className="profile-title">Update Profile</h1>
        <div className="profile-card">
          <div className="profile-card-header">
            <div className="profile-card-title">
              <div className="profile-avatar-wrapper" onClick={triggerFileInput}>
                {previewImage ? (<img src={previewImage} alt="Profile Preview" className="avatar-image-edit"/>) : (
                    <div className="avatar-fallback">
                      {name ? name.substring(0, 2).toUpperCase() : 'U'}
                    </div>)}
                <div className="avatar-edit-overlay">
                  <span>📷</span>
                </div>
              </div>
              <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  accept="image/*"
                  style={{display: 'none'}}/>
              <button
                  type="button"
                  className="profile-change-photo-btn"
                  onClick={triggerFileInput}>Change Photo
              </button>
              <span className="profile-name">{name || 'Your Name'}</span>
            </div>
          </div>
          <div className="profile-card-content">
            <form className="profile-form" onSubmit={handleUpdateProfile}>
              <div className="form-grid">
                <div className="profile-form-group">
                  <label htmlFor="name" className="profile-form-label">Name:</label>
                  <input
                      type="text"
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="profile-form-input"
                      required/>
                </div>
                <div className="profile-form-group">
                  <label htmlFor="email" className="profile-form-label">Email:</label>
                  <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="profile-form-input"
                      required/>
                </div>

                <div className="profile-form-group">
                  <label htmlFor="password" className="profile-form-label">
                    Password (Required by server):
                  </label>
                  <input
                      type="password"
                      id="password"
                      placeholder="e.g. SecureP@ssw0rd123!"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="profile-form-input"
                      required/>
                </div>
                <div className="profile-form-group">
                  <label htmlFor="phoneNumber" className="profile-form-label">Phone:</label>
                  <input
                      type="tel"
                      id="phoneNumber"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="profile-form-input"
                      required
                  />
                </div>
                <div className="profile-form-group" style={{gridColumn: 'span 2'}}>
                  <label htmlFor="address" className="profile-form-label">Address (min 10 characters):</label>
                  <input
                      type="text"
                      id="address"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="profile-form-input"
                      required
                  />
                </div>
              </div>
              <div className="profile-actions">
                <button type="submit" className="profile-submit-btn">
                  Update Profile
                </button>
                <button
                    type="button"
                    className="profile-deactivate-btn"
                    onClick={handleDeactivateProfile}>Deactivate Account
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>);
};

export default UpdateProfilePage;