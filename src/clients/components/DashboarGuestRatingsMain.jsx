import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { getGuestRatings } from '../../api/guestRatingApi';
import Swal from 'sweetalert2';
import ClientHeader from './ClientHeader';

const DashboarGuestRatingsMain = ({ onMobileMenuClick }) => {
  // API state
  const [ratingsData, setRatingsData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(12);
  
  // Sample data for ratings (removed - will use API data)
  const sampleRatingsData = [
    {
      id: 1,
      userName: "Omar Alrajihi",
      userImage: "/assets/user.png",
      date: "2024/09/28",
      rating: 5.0,
      service: "Deep cleaning",
      comment: "Great and fast service! Booking was easy and the team is very professional. I will definitely order the service again!",
      qouteImage: "/assets/qoute.png"
    },
    {
      id: 2,
      userName: "Sarah Johnson",
      userImage: "/assets/user.png",
      date: "2024/09/27",
      rating: 4.5,
      service: "Window cleaning",
      comment: "The team did an excellent job with my windows. They were very thorough and professional.",
      qouteImage: "/assets/qoute.png"
    },
    {
      id: 3,
      userName: "Ahmed Hassan",
      userImage: "/assets/user.png",
      date: "2024/09/26",
      rating: 4.0,
      service: "Kitchen cleaning",
      comment: "Very satisfied with the service. The kitchen looks brand new now!",
      qouteImage: "/assets/qoute.png"
    },
    {
      id: 4,
      userName: "Fatima Al-Mansour",
      userImage: "/assets/user.png",
      date: "2024/09/25",
      rating: 5.0,
      service: "Complete house cleaning",
      comment: "Outstanding service! The team was professional and the house is sparkling clean.",
      qouteImage: "/assets/qoute.png"
    },
    {
      id: 5,
      userName: "Mohammed Al-Fahad",
      userImage: "/assets/user.png",
      date: "2024/09/24",
      rating: 3.5,
      service: "Carpet cleaning",
      comment: "Good service overall, but they were a bit late. The carpet looks great though.",
      qouteImage: "/assets/qoute.png"
    },
    {
      id: 6,
      userName: "Layla Al-Rashid",
      userImage: "/assets/user.png",
      date: "2024/09/23",
      rating: 4.5,
      service: "Bathroom cleaning",
      comment: "Excellent attention to detail. The bathroom looks better than ever!",
      qouteImage: "/assets/qoute.png"
    },
    {
      id: 7,
      userName: "Khalid Al-Saud",
      userImage: "/assets/user.png",
      date: "2024/09/22",
      rating: 5.0,
      service: "Deep cleaning",
      comment: "I'm very impressed with the quality of service. Highly recommended!",
      qouteImage: "/assets/qoute.png"
    },
    {
      id: 8,
      userName: "Nora Al-Harbi",
      userImage: "/assets/user.png",
      date: "2024/09/21",
      rating: 4.0,
      service: "Garden cleaning",
      comment: "The team did a fantastic job with my garden. It looks beautiful now!",
      qouteImage: "/assets/qoute.png"
    }
  ];
  
  // Fetch ratings from API
  useEffect(() => {
    fetchGuestRatings();
  }, [currentPage]);
  
  const fetchGuestRatings = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const accessToken = localStorage.getItem('access_token') || 'q3mdPlSMfSBKo4QrUSXEezb3WU59BLcS';
      const response = await getGuestRatings(accessToken, currentPage);
      
      if (response.status === 1 && response.data && response.data.length > 0) {
        const apiData = response.data[0];
        
        // Map API data to component format
        const mappedData = apiData.items.map(item => ({
          id: item.id,
          userName: item.user.name,
          userImage: item.user.avatar || '/assets/user.png',
          date: item.created_at.split(' ')[0], // Extract date part
          rating: item.rate,
          service: item.service_id.property,
          comment: item.comment || 'No comment provided',
          qouteImage: '/assets/qoute.png'
        }));
        
        setRatingsData(mappedData);
        setTotalCount(apiData._meta.totalCount);
        setTotalPages(apiData._meta.NumberOfPage);
        setItemsPerPage(apiData._meta.perPage);
      } else {
        setRatingsData([]);
      }
    } catch (err) {
      console.error('Error fetching guest ratings:', err);
      setError('Failed to load ratings');
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to load guest ratings. Please try again.'
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Use ratingsData directly (API already handles pagination)
  const currentItems = ratingsData;

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
    const hasHalfStar = rating % 1 !== 0;
    
    return (
      <>
        {[...Array(fullStars)].map((_, index) => (
          <FontAwesomeIcon key={index} icon={faStar} className='text-warning' />
        ))}
        {hasHalfStar && <FontAwesomeIcon icon={faStar} className='text-warning half-star' />}
        <p className='m-0 date-label'>({rating.toFixed(1)})</p>
      </>
    );
  };

  return (
    <section>
      <ClientHeader title="Rating of gests" onMobileMenuClick={onMobileMenuClick} />
      <div className="dashboard-home-content px-3 mt-2">
        <h6 className="dashboard-routes-sub m-0">Rating of gests</h6>
        
        {/* Loading state */}
        {loading && (
          <div className="text-center mt-4">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        )}
        
        {/* Error state */}
        {error && !loading && (
          <div className="alert alert-danger mt-3" role="alert">
            {error}
          </div>
        )}
        
        {/* Empty state */}
        {!loading && !error && currentItems.length === 0 && (
          <div className="text-center mt-4">
            <p className="text-muted">No ratings found</p>
          </div>
        )}
        
        {/* Render current page items */}
        {!loading && currentItems.map((item) => (
          <div className="col-12 mt-3" key={item.id}>
            <div className="card p-2">
              <div className="d-flex justify-content-between align-items-start">
                <div className="d-flex flex-column gap-2 align-items-start w-100">
                  <div className="d-flex justify-content-between align-items-start w-100">
                    <div className="d-flex align-items-center gap-2 w-100">
                      <img src={item.userImage} className='provider-rate' alt="user" />
                      <div>
                        <h6 className='popup-title m-0'>{item.userName}</h6>
                        <h6 className="dashboard-routes-sub m-0 mt-1">{item.date}</h6>
                      </div>
                    </div>
                    <img src={item.qouteImage} alt="qoute" />
                  </div>
                  <div className="d-flex gap-1 align-items-center">
                    {renderStars(item.rating)}
                  </div>
                  <h6 className='sub-service-price m-0'>{item.service}</h6>
                  <p className='m-0 deep-desc'>"{item.comment}"</p>
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
      </div>    
    </section>
  );
};

export default DashboarGuestRatingsMain;