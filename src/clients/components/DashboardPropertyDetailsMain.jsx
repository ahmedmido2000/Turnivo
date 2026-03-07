import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { Link, useParams, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { getPropertyById, getListsData, updateProperty, deleteProperty } from '../../api/propertyApi';
import ClientHeader from './ClientHeader';
import { encodePropertyId, decodePropertyId } from '../../utils/qrEncoder';
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

const DashboardPropertyDetailsMain = ({ onMobileMenuClick, isToken = false }) => {
  const { id: routeId, token } = useParams(); // Get property ID or Token from URL
  const [id, setId] = useState(isToken ? null : routeId);
  const navigate = useNavigate();
  
  // Property data state
  const [property, setProperty] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Decode token if in token mode
  useEffect(() => {
    if (isToken && token) {
      const decodedId = decodePropertyId(token);
      if (decodedId) {
        setId(decodedId);
      } else {
        setError('Invalid property token');
        setIsLoading(false);
      }
    } else if (!isToken && routeId) {
      setId(routeId);
    }
  }, [isToken, token, routeId]);

  // Edit mode state
  const [isEditMode, setIsEditMode] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;
  const [isCoHostChecked, setIsCoHostChecked] = useState(false);
  const [formData, setFormData] = useState({
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
    specail_note: '',
    co_host_name: '',
    co_host_mobile: '',
    platform_id: '',
    platform_link: '',
    image: null
  });
  const [imagePreview, setImagePreview] = useState('');
  const [fileName, setFileName] = useState('');
  const inputRef = useRef(null);

  // Lists data state
  const [listsData, setListsData] = useState({
    propertyTypes: [],
    cities: [],
    platforms: []
  });
  const [isLoadingLists, setIsLoadingLists] = useState(true);

  // Fetch lists data
  useEffect(() => {
    const fetchLists = async () => {
      try {
        const accessToken = localStorage.getItem('access_token');
        if (!accessToken) return;

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
      } finally {
        setIsLoadingLists(false);
      }
    };

    fetchLists();
  }, []);

  // Fetch property details
  useEffect(() => {
    const fetchPropertyDetails = async () => {
      setIsLoading(true);
      setError(null);
      
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

        if (!id) {
          setError('Property ID is missing');
          return;
        }

        const response = await getPropertyById(accessToken, id);
        
        if (response.status === 1 && response.data && response.data.length > 0) {
          const propertyData = response.data[0];
          setProperty(propertyData);
          setImagePreview(propertyData.image);
          // Initialize form data with property values
          setFormData({
            property_type_id: propertyData.property_type_id?.id || '',
            area: propertyData.area || '',
            floor: propertyData.floor || '',
            number_room: propertyData.number_room || '',
            number_bathroom: propertyData.number_bathroom || '',
            address: propertyData.address || '',
            city_id: propertyData.city_id?.id || '',
            postal_code: propertyData.postal_code || '',
            lat: propertyData.lat || '',
            lang: propertyData.lang || '',
            specail_note: propertyData.specail_note || '',
            co_host_name: propertyData.co_host_name || '',
            co_host_mobile: propertyData.co_host_mobile || '',
            platform_id: propertyData.platform_id?.id || '',
            platform_link: propertyData.platform_link || '',
            image: null
          });
        } else {
          setError('Property not found');
          Swal.fire({
            icon: 'error',
            title: 'Property Not Found',
            text: 'The requested property could not be found.',
          });
        }
      } catch (error) {
        console.error('Error fetching property details:', error);
        setError(error.message);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to load property details. Please try again.',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchPropertyDetails();
  }, [id]);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle image change
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setFileName(file.name);
    setFormData(prev => ({
      ...prev,
      image: file
    }));
    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  // Handle remove image
  const handleRemoveImage = () => {
    setImagePreview(property?.image || '');
    setFileName('');
    if (inputRef.current) {
      inputRef.current.value = '';
    }
    setFormData(prev => ({ ...prev, image: null }));
  };

  // Handle edit button click
  const handleEditClick = () => {
    setIsEditMode(true);
    setCurrentStep(1);
    // Check if co-host data exists
    if (property.co_host_name || property.co_host_mobile) {
      setIsCoHostChecked(true);
    } else {
      setIsCoHostChecked(false);
    }
  };

  // Handle cancel edit
  const handleCancelEdit = () => {
    setIsEditMode(false);
    setCurrentStep(1);
    // Reset form data to original property values
    if (property) {
      setFormData({
        property_type_id: property.property_type_id?.id || '',
        area: property.area || '',
        floor: property.floor || '',
        number_room: property.number_room || '',
        number_bathroom: property.number_bathroom || '',
        address: property.address || '',
        city_id: property.city_id?.id || '',
        postal_code: property.postal_code || '',
        lat: property.lat || '',
        lang: property.lang || '',
        specail_note: property.specail_note || '',
        co_host_name: property.co_host_name || '',
        co_host_mobile: property.co_host_mobile || '',
        platform_id: property.platform_id?.id || '',
        platform_link: property.platform_link || '',
        image: null
      });
      setImagePreview(property.image);
      setFileName('');
      if (inputRef.current) {
        inputRef.current.value = '';
      }
    }
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
        co_host_mobile: ''
      }));
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
        
        if (formattedAddress) {
          setFormData(prev => ({
            ...prev,
            address: formattedAddress
          }));
          
          console.log('Address updated:', formattedAddress);
        }
      }
    } catch (error) {
      console.error('Error fetching address:', error);
    }
  };

  // Handle form submission
  const handleSubmit = async () => {
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

      // Create FormData object
      const submitData = new FormData();
      const integerFields = ['property_type_id', 'area', 'floor', 'number_room', 'number_bathroom', 'city_id', 'platform_id'];
      
      submitData.append('id', id);
      
      Object.keys(formData).forEach(key => {
        if (formData[key] !== null && formData[key] !== '') {
          // Only add co-host fields if checkbox is checked
          if (key.startsWith('co_host_')) {
            if (isCoHostChecked) {
              const value = integerFields.includes(key) ? parseInt(formData[key], 10) : formData[key];
              submitData.append(key, value);
            }
          } else if (key !== 'image') {
            // Convert to integer if it's a numeric field
            const value = integerFields.includes(key) ? parseInt(formData[key], 10) : formData[key];
            submitData.append(key, value);
          }
        }
      });
      
      // Only append image if a new one was selected
      if (formData.image) {
        submitData.append('image', formData.image);
      }

      const response = await updateProperty(submitData, accessToken, id);

      if (response.status === 1) {
        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: 'Property updated successfully',
          timer: 2000,
          showConfirmButton: false
        }).then(() => {
          // Refresh property data
          window.location.reload();
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: response.message || 'Failed to update property',
        });
      }
    } catch (error) {
      console.error('Error updating property:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.response?.data?.message || 'Failed to update property. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle delete button click
  const handleDeleteClick = async () => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!'
    });

    if (result.isConfirmed) {
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

        const response = await deleteProperty(accessToken, id);

        if (response.status === 1) {
          await Swal.fire({
            icon: 'success',
            title: 'Deleted!',
            text: 'Property has been deleted.',
            timer: 2000,
            showConfirmButton: false
          });
          navigate('/client/property-management');
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: response.message || 'Failed to delete property',
          });
        }
      } catch (error) {
        console.error('Error deleting property:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.response?.data?.message || 'Failed to delete property. Please try again.',
        });
      }
    }
  };

  // Show loading state
  if (isLoading) {
    return (
      <section>
        <div className="dashboard-main-nav px-md-3 px-1 py-1">
          <div className="d-flex justify-content-between align-items-center">
            <h2 className="mb-0 dashboard-title">Property Details</h2>
          </div>
        </div>
        <div className="dashboard-home-content px-3 mt-2">
          <div className="text-center mt-4 mb-4">
            <p className="text-muted">Loading property details...</p>
          </div>
        </div>
      </section>
    );
  }

  // Show error state
  if (error || !property) {
    return (
      <section>
        <div className="dashboard-main-nav px-md-3 px-1 py-1">
          <div className="d-flex justify-content-between align-items-center">
            <h2 className="mb-0 dashboard-title">Property Details</h2>
          </div>
        </div>
        <div className="dashboard-home-content px-3 mt-2">
          <div className="text-center mt-4 mb-4">
            <p className="text-muted">Property not found</p>
            <Link to="/client/property-management" className="sec-btn rounded-2 px-4 py-2 text-decoration-none">
              Back to Properties
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section>
      <ClientHeader title="Property Details" onMobileMenuClick={onMobileMenuClick} />
      <div className="dashboard-home-content px-3 mt-2">
        <div className="d-flex justify-content-between align-items-center gap-3 flex-wrap">
            <div className="d-flex align-items-center">
                <h6 className="dashboard-routes-main m-0">Property Management</h6>
                <FontAwesomeIcon icon={faChevronRight} className='dashboard-routes-icon' />
                <h6 className="dashboard-routes-sub m-0">{property.name}</h6>
            </div>
            <div className="d-flex gap-2 align-items-center flex-wrap">
              <Link to={`/client/calendar?propertyId=${property.id}`} className="third-btn d-flex align-items-center justify-content-center gap-1 w-50-100 text-decoration-none">
                <img src="/assets/calendar-icon-2.svg" alt="calendar" />
                <span className="mb-0">Calendar</span>
              </Link>
              <Link to={`/client/cleaning-request?propertyId=${property.id}`} className="sec-btn rounded-2 px-4 py-2 w-50-100 text-decoration-none">
                Request cleaning service
              </Link>
              <Link to={`/client/maintenance?propertyId=${property.id}`} className="main-btn rounded-2 px-3 py-2 w-50-100 text-decoration-none">
                Request maintenance service
              </Link>
            </div>
        </div>
        <div className="row g-0">
          <div className="col-12">
            <div className="property-management-card mt-3 w-100">
              {/* Show Steps only in Edit Mode */}
              {isEditMode ? (
                <div className="create-property-steps mt-2 w-100">
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

                  {/* Step 1: Property Information */}
                  <div className={`step-1-container ${currentStep === 1 ? '' : 'd-none'}`}>
                    <div className="row mt-3 w-100 g-0 g-lg-2">
                      <div className="col-12">
                        <div className="mb-3 w-100">
                          <label htmlFor="name" className="form-label mb-1">Name of Property</label>
                          <input
                            type="text"
                            className="form-control rounded-2 py-2 px-3 w-100 bg-light"
                            id="name"
                            name="name"
                            value={property.name}
                            readOnly
                            disabled
                          />
                          <small className="text-muted">Property name cannot be changed</small>
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
                            <i className="bi bi-chevron-down select-bs-icon"></i>
                          </div>
                        </div>
                      </div>
                      <div className="d-flex justify-content-end align-items-center mb-3 gap-2">
                        <button className="sec-btn-outline rounded-2 px-4 py-2" onClick={handleCancelEdit}>
                          Cancel
                        </button>
                        <button className="sec-btn rounded-2 px-5 py-2" onClick={handleNextStep}>
                          Next
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Step 2: Property Location */}
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
                      <h6 className="property-management-card-title mb-1">Address on map (Click to select location)</h6>
                      <div className="property-map-container mb-2">
                        <div className="property-map" style={{ height: '300px', zIndex: 1 }}>
                          <MapContainer 
                            key={`map-${currentStep}`}
                            center={formData.lat && formData.lang ? [parseFloat(formData.lat), parseFloat(formData.lang)] : [24.7136, 46.6753]} 
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
                          <div className="mt-2 small text-success d-flex align-items-center gap-1">
                            <i className="bi bi-geo-alt-fill"></i>
                            <span>Location: {parseFloat(formData.lat).toFixed(4)}, {parseFloat(formData.lang).toFixed(4)}</span>
                          </div>
                        )}
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

                  {/* Step 3: Property Photos */}
                  <div className={`step-3-container ${currentStep === 3 ? '' : 'd-none'}`}>
                    <div className="row mt-3 w-100 g-0">
                      <div className="col-12 mb-3">
                        <label className="form-label mb-2">Main image of property</label>

                        {/* Upload Box */}
                        <div
                          className="image-upload-box d-flex align-items-center justify-content-start p-2"
                          onClick={() => inputRef.current.click()}
                        >
                          {imagePreview ? (
                            <img src={imagePreview} alt="preview" className="uploaded-image" />
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
                        {imagePreview && (
                          <div className="image-upload-footer d-flex align-items-center justify-content-between mt-2">
                            <div className="d-flex align-items-center gap-2">
                              <button
                                type="button"
                                className="main-btn py-2 px-2 rounded-start-3"
                                onClick={() => inputRef.current.click()}
                              >
                                Change image
                              </button>
                              <span className="image-name">{fileName || 'Current image'}</span>
                            </div>
                            <div className="delete-btn px-1 py-1 m-1 d-flex align-items-center justify-content-center gap-1" onClick={handleRemoveImage}>
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

                  {/* Step 4: Contact Information */}
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
                        </>
                      )}

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
              ) : (
                /* Normal View Mode */
                <div className="d-flex align-items-start flex-column flex-md-row gap-3 w-100">
                  <div className="d-flex flex-column align-items-start gap-2 w-100">
                    <div className="d-flex justify-content-between w-100 align-items-center">
                      <h6 className="property-management-card-title m-0">{property.name}</h6>
                      <div className='villa-badge py-1 px-3 rounded-pill'>{property.property_type_id.name}</div>
                    </div>
                  
                  <img 
                    src={imagePreview} 
                    className='property-management-card-img' 
                    alt={property.name}
                    onError={(e) => {
                      e.target.src = '/assets/property-management-card-img.png';
                    }}
                  />
                  
                <div className="d-flex justify-content-between w-100 align-items-center">
                    <div>
                        <div className="d-flex align-items-center">
                            <img src="/assets/location.svg" className='img-fluid' alt="location" />
                            <p className="property-management-card-address m-0">{property.address}</p>
                        </div>
                        <div className="d-flex align-items-center gap-1 ps-1">
                            <img src="/assets/postal.svg" className='img-fluid' alt="postal" />
                            <div className="d-flex align-items-center gap-1">
                                <p className="property-management-card-address fw-bold m-0">Postal code:</p>
                                <p className="property-management-card-address m-0">{property.postal_code}</p>
                            </div>
                        </div>
                    </div>
                    <div className="d-flex flex-column align-items-center gap-1">
                        <h6 className='qr-title m-0'>QR code</h6>
                        <img 
                          src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&format=png&ecc=L&data=${encodeURIComponent(
`🏠 ${property.name}
━━━━━━━━━━━━━━━━
🔗 Link: ${window.location.origin}/client/p/${encodePropertyId(property.id)}

📋 Property Details:
• Type: ${property.property_type_id?.name || 'N/A'}
• Address: ${property.address || 'N/A'}
• City: ${property.city_id?.name || 'N/A'}
• Postal Code: ${property.postal_code || 'N/A'}

📐 Specifications:
• Area: ${property.area || 'N/A'} m²
• Floors: ${property.floor || 'N/A'}
• Rooms: ${property.number_room || 'N/A'}
• Bathrooms: ${property.number_bathroom || 'N/A'}

📍 Location:
• Lat: ${property.lat || 'N/A'}
• Lng: ${property.lang || 'N/A'}

👤 Co-Host: ${property.co_host_name || 'N/A'}
📞 Phone: ${property.co_host_mobile || 'N/A'}`
                          )}`} 
                          style={{ width: '120px', height: '120px' }}
                          alt="QR Code" 
                        />
                        <small className="text-muted" style={{ fontSize: '10px' }}>Scan to view property</small>
                    </div>
                </div>
                  <div className="d-flex gap-3 align-items-center flex-wrap bg-white w-100 py-1 px-2 rounded-1">
                    <div className="d-flex align-items-center gap-1">
                      <img src="/assets/property-card-icon-1.svg" className='img-fluid' alt="floors" />
                      <h6 className="property-management-card-icon-label m-0">{property.floor} floors</h6>
                    </div>
                    <div className='card-border-right'>|</div>
                    <div className="d-flex align-items-center gap-1">
                      <img src="/assets/property-card-icon-2.svg" className='img-fluid' alt="rooms" />
                      <h6 className="property-management-card-icon-label m-0">{property.number_room} rooms</h6>
                    </div>
                    <div className='card-border-right'>|</div>
                    <div className="d-flex align-items-center gap-1">
                      <img src="/assets/property-card-icon-3.svg" className='img-fluid' alt="area" />
                      <h6 className="property-management-card-icon-label m-0">{property.area} m</h6>
                    </div>
                    <div className='card-border-right'>|</div>
                    <div className="d-flex align-items-center gap-1">
                      <img src="/assets/property-card-icon-4.svg" className='img-fluid' alt="bathrooms" />
                      <h6 className="property-management-card-icon-label m-0">{property.number_bathroom} bathrooms</h6>
                    </div>
                  </div>
                    <h6 className="property-management-card-title mb-1 mt-2">Address on map</h6>
                    <div className="property-map-container">
                        <div className="property-map">
                            <iframe
                            src={`https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3622.5!2d${property.lang}!3d${property.lat}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zM!5e0!3m2!1sen!2sus!4v1234567890`}
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
                    <div className="row mt-2 w-100 g-0 g-lg-2">
                        {/* Property Type */}
                        <div className="col-md-6">
                          <div className="mb-3 w-100">
                            <label htmlFor="property_type_id" className="form-label mb-1">Property Type</label>
                            <input
                              type="text"
                              className="form-control rounded-2 border-0 py-2 px-3 w-100"
                              value={property.property_type_id?.name || ''}
                              readOnly
                            />
                          </div>
                        </div>

                        {/* Area */}
                        <div className="col-md-6">
                          <div className="mb-3 w-100">
                            <label htmlFor="area" className="form-label mb-1">Area (m²)</label>
                            <input
                              type="number"
                              className="form-control rounded-2 border-0 py-2 px-3 w-100"
                              id="area"
                              name="area"
                              value={property.area}
                              readOnly
                            />
                          </div>
                        </div>

                        {/* Floor */}
                        <div className="col-md-6">
                          <div className="mb-3 w-100">
                            <label htmlFor="floor" className="form-label mb-1">Floors</label>
                            <input
                              type="number"
                              className="form-control rounded-2 border-0 py-2 px-3 w-100"
                              id="floor"
                              name="floor"
                              value={property.floor}
                              readOnly
                            />
                          </div>
                        </div>

                        {/* Number of Rooms */}
                        <div className="col-md-6">
                          <div className="mb-3 w-100">
                            <label htmlFor="number_room" className="form-label mb-1">Number of Rooms</label>
                            <input
                              type="number"
                              className="form-control rounded-2 border-0 py-2 px-3 w-100"
                              id="number_room"
                              name="number_room"
                              value={property.number_room}
                              readOnly
                            />
                          </div>
                        </div>

                        {/* Number of Bathrooms */}
                        <div className="col-md-6">
                          <div className="mb-3 w-100">
                            <label htmlFor="number_bathroom" className="form-label mb-1">Number of Bathrooms</label>
                            <input
                              type="number"
                              className="form-control rounded-2 border-0 py-2 px-3 w-100"
                              id="number_bathroom"
                              name="number_bathroom"
                              value={property.number_bathroom}
                              readOnly
                            />
                          </div>
                        </div>

                        {/* Address */}
                        <div className="col-md-6">
                          <div className="mb-3 w-100">
                            <label htmlFor="address" className="form-label mb-1">Address</label>
                            <input
                              type="text"
                              className="form-control rounded-2 border-0 py-2 px-3 w-100"
                              id="address"
                              name="address"
                              value={property.address}
                              readOnly
                            />
                          </div>
                        </div>

                        {/* City */}
                        <div className="col-md-6">
                          <div className="mb-3 w-100">
                            <label htmlFor="city_id" className="form-label mb-1">City</label>
                            <input
                              type="text"
                              className="form-control rounded-2 border-0 py-2 px-3 w-100"
                              value={property.city_id?.name || ''}
                              readOnly
                            />
                          </div>
                        </div>

                        {/* Postal Code */}
                        <div className="col-md-6">
                          <div className="mb-3 w-100">
                            <label htmlFor="postal_code" className="form-label mb-1">Postal Code</label>
                            <input
                              type="text"
                              className="form-control rounded-2 border-0 py-2 px-3 w-100"
                              id="postal_code"
                              name="postal_code"
                              value={property.postal_code}
                              readOnly
                            />
                          </div>
                        </div>

                        {/* Special Notes */}
                        <div className="col-12">
                          <div className="mb-3 w-100">
                            <label htmlFor="specail_note" className="form-label mb-1">Special notes</label>
                            <input
                              type="text"
                              className="form-control rounded-2 border-0 py-2 px-3 w-100"
                              id="specail_note"
                              name="specail_note"
                              value={property.specail_note || ''}
                              readOnly
                            />
                          </div>
                        </div>
                        
                        <h6 className="property-management-card-title mb-3">Co-Host information</h6>
                        
                        {/* Co-Host Name */}
                        <div className="col-md-6">
                          <div className="mb-3 w-100">
                            <label htmlFor="co_host_name" className="form-label mb-1">Full Name</label>
                            <input
                              type="text"
                              className="form-control rounded-2 border-0 py-2 px-3 w-100"
                              id="co_host_name"
                              name="co_host_name"
                              value={property.co_host_name || ''}
                              readOnly
                            />
                          </div>
                        </div>
                        
                        {/* Co-Host Mobile */}
                        <div className="col-md-6">
                          <div className="mb-3 w-100">
                            <label htmlFor="co_host_mobile" className="form-label mb-1">Phone number</label>
                            <input
                              type="text"
                              className="form-control rounded-2 border-0 py-2 px-3 w-100"
                              id="co_host_mobile"
                              name="co_host_mobile"
                              value={property.co_host_mobile || ''}
                              readOnly
                            />
                          </div>
                        </div>
                        
                        {/* Platform */}
                        <div className="col-md-6">
                          <div className="mb-3 w-100">
                            <label htmlFor="platform_id" className="form-label mb-1">
                              Platform
                            </label>
                            <input
                              type="text"
                              className="form-control rounded-2 border-0 py-2 px-3 w-100"
                              value={property.platform_id?.name || ''}
                              readOnly
                            />
                          </div>
                        </div>
                        
                        {/* Platform Link */}
                        <div className="col-md-6">
                          <div className="mb-3 w-100">
                            <label htmlFor="platform_link" className="form-label mb-1">Platform Link</label>
                            <input
                              type="text"
                              className="form-control rounded-2 py-2 px-3 w-100"
                              id="platform_link"
                              name="platform_link"
                              value={property.platform_link || ''}
                              readOnly
                            />
                          </div>
                        </div>
                        
                        {/* Edit and Delete Buttons */}
                        <div className="col-md-6">
                            <div className="mb-3 w-100">
                              <div 
                                className="edit-btn d-flex align-items-center justify-content-center gap-1"
                                onClick={handleEditClick}
                                style={{ cursor: 'pointer' }}
                              >
                                <img src="/assets/edit.svg" alt="edit" /> 
                                <span>Edit</span>
                              </div>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="mb-3 w-100">
                                <div 
                                  className="delete-btn d-flex align-items-center justify-content-center gap-1"
                                  onClick={handleDeleteClick}
                                  style={{ cursor: 'pointer' }}
                                >
                                  <img src="/assets/delete.svg" alt="delete" /> 
                                  <span>Delete</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
              </div>
              )}
            </div>
          </div>
        </div>
        
      </div>
    </section>
  );
};

export default DashboardPropertyDetailsMain;