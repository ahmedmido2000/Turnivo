import React, { useState, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import { getProperties } from '../../api/propertyApi';
import { getListsData, createMaintenanceService } from '../../api/cleaningServiceApi';
import ClientHeader from './ClientHeader';

const DashboardServicesMaintenanceMain = ({ onMobileMenuClick }) => {
  const scrollContainerRef = useRef(null);
  const propertyCardsRef = useRef({});
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  // Data states
  const [properties, setProperties] = useState([]);
  const [listsData, setListsData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Selection states
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [selectedServiceType, setSelectedServiceType] = useState(null);
  const [selectedImportanceType, setSelectedImportanceType] = useState(null);
  const [description, setDescription] = useState('');
  
  // Fetch initial data
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setIsLoading(true);
        const accessToken = localStorage.getItem('access_token');
        
        if (!accessToken) {
          Swal.fire({
            icon: 'error',
            title: 'Authentication Required',
            text: 'Please log in to continue.',
          });
          navigate('/client/login');
          return;
        }

        // Fetch properties with pagination
        let allProperties = [];
        let currentPage = 1;
        let hasMorePages = true;

        while (hasMorePages) {
          const propertiesResponse = await getProperties(accessToken, currentPage);
          if (propertiesResponse.status === 1 && propertiesResponse.data) {
            const pageData = propertiesResponse.data[0];
            const items = pageData?.items || [];
            allProperties = [...allProperties, ...items];

            const meta = pageData?._meta;
            if (meta && currentPage < meta.NumberOfPage) {
              currentPage++;
            } else {
              hasMorePages = false;
            }
          } else {
            hasMorePages = false;
          }
        }
        
        // Reorder properties so selected property comes first
        let orderedProperties = allProperties;
        const propertyIdParam = searchParams.get('propertyId');
        if (propertyIdParam) {
          const selectedProp = allProperties.find(p => p.id.toString() === propertyIdParam);
          if (selectedProp) {
            orderedProperties = [
              selectedProp,
              ...allProperties.filter(p => p.id.toString() !== propertyIdParam)
            ];
          }
        }
        
        setProperties(orderedProperties);

        // Auto-select property from URL parameter or first property
        if (orderedProperties.length > 0) {
          const propertyToSelect = propertyIdParam 
            ? orderedProperties.find(p => p.id.toString() === propertyIdParam)
            : orderedProperties[0];
          
          if (propertyToSelect) {
            setSelectedProperty(propertyToSelect);
          }
        }

        // Fetch lists data
        const listsResponse = await getListsData(accessToken);
        if (listsResponse.status === 1 && listsResponse.data) {
          setListsData(listsResponse.data[0]);
        }

        setIsLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setIsLoading(false);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to load data. Please try again.',
        });
      }
    };

    fetchInitialData();
  }, [navigate, searchParams]);

  // Handlers
  const handlePropertySelect = (property) => {
    setSelectedProperty(property);
  };

  const handleServiceTypeChange = (e) => {
    const typeId = parseInt(e.target.value);
    const serviceType = listsData?.MaintenanceServiceType?.find(t => t.id === typeId);
    setSelectedServiceType(serviceType);
  };

  const handleImportanceTypeClick = (importanceType) => {
    setSelectedImportanceType(importanceType);
  };

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  };

  // Scroll functions
  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -350, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 350, behavior: 'smooth' });
    }
  };

  // Form submission
  const handleSubmit = async () => {
    // Validation
    if (!selectedProperty) {
      Swal.fire({ icon: 'warning', title: 'Please select a property' });
      return;
    }
    if (!selectedServiceType) {
      Swal.fire({ icon: 'warning', title: 'Please select a service type' });
      return;
    }
    if (!selectedImportanceType) {
      Swal.fire({ icon: 'warning', title: 'Please select an importance type' });
      return;
    }
    if (!description.trim()) {
      Swal.fire({ icon: 'warning', title: 'Please enter a service description' });
      return;
    }

    try {
      setIsSubmitting(true);
      const accessToken = localStorage.getItem('access_token');

      const serviceData = {
        property_id: selectedProperty.id,
        maintenance_service_type_id: selectedServiceType.id,
        maintenance_importance_type_id: selectedImportanceType.id,
        description: description.trim()
      };

      const response = await createMaintenanceService(serviceData, accessToken);

      if (response.status === 1) {
        await Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: 'Maintenance service request submitted successfully.',
        });
        navigate('/client/maintenance-orders');
      } else {
        throw new Error(response.message || 'Failed to submit request');
      }
    } catch (err) {
      console.error('Error submitting request:', err);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: err.message || 'Failed to submit request. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  if (isLoading) {
    return (
      <section>
        <div className="dashboard-main-nav px-md-3 px-1 py-1">
          <div className="d-flex justify-content-between align-items-center">
            <h2 className="mb-0 dashboard-title">Maintenance Request</h2>
          </div>
        </div>
        <div className="dashboard-home-content px-3 mt-2">
          <div className="text-center mt-4 mb-4">
            <p className="text-muted">Loading...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section>
      <ClientHeader title="Maintenance Services" onMobileMenuClick={onMobileMenuClick} />
      <div className="dashboard-home-content px-3 mt-2">
        <h6 className="dashboard-routes-sub m-0">Maintenance Request</h6>
        
        <div className="login-title mb-1 mt-4">Request a maintenance service for property</div>
        <div className="service-desc mb-3 mt-2">Determine the property</div>
        
        {/* Property selection with horizontal scroll */}
        <div className="position-relative mb-4">
          {properties.length > 3 && (
            <button 
              className="property-scroll-btn property-scroll-left"
              onClick={scrollLeft}
              aria-label="Scroll left"
            >
              <FontAwesomeIcon icon={faChevronLeft} />
            </button>
          )}
          
          <div 
            className="property-scroll-container d-flex gap-3 pb-2"
            ref={scrollContainerRef}
          >
            {properties.length > 0 ? (
              properties.map((prop) => (
                <div 
                  key={prop.id} 
                  className="property-card-wrapper"
                  ref={(el) => {
                    if (el) propertyCardsRef.current[prop.id] = el;
                  }}
                >
                  <div 
                    className={`calendar-card w-100 h-100 ${selectedProperty?.id === prop.id ? 'active' : ''}`} 
                    style={{ cursor: 'pointer' }}
                    onClick={() => handlePropertySelect(prop)}
                  >
                    <div className="d-flex w-100 align-items-center gap-2">
                      <img 
                        src={prop.image} 
                        className='property-management-card-img-2' 
                        alt={prop.name}
                        onError={(e) => {
                          e.target.src = '/assets/property-management-card-img.png';
                        }}
                      />
                      <div className='d-flex flex-column gap-2 align-items-start'>
                        <div className='villa-badge py-1 px-3 rounded-pill'>
                          {prop.property_type_id?.name || 'Property'}
                        </div>
                        <div className="d-flex align-items-center">
                          <img src="/assets/location.svg" className='img-fluid' alt="location" />
                          <p className="property-management-card-address m-0">{prop.address || 'N/A'}</p>
                        </div>
                      </div>
                    </div>
                    <div className="d-flex gap-1 align-items-center flex-wrap w-100 py-1 rounded-1 mt-2">
                      <div className="d-flex align-items-center gap-1">
                        <img src="/assets/property-card-icon-1.svg" className='img-fluid' alt="floors" />
                        <h6 className="property-management-card-icon-label m-0">{prop.floor || 0} floors</h6>
                      </div>
                      <div className='card-border-right'>|</div>
                      <div className="d-flex align-items-center gap-1">
                        <img src="/assets/property-card-icon-2.svg" className='img-fluid' alt="rooms" />
                        <h6 className="property-management-card-icon-label m-0">{prop.number_room || 0} rooms</h6>
                      </div>
                      <div className='card-border-right'>|</div>
                      <div className="d-flex align-items-center gap-1">
                        <img src="/assets/property-card-icon-3.svg" className='img-fluid' alt="area" />
                        <h6 className="property-management-card-icon-label m-0">{prop.area || 0} m</h6>
                      </div>
                      <div className='card-border-right'>|</div>
                      <div className="d-flex align-items-center gap-1">
                        <img src="/assets/property-card-icon-4.svg" className='img-fluid' alt="bathrooms" />
                        <h6 className="property-management-card-icon-label m-0">{prop.number_bathroom || 0} bathrooms</h6>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-12 text-center py-4">
                <p className="text-muted">No properties available. Please add a property first.</p>
              </div>
            )}
          </div>
          
          {properties.length > 3 && (
            <button 
              className="property-scroll-btn property-scroll-right"
              onClick={scrollRight}
              aria-label="Scroll right"
            >
              <FontAwesomeIcon icon={faChevronRight} />
            </button>
          )}
        </div>

        <div className="service-desc mb-2 mt-2">Service details</div>
        <div className="row">
          <div className="col-12">
            <div className="mb-3 w-100">
              <label htmlFor="serviceType" className="form-label mb-1">
                Type of service
              </label>

              <div className="position-relative">
                <select
                  id="serviceType"
                  className="form-select custom-select-bs py-2"
                  value={selectedServiceType?.id || ''}
                  onChange={handleServiceTypeChange}
                  required
                >
                  <option value="" disabled>
                    Select service type
                  </option>
                  {listsData?.MaintenanceServiceType?.map((type) => (
                    <option key={type.id} value={type.id}>
                      {type.name}
                    </option>
                  ))}
                </select>

                <i className="bi bi-chevron-down select-bs-icon"></i>
              </div>
            </div>
          </div>
          
          <div className="col-12">
            <div className="mb-3 w-100">
              <label htmlFor="description" className="form-label mb-1">Service description</label>
              <textarea 
                name="description" 
                id="description" 
                rows="4" 
                className="form-control rounded-2 py-2 w-100" 
                placeholder='Malfunction in the general lighting of the apartment'
                value={description}
                onChange={handleDescriptionChange}
              ></textarea>
            </div>
          </div>
          
          <label className="form-label mb-1">Importance level</label>
          <div className="d-flex gap-2 align-items-center order-type-filter flex-wrap mb-3">
            {listsData?.MaintenanceImportanceType?.map((importanceType) => (
              <button 
                key={importanceType.id}
                className={`order-type-item rounded-2 px-4 py-2 ${selectedImportanceType?.id === importanceType.id ? 'active' : ''}`}
                onClick={() => handleImportanceTypeClick(importanceType)}
              >
                {importanceType.name}
              </button>
            ))}
          </div>
          
          <div className="row">
            <div className="col-md-6 mb-3">
              <button 
                className="sec-btn rounded-2 px-5 py-2 w-100"
                onClick={handleSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Sending...' : 'Send a request'}
              </button>
            </div>
            <div className="col-md-6">
              <button 
                className="delete-btn rounded-2 px-5 py-2 w-100 border-0"
                onClick={handleCancel}
                disabled={isSubmitting}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <style jsx>{`
        .property-scroll-container {
          overflow-x: auto;
          scroll-behavior: smooth;
          -webkit-overflow-scrolling: touch;
          scrollbar-width: thin;
          scrollbar-color: #ccc #f1f1f1;
        }
        
        .property-scroll-container::-webkit-scrollbar {
          height: 8px;
        }
        
        .property-scroll-container::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        
        .property-scroll-container::-webkit-scrollbar-thumb {
          background: #ccc;
          border-radius: 10px;
        }
        
        .property-scroll-container::-webkit-scrollbar-thumb:hover {
          background: #999;
        }
        
        .property-card-wrapper {
          min-width: 350px;
          max-width: 350px;
          margin:10px 0;
          flex-shrink: 0;
        }
        
        .property-scroll-btn {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          background: white;
          border: 1px solid #ddd;
          border-radius: 50%;
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 10;
          box-shadow: 0 2px 5px rgba(0,0,0,0.1);
          cursor: pointer;
          transition: all 0.3s ease;
        }
        
        .property-scroll-btn:hover {
          background: #f8f9fa;
        }
        
        .property-scroll-left {
          left: 0px;
        }
        
        .property-scroll-right {
          right: 0px;
        }

        @media (max-width: 768px) {
          .property-card-wrapper {
            min-width: 280px;
            max-width: 280px;
          }
          
          .property-scroll-btn {
            width: 35px;
            height: 35px;
          }
          
          .property-scroll-left {
            left: -10px;
          }
          
          .property-scroll-right {
            right: -10px;
          }
        }
      `}</style>
    </section>
  );
};

export default DashboardServicesMaintenanceMain;