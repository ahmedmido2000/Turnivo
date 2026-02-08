import React, { useState, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import Swal from 'sweetalert2';
import { getListsData, createProperty } from '../../api/propertyApi';
import ClientHeader from './ClientHeader';

const DashboardCreatePropertyMain = ({ onMobileMenuClick }) => {
  // Add state to track current step
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;
  
  // Add state to track if co-host checkbox is checked
  const [isCoHostChecked, setIsCoHostChecked] = useState(false);

  // State for lists data
  const [listsData, setListsData] = useState({
    propertyTypes: [],
    cities: [],
    platforms: []
  });
  const [isLoadingLists, setIsLoadingLists] = useState(true);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    property_type_id: '',
    area: '',
    floor: '',
    number_room: '',
    number_bathroom: '',
    address: '',
    city_id: '',
    postal_code: '',
    lat: '',
    lang: '',
    image: null,
    specail_note: '',
    co_host_name: '',
    co_host_mobile: '',
    platform_id: '',
    platform_link: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch lists data on component mount
  useEffect(() => {
    const fetchLists = async () => {
      try {
        const accessToken = localStorage.getItem('access_token');
        if (!accessToken) {
          Swal.fire({
            icon: 'error',
            title: 'Authentication Required',
            text: 'Please login to continue',
          });
          return;
        }

        const response = await getListsData(accessToken);
        if (response.status === 1 && response.data && response.data.length > 0) {
          const data = response.data[0];
          setListsData({
            propertyTypes: data.PropertyType || [],
            cities: data.city || [],
            platforms: data.Platform || []
          });
        }
      } catch (error) {
        console.error('Error fetching lists:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to load form data. Please refresh the page.',
        });
      } finally {
        setIsLoadingLists(false);
      }
    };

    fetchLists();
  }, []);

  const [image, setImage] = useState(null);
  const [fileName, setFileName] = useState('');
  const inputRef = useRef(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setFileName(file.name);
    setImage(URL.createObjectURL(file));
    setFormData(prev => ({ ...prev, image: file }));
  };

  const handleRemove = () => {
    setImage(null);
    setFileName('');
    inputRef.current.value = '';
    setFormData(prev => ({ ...prev, image: null }));
  };

  // Function to handle next step
  const handleNextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  // Function to handle previous step
  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Function to handle step click from the step indicator
  const handleStepClick = (stepNumber) => {
    setCurrentStep(stepNumber);
  };
  
  // Function to handle co-host checkbox change
  const handleCoHostChange = (e) => {
    setIsCoHostChecked(e.target.checked);
    if (!e.target.checked) {
      // Clear co-host fields when unchecked
      setFormData(prev => ({
        ...prev,
        co_host_name: '',
        co_host_mobile: '',
        platform_id: '',
        platform_link: ''
      }));
    }
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Validate form data
  const validateForm = () => {
    const errors = [];

    // Step 1 validation
    if (!formData.name.trim()) errors.push('Property name is required');
    if (!formData.property_type_id) errors.push('Property type is required');
    if (!formData.area) errors.push('Area is required');
    if (!formData.floor) errors.push('Floor is required');
    if (!formData.number_room) errors.push('Number of rooms is required');
    if (!formData.number_bathroom) errors.push('Number of bathrooms is required');

    // Step 2 validation
    if (!formData.address.trim()) errors.push('Address is required');
    if (!formData.city_id) errors.push('City is required');
    if (!formData.postal_code.trim()) errors.push('Postal code is required');

    // Step 3 validation
    if (!formData.image) errors.push('Property image is required');

    // Step 4 validation (co-host is optional)
    if (isCoHostChecked) {
      if (!formData.co_host_name.trim()) errors.push('Co-host name is required');
      if (!formData.co_host_mobile.trim()) errors.push('Co-host mobile is required');
      if (!formData.platform_id) errors.push('Platform is required');
      if (!formData.platform_link.trim()) errors.push('Platform link is required');
    }

    return errors;
  };

  // Handle form submission
  const handleSubmit = async () => {
    const errors = validateForm();
    if (errors.length > 0) {
      Swal.fire({
        icon: 'error',
        title: 'Validation Error',
        html: errors.join('<br>'),
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const accessToken = localStorage.getItem('access_token');
      if (!accessToken) {
        Swal.fire({
          icon: 'error',
          title: 'Authentication Required',
          text: 'Please login to continue',
        });
        return;
      }

      // Create FormData for file upload
      const submitData = new FormData();
      // Fields that should be integers
      const integerFields = ['property_type_id', 'area', 'floor', 'number_room', 'number_bathroom', 'city_id', 'platform_id'];
      
      Object.keys(formData).forEach(key => {
        if (formData[key] !== null && formData[key] !== '') {
          // Only add co-host fields if checkbox is checked
          if (key.startsWith('co_host_') || key.startsWith('platform_')) {
            if (isCoHostChecked) {
              // Convert to integer if it's a numeric field
              const value = integerFields.includes(key) ? parseInt(formData[key], 10) : formData[key];
              submitData.append(key, value);
            }
          } else {
            // Convert to integer if it's a numeric field
            const value = integerFields.includes(key) ? parseInt(formData[key], 10) : formData[key];
            submitData.append(key, value);
          }
        }
      });

      // For now, set default lat/lang if not provided by map
      if (!formData.lat) submitData.append('lat', '24.7136');
      if (!formData.lang) submitData.append('lang', '46.6753');

      const response = await createProperty(submitData, accessToken);

      if (response.status === 1) {
        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: 'Property created successfully',
          confirmButtonText: 'OK'
        }).then(() => {
          // Reset form or redirect
          window.location.href = '/client/property-management';
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: response.message || 'Failed to create property',
        });
      }
    } catch (error) {
      console.error('Error creating property:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.message || 'Failed to create property. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section>
      <ClientHeader title="Create Property" onMobileMenuClick={onMobileMenuClick} />
      <div className="dashboard-home-content px-3 mt-2">
        <div className="d-flex justify-content-between align-items-center gap-3 flex-wrap">
            <div className="d-flex align-items-center">
                <h6 className="dashboard-routes-main m-0">Property Management</h6>
                <FontAwesomeIcon icon={faChevronRight} className='dashboard-routes-icon' />
                <h6 className="dashboard-routes-sub m-0">Create Property</h6>
            </div>
        </div>
        {/* Steps */}
        <div className="create-property-steps mt-4">
          <div className="steps-wrapper">
            <div 
              className={`step ${currentStep >= 1 ? 'active' : ''}`}
              onClick={() => handleStepClick(1)}
              style={{ cursor: 'pointer' }}
            >
              <div className="step-circle">
                <img src="/assets/step-1.svg" alt="info" />
              </div>
              <span className="step-label">Property Information</span>
            </div>

            <div 
              className={`step ${currentStep >= 2 ? 'active' : ''}`}
              onClick={() => handleStepClick(2)}
              style={{ cursor: 'pointer' }}
            >
              <div className="step-circle">
                <img src="/assets/step-2.svg" alt="location" />
              </div>
              <span className="step-label">Property location</span>
            </div>

            <div 
              className={`step ${currentStep >= 3 ? 'active' : ''}`}
              onClick={() => handleStepClick(3)}
              style={{ cursor: 'pointer' }}
            >
              <div className="step-circle">
                <img src="/assets/step-3.svg" alt="photos" />
              </div>
              <span className="step-label">Property photos</span>
            </div>

            <div 
              className={`step ${currentStep >= 4 ? 'active' : ''}`}
              onClick={() => handleStepClick(4)}
              style={{ cursor: 'pointer' }}
            >
              <div className="step-circle">
                <img src="/assets/step-4.svg" alt="contact" />
              </div>
              <span className="step-label">Contact information</span>
            </div>
          </div>

          <div className={`step-1-container ${currentStep === 1 ? '' : 'd-none'}`}>
            <div className="row mt-3 w-100 g-0 g-lg-2">
              <div className="col-12">
                <div className="mb-3 w-100">
                  <label htmlFor="name" className="form-label mb-1">Name of Property</label>
                  <input
                    type="text"
                    className="form-control rounded-2 py-2 px-3 w-100"
                    id="name"
                    name="name"
                    placeholder="Guest House Riyadh"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              <div className="col-md-6">
                <div className="mb-3 w-100">
                  <label htmlFor="property_type_id" className="form-label mb-1">
                    Property type
                  </label>

                  <div className="position-relative">
                    <select
                      id="property_type_id"
                      name="property_type_id"
                      className="form-select custom-select-bs py-2"
                      value={formData.property_type_id}
                      onChange={handleInputChange}
                      required
                      disabled={isLoadingLists}
                    >
                      <option value="">
                        {isLoadingLists ? 'Loading...' : 'Select property type'}
                      </option>
                      {listsData.propertyTypes.map(type => (
                        <option key={type.id} value={type.id}>{type.name}</option>
                      ))}
                    </select>

                    {/* Bootstrap Icon */}
                    <i className="bi bi-chevron-down select-bs-icon"></i>
                  </div>
                </div>
              </div>

              <div className="col-md-6">
                <div className="mb-3 w-100">
                  <label htmlFor="area" className="form-label mb-1">Area in square meters</label>
                  <input
                    type="number"
                    className="form-control rounded-2 py-2 px-3 w-100"
                    id="area"
                    name="area"
                    placeholder="300"
                    value={formData.area}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              <div className="col-md-4">
                <div className="mb-3 w-100">
                  <label htmlFor="floor" className="form-label mb-1">
                    Floors
                  </label>

                  <div className="position-relative">
                    <select
                      id="floor"
                      name="floor"
                      className="form-select custom-select-bs py-2"
                      value={formData.floor}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">
                        Select number of floors
                      </option>
                      <option value="1">1</option>
                      <option value="2">2</option>
                      <option value="3">3</option>
                      <option value="4">4</option>
                      <option value="5">5</option>
                    </select>

                    {/* Bootstrap Icon */}
                    <i className="bi bi-chevron-down select-bs-icon"></i>
                  </div>
                </div>
              </div>
              <div className="col-md-4">
                <div className="mb-3 w-100">
                  <label htmlFor="number_room" className="form-label mb-1">
                    Rooms
                  </label>

                  <div className="position-relative">
                    <select
                      id="number_room"
                      name="number_room"
                      className="form-select custom-select-bs py-2"
                      value={formData.number_room}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">
                        Select number of rooms
                      </option>
                      <option value="1">1</option>
                      <option value="2">2</option>
                      <option value="3">3</option>
                      <option value="4">4</option>
                      <option value="5">5</option>
                      <option value="6">6</option>
                      <option value="7">7</option>
                      <option value="8">8</option>
                    </select>

                    {/* Bootstrap Icon */}
                    <i className="bi bi-chevron-down select-bs-icon"></i>
                  </div>
                </div>
              </div>
              <div className="col-md-4">
                <div className="mb-3 w-100">
                  <label htmlFor="number_bathroom" className="form-label mb-1">
                    Bathrooms
                  </label>

                  <div className="position-relative">
                    <select
                      id="number_bathroom"
                      name="number_bathroom"
                      className="form-select custom-select-bs py-2"
                      value={formData.number_bathroom}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">
                        Select number of bathrooms
                      </option>
                      <option value="1">1</option>
                      <option value="2">2</option>
                      <option value="3">3</option>
                      <option value="4">4</option>
                      <option value="5">5</option>
                    </select>

                    {/* Bootstrap Icon */}
                    <i className="bi bi-chevron-down select-bs-icon"></i>
                  </div>
                </div>
              </div>
              <div className="d-flex justify-content-end align-items-center mb-3">
                <button className="sec-btn rounded-2 px-5 py-2 w-50-100" onClick={handleNextStep}>
                  Next
                </button>
              </div>
            </div>
          </div>

          <div className={`step-2-container ${currentStep === 2 ? '' : 'd-none'}`}>
            <div className="row mt-3 w-100 g-0 g-lg-2">
              <div className="col-12">
                <div className="mb-3 w-100">
                  <label htmlFor="address" className="form-label mb-1">Address of Property</label>
                  <input
                    type="text"
                    className="form-control rounded-2 py-2 px-3 w-100"
                    id="address"
                    name="address"
                    placeholder="Riyadh, Saudi Arabia, Al Nakheel Street"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="col-md-6">
                <div className="mb-3 w-100">
                  <label htmlFor="city_id" className="form-label mb-1">City</label>
                  <div className="position-relative">
                    <select
                      id="city_id"
                      name="city_id"
                      className="form-select custom-select-bs py-2"
                      value={formData.city_id}
                      onChange={handleInputChange}
                      required
                      disabled={isLoadingLists}
                    >
                      <option value="">
                        {isLoadingLists ? 'Loading...' : 'Select city'}
                      </option>
                      {listsData.cities.map(city => (
                        <option key={city.id} value={city.id}>{city.name}</option>
                      ))}
                    </select>
                    <i className="bi bi-chevron-down select-bs-icon"></i>
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="mb-3 w-100">
                  <label htmlFor="postal_code" className="form-label mb-1">Postal code</label>
                  <input
                    type="text"
                    className="form-control rounded-2 py-2 px-3 w-100"
                    id="postal_code"
                    name="postal_code"
                    placeholder="605555"
                    value={formData.postal_code}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              <h6 className="property-management-card-title mb-1">Address on map</h6>
              <div className="property-map-container mb-2">
                <div className="property-map">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3622.5049177533113!2d46.72160581500448!3d24.71355228411637!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e2f0385d3e9c9c9%3A0x9c9c9c9c9c9c9c9c!2sRiyadh%2C%20Saudi%20Arabia!5e0!3m2!1sen!2sus!4v1234567890"
                    width="100%"
                    height="100%"
                    style={{ border: 0, borderRadius: '8px' }}
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Property Location Map"
                    className="map-iframe"
                  ></iframe>
                </div>
              </div>
              <div className="d-flex justify-content-end align-items-center mb-3 gap-2">
                <button className="prev-btn rounded-2 px-4 py-2" onClick={handlePrevStep}>
                  Previous
                </button>
                <button className="sec-btn rounded-2 px-5 py-2" onClick={handleNextStep}>
                  Next
                </button>
              </div>
            </div>
          </div>

          <div className={`step-3-container ${currentStep === 3 ? '' : 'd-none'}`}>
            <div className="row mt-3 w-100 g-0">
              <div className="col-12 mb-3">
                <label className="form-label mb-2">Main image of property</label>

                {/* Upload Box */}
                <div
                  className="image-upload-box d-flex align-items-center justify-content-start p-2"
                  onClick={() => inputRef.current.click()}
                >
                  {image ? (
                    <img src={image} alt="preview" className="uploaded-image" />
                  ) : (
                    <span className="upload-placeholder text-center w-100">
                      Click to upload image
                    </span>
                  )}
                </div>

                <input
                  type="file"
                  accept="image/*"
                  hidden
                  ref={inputRef}
                  onChange={handleImageChange}
                />

                {/* Bottom Bar */}
                {image && (
                  <div className="image-upload-footer d-flex align-items-center justify-content-between mt-2">
                    <div className="d-flex align-items-center gap-2">
                      <button
                        type="button"
                        className="main-btn py-2 px-2 rounded-start-3"
                        onClick={() => inputRef.current.click()}
                      >
                        Change image
                      </button>
                      <span className="image-name">{fileName}</span>
                    </div>
                    <div className="delete-btn px-1 py-1 m-1 d-flex align-items-center justify-content-center gap-1" onClick={handleRemove}>
                      <img src="/assets/delete.svg" alt="delete" />
                    </div>
                  </div>
                )}
              </div>
              <div className="col-12">
                <div className="mb-3 w-100">
                  <label htmlFor="specail_note" className="form-label mb-1">Special notes</label>
                  <textarea 
                    name="specail_note" 
                    id="specail_note" 
                    rows="4" 
                    className="form-control rounded-2 py-2 w-100" 
                    placeholder='Entrance from the back'
                    value={formData.specail_note}
                    onChange={handleInputChange}
                  ></textarea>
                </div>
              </div>
              <div className="d-flex justify-content-end align-items-center mb-3 gap-2">
                <button className="prev-btn rounded-2 px-4 py-2" onClick={handlePrevStep}>
                  Previous
                </button>
                <button className="sec-btn rounded-2 px-5 py-2" onClick={handleNextStep}>
                  Next
                </button>
              </div>
            </div>
          </div>

          <div className={`step-4-container ${currentStep === 4 ? '' : 'd-none'}`}>
            <div className="row mt-3 w-100 g-0 g-lg-2">
              <div className="d-flex gap-1 align-items-center">
                <input 
                  type="checkbox" 
                  id='co-host' 
                  className='mb-2' 
                  checked={isCoHostChecked}
                  onChange={handleCoHostChange}
                />
                <label htmlFor="co-host" className="form-label mt-1">Add Co-Host for this Property</label>
              </div>
              
              {/* Conditionally render input fields based on checkbox state */}
              {isCoHostChecked && (
                <>
                  <div className="col-md-6">
                    <div className="mb-3 w-100">
                      <label htmlFor="co_host_name" className="form-label mb-1"> Full Name</label>
                      <input
                        type="text"
                        className="form-control rounded-2 py-2 px-3 w-100"
                        id="co_host_name"
                        name="co_host_name"
                        placeholder="Enter your name"
                        value={formData.co_host_name}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="mb-3 w-100">
                      <label htmlFor="co_host_mobile" className="form-label mb-1">Phone number</label>
                      <input
                        type="text"
                        className="form-control rounded-2 py-2 px-3 w-100"
                        id="co_host_mobile"
                        name="co_host_mobile"
                        placeholder="Enter your  number"
                        value={formData.co_host_mobile}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="mb-3 w-100">
                      <label htmlFor="platform_id" className="form-label mb-1">
                        Platforms list
                      </label>

                      <div className="position-relative">
                        <select
                          id="platform_id"
                          name="platform_id"
                          className="form-select custom-select-bs py-2"
                          value={formData.platform_id}
                          onChange={handleInputChange}
                          required
                          disabled={isLoadingLists}
                        >
                          <option value="">
                            {isLoadingLists ? 'Loading...' : 'Select platform'}
                          </option>
                          {listsData.platforms.map(platform => (
                            <option key={platform.id} value={platform.id}>{platform.name}</option>
                          ))}
                        </select>

                        {/* Bootstrap Icon */}
                        <i className="bi bi-chevron-down select-bs-icon"></i>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-8">
                    <div className="mb-3 w-100">
                      <label htmlFor="platform_link" className="form-label mb-1 text-white">.</label>
                      <input
                        type="text"
                        className="form-control rounded-2 py-2 px-3 w-100"
                        id="platform_link"
                        name="platform_link"
                        placeholder="Enter link"
                        value={formData.platform_link}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>
                </>
              )}
              
              <div className="d-flex justify-content-end align-items-center mb-3 gap-2">
                <button className="prev-btn rounded-2 px-4 py-2" onClick={handlePrevStep}>
                  Previous
                </button>
                <button 
                  className="sec-btn rounded-2 px-5 py-2" 
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DashboardCreatePropertyMain;