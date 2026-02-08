import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { Link, useParams, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { getPropertyById, getListsData, updateProperty, deleteProperty } from '../../api/propertyApi';
import ClientHeader from './ClientHeader';

const DashboardPropertyDetailsMain = ({ onMobileMenuClick }) => {
  const { id } = useParams(); // Get property ID from URL
  const navigate = useNavigate();
  
  // Property data state
  const [property, setProperty] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Edit mode state
  const [isEditMode, setIsEditMode] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
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
    if (file) {
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
    }
  };

  // Handle edit button click
  const handleEditClick = () => {
    setIsEditMode(true);
  };

  // Handle cancel edit
  const handleCancelEdit = () => {
    setIsEditMode(false);
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
      submitData.append('id', id);
      submitData.append('property_type_id', formData.property_type_id);
      submitData.append('area', formData.area);
      submitData.append('floor', formData.floor);
      submitData.append('number_room', formData.number_room);
      submitData.append('number_bathroom', formData.number_bathroom);
      submitData.append('address', formData.address);
      submitData.append('city_id', formData.city_id);
      submitData.append('postal_code', formData.postal_code);
      submitData.append('lat', formData.lat);
      submitData.append('lang', formData.lang);
      submitData.append('specail_note', formData.specail_note);
      submitData.append('co_host_name', formData.co_host_name);
      submitData.append('co_host_mobile', formData.co_host_mobile);
      submitData.append('platform_id', formData.platform_id);
      submitData.append('platform_link', formData.platform_link);
      
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
        });
        
        // Refresh property data
        const updatedResponse = await getPropertyById(accessToken, id);
        if (updatedResponse.status === 1 && updatedResponse.data && updatedResponse.data.length > 0) {
          const propertyData = updatedResponse.data[0];
          setProperty(propertyData);
          setImagePreview(propertyData.image);
        }
        
        setIsEditMode(false);
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
              <div className="d-flex align-items-start flex-column flex-md-row gap-3 w-100">
                <div className="d-flex flex-column align-items-start gap-2 w-100">
                  <div className="d-flex justify-content-between w-100 align-items-center">
                    <h6 className="property-management-card-title m-0">{property.name}</h6>
                    <div className='villa-badge py-1 px-3 rounded-pill'>{property.property_type_id.name}</div>
                  </div>
                
                {/* Image with edit capability */}
                {isEditMode ? (
                  <div className="w-100">
                    <label htmlFor="image" className="form-label mb-1">Property Image</label>
                    <input
                      type="file"
                      className="form-control rounded-2 py-2 px-3 w-100"
                      id="image"
                      name="image"
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                    {imagePreview && (
                      <img 
                        src={imagePreview} 
                        className='property-management-card-img mt-2' 
                        alt="Property preview"
                      />
                    )}
                  </div>
                ) : (
                  <img 
                    src={imagePreview} 
                    className='property-management-card-img' 
                    alt={property.name}
                    onError={(e) => {
                      e.target.src = '/assets/property-management-card-img.png';
                    }}
                  />
                )}
                
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
🔗 Link: ${window.location.origin}/client/property-details/${property.id}

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
                      <h6 className="property-management-card-icon-label m-0">{isEditMode ? formData.floor : property.floor} floors</h6>
                    </div>
                    <div className='card-border-right'>|</div>
                    <div className="d-flex align-items-center gap-1">
                      <img src="/assets/property-card-icon-2.svg" className='img-fluid' alt="rooms" />
                      <h6 className="property-management-card-icon-label m-0">{isEditMode ? formData.number_room : property.number_room} rooms</h6>
                    </div>
                    <div className='card-border-right'>|</div>
                    <div className="d-flex align-items-center gap-1">
                      <img src="/assets/property-card-icon-3.svg" className='img-fluid' alt="area" />
                      <h6 className="property-management-card-icon-label m-0">{isEditMode ? formData.area : property.area} m</h6>
                    </div>
                    <div className='card-border-right'>|</div>
                    <div className="d-flex align-items-center gap-1">
                      <img src="/assets/property-card-icon-4.svg" className='img-fluid' alt="bathrooms" />
                      <h6 className="property-management-card-icon-label m-0">{isEditMode ? formData.number_bathroom : property.number_bathroom} bathrooms</h6>
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
                            {isEditMode ? (
                              <div className="position-relative">
                                <select
                                  id="property_type_id"
                                  name="property_type_id"
                                  className="form-select custom-select-bs py-2"
                                  value={formData.property_type_id}
                                  onChange={handleInputChange}
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
                            ) : (
                              <input
                                type="text"
                                className="form-control rounded-2 border-0 py-2 px-3 w-100"
                                value={property.property_type_id?.name || ''}
                                readOnly
                              />
                            )}
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
                              value={isEditMode ? formData.area : property.area}
                              onChange={handleInputChange}
                              readOnly={!isEditMode}
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
                              value={isEditMode ? formData.floor : property.floor}
                              onChange={handleInputChange}
                              readOnly={!isEditMode}
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
                              value={isEditMode ? formData.number_room : property.number_room}
                              onChange={handleInputChange}
                              readOnly={!isEditMode}
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
                              value={isEditMode ? formData.number_bathroom : property.number_bathroom}
                              onChange={handleInputChange}
                              readOnly={!isEditMode}
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
                              value={isEditMode ? formData.address : property.address}
                              onChange={handleInputChange}
                              readOnly={!isEditMode}
                            />
                          </div>
                        </div>

                        {/* City */}
                        <div className="col-md-6">
                          <div className="mb-3 w-100">
                            <label htmlFor="city_id" className="form-label mb-1">City</label>
                            {isEditMode ? (
                              <div className="position-relative">
                                <select
                                  id="city_id"
                                  name="city_id"
                                  className="form-select custom-select-bs py-2"
                                  value={formData.city_id}
                                  onChange={handleInputChange}
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
                            ) : (
                              <input
                                type="text"
                                className="form-control rounded-2 border-0 py-2 px-3 w-100"
                                value={property.city_id?.name || ''}
                                readOnly
                              />
                            )}
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
                              value={isEditMode ? formData.postal_code : property.postal_code}
                              onChange={handleInputChange}
                              readOnly={!isEditMode}
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
                              value={isEditMode ? formData.specail_note : property.specail_note || ''}
                              onChange={handleInputChange}
                              readOnly={!isEditMode}
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
                              value={isEditMode ? formData.co_host_name : property.co_host_name || ''}
                              onChange={handleInputChange}
                              readOnly={!isEditMode}
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
                              value={isEditMode ? formData.co_host_mobile : property.co_host_mobile || ''}
                              onChange={handleInputChange}
                              readOnly={!isEditMode}
                            />
                          </div>
                        </div>
                        
                        {/* Platform */}
                        <div className="col-md-6">
                          <div className="mb-3 w-100">
                            <label htmlFor="platform_id" className="form-label mb-1">
                              Platforms list
                            </label>

                            <div className="position-relative">
                              <select
                                id="platform_id"
                                name="platform_id"
                                className="form-select custom-select-bs py-2"
                                value={isEditMode ? formData.platform_id : property.platform_id?.id || ''}
                                onChange={handleInputChange}
                                disabled={!isEditMode || isLoadingLists}
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
                        
                        {/* Platform Link */}
                        <div className="col-md-6">
                          <div className="mb-3 w-100">
                            <label htmlFor="platform_link" className="form-label mb-1 text-white">.</label>
                            <input
                              type="text"
                              className="form-control rounded-2 py-2 px-3 w-100"
                              id="platform_link"
                              name="platform_link"
                              placeholder="Enter link"
                              value={isEditMode ? formData.platform_link : property.platform_link || ''}
                              onChange={handleInputChange}
                              readOnly={!isEditMode}
                            />
                          </div>
                        </div>
                        
                        {/* Edit/Submit and Delete Buttons */}
                        <div className="col-md-6">
                            <div className="mb-3 w-100">
                                {isEditMode ? (
                                  <div className="d-flex gap-2">
                                    <button 
                                      className="sec-btn rounded-2 px-4 py-2 w-100"
                                      onClick={handleSubmit}
                                      disabled={isSubmitting}
                                    >
                                      {isSubmitting ? 'Submitting...' : 'Submit'}
                                    </button>
                                    <button 
                                      className="sec-btn-outline rounded-2 px-4 py-2"
                                      onClick={handleCancelEdit}
                                      disabled={isSubmitting}
                                    >
                                      Cancel
                                    </button>
                                  </div>
                                ) : (
                                  <div 
                                    className="edit-btn d-flex align-items-center justify-content-center gap-1"
                                    onClick={handleEditClick}
                                    style={{ cursor: 'pointer' }}
                                  >
                                    <img src="/assets/edit.svg" alt="edit" /> 
                                    <span>Edit</span>
                                  </div>
                                )}
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
            </div>
          </div>
        </div>
        
      </div>
    </section>
  );
};

export default DashboardPropertyDetailsMain;