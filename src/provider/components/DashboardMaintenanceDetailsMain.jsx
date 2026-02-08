import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { getMaintenanceServiceDetails } from '../../api/superviserMaintenanceApi';
import ProviderHeader from './ProviderHeader';

const DashboardMaintenanceDetailsMain = ({ onMobileMenuClick }) => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  // API data state
  const [serviceDetails, setServiceDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const handleReselectClick = () => {
    const serviceId = searchParams.get('id');
    if (serviceId) {
      navigate(`/provider/team-work?select=true&service_id=${serviceId}&type=maintenance`);
    }
  };
  
  // Fetch service details
  useEffect(() => {
    const fetchDetails = async () => {
      try {
        setIsLoading(true);
        const serviceId = searchParams.get('id');
        
        if (!serviceId) {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Service ID is missing',
          });
          return;
        }
        
        const accessToken = localStorage.getItem('access_token');
        if (!accessToken) {
          Swal.fire({
            icon: 'error',
            title: 'Authentication Required',
            text: 'Please login to continue',
          });
          return;
        }
        
        const response = await getMaintenanceServiceDetails(serviceId, accessToken);
        
        if (response.status === 1 && response.data && response.data.length > 0) {
          setServiceDetails(response.data[0]);
        }
      } catch (error) {
        console.error('Error fetching service details:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to load service details',
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchDetails();
  }, [searchParams]);
  
  // Helper function to format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };
  
  // Helper function to render image
  const renderImage = (img) => {
    if (typeof img === 'string') {
      return img;
    } else if (img instanceof File) {
      return URL.createObjectURL(img);
    }
    return '/assets/problem-img-2.png';
  };

  if (isLoading) {
    return (
      <section>
        <div className="dashboard-home-content px-3 mt-5">
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        </div>
      </section>
    );
  }
  
  if (!serviceDetails) {
    return (
      <section>
        <div className="dashboard-home-content px-3 mt-5">
          <div className="text-center py-5">
            <p>Service details not found</p>
          </div>
        </div>
      </section>
    );
  }



  return (
    <section>
      <ProviderHeader title="Maintenance Details" onMobileMenuClick={onMobileMenuClick} />
      <div className="dashboard-home-content px-3 mt-2">
        <div className="row">
          <div className="col-12">
            <div className=" mt-3 w-100">
              <div className="d-flex align-items-start flex-column flex-md-row gap-3 w-100">
                <div className="d-flex flex-column align-items-start gap-2 w-100">
                <div className="property-management-card mt-3 w-100">
                  <div className="d-flex align-items-start flex-column flex-md-row gap-3 w-100">
                    <img 
                      src={serviceDetails.property_id?.image || '/assets/property-management-card-img.png'} 
                      className='property-management-card-img-3' 
                      alt="Property" 
                    />
                    <div className="d-flex flex-column align-items-start gap-2 w-100">
                      <div className="d-flex justify-content-between w-100 align-items-center">
                        <h6 className="property-management-card-title m-0">
                          {serviceDetails.property_id?.name || 'Property Name'}
                        </h6>
                        <div className={`villa-badge py-1 px-3 rounded-pill`}>
                          {serviceDetails.property_id?.type || 'Property'}
                        </div>
                      </div>
                      <div className="d-flex align-items-center">
                        <img src="/assets/location.svg" className='img-fluid' alt="location" />
                        <p className="property-management-card-address m-0">
                          {serviceDetails.property_id?.address || 'Address not available'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <h6 className="property-problem-title mb-2 mt-2">Maintenance details</h6>
                </div>
              </div>
            </div>
          </div>
          <div className="col-12">
                <div className="d-flex align-items-center justify-content-between p-3 gap-2 w-100 materials-cards rounded-4 mb-3">
      <div className="d-flex w-100 align-items-start flex-column flex-md-row gap-2">
        <img 
          src={serviceDetails.property_id?.image || '/assets/problem-img-2.png'} 
          className='img-fluid materials-img' 
          alt="service" 
        />   
        <div className='d-flex flex-column gap-2 align-items-start w-100'>
          <div className="d-flex justify-content-between align-items-center w-100">
            <h6 className="property-problem-title mb-0">
              {serviceDetails.maintenance_service_type_id?.name || 'Maintenance Service'}
            </h6>
            <div className='new-badge px-2 p-1 rounded-2'>
              {serviceDetails.status?.name || 'New'}
            </div>
          </div>
            <div className="d-flex align-items-center gap-1">
            <img src="/assets/location-2.svg" alt="location" />
            <p className="dashboard-home-card-2-desc-3 m-0">
              {serviceDetails.property_id?.address || 'N/A'}
            </p>
          </div>
           <h6 className="property-problem-title mb-0 mt-2">
             {serviceDetails.maintenance_importance_type_id?.name || 'Service Request'}
           </h6>
          <div className="d-flex align-items-center gap-1">
            <img src="/assets/calendar-3.svg" alt="calendar" />
            <p className="dashboard-home-card-2-desc-3 m-0">{formatDate(serviceDetails.created_at)}</p>
          </div>
        </div>
      </div>
    </div>
          </div>
            <h6 className="property-problem-title mb-2 ">Room pictures before and after</h6>
            <div className="d-flex gap-2 align-items-center flex-wrap">
                <div className='rating-stars-bg p-2 rounded-2'>
                    <h3 className='form-label mb-2'>Before</h3>
                    <div className="d-flex gap-2 align-items-center flex-wrap">
                        {serviceDetails.service_images_befor?.length > 0 ? (
                          serviceDetails.service_images_befor.map((img, idx) => (
                            <img 
                              key={idx} 
                              src={renderImage(img)} 
                              className='added-img' 
                              alt="before" 
                              style={{ cursor: 'pointer' }}
                              onClick={() => window.open(renderImage(img), '_blank')}
                            />
                          ))
                        ) : (
                          <p className="dashboard-home-card-2-desc-3 m-0">No images available</p>
                        )}
                    </div>
                </div>
                <div className='rating-stars-bg p-2 rounded-2'>
                    <h3 className='form-label mb-2'>After</h3>
                    <div className="d-flex gap-2 align-items-center flex-wrap">
                        {serviceDetails.service_images_after?.length > 0 ? (
                          serviceDetails.service_images_after.map((img, idx) => (
                            <img 
                              key={idx} 
                              src={renderImage(img)} 
                              className='added-img' 
                              alt="after" 
                              style={{ cursor: 'pointer' }}
                              onClick={() => window.open(renderImage(img), '_blank')}
                            />
                          ))
                        ) : (
                          <p className="dashboard-home-card-2-desc-3 m-0">No images available</p>
                        )}
                    </div>
                </div>

            </div>
            <h6 className="property-problem-title my-2">Provider</h6>
                                <div className="d-flex align-items-center gap-2 w-100">
                      <img 
                        src={serviceDetails.provider?.avatar || '/assets/user.png'} 
                        className='provider-rate' 
                        alt="provider" 
                      />
                      <div>
                        <h6 className='login-title m-0'>
                          {serviceDetails.provider?.name || 'Not Assigned'}
                        </h6>
                        <div className="d-flex align-items-center gap-1 mt-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <svg
                              key={star}
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill={star <= (serviceDetails.provider?.rate || 0) ? "#f7941d" : "none"}
                              stroke="#f7941d"
                              strokeWidth="2"
                            >
                              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                            </svg>
                          ))}
                          <span className="training-details-card-desc m-0 ms-1">({serviceDetails.provider?.rate || 0})</span>
                        </div>
                      </div>
                    </div>
            <h6 className="property-problem-title my-2">Problem description</h6>
              <div className="d-flex gap-3 align-items-center flex-wrap flex-sm-nowrap">
                <div className='d-flex flex-column gap-2 text-nowrap'>
                              <div className="d-flex align-items-center gap-1">
            <img src="/assets/calendar-3.svg" alt="calendar" />
            <p className="dashboard-home-card-2-desc-3 m-0">{formatDate(serviceDetails.created_at)}</p>
          </div>
                    <div className="d-flex align-items-center gap-1">
            <img src="/assets/dollar.svg" alt="price" />
            <p className="dashboard-home-card-2-desc-3 m-0">
              {serviceDetails.cost ? `${serviceDetails.cost} SAR` : 'N/A'}
            </p>
          </div>
                </div>
                <div className='training-card p-2 rounded-2'>
                    <p className='m-0 problem-desc'>
                      {serviceDetails.description || 'No description available'}
                    </p>
                </div>
              </div>
        <div className="d-flex gap-2 align-items-center justify-content-between flex-wrap my-3">
                      <button
  className="main-btn rounded-2 px-4 py-2 d-flex justify-content-center align-items-center gap-2 w-50-100"
  onClick={handleReselectClick}
>
    <img src="/assets/people.svg" alt="people" />
  reselect
                        </button>
                      <button 
            type="submit" 
            className="sec-btn rounded-2 py-2 px-3 d-flex align-items-center justify-content-center gap-2 w-50-100"
          >
            <img src="/assets/key.svg" alt="key" />
            <span>smart key</span>
                        </button>
          </div>
        </div>
        
      </div>
    </section>
  );
};

export default DashboardMaintenanceDetailsMain;