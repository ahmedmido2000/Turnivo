import React, { useState, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faBars, faStar, faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { faStar as faStarRegular } from '@fortawesome/free-regular-svg-icons';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import ProviderHeader from './ProviderHeader';

const DashboarProviderGuestRatingsMain = ({ onMobileMenuClick }) => {
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  
  // Ratings data from API
  const [ratingsData, setRatingsData] = useState([]);
  const [averageRating, setAverageRating] = useState(0);

  // Fetch ratings data from API
  useEffect(() => {
    const fetchRatings = async () => {
      try {
        setIsLoading(true);
        const accessToken = localStorage.getItem('access_token');
        
        if (!accessToken) {
          console.error('No access token found');
          return;
        }

        const response = await axios.get(
          `https://alrajihy.com/demo/turnivo/api/web/v1/site/supervisor-rate?access-token=${accessToken}&page=${currentPage}`
        );

        if (response.data.status === 1 && response.data.data && response.data.data.length > 0) {
          const items = response.data.data[0].items || [];
          const meta = response.data.data[0]._meta || {};
          
          setRatingsData(items);
          setTotalPages(meta.NumberOfPage || 1);
          
          // Calculate average rating
          if (items.length > 0) {
            const totalRate = items.reduce((sum, item) => sum + (item.rate || 0), 0);
            setAverageRating((totalRate / items.length).toFixed(1));
          }
        } else {
          setRatingsData([]);
          setTotalPages(1);
        }
      } catch (error) {
        console.error('Error fetching ratings:', error);
        setRatingsData([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRatings();
  }, [currentPage]);

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

  const handleDropdownItemClick = (action) => {
    setIsDropdownOpen(false);
    if (action === 'profile') {
      navigate('/supervisor/profile');
    } else if (action === 'settings') {
      navigate('/supervisor/settings');
    } else if (action === 'logout') {
      localStorage.removeItem('access_token');
      navigate('/login');
    }
  };
  
  // Function to handle page change
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      // Here you would typically fetch the data for the new page
    }
  };
  
  // Function to render pagination numbers - simplified to match DashboardPropertyManagementMain
  const renderPaginationNumbers = () => {
    const pages = [];
    // Render pages in descending order as shown in DashboardPropertyManagementMain
    for (let i = totalPages; i >= 1; i--) {
      pages.push(
        <button
          key={i}
          className={`pagination-number ${currentPage === i ? 'active' : ''}`}
          onClick={() => handlePageChange(i)}
        >
          {i}
        </button>
      );
    }
    return pages;
  };
  
  // Function to render star rating
  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const emptyStars = 5 - fullStars;
    
    return (
      <>
        {[...Array(fullStars)].map((_, index) => (
          <FontAwesomeIcon key={`full-${index}`} icon={faStar} className='text-warning' />
        ))}
        {[...Array(emptyStars)].map((_, index) => (
          <FontAwesomeIcon key={`empty-${index}`} icon={faStarRegular} className='text-warning' />
        ))}
        <p className='m-0 date-label'>({rating})</p>
      </>
    );
  };

  return (
    <section>
      <ProviderHeader title="Ratings & Ratings" onMobileMenuClick={onMobileMenuClick} />
      <div className="dashboard-home-content px-3 mt-2">
          <div className="d-flex gap-2 align-items-center">
              <div className="rating-stars-bg p-3 rounded-3 d-flex gap-2 align-items-center mb-3">
            <img src="/assets/problem-img-2.png" className='review-img' alt="review-img" />
            <div>
              <p className='general-assess m-0'>General assessment</p>
              <div className="d-flex align-items-center gap-2">
                {renderStars(parseFloat(averageRating) || 0)}
              </div>
            </div>
              </div>
          </div>
        <h6 className="dashboard-routes-sub m-0">Rating of guests</h6>
        
        {/* Loading State */}
        {isLoading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : ratingsData.length === 0 ? (
          <div className="text-center mt-4 mb-4">
            <p className="text-muted">No ratings found.</p>
          </div>
        ) : (
          <>
            {/* Render ratings items */}
            {ratingsData.map((item) => (
              <div className="col-12 mt-3" key={item.id}>
                <div className="card p-2">
                  <div className="d-flex justify-content-between align-items-start">
                    <div className="d-flex flex-column gap-2 align-items-start w-100">
                      <div className="d-flex justify-content-between align-items-start w-100">
                        <div className="d-flex align-items-center gap-2 w-100">
                          <img src={item.user?.avatar || '/assets/user.png'} className='provider-rate' alt="user" />
                          <div>
                            <h6 className='popup-title m-0'>{item.user?.name || 'Unknown User'}</h6>
                            <h6 className="dashboard-routes-sub m-0 mt-1">{item.created_at || 'N/A'}</h6>
                          </div>
                        </div>
                        <img src="/assets/qoute.png" alt="qoute" />
                      </div>
                      <div className="d-flex gap-1 align-items-center">
                        {renderStars(item.rate || 0)}
                      </div>
                      <h6 className='sub-service-price m-0'>{item.type_name || 'Service'}</h6>
                      <p className='m-0 deep-desc text-muted'><strong>Property:</strong> {item.service_id?.property || 'N/A'}</p>
                      {item.comment && <p className='m-0 deep-desc'>"{item.comment}"</p>}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="d-flex justify-content-center mt-4 mb-3">
                <div className="pagination-container d-flex align-items-center">
                  <button
                    className="pagination-arrow"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    <FontAwesomeIcon icon={faChevronLeft} />
                  </button>
                  
                  {renderPaginationNumbers()}
                  
                  <button
                    className="pagination-arrow"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    <FontAwesomeIcon icon={faChevronRight} />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>    
    </section>
  );
};

export default DashboarProviderGuestRatingsMain;