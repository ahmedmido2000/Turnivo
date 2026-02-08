import React, { useState, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faBars, faUser, faLocationDot } from '@fortawesome/free-solid-svg-icons';
import { Person, Settings, Logout } from '@mui/icons-material';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import AddCircleOutlinedIcon from '@mui/icons-material/AddCircleOutlined';
import { Link } from 'react-router-dom';
import { getUserInfo, updateUserProfile } from '../../api/authApi';
import { getAccessToken, getUserData, updateUserData as updateStoredUserData } from '../../utils/authStorage';
import Swal from 'sweetalert2';

const DashboardClientProfileMain = ({ onMobileMenuClick }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  
  // Profile data state
  const [profileData, setProfileData] = useState({
    name: '',
    last_name: '',
    email: '',
    mobile: '',
    avatar: '',
    description: ''
  });
  
  // Edit mode state
  const [isEditMode, setIsEditMode] = useState(false);
  
  // Loading and error states
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);
  
  // Form data for editing
  const [formData, setFormData] = useState({
    name: '',
    last_name: '',
    email: '',
    mobile: ''
  });

  // Fetch user data on component mount
  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const accessToken = getAccessToken();
      const userData = getUserData();
      
      if (!accessToken || !userData) {
        setError('Authentication required');
        return;
      }
      
      const userId = userData.user_id;
      const response = await getUserInfo(accessToken, userId);
      
      if (response.status === 1 && response.data && response.data.length > 0) {
        const user = response.data[0];
        const userProfile = {
          name: user.name || '',
          last_name: user.last_name || '',
          email: user.email || '',
          mobile: user.mobile || '',
          avatar: user.avatar || '/assets/user.png',
          description: user.description || ''
        };
        
        setProfileData(userProfile);
        setFormData({
          name: userProfile.name,
          last_name: userProfile.last_name,
          email: userProfile.email,
          mobile: userProfile.mobile
        });
      }
    } catch (err) {
      console.error('Error fetching user data:', err);
      setError(err.message || 'Failed to load profile data');
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to load profile data. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEditClick = () => {
    setIsEditMode(true);
  };

  const handleCancelEdit = () => {
    setIsEditMode(false);
    // Reset form data to original profile data
    setFormData({
      name: profileData.name,
      last_name: profileData.last_name,
      email: profileData.email,
      mobile: profileData.mobile
    });
  };

  const handleSaveClick = async () => {
    try {
      // Validate form data
      if (!formData.name.trim() || !formData.last_name.trim() || !formData.email.trim() || !formData.mobile.trim()) {
        Swal.fire({
          icon: 'warning',
          title: 'Validation Error',
          text: 'Please fill in all required fields.',
        });
        return;
      }

      setIsSaving(true);
      const accessToken = getAccessToken();
      
      if (!accessToken) {
        throw new Error('Authentication required');
      }

      const response = await updateUserProfile(formData, accessToken);
      
      if (response.status === 1 && response.data && response.data.length > 0) {
        const updatedUser = response.data[0].model;
        const updatedProfile = {
          name: updatedUser.name,
          last_name: updatedUser.last_name,
          email: updatedUser.email,
          mobile: updatedUser.mobile,
          avatar: updatedUser.avatar || profileData.avatar,
          description: updatedUser.description || profileData.description
        };
        
        // Update local state
        setProfileData(updatedProfile);
        setFormData({
          name: updatedProfile.name,
          last_name: updatedProfile.last_name,
          email: updatedProfile.email,
          mobile: updatedProfile.mobile
        });
        
        // Update stored user data
        updateStoredUserData(updatedUser);
        
        // Exit edit mode
        setIsEditMode(false);
        
        // Show success message
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: response.data[0].message || 'Profile updated successfully!',
          timer: 2000,
          showConfirmButton: false
        });
      }
    } catch (err) {
      console.error('Error updating profile:', err);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: err.message || 'Failed to update profile. Please try again.',
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleDropdownItemClick = (item) => {
    console.log(`Clicked on ${item}`);
    setIsDropdownOpen(false);
    // Add your navigation logic here
  };

  if (isLoading) {
    return (
      <section>
        <div className="dashboard-main-nav px-md-3 px-1 py-1">
          <div className="d-flex justify-content-between align-items-center">
            <div className="d-flex align-items-center gap-0">
              <button 
                className="mobile-menu-btn"
                onClick={onMobileMenuClick}
                aria-label="Toggle menu"
              >
                <FontAwesomeIcon icon={faBars} />
              </button>
              <h2 className="mb-0 dashboard-title">Profile</h2>
            </div>
          </div>
        </div>
        <div className="dashboard-home-content px-3 mt-2 text-center">
          <p>Loading profile...</p>
        </div>
      </section>
    );
  }

  return (
    <section>
      <div className="dashboard-main-nav px-md-3 px-1 py-1">
        <div className="d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center gap-0">
            <button 
              className="mobile-menu-btn"
              onClick={onMobileMenuClick}
              aria-label="Toggle menu"
            >
              <FontAwesomeIcon icon={faBars} />
            </button>
            <h2 className="mb-0 dashboard-title">Profile</h2>
          </div>
          <div className="d-flex justify-content-end gap-2 align-items-center">
            <div className="dashboard-lang-btn d-flex gap-1 align-items-center">
              <img src="/assets/global.svg" alt="notification" />
              <span>English</span>
            </div>
            <Link to='/client/notifications' className="notification-icon-container">
              <img src="/assets/notification.svg" alt="notification" />
            </Link>
            
            {/* User Profile Dropdown */}
            <div className="user-dropdown-container d-none d-md-block" ref={dropdownRef}>
              <div 
                className="user-profile-trigger d-flex gap-2 align-items-center"
                onClick={toggleDropdown}
              >
                <FontAwesomeIcon 
                  icon={faChevronDown} 
                  className={`dropdown-chevron ${isDropdownOpen ? 'open' : ''}`}
                />
                <span className="user-name">{profileData.name} {profileData.last_name}</span>
                <img 
                  src={profileData.avatar} 
                  alt="User Profile" 
                  className="user-avatar-small"
                />
              </div>
              
              {isDropdownOpen && (
                <div className="user-dropdown-menu">
                  <div 
                    className="dropdown-item d-flex gap-2 align-items-center"
                    onClick={() => handleDropdownItemClick('profile')}
                  >
                    <img src="/assets/user-square.svg" alt="settings" />
                    <span>Profile</span>
                  </div>
                  <div 
                    className="dropdown-item d-flex gap-2 align-items-center"
                    onClick={() => handleDropdownItemClick('settings')}
                  >
                    <img src="/assets/setting-icon.svg" alt="settings" />
                    <span>Settings</span>
                  </div>
                  <div 
                    className="dropdown-item d-flex gap-2 align-items-center"
                    onClick={() => handleDropdownItemClick('logout')}
                  >
                    <img src="/assets/logout-icon.svg" alt="settings" />
                    <span>Logout</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="dashboard-home-content px-3 mt-2">
        <img src={profileData.avatar} className='profile-img' alt="user" />
        <h2 className="mb-0 property-problem-title">{profileData.name} {profileData.last_name}</h2>
        <div className="d-flex justify-content-between align-items-end gap-3 flex-wrap">
          <div>
            <div className="d-flex gap-1 align-items-center mt-2">
              <FontAwesomeIcon icon={faUser} className='gray-icon' />
              <p className='dashboard-small-title m-0'>New user</p>
            </div>
            <div className="d-flex gap-1 align-items-center mt-2">
              <FontAwesomeIcon icon={faLocationDot} className='gray-icon' />
              <p className='dashboard-small-title m-0'>Riyadh, Al Narjis Neighborhood</p>
            </div>
          </div>
          {!isEditMode ? (
            <button 
              className="main-btn rounded-2 px-3 py-2 w-50-100 d-flex justify-content-center gap-2 align-items-center"
              onClick={handleEditClick}
            >
              <img src="/assets/edit-2.svg" alt="edit" />
              Edit
            </button>
          ) : (
            <div className="d-flex gap-2">
              <button 
                className="btn btn-secondary rounded-2 px-3 py-2"
                onClick={handleCancelEdit}
                disabled={isSaving}
              >
                Cancel
              </button>
              <button 
                className="main-btn rounded-2 px-3 py-2 d-flex gap-2 align-items-center"
                onClick={handleSaveClick}
                disabled={isSaving}
              >
                {isSaving ? 'Saving...' : 'Save'}
              </button>
            </div>
          )}
        </div>
        <h6 className='service-desc mt-3'>About</h6>
        <p className='dashboard-small-title m-0'>{profileData.description || 'No description available.'}</p>
        <h6 className='service-desc mt-3'>Personal information</h6>

        <div className="row">
          <div className="col-12">
            <div className="mb-3 w-100">
              <label className="form-label mb-1">Phone number</label>
              <input
                type="text"
                name="mobile"
                className="form-control rounded-2 py-2 px-3 w-100"
                placeholder="+299 876 434 999"
                value={formData.mobile}
                onChange={handleInputChange}
                disabled={!isEditMode}
              />
            </div>
          </div>
          <div className="col-12">
            <div className="mb-3 w-100">
              <label className="form-label mb-1">First name</label>
              <input
                type="text"
                name="name"
                className="form-control rounded-2 py-2 px-3 w-100"
                placeholder="Omar"
                value={formData.name}
                onChange={handleInputChange}
                disabled={!isEditMode}
              />
            </div>
          </div>
          <div className="col-12">
            <div className="mb-3 w-100">
              <label className="form-label mb-1">Last name</label>
              <input
                type="text"
                name="last_name"
                className="form-control rounded-2 py-2 px-3 w-100"
                placeholder="Alrajihi"
                value={formData.last_name}
                onChange={handleInputChange}
                disabled={!isEditMode}
              />
            </div>
          </div>
          <div className="col-12">
            <div className="mb-3 w-100">
              <label className="form-label mb-1">Email</label>
              <input
                type="email"
                name="email"
                className="form-control rounded-2 py-2 px-3 w-100"
                placeholder="Omaralrajihi@gmail.com"
                value={formData.email}
                onChange={handleInputChange}
                disabled={!isEditMode}
              />
            </div>
          </div>
        </div>
        
      </div>
    </section>
  );
};

export default DashboardClientProfileMain;