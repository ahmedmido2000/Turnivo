import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import {
  getNewCleanServices,
  getProgressCleanServices,
  getCompleteCleanServices,
  getRejectCleanServices,
} from '../../api/superviserCleaningApi';
import ProviderHeader from './ProviderHeader';

const DashboardCleaningRequestMain = ({ onMobileMenuClick }) => {
  const navigate = useNavigate();

  const [selectedOrderFilter, setSelectedOrderFilter] = useState('new');
  const [cleaningData, setCleaningData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 6;

  // Fetch cleaning data based on selected tab
  useEffect(() => {
    const fetchData = async () => {
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

        let response;
        if (selectedOrderFilter === 'new') {
          response = await getNewCleanServices(accessToken);
        } else if (selectedOrderFilter === 'in-progress') {
          response = await getProgressCleanServices(accessToken);
        } else if (selectedOrderFilter === 'finished') {
          response = await getCompleteCleanServices(accessToken);
        } else {
          response = await getRejectCleanServices(accessToken);
        }

        if (response.status === 1 && response.data && response.data.length > 0) {
          const items = response.data?.[0]?.items || [];
          setCleaningData(items);
          const total = Math.ceil(items.length / itemsPerPage) || 1;
          setTotalPages(total);
          if (currentPage > total) setCurrentPage(1);
        } else {
          setCleaningData([]);
          setTotalPages(1);
          setCurrentPage(1);
        }
      } catch (error) {
        console.error('Error fetching cleaning services:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.message || 'Failed to load cleaning services',
        });
        setCleaningData([]);
      }
    };

    fetchData();
  }, [selectedOrderFilter, currentPage]);

  // Search filter
  const filteredMaterials = cleaningData.filter((item) => {
    if (!searchQuery.trim()) return true;
    const term = searchQuery.toLowerCase();
    const title = (item.property_id?.name || item.clean_service_type_id?.name || '').toLowerCase();
    const desc = (item.property_id?.address || '').toLowerCase();
    return title.includes(term) || desc.includes(term);
  });

  useEffect(() => {
    const calculatedPages = Math.ceil(filteredMaterials.length / itemsPerPage) || 1;
    setTotalPages(calculatedPages);
    if (currentPage > calculatedPages) {
      setCurrentPage(1);
    }
  }, [filteredMaterials.length, itemsPerPage, currentPage]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredMaterials.slice(indexOfFirstItem, indexOfLastItem);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };
  
  // Function to handle page change - same as DashboardPropertyManagementMain
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
  
  const handleOrderFilterClick = (filter) => {
    setSelectedOrderFilter(filter);
    setCurrentPage(1); // Reset to first page when changing filter
  };

  const handleReselectClick = (serviceId) => {
    // Navigate to team selection page with service info
    navigate(`/provider/team-work?select=true&service_id=${serviceId}&type=cleaning`);
  };
  
  const getStatusKey = (status) => {
    if (!status) return '';
    if (typeof status === 'string') return status.toLowerCase();
    return (status.name || '').toLowerCase();
  };

  const renderStatusBadge = (status) => {
    const key = getStatusKey(status);
    switch (key) {
      case 'new':
        return <div className='new-badge px-2 p-1 rounded-2'>New</div>;
      case 'progress':
      case 'in-progress':
        return <div className='in-progress-badge px-2 p-1 rounded-2'>In progress</div>;
      case 'complete':
      case 'finished':
        return <div className='finished-badge px-2 p-1 rounded-2'>Finished</div>;
      case 'reject':
      case 'reported':
        return <div className='canceled-badge px-2 p-1 rounded-2'>Reported</div>;
      default:
        return null;
    }
  };
  
  const renderActionButtons = (status, item) => {
    const key = getStatusKey(status);
    switch (key) {
      case 'new':
        return (
          <div className="d-flex gap-2 justify-content-between align-items-end flex-wrap w-100">
            {item.provider_id && (
              <div>
                <h6 className="property-problem-title my-2">employee</h6>
                <div className="d-flex align-items-center gap-2 w-100">
                  <img 
                    src={item.provider_id?.image || '/assets/user.png'} 
                    className='provider-rate' 
                    alt="user" 
                  />
                  <div>
                    <h6 className='login-title m-0'>
                      {`${item.provider_id?.first_name || ''} ${item.provider_id?.last_name || ''}`.trim() || 'Not assigned'}
                    </h6>
                    <h6 className="training-details-card-desc m-0 mt-1">
                      {item.provider_id?.job_title || 'Service Provider'}
                    </h6>
                  </div>
                </div>
              </div>
            )}
            <button
              className="main-btn rounded-2 px-4 py-2 d-flex justify-content-center align-items-center gap-2 w-50-100"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleReselectClick(item.id);
              }}
            >
              <img src="/assets/people.svg" alt="people" />
              reselect
            </button>
          </div>
        );
      default:
        return null;
    }
  };



  return (
    <section>
      <ProviderHeader title="Cleaning Requests" onMobileMenuClick={onMobileMenuClick} />
      <div className="dashboard-home-content px-3 mt-2">

        <div className="d-flex justify-content-between align-items-center gap-3 flex-wrap mb-3">
          <div className="search-input-wrapper mt-2">
            <SearchOutlinedIcon className="search-icon" />
            <input
              type="text"
              className="search-gray-input form-control"
              placeholder="Find a request..."
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </div>
        </div>
        <div className="row package-filter align-items-center py-2 px-0 m-0 mb-3">
          <div className="col-md-3">
            <button 
              className={`rounded-2 border-0 px-4 py-2 w-100 ${selectedOrderFilter === 'new' ? 'sec-btn' : 'package-filter-item'}`}
              onClick={() => handleOrderFilterClick('new')}
            >
              New orders
            </button>
          </div>
          <div className="col-md-3">
            <p 
              className={`text-center rounded-2 py-2 m-0 ${selectedOrderFilter === 'in-progress' ? 'sec-btn' : 'package-filter-item'}`}
              onClick={() => handleOrderFilterClick('in-progress')}
            >
              In progress orders
            </p>
          </div>
          <div className="col-md-3">
            <p 
              className={`text-center rounded-2 py-2 m-0 ${selectedOrderFilter === 'finished' ? 'sec-btn' : 'package-filter-item'}`}
              onClick={() => handleOrderFilterClick('finished')}
            >
              Finished orders
            </p>
          </div>
          <div className="col-md-3">
            <p 
              className={`text-center rounded-2 py-2 m-0 ${selectedOrderFilter === 'reported' ? 'sec-btn' : 'package-filter-item'}`}
              onClick={() => handleOrderFilterClick('reported')}
            >
              Reported orders
            </p>
          </div>
        </div>
        
        {/* Show message if no orders match the filter */}
        {filteredMaterials.length === 0 ? (
          <div className="text-center mt-4 mb-4">
            <p className="text-muted">No orders found for the selected filter.</p>
          </div>
        ) : (
          <>
            {/* Render current page items */}
            {currentItems.map((item) => (
              <Link to={`/supervisor/cleaning-details?id=${item.id}`} key={item.id} className="d-flex text-decoration-none align-items-center justify-content-between p-3 gap-2 w-100 materials-cards rounded-4 mb-3">
                <div className="d-flex w-100 align-items-start flex-column flex-md-row gap-2">
                  <img src={item.property_id?.image || '/assets/problem-img-2.png'} className='img-fluid materials-img' alt="location" />   
                  <div className='d-flex flex-column gap-2 align-items-start w-100'>
                    <div className="d-flex justify-content-between align-items-center w-100">
                      <h6 className="property-problem-title mb-0">{item.property_id?.name || item.clean_service_type_id?.name || 'Cleaning Service'}</h6>
                      {renderStatusBadge(item.status)}
                    </div>
                    <div className="d-flex align-items-center gap-1">
                      <img src="/assets/location-2.svg" alt="location" />
                      <p className="dashboard-home-card-2-desc-3 m-0">{item.property_id?.address || 'N/A'}</p>
                    </div>
                    <div className="d-flex align-items-center gap-1">
                      <img src="/assets/calendar-3.svg" alt="calendar" />
                      <p className="dashboard-home-card-2-desc-3 m-0">{item.date || 'N/A'}</p>
                    </div>
                    <div className="d-flex align-items-center gap-1">
                      <img src="/assets/clock.svg" alt="clock" />
                      <p className="dashboard-home-card-2-desc-3 mb-0">{item.time_from && item.time_to ? `${item.time_from} - ${item.time_to}` : 'N/A'}</p>
                    </div>
                    <div className="d-flex mt-2 gap-2 align-items-center w-100">
                      {renderActionButtons(item.status, item)}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
            
            {/* Only show pagination if there are items */}
            {filteredMaterials.length > 0 && (
              <div className="d-flex justify-content-center mt-2 mb-3">
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

export default DashboardCleaningRequestMain;