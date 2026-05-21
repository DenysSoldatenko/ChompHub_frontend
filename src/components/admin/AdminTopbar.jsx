import {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faSignOutAlt, faBars} from '@fortawesome/free-solid-svg-icons';
import {useError} from "../ErrorDisplay";
import {getMyProfile} from "../../api/userApi";

const FALLBACK_AVATAR = 'https://ui-avatars.com/api/?name=Admin&background=0f172a&color=fff&rounded=false&bold=true';

const AdminTopbar = () => {
  const navigate = useNavigate();
  const [userProfile, setUserProfile] = useState(null);
  const {RenderError, showError} = useError();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await getMyProfile();
        if (response) {
          setUserProfile(response);
        }
      } catch (error) {
        showError(error.response?.data?.message || error.message);
      }
    };

    fetchProfile();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("roles");
    navigate('/login');
  };

  const toggleSidebar = () => {
    document.querySelector('.admin-sidebar')?.classList.toggle('active');
  };

  return (
      <header className="admin-topbar">
        <div className="topbar-left">
          <button className="sidebar-toggle" onClick={toggleSidebar} aria-label="Toggle Sidebar">
            <FontAwesomeIcon icon={faBars}/>
          </button>
        </div>
        {RenderError}
        <div className="topbar-right">
          <div className="topbar-user-profile">
            <div className="topbar-profile-info">
              <span className="topbar-profile-name">{userProfile?.name || 'Administrator'}</span>
              <span className="topbar-profile-role">Admin</span>
            </div>
            <img
                src={userProfile?.profileUrl || FALLBACK_AVATAR}
                alt="User Profile"
                className="topbar-profile-image"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = FALLBACK_AVATAR;
                }}/>
            <div className="topbar-divider"></div>
            <button className="topbar-logout-btn" onClick={handleLogout} title="Log Out">
              <FontAwesomeIcon icon={faSignOutAlt}/>
            </button>
          </div>
        </div>
      </header>
  );
};

export default AdminTopbar;