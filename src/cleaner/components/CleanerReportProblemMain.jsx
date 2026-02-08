import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import CleanerHeader from './CleanerHeader';
import { createReportProblem } from '../../api/reportProblemApi';

const CleanerReportProblemMain = ({ onMobileMenuClick }) => {
  const [searchParams] = useSearchParams();
  const propertyId = searchParams.get('propertyId');
  
  // State to track which problem type is selected
  const [selectedProblemType, setSelectedProblemType] = useState('home-service');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // State for form inputs
  const [formData, setFormData] = useState({
    email: '',
    bookingDate: '',
    serviceProviderName: '',
    typeOfIssue: '',
    deviceType: '',
    problemDescription: ''
  });

  // Load user email and name on component mount
  useEffect(() => {
    const userData = localStorage.getItem('user_data');
    if (userData) {
      try {
        const parsedData = JSON.parse(userData);
        const userEmail = parsedData.email || sessionStorage.getItem('user_email');
        const userName = parsedData.name || parsedData.username || '';
        if (userEmail) {
          setFormData(prev => ({
            ...prev,
            email: userEmail,
            serviceProviderName: userName
          }));
        }
      } catch (error) {
        console.error('Error parsing user data:', error);
        const sessionEmail = sessionStorage.getItem('user_email');
        if (sessionEmail) {
          setFormData(prev => ({
            ...prev,
            email: sessionEmail
          }));
        }
      }
    } else {
      const sessionEmail = sessionStorage.getItem('user_email');
      if (sessionEmail) {
        setFormData(prev => ({
          ...prev,
          email: sessionEmail
        }));
      }
    }
  }, []);



  // Handle problem type selection
  const handleProblemTypeClick = (type) => {
    setSelectedProblemType(type);
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

    // Base validation
    const baseValidation = formData.email.trim() && formData.problemDescription.trim();

    if (!baseValidation) {
      Swal.fire({
        icon: 'warning',
        title: 'Missing information',
        text: 'Email and description are required.',
      });
      return;
    }

    // Specific validations based on problem type
    if (selectedProblemType === 'home-service' && !formData.bookingDate) {
      Swal.fire({
        icon: 'warning',
        title: 'Booking date required',
        text: 'Please select the booking date.',
      });
      return;
    }

    if (!formData.typeOfIssue) {
      Swal.fire({
        icon: 'warning',
        title: 'Issue type required',
        text: 'Please select the issue type.',
      });
      return;
    }

    if (selectedProblemType === 'technical-issue' && !formData.deviceType.trim()) {
      Swal.fire({
        icon: 'warning',
        title: 'Device type required',
        text: 'Please specify the device type.',
      });
      return;
    }

    const payload = {
      type: selectedProblemType === 'home-service' ? 1 : 2,
      email: formData.email.trim(),
      description: formData.problemDescription.trim(),
    };

    // Add property ID if available
    if (propertyId) {
      payload.property_id = Number(propertyId);
    }

    // Add conditional fields
    if (selectedProblemType === 'home-service') {
      payload.date = formData.bookingDate;
      if (formData.serviceProviderName.trim()) {
        payload.provider_name = formData.serviceProviderName.trim();
      }
      if (formData.typeOfIssue) {
        payload.type_issue = Number(formData.typeOfIssue);
      }
    } else {
      if (formData.typeOfIssue) {
        payload.type_issue = Number(formData.typeOfIssue);
      }
      if (formData.deviceType.trim()) {
        payload.device_type = formData.deviceType.trim();
      }
    }

    try {
      setIsSubmitting(true);
      const response = await createReportProblem(accessToken, payload);

      if (response.status === 1) {
        Swal.fire({
          icon: 'success',
          title: 'Submitted',
          text: response.message || 'Your problem report has been submitted successfully.',
        });

        // Reset form
        setFormData({
          email: '',
          bookingDate: '',
          serviceProviderName: '',
          typeOfIssue: '',
          deviceType: '',
          problemDescription: '',
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
      <CleanerHeader title="Report a Problem" onMobileMenuClick={onMobileMenuClick} />
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
            {/* Email field - always shown */}
            <div className="col-12">
              <div className="mb-3 w-100">
                <input
                  type="email"
                  className="form-control rounded-2 py-2 px-3 w-100"
                  id="email"
                  name="email"
                  placeholder="E-mail address*"
                  value={formData.email}
                  onChange={handleInputChange}
                  readOnly
                  required
                />
              </div>
            </div>

            {/* Conditional fields based on problem type */}
            {selectedProblemType === 'home-service' ? (
              <>
                <div className="col-md-4">
                  <div className="mb-3 w-100">
                    <input
                      type="date"
                      className="form-control rounded-2 py-2 px-3 w-100"
                      id="bookingDate"
                      name="bookingDate"
                      placeholder="Booking Date"
                      value={formData.bookingDate}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="mb-3 w-100">
                    <input
                      type="text"
                      className="form-control rounded-2 py-2 px-3 w-100"
                      id="serviceProviderName"
                      name="serviceProviderName"
                      placeholder="Service Provider Name"
                      value={formData.serviceProviderName}
                      onChange={handleInputChange}
                      readOnly
                    />
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="mb-3 w-100">
                    <select
                      className="form-control rounded-2 py-2 px-3 w-100"
                      id="typeOfIssue"
                      name="typeOfIssue"
                      value={formData.typeOfIssue}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Select Issue Type*</option>
                      <option value="1">Cleaning</option>
                      <option value="2">Maintenance</option>
                    </select>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="col-md-6">
                  <div className="mb-3 w-100">
                    <select
                      className="form-control rounded-2 py-2 px-3 w-100"
                      id="typeOfIssue"
                      name="typeOfIssue"
                      value={formData.typeOfIssue}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Select Issue Type*</option>
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
                      id="deviceType"
                      name="deviceType"
                      placeholder="Device Type"
                      value={formData.deviceType}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
              </>
            )}
            
            {/* Problem Description - always shown */}
            <div className="col-12">
              <div className="mb-3 w-100">
                <textarea 
                  rows='6' 
                  className='form-control rounded-2 py-2' 
                  placeholder='Problem Description'
                  id="problemDescription"
                  name="problemDescription"
                  value={formData.problemDescription}
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

export default CleanerReportProblemMain;