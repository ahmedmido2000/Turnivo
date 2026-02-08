import React, { useState, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faBars, faUser, faLocationDot } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { updateUserProfile } from '../../api/authApi';
import ProviderHeader from './ProviderHeader';
import Swal from 'sweetalert2';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useProviderData } from '../context/ProviderDataContext';

const DashboardAvailabilityMain = ({ onMobileMenuClick }) => {
  const { token: accessToken } = useSelector((state) => state.auth);
  const { 
    userInfo, 
    userFullName, 
    userAvatar, 
    userEmail, 
    userMobile, 
    userAddress, 
    userDescription,
    refreshUserInfo,
    isLoading: isDataLoading
  } = useProviderData();
  
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form data
  const [formData, setFormData] = useState({
    name: '',
    last_name: '',
    mobile: '',
    address: '',
    description: ''
  });

  // Sync form data when userInfo or isEditing changes
  useEffect(() => {
    if (userInfo && !isSubmitting) {
      setFormData({
        name: userInfo.name || '',
        last_name: userInfo.last_name || '',
        mobile: userInfo.mobile || '',
        address: userInfo.address || '',
        description: userInfo.description || ''
      });
    }
  }, [userInfo, isEditing, isSubmitting]);

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    
    try {
      setIsSubmitting(true);
      const response = await updateUserProfile(formData, accessToken);
      
      if (response.status === 1) {
        toast.success('Profile updated successfully!');
        setIsEditing(false);
        refreshUserInfo();
      } else {
        toast.error(response.message || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Failed to update profile:', error);
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Cancel editing
  const handleCancel = () => {
    setIsEditing(false);
  };

  return (
    <section>
      <ToastContainer />
      <ProviderHeader title="Profile" onMobileMenuClick={onMobileMenuClick} />
      
      <div className="dashboard-home-content px-md-4 px-3 mt-4">
        {isDataLoading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : (
          <div className="profile-redesign-container">
            {/* Profile Header Card */}
            <div className="bg-white rounded-4 p-4 mb-4 shadow-sm">
              <div className="d-flex flex-wrap flex-md-nowrap justify-content-between align-items-start gap-4">
                <div className="d-flex align-items-center gap-4">
                  <div className="profile-avatar-wrapper">
                    <img 
                      src={userAvatar} 
                      alt="User Avatar" 
                      className="rounded-circle border border-4 border-light shadow-sm"
                      style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                    />
                  </div>
                  <div>
                    <h2 className="profile-name-title mb-1">{userFullName}</h2>
                    <div className="d-flex align-items-center gap-2 text-muted mb-2">
                      <FontAwesomeIcon icon={faLocationDot} className="text-secondary" />
                      <span>{userAddress || 'No address set'}</span>
                    </div>
                  </div>
                </div>

                {!isEditing ? (
                  <button 
                    className="sec-btn d-flex align-items-center gap-2 rounded-pill px-4 py-2"
                    onClick={() => setIsEditing(true)}
                  >
                    <img src="/assets/edit-2.svg" alt="edit" style={{ width: '18px' }} />
                    <span>Edit</span>
                  </button>
                ) : (
                  <div className="d-flex gap-2">
                    <button 
                      className="btn btn-outline-secondary rounded-pill px-4"
                      onClick={handleCancel}
                      disabled={isSubmitting}
                    >
                      Cancel
                    </button>
                    <button 
                      className="sec-btn rounded-pill px-4 py-2"
                      onClick={handleSubmit}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Saving...' : 'Save'}
                    </button>
                  </div>
                )}
              </div>

              {/* About Section */}
              <div className="mt-4 pt-4 border-top">
                <h5 className="section-title mb-3">About</h5>
                {!isEditing ? (
                  <p className="profile-about-text text-muted">
                    {userDescription || 'No description available. Click edit to add an about section.'}
                  </p>
                ) : (
                  <textarea
                    name="description"
                    className="form-control rounded-3 p-3 bg-light"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Tell us about yourself..."
                    rows="4"
                  />
                )}
              </div>
            </div>

            {/* Personal Information Card */}
            <div className="bg-white rounded-4 p-4 mb-4 shadow-sm">
              <h5 className="section-title mb-4">Personal information</h5>
              
              <div className="row g-4">
                {/* Phone number */}
                <div className="col-12">
                  <div className="form-group">
                    <label className="form-label text-muted small fw-bold mb-1">Phone number</label>
                    <input
                      type="tel"
                      name="mobile"
                      className={`form-control rounded-3 py-2 px-3 ${!isEditing ? 'bg-light border-0' : ''}`}
                      value={formData.mobile}
                      onChange={handleInputChange}
                      readOnly={!isEditing}
                    />
                  </div>
                </div>

                {/* First Name */}
                <div className="col-md-6">
                  <div className="form-group">
                    <label className="form-label text-muted small fw-bold mb-1">First Name</label>
                    <input
                      type="text"
                      name="name"
                      className={`form-control rounded-3 py-2 px-3 ${!isEditing ? 'bg-light border-0' : ''}`}
                      value={formData.name}
                      onChange={handleInputChange}
                      readOnly={!isEditing}
                    />
                  </div>
                </div>

                {/* Last Name */}
                <div className="col-md-6">
                  <div className="form-group">
                    <label className="form-label text-muted small fw-bold mb-1">Last Name</label>
                    <input
                      type="text"
                      name="last_name"
                      className={`form-control rounded-3 py-2 px-3 ${!isEditing ? 'bg-light border-0' : ''}`}
                      value={formData.last_name}
                      onChange={handleInputChange}
                      readOnly={!isEditing}
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="col-12">
                  <div className="form-group">
                    <label className="form-label text-muted small fw-bold mb-1">Email</label>
                    <input
                      type="email"
                      className="form-control rounded-3 py-2 px-3 bg-light border-0"
                      value={userEmail}
                      disabled
                    />
                  </div>
                </div>

                {/* Address (Editable) */}
                <div className="col-12">
                  <div className="form-group">
                    <label className="form-label text-muted small fw-bold mb-1">Address</label>
                    <input
                      type="text"
                      name="address"
                      className={`form-control rounded-3 py-2 px-3 ${!isEditing ? 'bg-light border-0' : ''}`}
                      value={formData.address}
                      onChange={handleInputChange}
                      readOnly={!isEditing}
                      placeholder="Enter your address"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default DashboardAvailabilityMain;
