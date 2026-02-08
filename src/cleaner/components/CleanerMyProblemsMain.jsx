import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import CleanerHeader from './CleanerHeader';
import { getProviderReportProblems } from '../../api/reportProblemApi';
import { selectAccessToken } from '../../store/authSlice';

const CleanerMyProblemsMain = ({ onMobileMenuClick }) => {
  const [problemsData, setProblemsData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const accessToken = useSelector(selectAccessToken);

  // Fetch problems data
  useEffect(() => {
    const fetchData = async () => {
      if (!accessToken) return;

      try {
        setIsLoading(true);
        const response = await getProviderReportProblems(accessToken, currentPage);

        if (response.status === 1 && response.data && response.data.length > 0) {
          const items = response.data[0]?.items || [];
          const meta = response.data[0]?._meta;
          setProblemsData(items);
          if (meta) {
            setTotalPages(meta.NumberOfPage || 1);
          }
        } else {
          setProblemsData([]);
          setTotalPages(1);
        }
      } catch (error) {
        console.error('Error fetching problems:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.message || 'Failed to load problems',
        });
        setProblemsData([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [accessToken, currentPage]);

  // Search filter
  const filteredProblems = problemsData.filter((item) => {
    if (!searchQuery.trim()) return true;
    const term = searchQuery.toLowerCase();
    const propertyName = (item.property_id?.name || '').toLowerCase();
    const description = (item.description || '').toLowerCase();
    const address = (item.property_id?.address || '').toLowerCase();
    return propertyName.includes(term) || description.includes(term) || address.includes(term);
  });

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  // Get status badge class and text
  const getStatusInfo = (status) => {
    switch (status) {
      case 0: return { className: 'new-badge', text: 'Pending' };
      case 1: return { className: 'progress-badge', text: 'In Progress' };
      case 2: return { className: 'complete-badge', text: 'Resolved' };
      case 3: return { className: 'reject-badge', text: 'Rejected' };
      default: return { className: 'new-badge', text: 'Pending' };
    }
  };

  // Get problem type text
  const getProblemType = (type) => {
    switch (type) {
      case 1: return 'Issue with a Home Service';
      case 2: return 'Technical Issue with the App';
      default: return 'General Issue';
    }
  };

  return (
    <section>
      <CleanerHeader title="My Problems" onMobileMenuClick={onMobileMenuClick} />
      <div className="dashboard-home-content px-3 mt-2">
        <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-3">
          <h6 className="dashboard-routes-sub m-0">My Reported Problems</h6>
          <div className="search-input-wrapper">
            <SearchOutlinedIcon className="search-icon" />
            <input 
              type="text" 
              className="search-gray-input form-control"
              placeholder="Search problems..." 
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </div>
        </div>

        {isLoading ? (
          <div className="text-center mt-4">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : filteredProblems.length === 0 ? (
          <div className="text-center mt-4">
            <img src="/assets/empty-state.svg" alt="No data" className="mb-3" style={{ width: '150px', opacity: 0.5 }} />
            <p className="text-muted">No problems reported yet</p>
          </div>
        ) : (
          <div className="row mt-3">
            {filteredProblems.map((item, index) => {
              const statusInfo = getStatusInfo(item.status);
              return (
                <div className="col-lg-6 col-12 mb-3" key={item.id || index}>
                  <Link 
                    to={`/cleaner/problem-details?id=${item.id}`} 
                    className="text-decoration-none"
                  >
                    <div className="d-flex align-items-center justify-content-between p-3 gap-2 w-100 materials-cards rounded-4 h-100">
                      <div className="d-flex w-100 align-items-start flex-column flex-md-row gap-2">
                        <img 
                          src={item.property_id?.image || "/assets/problem-img-2.png"} 
                          className='img-fluid materials-img' 
                          alt="property" 
                        />   
                        <div className='d-flex flex-column gap-2 align-items-start w-100'>
                          <div className="d-flex justify-content-between align-items-center w-100">
                            <h6 className="property-problem-title mb-0">
                              {item.property_id?.name || 'Property Name'}
                            </h6>
                            <div className={`${statusInfo.className} px-2 p-1 rounded-2`}>
                              {statusInfo.text}
                            </div>
                          </div>
                          <div className="d-flex align-items-center gap-1">
                            <img src="/assets/location-2.svg" alt="location" />
                            <p className="dashboard-home-card-2-desc-3 m-0">
                              {item.property_id?.address || 'Address not available'}
                            </p>
                          </div>
                          <div className="problem-type-badge d-flex align-items-center gap-2 p-2 rounded-2">
                            <img style={{width:"20px"}} src="/assets/warning.svg" alt="type" />
                            <span>{getProblemType(item.type)}</span>
                          </div>
                          <p className="dashboard-home-card-2-desc-3 m-0 text-truncate" style={{ maxWidth: '250px' }}>
                            {item.description || 'No description'}
                          </p>
                          <div className="d-flex align-items-center gap-1">
                            <img src="/assets/calendar-3.svg" alt="calendar" />
                            <p className="dashboard-home-card-2-desc-3 m-0">
                              {item.created_at || 'N/A'}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="d-flex justify-content-center align-items-center gap-3 mt-4">
            <button 
              className="pagination-btn" 
              onClick={handlePrevPage}
              disabled={currentPage === 1}
            >
              <FontAwesomeIcon icon={faChevronLeft} />
            </button>
            <span className="pagination-info">
              Page {currentPage} of {totalPages}
            </span>
            <button 
              className="pagination-btn" 
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
            >
              <FontAwesomeIcon icon={faChevronRight} />
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default CleanerMyProblemsMain;
