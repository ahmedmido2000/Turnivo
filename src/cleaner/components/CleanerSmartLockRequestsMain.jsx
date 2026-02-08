import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import Swal from 'sweetalert2';
import CleanerHeader from './CleanerHeader';
import { getProviderSmartLockRequest } from '../../api/smartLockApi';
import { selectAccessToken } from '../../store/authSlice';

const CleanerSmartLockRequestsMain = ({ onMobileMenuClick }) => {
  const [requestsData, setRequestsData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const accessToken = useSelector(selectAccessToken);

  // Fetch requests data
  useEffect(() => {
    const fetchData = async () => {
      if (!accessToken) return;

      try {
        setIsLoading(true);
        const response = await getProviderSmartLockRequest(accessToken, currentPage);

        if (response.status === 1 && response.data && response.data.length > 0) {
          const items = response.data[0]?.items || [];
          const meta = response.data[0]?._meta;
          setRequestsData(items);
          if (meta) {
            setTotalPages(meta.NumberOfPage || 1);
          }
        } else {
          setRequestsData([]);
          setTotalPages(1);
        }
      } catch (error) {
        console.error('Error fetching smart lock requests:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.message || 'Failed to load smart lock requests',
        });
        setRequestsData([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [accessToken, currentPage]);

  // Search filter
  const filteredRequests = requestsData.filter((item) => {
    if (!searchQuery.trim()) return true;
    const term = searchQuery.toLowerCase();
    const propertyName = (item.property_id?.name || '').toLowerCase();
    const address = (item.property_id?.address || '').toLowerCase();
    const userName = (item.user?.name || '').toLowerCase();
    return propertyName.includes(term) || address.includes(term) || userName.includes(term);
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
      case 1: return { className: 'progress-badge', text: 'Approved' };
      case 2: return { className: 'complete-badge', text: 'Completed' };
      case 3: return { className: 'reject-badge', text: 'Rejected' };
      default: return { className: 'new-badge', text: 'Pending' };
    }
  };

  // Get payment status
  const getPaymentStatus = (status) => {
    switch (status) {
      case 0: return { className: 'new-badge', text: 'Unpaid' };
      case 1: return { className: 'complete-badge', text: 'Paid' };
      default: return { className: 'new-badge', text: 'Unpaid' };
    }
  };

  return (
    <section>
      <CleanerHeader title="Smart Lock Requests" onMobileMenuClick={onMobileMenuClick} />
      <div className="dashboard-home-content px-3 mt-2">
        <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-3">
          <h6 className="dashboard-routes-sub m-0">Smart Lock Requests</h6>
          <div className="search-input-wrapper position-relative">
            <SearchOutlinedIcon className="position-absolute" style={{ left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af', fontSize: '20px' }} />
            <input 
              type="text" 
              className="form-control" 
              placeholder="Search requests..." 
              value={searchQuery}
              onChange={handleSearchChange}
              style={{ paddingLeft: '40px', borderRadius: '8px', border: '1px solid #e5e7eb', height: '42px', minWidth: '250px' }}
            />
          </div>
        </div>

        {isLoading ? (
          <div className="text-center mt-4">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : filteredRequests.length === 0 ? (
          <div className="text-center mt-4">
            <img src="/assets/empty-state.svg" alt="No data" className="mb-3" style={{ width: '150px', opacity: 0.5 }} />
            <p className="text-muted">No smart lock requests found</p>
          </div>
        ) : (
          <div className="row mt-3">
            {filteredRequests.map((item, index) => {
              const statusInfo = getStatusInfo(item.status);
              const paymentInfo = getPaymentStatus(item.payment_status);
              return (
                <div className="col-lg-6 col-12 mb-3" key={item.id || index}>
                  <div className="d-flex align-items-center justify-content-between p-3 gap-2 w-100 materials-cards rounded-4 h-100">
                    <div className="d-flex w-100 align-items-start flex-column flex-md-row gap-2">
                      <img 
                        src={item.property_id?.image || "/assets/property-management-card-img.png"} 
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
                        <div className="d-flex align-items-center gap-2">
                          <img 
                            src={item.user?.avatar || '/assets/user.png'} 
                            className='user-avatar-sm' 
                            alt="user"
                            style={{ width: '24px', height: '24px', borderRadius: '50%' }}
                          />
                          <span className="dashboard-home-card-2-desc-3">
                            {item.user?.name || 'User'}
                          </span>
                        </div>
                        <div className="d-flex align-items-center gap-1">
                          <img src="/assets/calendar-3.svg" alt="calendar" />
                          <p className="dashboard-home-card-2-desc-3 m-0">
                            {item.date || 'N/A'}
                          </p>
                        </div>
                        <div className="d-flex align-items-center gap-1">
                          <img src="/assets/clock.svg" alt="clock" />
                          <p className="dashboard-home-card-2-desc-3 m-0">
                            {item.time_from || '--:--'} - {item.time_to || '--:--'}
                          </p>
                        </div>
                        <div className="d-flex align-items-center justify-content-between w-100">
                          <div className="d-flex align-items-center gap-2">
                            <span className="fw-semibold">${item.price || 0}</span>
                            <div className={`${paymentInfo.className} px-2 p-1 rounded-2`} style={{ fontSize: '12px' }}>
                              {paymentInfo.text}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
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

export default CleanerSmartLockRequestsMain;
