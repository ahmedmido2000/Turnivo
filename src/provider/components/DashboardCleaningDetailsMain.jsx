import React, { useState, useRef, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { getCleanServiceDetails } from '../../api/superviserCleaningApi';
import ProviderHeader from './ProviderHeader';

const DashboardCleaningDetailsMain = ({ onMobileMenuClick }) => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [serviceDetails, setServiceDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const handleReselectClick = () => {
    const serviceId = searchParams.get('id');
    if (serviceId) {
      navigate(`/provider/team-work?select=true&service_id=${serviceId}&type=cleaning`);
    }
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

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        setIsLoading(true);
        const id = searchParams.get('id');
        const accessToken = localStorage.getItem('access_token');

        if (!id) {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Service ID is missing',
          });
          return;
        }

        if (!accessToken) {
          Swal.fire({
            icon: 'error',
            title: 'Authentication Required',
            text: 'Please login to continue',
          });
          return;
        }

        const response = await getCleanServiceDetails(accessToken, id);

        if (response.status === 1) {
          const detail = Array.isArray(response.data)
            ? response.data?.[0]?.items?.[0] || response.data?.[0]
            : response.data?.items?.[0] || response.data?.[0];
          setServiceDetails(detail || null);
        } else {
          setServiceDetails(null);
        }
      } catch (error) {
        console.error('Error fetching cleaning service details:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.message || 'Failed to load service details',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchDetails();
  }, [searchParams]);



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
            <p className="m-0">Service details not found.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section>
      <ProviderHeader title="Cleaning Details" onMobileMenuClick={onMobileMenuClick} />
      <div className="dashboard-home-content px-3 mt-2">
        <div className="row">
          <div className="col-12">
                            <h6 className="property-problem-title mb-2 mt-2">Maintenance details</h6>
                <div className="d-flex align-items-center justify-content-between p-3 gap-2 w-100 materials-cards rounded-4 mb-3">
      <div className="d-flex w-100 align-items-start flex-column flex-md-row gap-2">
        <img src={serviceDetails.property_id?.image || '/assets/problem-img-2.png'} className='img-fluid materials-img' alt="location" />   
        <div className='d-flex flex-column gap-2 align-items-start w-100'>
                                <div className="d-flex justify-content-between align-items-center w-100">
           <h6 className="property-problem-title mb-0 mt-2">{serviceDetails.clean_service_type_id?.name || 'Cleaning Service'}</h6>
            <div className='new-badge px-2 p-1 rounded-2'>{serviceDetails.status?.name || 'New'}</div>
          </div>
           <h6 className="property-problem-title mb-0 mt-2">{serviceDetails.property_id?.name || 'Property'}</h6>
          <div className="d-flex align-items-center gap-1">
            <img src="/assets/calendar-3.svg" alt="calendar" />
            <p className="dashboard-home-card-2-desc-3 m-0">{serviceDetails.date || 'N/A'}</p>
          </div>
          <div className="d-flex align-items-center gap-1">
            <img src="/assets/clock.svg" alt="clock" />
            <p className="dashboard-home-card-2-desc-3 mb-0">{serviceDetails.time_from && serviceDetails.time_to ? `${serviceDetails.time_from} - ${serviceDetails.time_to}` : 'N/A'}</p>
          </div>
            <h6 className="property-problem-title mb-0">{serviceDetails.property_id?.name || 'Property'}</h6>
            <div className="d-flex align-items-center gap-1">
            <img src="/assets/location-2.svg" alt="location" />
            <p className="dashboard-home-card-2-desc-3 m-0">{serviceDetails.property_id?.address || 'N/A'}</p>
          </div>
            <div className="d-flex align-items-center gap-1">
            <img src="/assets/more-square.svg" alt="location" />
            <p className="dashboard-home-card-2-desc-3 m-0">request number :</p>
            <p className="smart-access-title m-0">#{serviceDetails.id}</p>
          </div>
        </div>
      </div>
    </div>
          </div>
            <h6 className="property-problem-title mb-2 ">Room pictures before and after</h6>
            <div className="d-flex gap-2 align-items-center flex-wrap">
                <div className='rating-stars-bg p-2 rounded-2'>
                    <h3 className='form-label mb-2'>Before cleaning</h3>
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
                    <h3 className='form-label mb-2'>After cleaning</h3>
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
            <h6 className="property-problem-title my-2">Employee</h6>
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
                                        <h6 className="property-management-card-title mb-0 mt-4">Additional Services</h6>
                    <div className="row w-100 g-0 g-lg-2">
                      {serviceDetails.addition_service?.length ? (
                        serviceDetails.addition_service.map((add) => (
                          <div className="col-md-2 col-12 mb-3 col-20-per" key={add.id}>
                            <div className="bg-light-gray p-3 rounded-3 h-100 active">
                              <img src="/assets/service-img.png" className='img-fluid w-100' alt="service" />
                              <div className="d-flex justify-content-between align-items-center gap-1 mt-2">
                                <h3 className='dashboard-routes-sub m-0'>{add.addition_service?.name || 'Service'}</h3>
                                <div className='third-btn-sm p-1 rounded-2'>
                                  {add.addition_service?.price ? `$${add.addition_service.price}` : '$0'}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="col-12 mb-2">
                          <p className='dashboard-home-card-2-desc-3 m-0'>No additional services.</p>
                        </div>
                      )}
                    </div>
            <h6 className="property-problem-title my-2">Problem description</h6>
              <div className="d-flex gap-3 align-items-center flex-wrap flex-sm-nowrap">
                <div className='training-card p-2 rounded-2'>
                    <p className='m-0 problem-desc'>{serviceDetails.description || 'No description available.'}</p>
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

export default DashboardCleaningDetailsMain;