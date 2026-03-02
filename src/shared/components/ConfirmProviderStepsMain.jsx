import React, { useState, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faBars, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { Person, Settings, Logout } from '@mui/icons-material';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import AddCircleOutlinedIcon from '@mui/icons-material/AddCircleOutlined';
import { Link, useNavigate } from 'react-router-dom';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import Swal from 'sweetalert2';
import { joinTeam } from '../../api/cleanerApi';
import { useCities } from '../../hooks/useSite';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix Leaflet marker icon issue in Vite
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

// Component to handle map clicks and initialization
const LocationPicker = ({ lat, lang, onLocationSelect }) => {
  const map = useMapEvents({
    click(e) {
      onLocationSelect(e.latlng.lat, e.latlng.lng);
    },
  });

  // Fix map size on mount
  useEffect(() => {
    setTimeout(() => {
      map.invalidateSize();
    }, 100);
  }, [map]);

  if (lat && lang) {
    const position = [parseFloat(lat), parseFloat(lang)];
    return <Marker position={position} />;
  }
  return null;
};

const ConfirmProviderStepsMain = ({ onMobileMenuClick }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  
  // Add state to track current step
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;
  
  // Fetch cities using the useCities hook
  const { data: cityListData } = useCities();
  
  // Combine API cities with requested static cities as a fallback or addition
  const apiCities = cityListData?.data?.[0]?.city || [];
  const staticCities = [
    { id: 'riyadh', name: 'Riyadh' },
    { id: 'jeddah', name: 'Jeddah' },
    { id: 'medina', name: 'Medina' },
    { id: 'mecca', name: 'Mecca' }
  ];
  
  // Use API cities if available, otherwise use static cities
  const cities = apiCities.length > 0 ? apiCities : staticCities;
  
  // State to track if user has experience
  const [hasExperience, setHasExperience] = useState(null);
  
  // Navigation hook
  const navigate = useNavigate();
  
  // Form data state
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    address: '',
    postcode: '',
    city_id: '',
    region: '',
    lat: '',
    lang: '',
    experience: 0, // Default to 0 (no experience)
    company: '',
    start_date: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const [image, setImage] = useState(null);
  const [fileName, setFileName] = useState('');
  const inputRef = useRef(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setFileName(file.name);
    setImage(URL.createObjectURL(file));
  };

  const handleRemove = () => {
    setImage(null);
    setFileName('');
    inputRef.current.value = '';
  };
  
  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // For phone field, only allow numbers
    if (name === 'phone') {
      const numericValue = value.replace(/\D/g, ''); // Remove all non-digits
      setFormData(prev => ({ ...prev, [name]: numericValue }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };
  
  // Validate form data
  const validateForm = () => {
    const errors = [];
    
    // Step 1 validation
    if (!formData.first_name.trim()) errors.push('First name is required');
    if (!formData.last_name.trim()) errors.push('Last name is required');
    if (!formData.email.trim()) errors.push('Email is required');
    if (!formData.phone.trim()) errors.push('Phone is required');
    
    // Step 2 validation
    if (!formData.address.trim()) errors.push('Address is required');
    if (!formData.postcode.trim()) errors.push('Postcode is required');
    if (!formData.city_id || formData.city_id === '') errors.push('City ID is required');
    if (!formData.region.trim()) errors.push('Province is required');
    
    // Step 3 validation - experience is set by default to 0, so it's always valid
    
    // Step 4 validation
    if (!formData.start_date) errors.push('Start date is required');
    
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
      // Prepare data for submission
      const submitData = {
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        postcode: formData.postcode,
        city_id: parseInt(formData.city_id, 10) || 0, // Convert to integer with fallback
        region: formData.region,
        lat: formData.lat || '24.7136', // Default lat if not provided
        lang: formData.lang || '46.6753', // Default lang if not provided
        experience: parseInt(formData.experience, 10), // Ensure it's integer
        company: formData.company || '',
        start_date: formData.start_date
      };
      
      const response = await joinTeam(submitData);
      
      if (response.status === 1) {
        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: 'Your registration has been submitted successfully',
          confirmButtonText: 'OK'
        }).then(() => {
          navigate('/provider-thanks');
        });
      } else {
        // Handle validation errors from API
        let errorMessage = '';
        
        if (response.data && Array.isArray(response.data)) {
          // Extract error messages from the response
          errorMessage = response.data.map(err => {
            const fieldName = err.field.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
            return `<strong>${fieldName}:</strong> ${err.message}`;
          }).join('<br>');
        } else {
          errorMessage = response.message || 'Failed to submit registration';
        }
        
        Swal.fire({
          icon: 'error',
          title: 'Validation Error',
          html: errorMessage,
        });
      }
    } catch (error) {
      console.error('Error submitting registration:', error);
      
      // Handle error response from API
      let errorMessage = 'Failed to submit registration. Please try again.';
      
      if (error.data && Array.isArray(error.data)) {
        errorMessage = error.data.map(err => {
          const fieldName = err.field.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
          return `<strong>${fieldName}:</strong> ${err.message}`;
        }).join('<br>');
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      Swal.fire({
        icon: 'error',
        title: 'Error',
        html: errorMessage,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Validate current step
  const validateCurrentStep = () => {
    const errors = [];
    
    switch (currentStep) {
      case 1:
        // Step 1 validation
        if (!formData.first_name.trim()) errors.push('First name is required');
        if (!formData.last_name.trim()) errors.push('Last name is required');
        if (!formData.email.trim()) errors.push('Email is required');
        else if (!/\S+@\S+\.\S+/.test(formData.email)) errors.push('Email is invalid');
        if (!formData.phone.trim()) errors.push('Phone is required');
        break;
        
      case 2:
        // Step 2 validation
        if (!formData.address.trim()) errors.push('Address is required');
        if (!formData.postcode.trim()) errors.push('Postcode is required');
        if (!formData.city_id || formData.city_id === '') errors.push('City ID is required');
        if (!formData.region.trim()) errors.push('Province is required');
        break;
        
      case 3:
        // Step 3 validation - check if user made a selection
        if (hasExperience === null) {
          errors.push('Please select if you have experience or not');
        } else if (hasExperience === true && !formData.company.trim()) {
          errors.push('Please select the company name');
        }
        break;
        
      case 4:
        // Step 4 validation
        if (!formData.start_date) errors.push('Start date is required');
        break;
        
      default:
        break;
    }
    
    return errors;
  };

  // Function to handle next step
const handleNextStep = (e) => {
  e?.preventDefault(); // يمنع reload

  if (currentStep === totalSteps) {
    // آخر خطوة → إرسال البيانات
    handleSubmit();
    return;
  }

  // Validate current step before moving to next
  const errors = validateCurrentStep();
  if (errors.length > 0) {
    Swal.fire({
      icon: 'warning',
      title: 'Required Fields',
      html: errors.join('<br>'),
    });
    return;
  }

  setCurrentStep((prev) => prev + 1);
};


  // Function to handle previous step
  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Function to handle step click from the step indicator
  const handleStepClick = (stepNumber) => {
    // Only allow going back to previous steps, not jumping forward
    if (stepNumber < currentStep) {
      setCurrentStep(stepNumber);
    } else if (stepNumber > currentStep) {
      Swal.fire({
        icon: 'info',
        title: 'Complete Current Step',
        text: 'Please complete the current step before moving forward',
      });
    }
  };
  
  // Function to handle experience selection
  const handleExperienceSelection = (hasExp) => {
    setHasExperience(hasExp);
    setFormData(prev => ({ ...prev, experience: hasExp ? 1 : 0 }));
    if (!hasExp) {
      // If user has no experience, clear company and go directly to next step
      setFormData(prev => ({ ...prev, company: '' }));
      setCurrentStep(4); // Go directly to step 4 without validation
    }
  };
  
  // Handle location selection from map
  const handleLocationSelect = async (lat, lang) => {
    // Update coordinates immediately
    setFormData(prev => ({
      ...prev,
      lat: lat.toString(),
      lang: lang.toString()
    }));

    
    // Fetch address from coordinates
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lang}&accept-language=en`,
        {
          headers: {
            'User-Agent': 'Turnivo Property Management App'
          }
        }
      );
      
      if (!response.ok) {
        console.error('Failed to fetch address:', response.status);
        return;
      }
      
      const data = await response.json();
      
      if (data && data.address) {
        const addressParts = [];
        const { city, town, village, suburb, road, neighbourhood, state, country } = data.address;
        
        // Build address in the format: City, Country, Street
        const cityName = city || town || village || suburb;
        if (cityName) addressParts.push(cityName);
        if (country) addressParts.push(country);
        if (road || neighbourhood) addressParts.push(road || neighbourhood);
        
        const formattedAddress = addressParts.join(', ');
        
        // Update form data with address and region only (postcode is user input)
        setFormData(prev => ({
          ...prev,
          address: formattedAddress || prev.address,
          region: state || prev.region
        }));
        
        console.log('Address updated:', formattedAddress);
      }
    } catch (error) {
      console.error('Error fetching address:', error);
    }
  };

  return (
    <section>
        <div className="container">
            <div className="dashboard-home-content px-3 my-md-5 my-4">
                {/* Steps */}
                <div className="create-property-steps mt-4">
                <div className="steps-wrapper">
                    <div 
                    className={`step ${currentStep >= 1 ? 'active' : ''}`}
                    onClick={() => handleStepClick(1)}
                    style={{ cursor: 'pointer' }}
                    >
                    <div className="step-circle">
                        <img src="/assets/provider-step-icon-1.svg" alt="info" />
                    </div>
                    <span className="step-label">Contact Information</span>
                    </div>

                    <div 
                    className={`step ${currentStep >= 2 ? 'active' : ''}`}
                    onClick={() => handleStepClick(2)}
                    style={{ cursor: 'pointer' }}
                    >
                    <div className="step-circle">
                        <img src="/assets/provider-step-icon-2.svg" alt="location" />
                    </div>
                    <span className="step-label">Address</span>
                    </div>

                    <div 
                    className={`step ${currentStep >= 3 ? 'active' : ''}`}
                    onClick={() => handleStepClick(3)}
                    style={{ cursor: 'pointer' }}
                    >
                    <div className="step-circle">
                        <img src="/assets/provider-step-icon-3.svg" alt="photos" />
                    </div>
                    <span className="step-label">Ervaring</span>
                    </div>

                    <div 
                    className={`step ${currentStep >= 4 ? 'active' : ''}`}
                    onClick={() => handleStepClick(4)}
                    style={{ cursor: 'pointer' }}
                    >
                    <div className="step-circle">
                        <img src="/assets/provider-step-icon-4.svg" alt="contact" />
                    </div>
                    <span className="step-label">Possibility to start</span>
                    </div>
                </div>

                <div className={`step-1-container ${currentStep === 1 ? '' : 'd-none'}`}>
                    <div className="row g-0 min-vh-100">
          {/* Left side - Image */}
          <div className="col-lg-5 mt-3 p-3 d-none d-lg-block">
            <div 
              className="h-100 d-flex align-items-center justify-content-center rounded-3"
              style={{
                backgroundImage: `url('/assets/login-2.png')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundColor: '#f8f9fa'
              }}
            >
              <div className="text-center d-flex justify-content-center align-items-center p-4 w-100 h-100" style={{ backgroundColor: '#FFFFFF33', borderRadius: '10px' }}>
                <img 
                  src="/assets/logo.png" 
                  alt="Logo"  
                  className="mb-3 confirm-logo"
                />
              </div>
            </div>
          </div>
          
          {/* Right side - Form */}
          <div className="col-lg-7 mt-3 p-3">
            <div className='d-flex align-items-start justify-content-center bg-white shadow-sm rounded-3 h-100'>
            <div className="w-100 px-4 py-5">
              
              {/* Title and Description */}
              <div className="">
                <h2 className="mb-2 login-title">Wat is uw contactinformatie?</h2>
                <p className="login-description">Welcome back! Please log in to continue</p>
              </div>
              
              {/* Login Form */}
              <form>
                {/* First Name Input */}
                <div className="mb-3">
                  <label className="form-label mb-1">first name</label>
                  <input
                    type="text"
                    name="first_name"
                    className="form-control rounded-2 py-2 px-3"
                    placeholder="Enter your first name"
                    value={formData.first_name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                {/* Last Name Input */}
                <div className="mb-3">
                  <label className="form-label mb-1">last name</label>
                  <input
                    type="text"
                    name="last_name"
                    className="form-control rounded-2 py-2 px-3"
                    placeholder="Enter your last name"
                    value={formData.last_name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                {/* Email Input */}
                <div className="mb-3">
                  <label className="form-label mb-1">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    className="form-control rounded-2 py-2 px-3"
                    id="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                {/* Phone Input */}
                <div className="mb-3">
                  <label className="form-label mb-1">Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    className="form-control rounded-2 py-2 px-3"
                    placeholder="Enter your phone number"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                
                        <div className="d-flex justify-content-end align-items-center mb-3">
                        <button className="sec-btn rounded-2 px-3 py-2 w-50-100" onClick={handleNextStep}>
                        Next
                        </button>
                    </div>
              </form>
              
            </div>

            </div>
          </div>
                    </div>
                </div>

                <div className={`step-2-container ${currentStep === 2 ? '' : 'd-none'}`}>
                                        <div className="row g-0 min-vh-100">
          
          {/* Right side - Form */}
          <div className="col-lg-7 mt-3 p-3">
            <div className='d-flex align-items-start justify-content-center bg-white shadow-sm rounded-3 h-100'>
            <div className="w-100 px-4 py-5">
              
              {/* Title and Description */}
              <div className="">
                <h2 className="mb-2 login-title">What is your address?</h2>
                <p className="login-description">Fill in your address details or click on the map to select your location</p>
              </div>
              
              {/* Login Form */}
              <form>
                {/* Address Input */}
                <div className="mb-3">
                  <label className="form-label mb-1">Address</label>
                  <input
                    type="text"
                    name="address"
                    className="form-control rounded-2 py-2 px-3"
                    placeholder="Enter your address"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                {/* Postcode Input */}
                <div className="mb-3">
                  <label className="form-label mb-1">Postcode</label>
                  <input
                    type="text"
                    name="postcode"
                    className="form-control rounded-2 py-2 px-3"
                    placeholder="2390"
                    value={formData.postcode}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                {/* City Input */}
                
                <div className="mb-3">
                  <label className="form-label mb-1">stad (City)</label>
                  <select
                    name="city_id"
                    className="form-select rounded-2 py-2 px-3"
                    value={formData.city_id}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select a city</option>
                    {cities.map(city => (
                      <option key={city.id} value={city.id}>
                        {city.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Province Input */}
                <div className="mb-3">
                  <label className="form-label mb-1">Provinicie</label>
                  <input
                    type="text"
                    name="region"
                    className="form-control rounded-2 py-2 px-3"
                    placeholder="Provinicie"
                    value={formData.region}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                
                        <div className="d-flex justify-content-start align-items-center mb-3">
                        <button className="sec-btn rounded-2 px-3 py-2 w-50-100" onClick={handleNextStep}>
                        Next
                        </button>
                    </div>
              </form>
              
            </div>

            </div>
          </div>

                    {/* Left side - Map */}
          <div className="col-lg-5 mt-3 p-3 d-none d-lg-block">
            <div className="h-100 d-flex flex-column align-items-center justify-content-center rounded-3 overflow-hidden">
              <div className="w-100 h-100" style={{ minHeight: '400px' }}>
                <MapContainer 
                  key={`provider-map-${currentStep}`}
                  center={formData.lat && formData.lang ? [parseFloat(formData.lat), parseFloat(formData.lang)] : [52.3676, 4.9041]} 
                  zoom={13} 
                  style={{ height: '100%', width: '100%', borderRadius: '8px' }}
                  scrollWheelZoom={true}
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  />
                  <LocationPicker 
                    lat={formData.lat} 
                    lang={formData.lang} 
                    onLocationSelect={handleLocationSelect} 
                  />
                </MapContainer>
              </div>
              {formData.lat && formData.lang && (
                <div className="mt-2 small text-success d-flex align-items-center gap-1 bg-white px-3 py-2 rounded-2 shadow-sm">
                  <i className="bi bi-geo-alt-fill"></i>
                  <span>Location: {parseFloat(formData.lat).toFixed(4)}, {parseFloat(formData.lang).toFixed(4)}</span>
                </div>
              )}
            </div>
          </div>
                    </div>
                </div>

                <div className={`step-3-container ${currentStep === 3 ? '' : 'd-none'}`}>
                                                           <div className="row g-0 min-vh-100">
          
          {/* Right side - Form */}
          <div className="col-lg-7 mt-3 p-3">
            <div className='d-flex align-items-center justify-content-center bg-white shadow-sm rounded-3 h-100'>
            <div className="w-100 px-4 py-5">
              
              {/* Title and Description - only show if no selection made */}
              {hasExperience === null && (
                <div className="">
                  <h2 className="mb-2 login-title">Do you have previous cleaning experience?</h2>
                  <p className="login-description">Your experience can help you in the selection process.</p>
                </div>
              )}
              
              {/* Yes/No buttons - only show if no selection made */}
              {hasExperience === null && (
                <div className="d-flex gap-2 align-items-center mb-3">
                    
                  <button 
                    className="main-btn rounded-2 px-3 py-2"
                    onClick={() => handleExperienceSelection(true)}
                  >
                    YES
                  </button>
                  <button 
                    className="main-btn rounded-2 px-3 py-2"
                    onClick={() => handleExperienceSelection(false)}
                  >
                    NO
                  </button>
                </div>
              )}
              
              {/* Yes content - only show if user selected YES */}
              {hasExperience === true && (
                <div className="yes-content">
                    <div className="">
                  <h2 className="mb-2 login-title">What company have you worked for before?</h2>
                  <p className="login-description">Select the name of the company you worked for previously</p>
                </div>
                  <div className="position-relative mb-3">
                    <select
                      id="company"
                      name="company"
                      className="form-select custom-select-bs py-2"
                      value={formData.company}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Select the name of the company</option>
                      <option value="Company A">Company A</option>
                      <option value="Company B">Company B</option>
                      <option value="Company C">Company C</option>
                      <option value="Other">Other</option>
                    </select>

                    {/* Bootstrap Icon */}
                    <i className="bi bi-chevron-down select-bs-icon"></i>
                  </div>
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <button 
                      className="main-btn rounded-2 px-3 py-2" 
                      onClick={() => setHasExperience(null)}
                    >
                      Back
                    </button>
                    <button className="sec-btn rounded-2 px-3 py-2 w-50-100" onClick={handleNextStep}>
                      Next
                    </button>
                  </div>
                </div>
              )}
              
              {/* No content - show if user selected NO */}
              {hasExperience === false && (
                <div className="no-content">
                  <div className="">
                    <h2 className="mb-2 login-title">No previous experience</h2>
                    <p className="login-description">You selected that you have no previous cleaning experience.</p>
                  </div>
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <button 
                      className="main-btn rounded-2 px-3 py-2" 
                      onClick={() => setHasExperience(null)}
                    >
                      Change Selection
                    </button>
                    <button className="sec-btn rounded-2 px-3 py-2 w-50-100" onClick={handleNextStep}>
                      Next
                    </button>
                  </div>
                </div>
              )}
            </div>

            </div>
          </div>

                    {/* Left side - Image */}
          <div className="col-lg-5 mt-3 p-3 d-none d-lg-block">
            <div 
              className="h-100 d-flex align-items-center justify-content-center rounded-3"
              style={{
                backgroundImage: `url('/assets/login-3.png')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundColor: '#f8f9fa'
              }}
            >
            </div>
          </div>
                    </div>
                </div>

                <div className={`step-4-container ${currentStep === 4 ? '' : 'd-none'}`}>
                                                                               <div className="row g-0 min-vh-100">
          
          {/* Right side - Form */}
          <div className="col-lg-7 mt-3 p-3">
            <div className='d-flex align-items-center justify-content-center bg-white shadow-sm rounded-3 h-100'>
            <div className="w-100 px-4 py-5 align-items-center">
              
              {/* Title and Description */}
              <div className="">
                <h2 className="mb-2 login-title">When can you start?</h2>
                <p className="login-description">Let us know the date you are available to start.</p>
              </div>
                              <div className="mb-3">
                  <input
                    type="date"
                    name="start_date"
                    className="form-control rounded-2 py-2 px-3"
                    value={formData.start_date}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                                      <div className="position-relative mb-3 d-none">
                            <select
                            id="propertyType"
                            className="form-select custom-select-bs py-2"
                            defaultValue=""
                            required
                            >
                            <option selected >Select the name of the company</option>
                            </select>

                            {/* Bootstrap Icon */}
                            <i className="bi bi-chevron-down select-bs-icon"></i>
                        </div>
                        <div className="d-flex justify-content-end align-items-center mb-3">
                        <button 
                          className="sec-btn rounded-2 px-3 py-2 w-50-100" 
                          onClick={handleNextStep}
                          disabled={isSubmitting}
                        >
                        {isSubmitting ? 'Submitting...' : 'Submit'}
                        </button>
                    </div>
              
            </div>

            </div>
          </div>

                    {/* Left side - Image */}
          <div className="col-lg-5 mt-3 p-3 d-none d-lg-block">
            <div 
              className="h-100 d-flex align-items-center justify-content-center rounded-3"
              style={{
                backgroundImage: `url('/assets/login-4.png')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundColor: '#f8f9fa'
              }}
            >
            </div>
          </div>
                    </div>
                </div>
                </div>
            </div>
        </div>
    </section>
  );
};

export default ConfirmProviderStepsMain;