import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import { faStar as faStarRegular } from '@fortawesome/free-regular-svg-icons';
import { Person, Settings, Logout } from '@mui/icons-material';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import AddCircleOutlinedIcon from '@mui/icons-material/AddCircleOutlined';
import { Link, useNavigate } from 'react-router-dom';
import { guestRateService } from '../../api/guestApi';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const GuestRatingsMain = () => {
  const navigate = useNavigate();
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    temp_code: 'TEMP123', // Temporary code for development - will be dynamic later
    property_id: 1, // You can set this dynamically
    service_quality: '',
    comment: ''
  });

  // Get guest access token from localStorage
  const guestData = localStorage.getItem('guest_data');
  // Temporary: use default token for development if not logged in
  const accessToken = guestData ? JSON.parse(guestData).access_token : 'q3mdPlSMfSBKo4QrUSXEezb3WU59BLcS';

  useEffect(() => {
    // Temporarily disabled for development - will be enabled when temp_code is dynamic
    // if (!accessToken) {
    //   toast.error('Please login first', {
    //     position: "top-center",
    //     autoClose: 2000,
    //   });
    //   navigate('/guest/login');
    // }
  }, [accessToken, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleStarClick = (starIndex) => {
    setRating(starIndex);
  };

  const handleStarHover = (starIndex) => {
    setHoveredRating(starIndex);
  };

  const handleStarLeave = () => {
    setHoveredRating(0);
  };

  const handleSubmit = async () => {
    if (!formData.temp_code) {
      toast.error('Please enter temp code', {
        position: "top-center",
        autoClose: 2000,
      });
      return;
    }

    if (rating === 0) {
      toast.error('Please select a rating', {
        position: "top-center",
        autoClose: 2000,
      });
      return;
    }

    if (!formData.comment) {
      toast.error('Please enter feedback', {
        position: "top-center",
        autoClose: 2000,
      });
      return;
    }

    setLoading(true);
    try {
      const response = await guestRateService(
        accessToken,
        formData.property_id,
        formData.temp_code,
        rating,
        formData.comment
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
        setTimeout(() => {
          navigate('/guest/list');
        }, 2000);
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

  const handleCancel = () => {
    navigate('/guest/list');
  };

  return (
    <section>
        <ToastContainer />
        <div className="container">
            <div className="dashboard-home-content px-3 mt-3">
                <h6 className="dashboard-routes-sub mb-2">Ratings</h6>
                <div className="mb-3 w-100">
                    <label className="form-label mb-1">temp code</label>
                    <input
                      type="text"
                      name="temp_code"
                      value={formData.temp_code}
                      onChange={handleInputChange}
                      className="form-control rounded-2 py-2 px-3 w-100"
                      placeholder="Enter code"
                    />
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
                            <label htmlFor="service_quality" className="form-label mb-1">
                                Service quality
                            </label>
                            <div className="position-relative">
                                <select
                                  id="service_quality"
                                  name="service_quality"
                                  value={formData.service_quality}
                                  onChange={handleInputChange}
                                  className="form-select custom-select-bs py-2"
                                  required
                                >
                                  <option value="" disabled>
                                      Select Service quality
                                  </option>
                                  <option value="Excellent cleaning">Excellent cleaning</option>
                                  <option value="Good cleaning">Good cleaning</option>
                                  <option value="Average cleaning">Average cleaning</option>
                                  <option value="Poor cleaning">Poor cleaning</option>
                                </select>
                                <i className="bi bi-chevron-down select-bs-icon"></i>
                            </div>
                        </div>
                    </div>
                    <div className="col-12">
                        <div className="mb-3 w-100">
                            <label htmlFor="comment" className="form-label mb-1">Feedback</label>
                            <textarea
                              name="comment"
                              id="comment"
                              rows="4"
                              value={formData.comment}
                              onChange={handleInputChange}
                              className="form-control rounded-2 py-2 w-100"
                              placeholder='Great and fast service! Booking was easy and the team is very professional. I will definitely order the service again!'
                            ></textarea>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-6 mb-3">
                            <button
                              onClick={handleSubmit}
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
        </div>
    </section>
  );
};

export default GuestRatingsMain;