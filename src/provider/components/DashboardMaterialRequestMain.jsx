import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight, faBars, faChevronDown } from '@fortawesome/free-solid-svg-icons';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import {
  getNewMaterialRequests,
  getProgressMaterialRequests,
  getCompleteMaterialRequests,
  getRejectMaterialRequests,
  rejectMaterialRequest,
} from '../../api/superviserMatrialsApi';
import ProviderHeader from './ProviderHeader';

const DashboardMaterialRequestMain = ({ onMobileMenuClick }) => {
  const navigate = useNavigate();
  const [selectedOrderFilter, setSelectedOrderFilter] = useState('new');
  const [materialsData, setMaterialsData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const itemsPerPage = 6;

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fetch materials data based on selected tab
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
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
          response = await getNewMaterialRequests(accessToken);
        } else if (selectedOrderFilter === 'in-progress') {
          response = await getProgressMaterialRequests(accessToken);
        } else if (selectedOrderFilter === 'complete') {
          response = await getCompleteMaterialRequests(accessToken);
        } else {
          response = await getRejectMaterialRequests(accessToken);
        }

        if (response.status === 1 && response.data && response.data.length > 0) {
          const items = response.data?.[0]?.items || [];
          setMaterialsData(items);
          const total = Math.ceil(items.length / itemsPerPage) || 1;
          setTotalPages(total);
          if (currentPage > total) setCurrentPage(1);
        } else {
          setMaterialsData([]);
          setTotalPages(1);
          setCurrentPage(1);
        }
      } catch (error) {
        console.error('Error fetching material requests:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.message || 'Failed to load material requests',
        });
        setMaterialsData([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [selectedOrderFilter]);

  // Search filter
  const filteredMaterials = materialsData.filter((item) => {
    if (!searchQuery.trim()) return true;
    const term = searchQuery.toLowerCase();
    const userName = (item.user?.name || '').toLowerCase();
    return userName.includes(term);
  });

  useEffect(() => {
    const calculatedPages = Math.ceil(filteredMaterials.length / itemsPerPage) || 1;
    setTotalPages(calculatedPages);
    if (currentPage > calculatedPages) {
      setCurrentPage(1);
    }
  }, [filteredMaterials.length, itemsPerPage]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredMaterials.slice(indexOfFirstItem, indexOfLastItem);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const renderPaginationNumbers = () => {
    const pages = [];
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
    setCurrentPage(1);
  };

  const handleRejectClick = async (e, serviceId) => {
    e.preventDefault();
    e.stopPropagation();

    const { value: comment } = await Swal.fire({
      title: 'Reject Order',
      input: 'textarea',
      inputLabel: 'Enter rejection reason',
      inputPlaceholder: 'Type your comment here...',
      showCancelButton: true,
      confirmButtonText: 'Reject',
      confirmButtonColor: '#dc3545',
      inputValidator: (value) => {
        if (!value) {
          return 'Please enter a comment!';
        }
      }
    });

    if (comment) {
      try {
        const accessToken = localStorage.getItem('access_token');
        const response = await rejectMaterialRequest(accessToken, serviceId, comment);
        
        if (response.status === 1) {
          Swal.fire({
            icon: 'success',
            title: 'Success',
            text: response.message || 'Order rejected successfully',
          });
          // Refresh data by re-triggering useEffect
          const currentFilter = selectedOrderFilter;
          setSelectedOrderFilter('');
          setTimeout(() => setSelectedOrderFilter(currentFilter), 0);
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: response.message || 'Failed to reject order',
          });
        }
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.message || 'Failed to reject order',
        });
      }
    }
  };

  const getStatusBadge = () => {
    switch (selectedOrderFilter) {
      case 'new':
        return <div className='new-badge px-2 p-1 rounded-2'>New</div>;
      case 'in-progress':
        return <div className='in-progress-badge px-2 p-1 rounded-2'>In Progress</div>;
      case 'complete':
        return <div className='finished-badge px-2 p-1 rounded-2'>Complete</div>;
      case 'reported':
        return <div className='canceled-badge px-2 p-1 rounded-2'>Reported</div>;
      default:
        return null;
    }
  };

  const calculateTotalPrice = (items) => {
    if (!items || !items.length) return 0;
    return items.reduce((sum, item) => sum + (item.total_price || 0), 0);
  };

  return (
    <section>
      <ProviderHeader title="Material Requests" onMobileMenuClick={onMobileMenuClick} />
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

        {/* Tabs */}
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
              style={{cursor: 'pointer'}}
            >
              In progress orders
            </p>
          </div>
          <div className="col-md-3">
            <p 
              className={`text-center rounded-2 py-2 m-0 ${selectedOrderFilter === 'complete' ? 'sec-btn' : 'package-filter-item'}`}
              onClick={() => handleOrderFilterClick('complete')}
              style={{cursor: 'pointer'}}
            >
              Complete orders
            </p>
          </div>
          <div className="col-md-3">
            <p 
              className={`text-center rounded-2 py-2 m-0 ${selectedOrderFilter === 'reported' ? 'sec-btn' : 'package-filter-item'}`}
              onClick={() => handleOrderFilterClick('reported')}
              style={{cursor: 'pointer'}}
            >
              Reported orders
            </p>
          </div>
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : filteredMaterials.length === 0 ? (
          <div className="text-center mt-4 mb-4">
            <p className="text-muted">No orders found for the selected filter.</p>
          </div>
        ) : (
          <>
            {/* Render current page items */}
            {currentItems.map((item) => (
              <Link 
                to={`/supervisor/material-details?id=${item.id}`} 
                key={item.id} 
                className="d-flex text-decoration-none align-items-center justify-content-between p-3 gap-2 w-100 materials-cards rounded-4 mb-3"
              >
                <div className="d-flex w-100 align-items-start flex-column flex-md-row gap-2">
                  <img 
                    src={item.user?.avatar || '/assets/user.png'} 
                    className='img-fluid materials-img rounded-circle' 
                    alt="user" 
                    style={{width: '80px', height: '80px', objectFit: 'cover'}}
                  />   
                  <div className='d-flex flex-column gap-2 align-items-start w-100'>
                    <div className="d-flex justify-content-between align-items-center w-100">
                      <h6 className="property-problem-title mb-0">{item.user?.name || 'Unknown User'}</h6>
                      {getStatusBadge()}
                    </div>
                    <div className="d-flex align-items-center gap-1">
                      <img src="/assets/calendar-3.svg" alt="calendar" />
                      <p className="dashboard-home-card-2-desc-3 m-0">{item.created_at || 'N/A'}</p>
                    </div>
                    <div className="d-flex align-items-center gap-1">
                      <p className="dashboard-home-card-2-desc-3 m-0">
                        Items: {item.material_request_items?.length || 0} | 
                        Total: ${calculateTotalPrice(item.material_request_items)}
                      </p>
                    </div>
                    
                    {/* Show reject button only for new and in-progress orders */}
                    {(selectedOrderFilter === 'new' || selectedOrderFilter === 'in-progress') && (
                      <div className="d-flex mt-2 gap-2 align-items-center">
                        <button
                          className="btn btn-outline-danger rounded-2 px-4 py-2"
                          onClick={(e) => handleRejectClick(e, item.id)}
                        >
                          Reject Order
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            ))}
            
            {/* Pagination */}
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

export default DashboardMaterialRequestMain;