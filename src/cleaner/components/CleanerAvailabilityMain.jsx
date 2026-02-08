import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faLocationDot } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import { useCleanerData } from '../context/CleanerDataContext';
import CleanerHeader from './CleanerHeader';
import { updateCleanerProfile } from '../../api/cleanerApi';
import { getUserInfo } from '../../api/authApi';

const CleanerAvailabilityMain = ({ onMobileMenuClick }) => {
  // Get user data from context
  const { 
    userFullName, 
    userAvatar, 
    userEmail, 
    userMobile, 
    userAddress, 
    userDescription, 
    userStatus
  } = useCleanerData();

  // State for edit mode
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  // State for display data (updated after successful save)
  const [formData, setFormData] = useState({
    fullName: userFullName || '',
    email: userEmail || '',
    mobile: userMobile || '',
    address: userAddress || '',
    description: userDescription || ''
  });
  
  // State for edit form (temp edit data)
  const [editData, setEditData] = useState({
    fullName: userFullName || '',
    email: userEmail || '',
    mobile: userMobile || '',
    address: userAddress || '',
    description: userDescription || ''
  });

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle field focus - select all text when in edit mode
  const handleFieldFocus = (e) => {
    if (isEditing) {
      e.target.select();
    }
  };

  // Load user data from API on component mount
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const accessToken = localStorage.getItem('access_token');
        const userData = localStorage.getItem('user_data');
        const parsedUserData = JSON.parse(userData);
        const userId = parsedUserData?.id;

        if (accessToken && userId) {
          const userInfo = await getUserInfo(accessToken, userId);
          
          if (userInfo.status === 1 && userInfo.data && Array.isArray(userInfo.data)) {
            const user = userInfo.data[0];
            const fullName = `${user.name || ''} ${user.last_name || ''}`.trim();
            
            const userData = {
              fullName: fullName,
              email: user.email || '',
              mobile: user.mobile || '',
              address: user.address || '',
              description: user.description || ''
            };
            
            setFormData(userData);
            setEditData(userData);
          }
        }
      } catch (error) {
        console.error('Error loading user data:', error);
      }
    };

    loadUserData();
  }, []);

  // Handle save
  const handleSave = async () => {
    // Validate inputs
    if (!editData.fullName.trim() || !editData.mobile.trim()) {
      Swal.fire({
        icon: 'warning',
        title: 'Missing Information',
        text: 'Full name and mobile are required.',
      });
      return;
    }

    try {
      setIsSaving(true);

      // Split full name into first and last name
      const nameParts = editData.fullName.trim().split(' ');
      const firstName = nameParts[0];
      const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : '';

      const payload = {
        name: firstName,
        last_name: lastName,
        mobile: editData.mobile.trim(),
        description: editData.description.trim(),
        address: editData.address.trim()
      };

      // Make API call using the new function
      const response = await updateCleanerProfile(payload);

      if (response.status === 1 || response.status === true) {
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Profile updated successfully.',
        });
        
        // Fetch updated user data from getUserInfo
        try {
          const accessToken = localStorage.getItem('access_token');
          const userData = localStorage.getItem('user_data');
          const parsedUserData = JSON.parse(userData);
          const userId = parsedUserData?.id;

          if (accessToken && userId) {
            const updatedUserInfo = await getUserInfo(accessToken, userId);
            
            if (updatedUserInfo.status === 1 && updatedUserInfo.data && Array.isArray(updatedUserInfo.data)) {
              const userInfo = updatedUserInfo.data[0];
              const fullName = `${userInfo.name || ''} ${userInfo.last_name || ''}`.trim();
              
              const updatedData = {
                fullName: fullName,
                email: userInfo.email || '',
                mobile: userInfo.mobile || '',
                address: userInfo.address || '',
                description: userInfo.description || ''
              };
              
              setFormData(updatedData);
              setEditData(updatedData);
            }
          }
        } catch (fetchError) {
          console.error('Error fetching updated user data:', fetchError);
        }
        
        setIsEditing(false);
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Update Failed',
          text: response.message || 'Failed to update profile.',
        });
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.message || 'Failed to update profile.',
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Handle cancel
  const handleCancel = () => {
    setEditData({ ...formData });
    setIsEditing(false);
  };

  return (
    <section>
      <CleanerHeader title="Calendar & Availability" onMobileMenuClick={onMobileMenuClick} />
      <div className="dashboard-home-content px-3 mt-2">
        <img src={userAvatar} className='profile-img' alt="user" />
        <h2 className="mb-0 property-problem-title">{isEditing ? editData.fullName : formData.fullName}</h2>
        <div className="d-flex justify-content-between align-items-end gap-3 flex-wrap">
          <div>
            <div className="d-flex gap-1 align-items-center mt-2">
              <FontAwesomeIcon icon={faUser} className='gray-icon' />
              <p className='dashboard-small-title m-0'>{userStatus || 'Available'}</p>
            </div>
            <div className="d-flex gap-1 align-items-center mt-2">
              <FontAwesomeIcon icon={faLocationDot} className='gray-icon' />
              <p className='dashboard-small-title m-0'>{isEditing ? editData.address : formData.address || 'No address provided'}</p>
            </div>
          </div>
          {!isEditing ? (
            <button 
              className="main-btn rounded-2 px-3 py-2 w-50-100 d-flex gap-2 align-items-center"
              onClick={() => setIsEditing(true)}
            >
              <img src="/assets/edit-2.svg" alt="edit" />
              Edit
            </button>
          ) : (
            <div className="d-flex gap-2 w-50-100">
              <button 
                className="main-btn rounded-2 px-3 py-2 flex-grow-1 d-flex gap-2 align-items-center justify-content-center"
                onClick={handleSave}
                disabled={isSaving}
              >
                {isSaving ? 'Saving...' : 'Save'}
              </button>
              <button 
                className="btn btn-outline-secondary rounded-2 px-3 py-2 flex-grow-1"
                onClick={handleCancel}
                disabled={isSaving}
              >
                Cancel
              </button>
            </div>
          )}
        </div>
        <h6 className='service-desc mt-3'>About</h6>
        {!isEditing && (
          <p className='dashboard-small-title m-0'>{formData.description || 'No description provided.'}</p>
        )}
        <h6 className='service-desc mt-3'>Personal information</h6>

        <div className="row">
          <div className="col-12">
                <div className="mb-3 w-100">
                  <label className="form-label mb-1">Full name</label>
                  <input
                    type="text"
                    name="fullName"
                    className="form-control rounded-2 py-2 px-3 w-100"
                    placeholder="Enter your full name"
                    value={isEditing ? editData.fullName : formData.fullName}
                    onChange={handleInputChange}
                    onFocus={handleFieldFocus}
                    readOnly={!isEditing}
                  />
                </div>
          </div>
          <div className="col-md-6">
                <div className="mb-3 w-100">
                  <label className="form-label mb-1">Email</label>
                  <input
                    type="email"
                    name="email"
                    className="form-control rounded-2 py-2 px-3 w-100"
                    placeholder="Enter your email"
                    value={isEditing ? editData.email : formData.email}
                    onChange={handleInputChange}
                    readOnly
                  />
                </div>
          </div>
          <div className="col-md-6">
                <div className="mb-3 w-100">
                  <label className="form-label mb-1">Phone number</label>
                  <input
                    type="text"
                    name="mobile"
                    className="form-control rounded-2 py-2 px-3 w-100"
                    placeholder="Enter your phone number"
                    value={isEditing ? editData.mobile : formData.mobile}
                    onChange={handleInputChange}
                    onFocus={handleFieldFocus}
                    readOnly={!isEditing}
                  />
                </div>
          </div>
          <div className="col-12">
                <div className="mb-3 w-100">
                  <label className="form-label mb-1">Address</label>
                  <input
                    type="text"
                    name="address"
                    className="form-control rounded-2 py-2 px-3 w-100"
                    placeholder="Enter your address"
                    value={isEditing ? editData.address : formData.address}
                    onChange={handleInputChange}
                    onFocus={handleFieldFocus}
                    readOnly={!isEditing}
                  />
                </div>
          </div>
          {isEditing && (
            <div className="col-12">
                  <div className="mb-3 w-100">
                    <label className="form-label mb-1">Description</label>
                    <textarea
                      name="description"
                      className="form-control rounded-2 py-2 px-3 w-100"
                      placeholder="Tell us about yourself..."
                      rows="4"
                      value={editData.description}
                      onChange={handleInputChange}
                      onFocus={handleFieldFocus}
                    />
                  </div>
            </div>
          )}
        </div>
        
      </div>
    </section>
  );
};

export default CleanerAvailabilityMain;