import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { getServiceDetails, getMaintenanceServiceDetails } from '../../api/cleaningServiceApi';
import Swal from 'sweetalert2';
import ClientHeader from './ClientHeader';

const DashboardServiceDetailsMain = ({ onMobileMenuClick }) => {
  const [searchParams] = useSearchParams();
  
  // API state
  const [serviceData, setServiceData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Get service ID and type from URL
  const serviceId = searchParams.get('id');
  const serviceType = searchParams.get('type') || 'cleaning'; // Default to cleaning if not specified
  
  // Fetch service details
  useEffect(() => {
    const fetchServiceDetails = async () => {
      if (!serviceId) {
        setError('No service ID provided');
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
        
        // Use appropriate API based on service type
        let response;
        if (serviceType === 'maintenance') {
          response = await getMaintenanceServiceDetails(serviceId, accessToken);
        } else {
          response = await getServiceDetails(serviceId, accessToken);
        }
        
        if (response && response.status === 1 && response.data && response.data[0]) {
          setServiceData(response.data[0]);
        } else {
          throw new Error('Failed to fetch service details');
        }
      } catch (err) {
        console.error('Error fetching service details:', err);
        setError(err.message || 'Failed to fetch service details');
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: err.message || 'Failed to fetch service details. Please try again.',
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchServiceDetails();
  }, [serviceId, serviceType]);

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  return (
    <section>
      <ClientHeader title={serviceType === 'maintenance' ? 'Maintenance Request' : 'Cleaning Request'} onMobileMenuClick={onMobileMenuClick} />
      <div className="dashboard-home-content px-3 mt-2">
        <div className="d-flex justify-content-between align-items-center gap-3 flex-wrap">
            <h2 className="mb-0 dashboard-title">
              {serviceType === 'maintenance' ? 'Maintenance request' : 'Cleaning request'}
            </h2>
            <button className="main-btn rounded-2 px-3 py-2 w-50-100">
                Edit
            </button>
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
            <Link to="/client/cleaning-request" className="btn btn-primary">
              Back to Orders
            </Link>
          </div>
        )}
        
        {/* Service details */}
        {!loading && !error && serviceData && (
          <div className="row">
            <div className="col-12">
              <div className="property-management-card mt-3 w-100">
                <div className="d-flex align-items-start flex-column flex-md-row gap-3 w-100">
                  <div className="d-flex flex-column align-items-start gap-2 w-100">
                    <div className="d-flex justify-content-between w-100 align-items-center">
                      <h6 className="property-management-card-title m-0">
                        {serviceType === 'maintenance' 
                          ? serviceData.maintenance_service_type_id?.name || 'Maintenance Service'
                          : serviceData.clean_service_type_id?.name || 'Cleaning Service'
                        }
                        {serviceType === 'cleaning' && serviceData.plan_id?.name && ` - ${serviceData.plan_id.name}`}
                        {serviceType === 'maintenance' && serviceData.maintenance_importance_type_id?.name && ` - ${serviceData.maintenance_importance_type_id.name}`}
                      </h6>
                      <div className='villa-badge py-1 px-3 rounded-pill'>
                        {serviceType === 'maintenance' ? 'Maintenance' : 'Cleaning'}
                      </div>
                    </div>
                    <img 
                      src={serviceData.property_id?.image || '/assets/property-management-card-img.png'} 
                      className='property-management-card-img' 
                      alt="Property" 
                    />
                    <div className="d-flex gap-4 align-items-center flex-wrap bg-white w-100 py-1 px-2 rounded-1">
                      <div className="d-flex align-items-center gap-1">
                        <img src="/assets/calendar-3.svg" alt="calendar" />
                        <p className="dashboard-home-card-2-desc-3 m-0">{formatDate(serviceData.date)}</p>
                      </div>
                      <div className="d-flex align-items-center gap-1">
                        <img src="/assets/clock.svg" alt="clock" />
                        <p className="dashboard-home-card-2-desc-3 mb-0">
                          {serviceData.time_from || ''} - {serviceData.time_to || ''}
                        </p>
                      </div>
                    </div>
                    <h2 className="mb-0 dashboard-title">{serviceData.property_id?.name || 'Property'}</h2>
                    <div className="d-flex align-items-center">
                        <img src="/assets/location.svg" className='img-fluid' alt="location" />
                        <p className="property-management-card-address m-0">
                          {serviceData.property_id?.address || 'N/A'}
                        </p>
                    </div>

                    {/* Price Section - For Both Cleaning and Maintenance */}
                    <div className="d-flex align-items-center gap-2 px-1">
                        <img src="/assets/dollar-2.svg" className='img-fluid' alt="price" />
                        <p className="property-management-card-address fw-bold m-0">Price</p>
                        <p className="currency m-0">
                          {serviceType === 'maintenance' 
                            ? (serviceData.property_id?.price || 0) 
                            : (serviceData.total_price || 0)
                          } SAR
                        </p>
                    </div>

                    {/* Status History - For Maintenance */}
                    {serviceType === 'maintenance' && serviceData.status_history && serviceData.status_history.length > 0 && (
                      <>
                        <h6 className="property-management-card-title mb-1 mt-2">Status History</h6>
                        <div className="timeline" style={{ borderLeft: '2px solid #ccc', paddingLeft: '15px' }}>
                          {serviceData.status_history.map((history, index) => (
                            <div key={index} className="mb-3">
                              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <div style={{ 
                                  width: '12px', 
                                  height: '12px', 
                                  backgroundColor: '#007bff', 
                                  borderRadius: '50%', 
                                  marginLeft: '-21px'
                                }}></div>
                                <div>
                                  <p className="property-management-card-address m-0">
                                    <strong>{history.status_id?.name || 'Status'}</strong>
                                  </p>
                                  <p className="property-management-card-address m-0" style={{ fontSize: '0.85rem' }}>
                                    {formatDate(history.created_at)}
                                  </p>
                                  {history.comment && (
                                    <p className="property-management-card-address m-0" style={{ fontSize: '0.85rem', color: '#666' }}>
                                      Comment: {history.comment}
                                    </p>
                                  )}
                                  {history.user && (
                                    <p className="property-management-card-address m-0" style={{ fontSize: '0.85rem', color: '#999' }}>
                                      By: {history.user.name}
                                    </p>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </>
                    )}

                    {/* Service Images - For Maintenance */}
                    {serviceType === 'maintenance' && (
                      <>
                        {serviceData.service_images_befor && serviceData.service_images_befor.length > 0 && (
                          <>
                            <h6 className="property-management-card-title mb-1 mt-2">Before Photos</h6>
                            <div className="d-flex gap-2 flex-wrap">
                              {serviceData.service_images_befor.map((image, index) => (
                                <div key={index} style={{ width: '100px', height: '100px', overflow: 'hidden', borderRadius: '8px' }}>
                                  <img 
                                    src={image.image} 
                                    alt={`Before ${index}`}
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                  />
                                </div>
                              ))}
                            </div>
                          </>
                        )}
                        {serviceData.service_images_after && serviceData.service_images_after.length > 0 && (
                          <>
                            <h6 className="property-management-card-title mb-1 mt-2">After Photos</h6>
                            <div className="d-flex gap-2 flex-wrap">
                              {serviceData.service_images_after.map((image, index) => (
                                <div key={index} style={{ width: '100px', height: '100px', overflow: 'hidden', borderRadius: '8px' }}>
                                  <img 
                                    src={image.image} 
                                    alt={`After ${index}`}
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                  />
                                </div>
                              ))}
                            </div>
                          </>
                        )}
                      </>
                    )}

                    {/* Cleaning Specific Content */}
                    {serviceType === 'cleaning' && (
                      <>
                        {serviceData.addition_service && serviceData.addition_service.length > 0 && (
                          <>
                            <h6 className="property-management-card-title mb-1 mt-2">Additional Services</h6>
                            <div className="row w-100 g-0 g-lg-2">
                              {serviceData.addition_service.map((service) => (
                                <div key={service.id} className="col-md-2 col-12 mb-3 col-20-per">
                                  <div className="bg-light-gray p-3 rounded-3 h-100 active">
                                    <img 
                                      src={service.addition_service?.image || '/assets/service-img.png'} 
                                      className='img-fluid w-100' 
                                      alt="service" 
                                    />
                                    <div className="d-flex justify-content-between align-items-center gap-1 mt-2">
                                      <h3 className='dashboard-routes-sub m-0'>
                                        {service.addition_service?.name || 'Service'}
                                      </h3>
                                      <div className='third-btn-sm p-1 rounded-2'>
                                        ${service.addition_service?.price || 0}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </>
                        )}
                        
                        {/* Price Breakdown */}
                        <div className="row w-100 g-0">
                            <div className="col-md-6">
                              <div className='total-payments p-3 rounded-3'>
                                <div className='d-flex justify-content-between gap-4 align-items-center mb-2'>
                                  <h3 className='service-desc m-0'>
                                    {serviceData.clean_service_type_id?.name || 'Service'}
                                  </h3>
                                  <h4 className='service-price m-0'>{serviceData.price || 0} SAR</h4>
                                </div>
                                
                                {serviceData.addition_service && serviceData.addition_service.length > 0 && (
                                  <>
                                    <div className='d-flex justify-content-between gap-4 align-items-center mb-2'>
                                      <h3 className='service-desc m-0'>Add-on services</h3>
                                      <h4 className='service-price m-0'>{serviceData.addition_service_price || 0} SAR</h4>
                                    </div>
                                    {serviceData.addition_service.map((service) => (
                                      <div key={service.id} className='d-flex justify-content-between gap-4 align-items-center mb-2 px-1 px-md-2'>
                                        <h3 className='property-management-card-address m-0'>
                                          {service.addition_service?.name || 'Service'}
                                        </h3>
                                        <h4 className='sub-service-price m-0'>{service.addition_service?.price || 0} SAR</h4>
                                      </div>
                                    ))}
                                  </>
                                )}
                                
                                <div className='d-flex justify-content-between gap-4 align-items-center'>
                                  <h3 className='service-desc m-0'>Total</h3>
                                  <h4 className='service-total-price m-0'>{serviceData.total_price || 0} SAR</h4>
                                </div>
                              </div>
                            </div>
                        </div>
                      </>
                    )}
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

export default DashboardServiceDetailsMain;