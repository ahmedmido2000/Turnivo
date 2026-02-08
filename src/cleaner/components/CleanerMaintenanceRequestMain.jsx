import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import {
  getNewMaintenanceServices,
  getProgressMaintenanceServices,
  getCompleteMaintenanceServices,
  getRejectMaintenanceServices,
  rejectMaintenanceService,
  acceptMaintenanceService,
  changeStatusMaintenanceService,
} from '../../api/cleanerMaintenanceApi';
import { selectAccessToken } from '../../store/authSlice';
import CleanerHeader from './CleanerHeader';

const CleanerMaintenanceRequestMain = ({ onMobileMenuClick }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 6;
  const [selectedOrderFilter, setSelectedOrderFilter] = useState('new');
  const [maintenanceData, setMaintenanceData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedServiceId, setSelectedServiceId] = useState(null);
  const [rejectComment, setRejectComment] = useState('');
  const [isSubmittingReject, setIsSubmittingReject] = useState(false);
  const [isAccepting, setIsAccepting] = useState(null);
  const [showStartModal, setShowStartModal] = useState(false);
  const [startTaskServiceId, setStartTaskServiceId] = useState(null);
  const [startComment, setStartComment] = useState('');
  const [isChangingStatus, setIsChangingStatus] = useState(null);
  const [showAcceptModal, setShowAcceptModal] = useState(false);
  const [acceptServiceId, setAcceptServiceId] = useState(null);
  const [acceptComment, setAcceptComment] = useState('');
  const [isAcceptingWithComment, setIsAcceptingWithComment] = useState(false);
  
  const accessToken = useSelector(selectAccessToken);

  
  // Fetch maintenance data based on selected tab
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

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
          response = await getNewMaintenanceServices(accessToken);
        } else if (selectedOrderFilter === 'in-progress') {
          response = await getProgressMaintenanceServices(accessToken);
        } else if (selectedOrderFilter === 'finished') {
          response = await getCompleteMaintenanceServices(accessToken);
        } else {
          response = await getRejectMaintenanceServices(accessToken);
        }

        if (response.status === 1 && response.data && response.data.length > 0) {
          const items = response.data?.[0]?.items || [];
          setMaintenanceData(items);
          const total = Math.ceil(items.length / itemsPerPage) || 1;
          setTotalPages(total);
          if (currentPage > total) setCurrentPage(1);
        } else {
          setMaintenanceData([]);
          setTotalPages(1);
          setCurrentPage(1);
        }
      } catch (error) {
        console.error('Error fetching maintenance services:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.message || 'Failed to load maintenance services',
        });
        setMaintenanceData([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [selectedOrderFilter, accessToken]);

  
  // Filter materials based on selected filter and search query
  const filteredMaterials = maintenanceData.filter(item => {
    if (!searchQuery.trim()) return true;
    const term = searchQuery.toLowerCase();
    const title = (item.property_id?.name || item.maintenance_service_type_id?.name || '').toLowerCase();
    const desc = (item.property_id?.address || item.description || '').toLowerCase();
    return title.includes(term) || desc.includes(term);
  });
  
  // Calculate total pages based on filtered data
  useEffect(() => {
    const calculatedPages = Math.ceil(filteredMaterials.length / itemsPerPage);
    setTotalPages(calculatedPages);
    
    // Reset to first page if current page is beyond the new total pages
    if (currentPage > calculatedPages && calculatedPages > 0) {
      setCurrentPage(1);
    }
  }, [filteredMaterials.length, currentPage, itemsPerPage]);
  
  // Get current items for the current page
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
  
  // Function to handle order filter selection
  const handleOrderFilterClick = (filter) => {
    setSelectedOrderFilter(filter);
    setCurrentPage(1); // Reset to first page when changing filter
  };

  const handleRejectClick = (serviceId) => {
    setSelectedServiceId(serviceId);
    setRejectComment('');
  };

  const handleAcceptOrder = (e, serviceId) => {
    e.preventDefault();
    e.stopPropagation();
    setAcceptServiceId(serviceId);
    setAcceptComment('');
    setShowAcceptModal(true);
  };

  const handleAcceptSubmit = async () => {
    if (!acceptComment.trim()) {
      Swal.fire({
        icon: 'warning',
        title: 'Comment Required',
        text: 'Please enter a comment',
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

    try {
      setIsAcceptingWithComment(true);
      const response = await changeStatusMaintenanceService(accessToken, {
        service_id: acceptServiceId,
        comment: acceptComment.trim(),
      });

      if (response.status === 1) {
        Swal.fire({
          icon: 'success',
          title: 'Accepted',
          text: response.message || 'Order accepted successfully.',
        });
        setShowAcceptModal(false);
        setAcceptServiceId(null);
        setAcceptComment('');
        // Refresh data - move to in-progress
        const newResponse = await getProgressMaintenanceServices(accessToken);
        if (newResponse.status === 1 && newResponse.data?.length > 0) {
          const items = newResponse.data[0]?.items || [];
          setMaintenanceData(items);
        }
        setSelectedOrderFilter('in-progress');
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Failed',
          text: response.message || 'Unable to accept order.',
        });
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.message || 'Failed to accept order.',
      });
    } finally {
      setIsAcceptingWithComment(false);
    }
  };

  const handleRejectSubmit = async () => {
    if (!selectedServiceId) return;
    if (!rejectComment.trim()) {
      Swal.fire({
        icon: 'warning',
        title: 'Comment required',
        text: 'Please enter a reason.',
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

    try {
      setIsSubmittingReject(true);
      const response = await rejectMaintenanceService(accessToken, {
        service_id: selectedServiceId,
        comment: rejectComment.trim(),
      });

      if (response.status === 1) {
        Swal.fire({
          icon: 'success',
          title: 'Submitted',
          text: response.message || 'Service rejected successfully.',
        });
        setRejectComment('');
        setSelectedServiceId(null);
        const closeBtn = document.querySelector('#rejectOrderModal .btn-close');
        if (closeBtn) closeBtn.click();
        // refresh data
        setSelectedOrderFilter('reported');
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Failed',
          text: response.message || 'Unable to reject service.',
        });
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.message || 'Failed to reject service.',
      });
    } finally {
      setIsSubmittingReject(false);
    }
  };

  const handleStartTask = async (serviceId) => {
    if (!accessToken) {
      Swal.fire({
        icon: 'error',
        title: 'Authentication Required',
        text: 'Please login to continue',
      });
      return;
    }

    if (!startComment.trim()) {
      Swal.fire({
        icon: 'warning',
        title: 'Comment Required',
        text: 'Please enter a comment',
      });
      return;
    }

    try {
      setIsChangingStatus(serviceId);
      const response = await changeStatusMaintenanceService(accessToken, {
        service_id: serviceId,
        comment: startComment.trim(),
      });

      if (response.status === 1) {
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: response.message || 'Status updated successfully',
        });
        setShowStartModal(false);
        setStartTaskServiceId(null);
        setStartComment('');
        // Refresh data
        const newResponse = await getProgressMaintenanceServices(accessToken);
        if (newResponse.status === 1 && newResponse.data?.length > 0) {
          const items = newResponse.data[0]?.items || [];
          setMaintenanceData(items);
        }
        setSelectedOrderFilter('in-progress');
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Failed',
          text: response.message || 'Failed to update status',
        });
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.message || 'Failed to update status',
      });
    } finally {
      setIsChangingStatus(null);
    }
  };
  
  const getStatusKey = (status) => {
    if (!status) return '';
    if (typeof status === 'string') return status.toLowerCase();
    return (status.name || '').toLowerCase();
  };
  
  // Function to render badge based on status
  const renderStatusBadge = (status) => {
    const key = getStatusKey(status);
    switch(key) {
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
      case 'canceled':
        return <div className='canceled-badge px-2 p-1 rounded-2'>Canceled</div>;
      default:
        return null;
    }
  };
  
  // Function to render action buttons based on status
  const renderActionButtons = (status, itemId) => {
    switch(status) {
      case 'new':
        return (
          <div className="d-flex justify-content-between align-items-center gap-2 w-100 flex-wrap">
            <div className="d-flex gap-2">
              <button 
                className="rounded-2 px-3 py-2 border-0 text-white"
                style={{ backgroundColor: '#F59331' }}
                onClick={(e) => handleAcceptOrder(e, itemId)}
              >
                Accept order
              </button>
              <button 
                className="btn btn-outline-danger rounded-2 py-2 px-3"
                data-bs-toggle="modal"
                data-bs-target="#rejectOrderModal"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleRejectClick(itemId);
                }}
              >
                reject ordeer
              </button>
            </div>
            <button 
              type="button" 
              className="rounded-2 py-2 px-3 d-flex align-items-center justify-content-center gap-2 border-0 text-white"
              style={{ backgroundColor: '#F59331' }}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                // Smart key functionality
              }}
            >
              <img src="/assets/key-icon.svg" alt="key" style={{ filter: 'brightness(0) invert(1)' }} />
              <span>smart key</span>
            </button>
          </div>
        );
      case 'in-progress':
        return (
          <div className="d-flex justify-content-start w-100 gap-2">
            <button 
              className="sec-btn rounded-2 px-md-4 py-2"
              disabled={isChangingStatus === itemId}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setStartTaskServiceId(itemId);
                setStartComment('');
                setShowStartModal(true);
              }}
            >
              {isChangingStatus === itemId ? 'Updating...' : 'Complete order'}
            </button>
            <button 
              className="btn btn-outline-danger rounded-2 py-2 px-3"
              data-bs-toggle="modal"
              data-bs-target="#rejectOrderModal"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleRejectClick(itemId);
              }}
            >
              Cancel order
            </button>
          </div>
        );
      case 'finished':
        return (
            <div className='w-100'>
                <h6 className="property-problem-title mb-2">Rating</h6>
                <div className="rating-badge w-100">“Great and fast service! Booking was easy and the team is very professional. I will definitely order the service again!”</div>
            </div>
        ); // No buttons for finished orders
      case 'reported':
        return null;
      default:
        return null;
    }
  };

  return (
    <section>
      <CleanerHeader title="Maintenance Requests" onMobileMenuClick={onMobileMenuClick} />
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
              Canceled orders
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
              <Link to={`/cleaner/maintenance-details?id=${item.id}`} key={item.id} className="d-flex text-decoration-none align-items-center justify-content-between p-3 gap-2 w-100 materials-cards rounded-4 mb-3">
                <div className="d-flex w-100 align-items-start flex-column flex-md-row gap-2">
                  <img src={item.property_id?.image || '/assets/problem-img-2.png'} className='img-fluid materials-img' alt="location" />   
                  <div className='d-flex flex-column gap-2 align-items-start w-100'>
                    <div className="d-flex justify-content-between align-items-center w-100">
                      <h6 className="property-problem-title mb-0">{item.property_id?.name || item.maintenance_service_type_id?.name || 'Maintenance Service'}</h6>
                      {renderStatusBadge(item.status)}
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
                      {/* Replace hardcoded buttons with conditional rendering */}
                      {renderActionButtons(selectedOrderFilter, item.id)}
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
      
      {/* Reject Order Modal */}
      <div
        className="modal fade"
        id="rejectOrderModal"
        tabIndex="-1"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content rounded-4">
            <div className="modal-header border-0">
              <h5 className="m-0 dashboard-home-card-2-title-1">
                What issue are you facing?
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
              ></button>
            </div>

            <div className="modal-body">
              <div className="">
                <label className="dashboard-home-card-2-title-1 fw-bold">
                  Cause of the problem
                </label>
                <textarea
                  className="form-control rounded-2 py-2"
                  placeholder="Enter Cause of the problem"
                  rows="4"
                  value={rejectComment}
                  onChange={(e) => setRejectComment(e.target.value)}
                ></textarea>
              </div>
            </div>

            <div className="modal-footer border-0">
              <button
                type="button"
                className="sec-btn rounded-2 px-4 py-2"
                disabled={isSubmittingReject}
                onClick={handleRejectSubmit}
              >
                {isSubmittingReject ? 'Submitting...' : 'Submit'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Accept Order Modal */}
      {showAcceptModal && (
        <div 
          className="modal show d-block" 
          style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
          onClick={() => setShowAcceptModal(false)}
        >
          <div className="modal-dialog modal-dialog-centered" onClick={(e) => e.stopPropagation()}>
            <div className="modal-content rounded-4">
              <div className="modal-header border-0">
                <h5 className="m-0 dashboard-home-card-2-title-1">Accept Order</h5>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={() => setShowAcceptModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div>
                  <label className="dashboard-home-card-2-title-1 fw-bold">Comment</label>
                  <textarea
                    className="form-control rounded-2 py-2"
                    placeholder="Enter your comment"
                    rows="4"
                    value={acceptComment}
                    onChange={(e) => setAcceptComment(e.target.value)}
                  ></textarea>
                </div>
              </div>
              <div className="modal-footer border-0">
                <button
                  type="button"
                  className="btn btn-secondary rounded-2 px-4 py-2"
                  onClick={() => setShowAcceptModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="sec-btn rounded-2 px-4 py-2"
                  disabled={isAcceptingWithComment}
                  onClick={handleAcceptSubmit}
                >
                  {isAcceptingWithComment ? 'Accepting...' : 'Accept'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Start Task / Change Status Modal */}
      {showStartModal && (
        <div 
          className="modal show d-block" 
          style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
          onClick={() => setShowStartModal(false)}
        >
          <div className="modal-dialog modal-dialog-centered" onClick={(e) => e.stopPropagation()}>
            <div className="modal-content rounded-4">
              <div className="modal-header border-0">
                <h5 className="m-0 dashboard-home-card-2-title-1">Complete Order</h5>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={() => setShowStartModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div>
                  <label className="dashboard-home-card-2-title-1 fw-bold">Comment</label>
                  <textarea
                    className="form-control rounded-2 py-2"
                    placeholder="Enter your comment"
                    rows="4"
                    value={startComment}
                    onChange={(e) => setStartComment(e.target.value)}
                  ></textarea>
                </div>
              </div>
              <div className="modal-footer border-0">
                <button
                  type="button"
                  className="btn btn-secondary rounded-2 px-4 py-2"
                  onClick={() => setShowStartModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="sec-btn rounded-2 px-4 py-2"
                  disabled={isChangingStatus === startTaskServiceId}
                  onClick={() => handleStartTask(startTaskServiceId)}
                >
                  {isChangingStatus === startTaskServiceId ? 'Updating...' : 'Confirm'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default CleanerMaintenanceRequestMain;