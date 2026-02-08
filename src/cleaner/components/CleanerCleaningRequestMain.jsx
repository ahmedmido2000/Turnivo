import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import {
  getNewCleanServices,
  getProgressCleanServices,
  getCompleteCleanServices,
  getRejectCleanServices,
  rejectCleanService,
  changeStatusCleanService,
} from '../../api/cleanerCleaningApi';
import { selectAccessToken } from '../../store/authSlice';
import CleanerHeader from './CleanerHeader';

const CleanerCleaningRequestMain = ({ onMobileMenuClick }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 6;
  const [selectedOrderFilter, setSelectedOrderFilter] = useState('new');
  const [cleaningData, setCleaningData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedServiceId, setSelectedServiceId] = useState(null);
  const [rejectComment, setRejectComment] = useState('');
  const [isSubmittingReject, setIsSubmittingReject] = useState(false);
  const [isChangingStatus, setIsChangingStatus] = useState(null);
  const [showStartModal, setShowStartModal] = useState(false);
  const [startTaskServiceId, setStartTaskServiceId] = useState(null);
  const [startComment, setStartComment] = useState('');

  const accessToken = useSelector(selectAccessToken);

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
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.message || 'Failed to load cleaning services',
        });
        setCleaningData([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [selectedOrderFilter, accessToken]);

  const filteredMaterials = cleaningData.filter((item) => {
    if (!searchQuery.trim()) return true;
    const term = searchQuery.toLowerCase();
    const title = (item.property_id?.name || item.clean_service_type_id?.name || '').toLowerCase();
    const desc = (item.property_id?.address || item.description || '').toLowerCase();
    return title.includes(term) || desc.includes(term);
  });

  useEffect(() => {
    const calculatedPages = Math.ceil(filteredMaterials.length / itemsPerPage) || 1;
    setTotalPages(calculatedPages);
    if (currentPage > calculatedPages && calculatedPages > 0) {
      setCurrentPage(1);
    }
  }, [filteredMaterials.length, currentPage, itemsPerPage]);

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

  const handleRejectClick = (serviceId) => {
    setSelectedServiceId(serviceId);
    setRejectComment('');
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
      const response = await rejectCleanService(accessToken, {
        service_id: selectedServiceId,
        comment: rejectComment.trim(),
      });

      if (response.status === 1) {
        Swal.fire({
          icon: 'success',
          title: 'Submitted',
          text: response.message || 'Report submitted successfully.',
        });
        setRejectComment('');
        setSelectedServiceId(null);
        const closeBtn = document.querySelector('#reportOrderModal .btn-close');
        if (closeBtn) closeBtn.click();
        setSelectedOrderFilter('reported');
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Failed',
          text: response.message || 'Unable to submit report.',
        });
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.message || 'Failed to submit report.',
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
      const response = await changeStatusCleanService(accessToken, {
        service_id: serviceId,
        comment: startComment.trim(),
      });

      if (response.status === 1) {
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: response.message || 'Task started successfully',
        });
        setShowStartModal(false);
        setStartTaskServiceId(null);
        setStartComment('');
        // Refresh data
        const newResponse = await getNewCleanServices(accessToken);
        if (newResponse.status === 1 && newResponse.data?.length > 0) {
          const items = newResponse.data[0]?.items || [];
          setCleaningData(items);
        } else {
          setCleaningData([]);
        }
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Failed',
          text: response.message || 'Failed to start task',
        });
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.message || 'Failed to start task',
      });
    } finally {
      setIsChangingStatus(null);
    }
  };

  const getStatusKey = (status) => {
    if (!status) return '';
    if (typeof status === 'string') return status.toLowerCase();
    return (status.name || status.status || '').toLowerCase();
  };

  const renderStatusBadge = (status) => {
    const key = getStatusKey(status);
    switch (key) {
      case 'new':
        return <div className="new-badge px-2 p-1 rounded-2">New</div>;
      case 'progress':
      case 'in-progress':
        return <div className="in-progress-badge px-2 p-1 rounded-2">In progress</div>;
      case 'complete':
      case 'finished':
        return <div className="finished-badge px-2 p-1 rounded-2">Finished</div>;
      case 'reject':
      case 'reported':
      case 'canceled':
        return <div className="canceled-badge px-2 p-1 rounded-2">Canceled</div>;
      default:
        return null;
    }
  };

  const renderActionButtons = (status, itemId) => {
    const key = getStatusKey(status);
    switch (key) {
      case 'new':
        return (
          <div className="d-flex gap-2">
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
              {isChangingStatus === itemId ? 'Starting...' : 'Start the task'}
            </button>
            <button
              className="btn btn-outline-danger py-2"
              data-bs-toggle="modal"
              data-bs-target="#reportOrderModal"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleRejectClick(itemId);
              }}
            >
              Report order
            </button>
          </div>
        );
      case 'in-progress':
        return (
          <button
            className="btn btn-outline-danger py-2"
            data-bs-toggle="modal"
            data-bs-target="#reportOrderModal"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleRejectClick(itemId);
            }}
          >
            Cancel order
          </button>
        );
      case 'finished':
        return (
          <div className="w-100">
            <h6 className="property-problem-title mb-2">Rating</h6>
            <div className="rating-badge w-100">“Great and fast service! Booking was easy and the team is very professional. I will definitely order the service again!”</div>
          </div>
        );
      case 'reported':
        return null;
      default:
        return null;
    }
  };

  return (
    <section>
      <CleanerHeader title="Cleaning Requests" onMobileMenuClick={onMobileMenuClick} />
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

        {filteredMaterials.length === 0 ? (
          <div className="text-center mt-4 mb-4">
            <p className="text-muted">No orders found for the selected filter.</p>
          </div>
        ) : (
          <>
            {currentItems.map((item) => (
              <Link
                to={`/cleaner/cleaning-details?id=${item.id}`}
                key={item.id}
                className="d-flex text-decoration-none align-items-center justify-content-between p-3 gap-2 w-100 materials-cards rounded-4 mb-3"
              >
                <div className="d-flex w-100 align-items-start flex-column flex-md-row gap-2">
                  <img
                    src={item.property_id?.image || '/assets/problem-img-2.png'}
                    className="img-fluid materials-img"
                    alt="location"
                  />
                  <div className="d-flex flex-column gap-2 align-items-start w-100">
                    <div className="d-flex justify-content-between align-items-center w-100">
                      <h6 className="property-problem-title mb-0">
                        {item.property_id?.name || item.clean_service_type_id?.name || 'Cleaning Service'}
                      </h6>
                      {renderStatusBadge(item.status)}
                    </div>
                    <div className="d-flex align-items-center gap-1">
                      <img src="/assets/calendar-3.svg" alt="calendar" />
                      <p className="dashboard-home-card-2-desc-3 m-0">{item.date || 'N/A'}</p>
                    </div>
                    <div className="d-flex align-items-center gap-1">
                      <img src="/assets/clock.svg" alt="clock" />
                      <p className="dashboard-home-card-2-desc-3 mb-0">
                        {item.time_from && item.time_to ? `${item.time_from} - ${item.time_to}` : item.time || 'N/A'}
                      </p>
                    </div>
                    <div className="d-flex mt-2 gap-2 align-items-center w-100">
                      {renderActionButtons(item.status, item.id)}
                    </div>
                  </div>
                </div>
              </Link>
            ))}

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

      <div className="modal fade" id="reportOrderModal" tabIndex="-1" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content rounded-4">
            <div className="modal-header border-0">
              <h5 className="m-0 dashboard-home-card-2-title-1">What issue are you facing?</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
            </div>

            <div className="modal-body">
              <div>
                <label className="dashboard-home-card-2-title-1 fw-bold">Cause of the problem</label>
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

      {/* Start Task Modal */}
      {showStartModal && (
        <div 
          className="modal show d-block" 
          style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
          onClick={() => setShowStartModal(false)}
        >
          <div className="modal-dialog modal-dialog-centered" onClick={(e) => e.stopPropagation()}>
            <div className="modal-content rounded-4">
              <div className="modal-header border-0">
                <h5 className="m-0 dashboard-home-card-2-title-1">Start Task</h5>
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
                  {isChangingStatus === startTaskServiceId ? 'Starting...' : 'Start Task'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default CleanerCleaningRequestMain;
