import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import { faStar as faStarRegular } from '@fortawesome/free-regular-svg-icons';
import { useLocation } from 'react-router-dom';
import { rateService } from '../../api/guestRatingApi';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ClientHeader from './ClientHeader';

const DashboardServicesMaintenanceMain = ({ onMobileMenuClick }) => {
  const location = useLocation();
  
  // Rating state
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);

  const serviceData = location.state?.serviceData || null;
  const serviceId = location.state?.serviceId ?? serviceData?.id ?? null;
  const serviceType = location.state?.serviceType ?? serviceData?.type ?? null;

  const serviceDisplay = {
    title: serviceData?.title || serviceData?.serviceTitle || 'Service',
    date: serviceData?.date || 'N/A',
    time: serviceData?.time || 'N/A',
    propertyName: serviceData?.propertyName || serviceData?.subtitle || 'Property',
    location: serviceData?.location || 'N/A',
    price: serviceData?.price || 'N/A',
    image: serviceData?.image || '/assets/property-management-card-img.png',
    providerName: serviceData?.providerName || 'Service Provider',
    providerAvatar: serviceData?.providerAvatar || '/assets/user.png',
    providerDate: serviceData?.providerDate || serviceData?.date || 'N/A'
  };

  // Handle star click
  const handleStarClick = (starIndex) => {
    setRating(starIndex);
  };

  // Handle star hover
  const handleStarHover = (starIndex) => {
    setHoveredRating(starIndex);
  };

  // Handle star leave
  const handleStarLeave = () => {
    setHoveredRating(0);
  };

  // Handle rating submission
  const handleRatingSubmit = async () => {
    if (rating === 0) {
      toast.error('Please select a rating', {
        position: "top-center",
        autoClose: 2000,
      });
      return;
    }

    if (!serviceId || !serviceType) {
      toast.error('Service data is missing. Please try again from the orders page.', {
        position: "top-center",
        autoClose: 3000,
      });
      return;
    }

    if (!comment.trim()) {
      toast.error('Please enter feedback', {
        position: "top-center",
        autoClose: 2000,
      });
      return;
    }

    setLoading(true);
    try {
      const accessToken = localStorage.getItem('access_token') || 'q3mdPlSMfSBKo4QrUSXEezb3WU59BLcS';
      
      const response = await rateService(
        accessToken,
        serviceId,
        serviceType,
        rating,
        comment
      );

      // Check if response contains error message in data array
      if (response.status === 1 && response.data && Array.isArray(response.data) && response.data.length > 0) {
        if (response.data[0].status === 0 && response.data[0].message) {
          toast.error(response.data[0].message, {
            position: "top-center",
            autoClose: 3000,
          });
          setLoading(false);
          return;
        }
      }

      if (response.status === 1) {
        toast.success(response.message || 'Rating submitted successfully!', {
          position: "top-center",
          autoClose: 2000,
        });
        // Reset form
        setRating(0);
        setComment('');
      } else {
        toast.error(response.message || 'Failed to submit rating', {
          position: "top-center",
          autoClose: 2000,
        });
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'An error occurred';
      toast.error(errorMessage, {
        position: "top-center",
        autoClose: 2000,
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle cancel
  const handleCancel = () => {
    setRating(0);
    setComment('');
    setHoveredRating(0);
  };


  return (
    <section>
      <ToastContainer />
      <ClientHeader title="My Ratings" onMobileMenuClick={onMobileMenuClick} />
      <div className="dashboard-home-content px-3 mt-2">
        <h6 className="dashboard-routes-sub m-0">Service Rating</h6>
        <div className="service-desc mb-3 mt-3">Service</div>
        <div className="d-flex align-items-center justify-content-between p-3 gap-2 w-100 materials-cards rounded-4 mb-3">
          <div className="d-flex w-100 align-items-start flex-column flex-md-row gap-2">
            <img src={serviceDisplay.image} className='img-fluid materials-img' alt="location" />
            <div className='d-flex flex-column gap-2 align-items-start w-100'>
              <h6 className="property-problem-title mb-0">{serviceDisplay.title}</h6>
              <div className="d-flex align-items-center gap-1">
                <img src="/assets/calendar-3.svg" alt="calendar" />
                <p className="dashboard-home-card-2-desc-3 m-0">{serviceDisplay.date}</p>
              </div>
              <div className="d-flex align-items-center gap-1">
                <img src="/assets/clock.svg" alt="clock" />
                <p className="dashboard-home-card-2-desc-3 mb-0">{serviceDisplay.time}</p>
              </div>
              <h6 className="property-problem-title mb-0">{serviceDisplay.propertyName}</h6>
              <div className="d-flex align-items-center gap-1">
                <img src="/assets/location-2.svg" alt="location" />
                <p className="dashboard-home-card-2-desc-3 m-0">{serviceDisplay.location}</p>
              </div>
              <div className="d-flex align-items-center gap-1">
                <img src="/assets/dollar.svg" alt="price" />
                <p className="dashboard-home-card-2-desc-3 m-0">{serviceDisplay.price}</p>
              </div>
            </div>
          </div>
        </div>
        <div className="d-flex align-items-center gap-2 mb-3">
          <div className="service-desc mb-2 mt-2">Provider</div>
          <img src={serviceDisplay.providerAvatar} className='provider-rate' alt="user" />
          <div>
            <h6 className='popup-title m-0'>{serviceDisplay.providerName}</h6>
            <h6 className="dashboard-routes-sub m-0 mt-1">{serviceDisplay.providerDate}</h6>
          </div>
        </div>
              <div className="d-flex">
              <div className="rating-stars-bg p-3 rounded-3 d-flex gap-2 align-items-center mb-3">
                {[1, 2, 3, 4, 5].map((star) => (
                  <FontAwesomeIcon
                    key={star}
                    icon={star <= (hoveredRating || rating) ? faStar : faStarRegular}
                    style={{
                      cursor: 'pointer',
                      color: star <= (hoveredRating || rating) ? '#FFD700' : '#ccc',
                      fontSize: '1.5rem'
                    }}
                    onClick={() => handleStarClick(star)}
                    onMouseEnter={() => handleStarHover(star)}
                    onMouseLeave={handleStarLeave}
                  />
                ))}
              </div>
              </div>
              <div className="row">
                <div className="col-12">
                <div className="mb-3 w-100">
                  <label htmlFor="notes" className="form-label mb-1">Feedback</label>
                  <textarea
                    name="notes"
                    id="notes"
                    rows="4"
                    className="form-control rounded-2 py-2 w-100"
                    placeholder='Great and fast service! Booking was easy and the team is very professional. I will definitely order the service again!'
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                  ></textarea>
                </div>
                </div>
                <div className="row">
                    <div className="col-md-6 mb-3">
                        <button
                          onClick={handleRatingSubmit}
                          disabled={loading}
                          className="edit-btn rounded-2 px-5 py-2 w-100 border-0"
                        >
                            {loading ? 'Submitting...' : 'Rating'}
                        </button>
                    </div>
                    <div className="col-md-6">
                        <button
                          onClick={handleCancel}
                          disabled={loading}
                          className="delete-btn rounded-2 px-5 py-2 w-100 border-0"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
              </div>
      </div>
    </section>
  );
};

export default DashboardServicesMaintenanceMain;