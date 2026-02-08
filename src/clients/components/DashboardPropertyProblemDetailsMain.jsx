import React, { useState, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faBars } from '@fortawesome/free-solid-svg-icons';
import { Link, useSearchParams } from 'react-router-dom';
import { getPropertyProblemDetails } from '../../api/cleaningServiceApi';
import Swal from 'sweetalert2';

const DashboardPropertyProblemDetailsMain = ({ onMobileMenuClick }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [searchParams] = useSearchParams();
  
  // API state
  const [problemData, setProblemData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Get problem ID from URL
  const problemId = searchParams.get('id');
  
  // Fetch problem details
  useEffect(() => {
    const fetchProblemDetails = async () => {
      if (!problemId) {
        setError('No problem ID provided');
        setLoading(false);
        return;
      }
      
      setLoading(true);
      setError(null);
      
      try {
        const accessToken = localStorage.getItem('access_token');
        if (!accessToken) {
          throw new Error('No access token found. Please login again.');
        }
        
        const response = await getPropertyProblemDetails(problemId, accessToken);
        
        if (response && response.status === 1 && response.data && response.data[0]) {
          setProblemData(response.data[0]);
        } else {
          throw new Error('Failed to fetch problem details');
        }
      } catch (err) {
        console.error('Error fetching problem details:', err);
        setError(err.message || 'Failed to fetch problem details');
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: err.message || 'Failed to fetch problem details. Please try again.',
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchProblemDetails();
  }, [problemId]);

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
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  // Get problem type label
  const getProblemTypeLabel = (type) => {
    return type === 1 ? 'Cleaning' : type === 2 ? 'Maintenance' : 'Other';
  };

  // Get status badge class
  const getStatusBadgeClass = (status) => {
    return status === 0 ? 'pending-badge' : 'processed-badge';
  };

  // Get status label
  const getStatusLabel = (status) => {
    return status === 0 ? 'Your request is pending' : 'Your request is Processed';
  };

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
            <h2 className="mb-0 dashboard-title">Problem Details</h2>
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
                <span className="user-name">Omar Alrajhi</span>
                <img 
                  src="/assets/user.png" 
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
        <div className="d-flex justify-content-between align-items-center gap-3 flex-wrap">
          <h2 className="mb-0 dashboard-title">Problem Details</h2>
          <Link to="/client/property-problem" className="sec-btn rounded-2 px-3 py-2">
            Back to Problems
          </Link>
        </div>
        
        {/* Loading state */}
        {loading && (
          <div className="text-center mt-4 mb-4">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        )}
        
        {/* Error state */}
        {error && !loading && (
          <div className="text-center mt-4 mb-4">
            <p className="text-danger">{error}</p>
            <Link to="/client/property-problem" className="btn btn-primary">
              Back to Problems
            </Link>
          </div>
        )}
        
        {/* Problem details */}
        {!loading && !error && problemData && (
          <div className="row">
            <div className="col-12">
              <div className="property-management-card mt-3 w-100">
                <div className="d-flex align-items-start flex-column flex-md-row gap-3 w-100">
                  <div className="d-flex flex-column align-items-start gap-2 w-100">
                    
                    {/* Property Information */}
                    <div className="d-flex justify-content-between w-100 align-items-center">
                      <h6 className="property-management-card-title m-0">
                        {problemData.property_id?.name || 'Property'}
                      </h6>
                      <div className='villa-badge py-1 px-3 rounded-pill'>
                        {getProblemTypeLabel(problemData.type)}
                      </div>
                    </div>
                    
                    <img 
                      src={problemData.property_id?.image || '/assets/property-management-card-img.png'} 
                      className='property-management-card-img' 
                      alt="Property" 
                    />
                    
                    {/* Date Created */}
                    <div className="d-flex gap-4 align-items-center flex-wrap bg-white w-100 py-1 px-2 rounded-1">
                      <div className="d-flex align-items-center gap-1">
                        <img src="/assets/calendar-3.svg" alt="calendar" />
                        <p className="dashboard-home-card-2-desc-3 m-0">
                          {formatDate(problemData.created_at)}
                        </p>
                      </div>
                    </div>
                    
                    {/* Property Details */}
                    <h2 className="mb-0 dashboard-title">{problemData.property_id?.name || 'Property'}</h2>
                    <div className="d-flex align-items-center">
                      <img src="/assets/location.svg" className='img-fluid' alt="location" />
                      <p className="property-management-card-address m-0">
                        {problemData.property_id?.address || 'N/A'}
                      </p>
                    </div>
                    
                    {/* Property Stats */}
                    <div className="d-flex gap-3 align-items-center justify-content-between flex-wrap w-100 py-1 px-2 rounded-1 bg-light">
                      <div className="d-flex align-items-center gap-1">
                        <img src="/assets/property-card-icon-1.svg" className='img-fluid' alt="floors" />
                        <h6 className="property-management-card-icon-label m-0">
                          {problemData.property_id?.floor || 0} floors
                        </h6>
                      </div>
                      <div className='card-border-right'>|</div>
                      <div className="d-flex align-items-center gap-1">
                        <img src="/assets/property-card-icon-2.svg" className='img-fluid' alt="rooms" />
                        <h6 className="property-management-card-icon-label m-0">
                          {problemData.property_id?.number_room || 0} rooms
                        </h6>
                      </div>
                      <div className='card-border-right'>|</div>
                      <div className="d-flex align-items-center gap-1">
                        <img src="/assets/property-card-icon-3.svg" className='img-fluid' alt="area" />
                        <h6 className="property-management-card-icon-label m-0">
                          {problemData.property_id?.area || 0} m²
                        </h6>
                      </div>
                      <div className='card-border-right'>|</div>
                      <div className="d-flex align-items-center gap-1">
                        <img src="/assets/property-card-icon-4.svg" className='img-fluid' alt="bathrooms" />
                        <h6 className="property-management-card-icon-label m-0">
                          {problemData.property_id?.number_bathroom || 0} bathrooms
                        </h6>
                      </div>
                    </div>
                    
                    {/* Reporter Information */}
                    <h6 className="property-management-card-title mb-1 mt-2">Reported By</h6>
                    <div className="d-flex align-items-center gap-2">
                      <img 
                        src={problemData.user?.avatar || '/assets/user.png'} 
                        alt="Reporter"
                        style={{ width: '50px', height: '50px', borderRadius: '50%', objectFit: 'cover' }}
                      />
                      <div>
                        <p className="property-management-card-title m-0">
                          {problemData.user?.name || 'Unknown'}
                        </p>
                        <p className="property-management-card-address m-0">
                          Rating: {problemData.user?.rate || 0}/5
                        </p>
                      </div>
                    </div>
                    
                    {/* Client Information */}
                   
                    
                    {/* Problem Description */}
                    <h6 className="property-management-card-title mb-1 mt-2">Problem Description</h6>
                    <p className='problem-desc bg-white p-2 w-100 m-0'>
                      {problemData.description || 'No description provided'}
                    </p>
                    
                    {/* Status Badge */}
                    <div className={`${getStatusBadgeClass(problemData.status)} w-100 py-2 text-center mt-2`}>
                      {getStatusLabel(problemData.status)}
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="d-flex justify-content-end w-100 gap-2 mt-3">
                      <Link 
                        to={`/client/maintenance?property_id=${problemData.property_id?.id}`} 
                        className="main-btn rounded-2 px-3 py-2 w-50-100 text-decoration-none"
                      >
                        Request maintenance service
                      </Link>
                      <Link 
                        to={`/client/cleaning-request?property_id=${problemData.property_id?.id}`} 
                        className="sec-btn rounded-2 px-4 py-2 w-50-100 text-decoration-none"
                      >
                        Request cleaning service
                      </Link>
                    </div>
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

export default DashboardPropertyProblemDetailsMain;
