import React, { useState, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import AddCircleOutlinedIcon from '@mui/icons-material/AddCircleOutlined';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import {
  getNewMaintenanceServices,
  getProgressMaintenanceServices,
  getCompleteMaintenanceServices,
  getRejectMaintenanceServices,
  rejectMaintenanceService,
  reselectMaintenanceService
} from '../../api/superviserMaintenanceApi';
import ProviderHeader from './ProviderHeader';

const DashboardMaintenanceRequestMain = ({ onMobileMenuClick }) => {
  const navigate = useNavigate();

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 6;
  
  // Add state to track selected order filter
  const [selectedOrderFilter, setSelectedOrderFilter] = useState('new');
  
  // API data state
  const [maintenanceData, setMaintenanceData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modal state
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectComment, setRejectComment] = useState('');
  const [selectedServiceId, setSelectedServiceId] = useState(null);
  
  // Fetch data based on selected filter
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
        switch (selectedOrderFilter) {
          case 'new':
            response = await getNewMaintenanceServices(accessToken);
            break;
          case 'in-progress':
            response = await getProgressMaintenanceServices(accessToken);
            break;
          case 'finished':
            response = await getCompleteMaintenanceServices(accessToken);
            break;
          case 'reported':
            response = await getRejectMaintenanceServices(accessToken);
            break;
          default:
            response = await getNewMaintenanceServices(accessToken);
        }

        if (response.status === 1 && response.data && response.data.length > 0) {
          const items = response.data[0].items || [];
          setMaintenanceData(items);
          
          // Calculate total pages
          const totalCount = response.data[0]._meta?.totalCount || items.length;
          setTotalPages(Math.ceil(totalCount / itemsPerPage));
        } else {
          setMaintenanceData([]);
          setTotalPages(1);
        }
      } catch (error) {
        console.error('Error fetching maintenance data:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to load maintenance requests',
        });
        setMaintenanceData([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [selectedOrderFilter]);
  
  // Filter data based on search query
  const filteredMaterials = maintenanceData.filter(item => {
    if (!searchQuery) return true;
    const searchLower = searchQuery.toLowerCase();
    return (
      item.property_id?.name?.toLowerCase().includes(searchLower) ||
      item.maintenance_service_type_id?.name?.toLowerCase().includes(searchLower) ||
      item.description?.toLowerCase().includes(searchLower)
    );
  });
  
  // Get current items for the current page
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredMaterials.slice(indexOfFirstItem, indexOfLastItem);
  
  // Handle reject/cancel modal
  const handleShowRejectModal = (serviceId) => {
    setSelectedServiceId(serviceId);
    setRejectComment('');
    setShowRejectModal(true);
  };
  
  const handleCloseRejectModal = () => {
    setShowRejectModal(false);
    setRejectComment('');
    setSelectedServiceId(null);
  };
  
  const handleRejectSubmit = async () => {
    if (!rejectComment.trim()) {
      Swal.fire({
        icon: 'warning',
        title: 'Comment Required',
        text: 'Please enter a comment before submitting',
      });
      return;
    }
    
    try {
      const accessToken = localStorage.getItem('access_token');
      await rejectMaintenanceService({
        service_id: selectedServiceId,
        comment: rejectComment
      }, accessToken);
      
      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'Service has been rejected/cancelled successfully',
      });
      
      handleCloseRejectModal();
      
      // Refresh data
      const response = selectedOrderFilter === 'new' 
        ? await getNewMaintenanceServices(accessToken)
        : await getProgressMaintenanceServices(accessToken);
        
      if (response.status === 1 && response.data && response.data.length > 0) {
        setMaintenanceData(response.data[0].items || []);
      }
    } catch (error) {
      console.error('Error rejecting service:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to reject/cancel service',
      });
    }
  };
  
  // Function to handle page change
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };
  
  // Function to render pagination numbers
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
  
  // Function to handle order filter selection
  const handleOrderFilterClick = (filter) => {
    setSelectedOrderFilter(filter);
    setCurrentPage(1);
  };
  
  // Helper function to format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };
  
  // Helper function to render status badge
  const renderStatusBadge = () => {
    switch(selectedOrderFilter) {
      case 'new':
        return <div className='new-badge px-2 p-1 rounded-2'>New</div>;
      case 'in-progress':
        return <div className='in-progress-badge px-2 p-1 rounded-2'>In progress</div>;
      case 'finished':
        return <div className='finished-badge px-2 p-1 rounded-2'>Finished</div>;
      case 'reported':
        return <div className='canceled-badge px-2 p-1 rounded-2'>Reported</div>;
      default:
        return null;
    }
  };
  
  // Function to render action buttons based on status
  const renderActionButtons = (item) => {
    switch(selectedOrderFilter) {
      case 'new':
        return (
          <div className="d-flex gap-2 justify-content-between align-items-end flex-wrap w-100">
            <div className="d-flex gap-2">
              <button className="sec-btn rounded-2 px-4 py-2">
                Submit the order
              </button>
              <button 
                className="btn btn-outline-danger py-2"
                onClick={(e) => {
                  e.preventDefault();
                  handleShowRejectModal(item.id);
                }}
              >
                Reject order
              </button>
            </div>
            <button
              className="main-btn rounded-2 px-4 py-2 d-flex justify-content-center align-items-center gap-2"
              onClick={(e) => {
                e.preventDefault();
                navigate(`/provider/team-work?select=true&service_id=${item.id}&type=maintenance`);
              }}
            >
              <img src="/assets/people.svg" alt="people" />
              resellect
            </button>
          </div>
        );
      case 'in-progress':
        return (
          <button 
            className="btn btn-outline-danger py-2"
            onClick={(e) => {
              e.preventDefault();
              handleShowRejectModal(item.id);
            }}
          >
            Cancel order
          </button>
        );
      case 'finished':
        return null;
      case 'reported':
        return (
          <button className="btn btn-outline-danger py-2">Report problem</button>
        );
      default:
        return null;
    }
  };

  return (
    <section>
      <ProviderHeader title="Maintenance Requests" onMobileMenuClick={onMobileMenuClick} />
      <div className="dashboard-home-content px-3 mt-2">

        <div className="d-flex justify-content-between align-items-center gap-3 flex-wrap mb-3">
          <div className="search-input-wrapper mt-2">
            <SearchOutlinedIcon className="search-icon" />
            <input
              type="text"
              className="search-gray-input form-control"
              placeholder="Find a request..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
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
        
        {/* Show message if no orders match the filter or loading */}
        {isLoading ? (
          <div className="text-center mt-4 mb-4">
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
                to={`/supervisor/maintenance-details?id=${item.id}`} 
                key={item.id} 
                className="d-flex text-decoration-none align-items-center justify-content-between p-3 gap-2 w-100 materials-cards rounded-4 mb-3"
              >
                <div className="d-flex w-100 align-items-start flex-column flex-md-row gap-2">
                  <img 
                    src={item.property_id?.image || '/assets/problem-img-2.png'} 
                    className='img-fluid materials-img' 
                    alt="property" 
                  />   
                  <div className='d-flex flex-column gap-2 align-items-start w-100'>
                    <div className="d-flex justify-content-between align-items-center w-100">
                      <h6 className="property-problem-title mb-0">
                        {item.maintenance_service_type_id?.name || 'Maintenance Service'}
                      </h6>
                      {renderStatusBadge()}
                    </div>
                    <div className="d-flex align-items-center gap-1">
                      <img src="/assets/location-2.svg" alt="location" />
                      <p className="dashboard-home-card-2-desc-3 m-0">
                        {item.property_id?.address || 'N/A'}
                      </p>
                    </div>
                    <div className="d-flex align-items-center gap-1">
                      <img src="/assets/calendar-3.svg" alt="calendar" />
                      <p className="dashboard-home-card-2-desc-3 m-0">
                        {formatDate(item.created_at)}
                      </p>
                    </div>
                    {item.description && (
                      <p className="dashboard-home-card-2-desc-3 mb-0">
                        {item.description.substring(0, 100)}...
                      </p>
                    )}
                    <div className="d-flex mt-2 gap-2 align-items-center">
                      {renderActionButtons(item)}
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
      
      {/* Reject/Cancel Modal */}
      {showRejectModal && (
        <div className="modal fade show d-block" style={{backgroundColor: 'rgba(0,0,0,0.5)'}} tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {selectedOrderFilter === 'new' ? 'Reject Order' : 'Cancel Order'}
                </h5>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={handleCloseRejectModal}
                ></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label htmlFor="rejectComment" className="form-label">
                    Please provide a reason for {selectedOrderFilter === 'new' ? 'rejection' : 'cancellation'}:
                  </label>
                  <textarea
                    className="form-control"
                    id="rejectComment"
                    rows="4"
                    value={rejectComment}
                    onChange={(e) => setRejectComment(e.target.value)}
                    placeholder="Enter your comment here..."
                    required
                  ></textarea>
                </div>
              </div>
              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={handleCloseRejectModal}
                >
                  Cancel
                </button>
                <button 
                  type="button" 
                  className="btn btn-danger" 
                  onClick={handleRejectSubmit}
                >
                  {selectedOrderFilter === 'new' ? 'Reject Order' : 'Cancel Order'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default DashboardMaintenanceRequestMain;