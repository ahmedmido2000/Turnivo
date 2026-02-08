import React, { useState, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faBars } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import { getProperties } from '../../api/propertyApi';
import { createReportProblem } from '../../api/reportProblemApi';

const DashboardReportProblemMain = ({ onMobileMenuClick }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  
  // State to track which problem type is selected
  const [selectedProblemType, setSelectedProblemType] = useState('home-service');
  
  // State for form inputs
  const [formData, setFormData] = useState({
    propertyId: '',
    email: '',
    date: '',
    typeIssue: '1',
    providerName: '',
    deviceType: '',
    description: ''
  });

  const [properties, setProperties] = useState([]);
  const [isLoadingProperties, setIsLoadingProperties] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load properties for selection
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setIsLoadingProperties(true);
        const accessToken = localStorage.getItem('access_token');

        if (!accessToken) {
          return;
        }

        const response = await getProperties(accessToken, 1);

        if (response.status === 1 && response.data && response.data.length > 0) {
          setProperties(response.data[0]?.items || []);
        } else {
          setProperties([]);
        }
      } catch (error) {
        console.error('Error fetching properties:', error);
      } finally {
        setIsLoadingProperties(false);
      }
    };

    fetchProperties();
  }, []);

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

  // Handle problem type selection
  const handleProblemTypeClick = (type) => {
    setSelectedProblemType(type);
    setFormData(prev => ({
      ...prev,
      propertyId: '',
      typeIssue: '1',
      providerName: '',
      deviceType: '',
    }));
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const accessToken = localStorage.getItem('access_token');

    if (!accessToken) {
      Swal.fire({
        icon: 'error',
        title: 'Authentication Required',
        text: 'Please login to continue',
      });
      return;
    }

    const baseValidation = formData.email.trim() && formData.date && formData.description.trim();
    const isHomeIssue = selectedProblemType === 'home-service';

    if (!baseValidation) {
      Swal.fire({
        icon: 'warning',
        title: 'Missing information',
        text: 'Email, date, and description are required.',
      });
      return;
    }

    if (isHomeIssue && !formData.propertyId) {
      Swal.fire({
        icon: 'warning',
        title: 'Property required',
        text: 'Please select a property for the home service issue.',
      });
      return;
    }

    if (isHomeIssue && !formData.typeIssue) {
      Swal.fire({
        icon: 'warning',
        title: 'Issue type required',
        text: 'Please select the issue type (Cleaning or Maintenance).',
      });
      return;
    }

    const propertyIdValue = formData.propertyId ? Number(formData.propertyId) : undefined;

    const payload = {
      property_id: propertyIdValue,
      type: isHomeIssue ? 1 : 2,
      email: formData.email.trim(),
      date: formData.date,
      type_issue: isHomeIssue ? Number(formData.typeIssue) : undefined,
      provider_name: isHomeIssue ? formData.providerName : '',
      description: formData.description.trim(),
    };

    if (!isHomeIssue && formData.deviceType.trim()) {
      payload.device_type = formData.deviceType.trim();
    }

    const sanitizedPayload = Object.fromEntries(
      Object.entries(payload).filter(([, value]) => value !== undefined && value !== '')
    );

    try {
      setIsSubmitting(true);
      const response = await createReportProblem(accessToken, sanitizedPayload);

      if (response.status === 1) {
        Swal.fire({
          icon: 'success',
          title: 'Submitted',
          text: response.message || 'Your problem report has been submitted successfully.',
        });

        setFormData({
          propertyId: '',
          email: '',
          date: '',
          typeIssue: '1',
          providerName: '',
          deviceType: '',
          description: '',
        });

        setSelectedProblemType('home-service');
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Submission failed',
          text: response.message || 'Unable to submit the problem report.',
        });
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.message || 'Failed to submit the problem report.',
      });
    } finally {
      setIsSubmitting(false);
    }
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
            <h2 className="mb-0 dashboard-title">Report a problem</h2>
          </div>
          <div className="d-flex justify-content-end gap-2 align-items-center">
            <div className="dashboard-lang-btn d-flex gap-1 align-items-center">
              <img src="/assets/global.svg" alt="notification" />
              <span>English</span>
            </div>
            <Link to='/supervisor/notifications' className="notification-icon-container">
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
        <h6 className="dashboard-routes-sub m-0">Report a problem</h6>
        <label className="form-label mt-3 mb-1">Problem Type:</label>
        <div className="d-flex gap-2 align-items-center">
                   <div 
            className={`d-flex gap-5 align-items-center problem-checkbox-container ${selectedProblemType === 'home-service' ? 'active' : ''}`}
            onClick={() => handleProblemTypeClick('home-service')}
          >
            <label className="checkbox-label">Issue with a Home Service</label>
            <label className="custom-checkbox">
              <input 
                type="checkbox" 
                checked={selectedProblemType === 'home-service'}
                onChange={() => handleProblemTypeClick('home-service')}
              />
              <span className="checkmark"></span>
            </label>
          </div>
                    <div 
            className={`d-flex gap-5 align-items-center problem-checkbox-container ${selectedProblemType === 'technical-issue' ? 'active' : ''}`}
            onClick={() => handleProblemTypeClick('technical-issue')}
          >
            <label className="checkbox-label">Technical Issue with the App</label>
            <label className="custom-checkbox">
              <input 
                type="checkbox" 
                checked={selectedProblemType === 'technical-issue'}
                onChange={() => handleProblemTypeClick('technical-issue')}
              />
              <span className="checkmark"></span>
            </label>
          </div>
        </div>
        
        <p className='problem-check-desc my-2'>Do you have questions? Feel free to reach out to us for support or more information about on next stay. Our team is ready to answer all your queries.</p>
        
        <form onSubmit={handleSubmit}>
          <div className="row mt-3 w-100 g-0 g-lg-2">
            <div className="col-12">
              <div className="mb-3 w-100">
                <select
                  className="form-control rounded-2 py-2 px-3 w-100"
                  name="propertyId"
                  value={formData.propertyId}
                  onChange={handleInputChange}
                  required={selectedProblemType === 'home-service'}
                >
                  <option value="">Select Property</option>
                  {properties.map((property) => (
                    <option key={property.id} value={property.id}>
                      {property.name || `Property #${property.id}`}
                    </option>
                  ))}
                </select>
                {isLoadingProperties && (
                  <small className="text-muted">Loading properties...</small>
                )}
                {!isLoadingProperties && properties.length === 0 && (
                  <small className="text-muted">No properties available</small>
                )}
                {selectedProblemType !== 'home-service' && (
                  <small className="text-muted">Optional for technical issues</small>
                )}
              </div>
            </div>

            <div className="col-md-6">
              <div className="mb-3 w-100">
                <input
                  type="email"
                  className="form-control rounded-2 py-2 px-3 w-100"
                  id="email"
                  name="email"
                  placeholder="E-mail address*"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="col-md-6">
              <div className="mb-3 w-100">
                <input
                  type="date"
                  className="form-control rounded-2 py-2 px-3 w-100"
                  id="date"
                  name="date"
                  placeholder="Date"
                  value={formData.date}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            {selectedProblemType === 'home-service' ? (
              <>
                <div className="col-md-6">
                  <div className="mb-3 w-100">
                    <select
                      className="form-control rounded-2 py-2 px-3 w-100"
                      name="typeIssue"
                      value={formData.typeIssue}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="1">Cleaning</option>
                      <option value="2">Maintenance</option>
                    </select>
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="mb-3 w-100">
                    <input
                      type="text"
                      className="form-control rounded-2 py-2 px-3 w-100"
                      id="providerName"
                      name="providerName"
                      placeholder="Service Provider Name (optional)"
                      value={formData.providerName}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </>
            ) : (
              <div className="col-md-6">
                <div className="mb-3 w-100">
                  <input
                    type="text"
                    className="form-control rounded-2 py-2 px-3 w-100"
                    id="deviceType"
                    name="deviceType"
                    placeholder="Device Type (optional)"
                    value={formData.deviceType}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            )}
            
            <div className="col-12">
              <div className="mb-3 w-100">
                <textarea 
                  rows='6' 
                  className='form-control rounded-2 py-2' 
                  placeholder='Problem Description'
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                ></textarea>
              </div>
            </div>
            
            <div className="col-12">
              <button 
                type="submit" 
                className="sec-btn rounded-2 px-5 py-2 w-100"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Sending...' : 'Send'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
};

export default DashboardReportProblemMain;