import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import CleanerHeader from './CleanerHeader';
import { getProviderSmartLockHistoryCheckin, getProviderSmartLockHistoryCheckout } from '../../api/smartLockApi';
import { selectAccessToken } from '../../store/authSlice';

const CleanerSmartLockCheckinCheckoutMain = ({ onMobileMenuClick }) => {
  const [activeTab, setActiveTab] = useState('checkin');
  const [checkinData, setCheckinData] = useState([]);
  const [checkoutData, setCheckoutData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const accessToken = useSelector(selectAccessToken);

  useEffect(() => {
    const fetchCheckinData = async () => {
      if (!accessToken) return;
      try {
        setIsLoading(true);
        const response = await getProviderSmartLockHistoryCheckin(accessToken, currentPage);
        if (response.status === 1 && response.data && response.data.length > 0) {
          const items = response.data[0]?.items || [];
          const meta = response.data[0]?._meta;
          setCheckinData(items);
          if (activeTab === 'checkin' && meta) {
            setTotalPages(meta.NumberOfPage || 1);
          }
        } else {
          setCheckinData([]);
          if (activeTab === 'checkin') {
            setTotalPages(1);
          }
        }
      } catch (error) {
        console.error('Error fetching checkin history:', error);
        setCheckinData([]);
      } finally {
        if (activeTab === 'checkin') {
          setIsLoading(false);
        }
      }
    };
    if (activeTab === 'checkin') {
      fetchCheckinData();
    }
  }, [accessToken, currentPage, activeTab]);

  useEffect(() => {
    const fetchCheckoutData = async () => {
      if (!accessToken) return;
      try {
        setIsLoading(true);
        const response = await getProviderSmartLockHistoryCheckout(accessToken, currentPage);
        if (response.status === 1 && response.data && response.data.length > 0) {
          const items = response.data[0]?.items || [];
          const meta = response.data[0]?._meta;
          setCheckoutData(items);
          if (activeTab === 'checkout' && meta) {
            setTotalPages(meta.NumberOfPage || 1);
          }
        } else {
          setCheckoutData([]);
          if (activeTab === 'checkout') {
            setTotalPages(1);
          }
        }
      } catch (error) {
        console.error('Error fetching checkout history:', error);
        setCheckoutData([]);
      } finally {
        if (activeTab === 'checkout') {
          setIsLoading(false);
        }
      }
    };
    if (activeTab === 'checkout') {
      fetchCheckoutData();
    }
  }, [accessToken, currentPage, activeTab]);

  const currentData = activeTab === 'checkin' ? checkinData : checkoutData;

  const filteredData = currentData.filter((item) => {
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

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const getStatusInfo = (status) => {
    switch (status) {
      case 0: return { className: 'new-badge', text: 'Pending' };
      case 1: return { className: 'progress-badge', text: 'In Progress' };
      case 2: return { className: 'complete-badge', text: 'Completed' };
      case 3: return { className: 'reject-badge', text: 'Cancelled' };
      default: return { className: 'new-badge', text: 'Pending' };
    }
  };

  return (
    <section>
      <CleanerHeader title="Checkin-Checkout" onMobileMenuClick={onMobileMenuClick} />
      <div className="dashboard-home-content px-3 mt-2">
        <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-3">
          <h6 className="dashboard-routes-sub m-0">Checkin & Checkout History</h6>
          <div className="search-input-wrapper position-relative">
            <SearchOutlinedIcon className="position-absolute" style={{ left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af', fontSize: '20px' }} />
            <input 
              type="text" 
              className="form-control" 
              placeholder="Search..." 
              value={searchQuery}
              onChange={handleSearchChange}
              style={{ paddingLeft: '40px', borderRadius: '8px', border: '1px solid #e5e7eb', height: '42px', minWidth: '250px' }}
            />
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="d-flex justify-content-center mb-4">
          <div className="nav-tabs-wrapper d-flex p-1 rounded-3" style={{ backgroundColor: '#f3f4f6' }}>
            <button
              className={`nav-tab-btn px-4 py-2 border-0 rounded-2 fw-medium`}
              onClick={() => handleTabChange('checkin')}
              style={{ 
                backgroundColor: activeTab === 'checkin' ? '#F59331' : 'transparent',
                color: activeTab === 'checkin' ? '#fff' : '#6b7280',
                boxShadow: activeTab === 'checkin' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                transition: 'all 0.2s ease',
                minWidth: '150px'
              }}
            >
              Check-in History
            </button>
            <button
              className={`nav-tab-btn px-4 py-2 border-0 rounded-2 fw-medium`}
              onClick={() => handleTabChange('checkout')}
              style={{ 
                backgroundColor: activeTab === 'checkout' ? '#F59331' : 'transparent',
                color: activeTab === 'checkout' ? '#fff' : '#6b7280',
                boxShadow: activeTab === 'checkout' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                transition: 'all 0.2s ease',
                minWidth: '150px'
              }}
            >
              Check-out History
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="text-center mt-4">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : filteredData.length === 0 ? (
          <div className="text-center mt-4">
            <img src="/assets/empty-state.svg" alt="No data" className="mb-3" style={{ width: '150px', opacity: 0.5 }} />
            <p className="text-muted">
              No {activeTab === 'checkin' ? 'check-in' : 'check-out'} history found
            </p>
          </div>
        ) : (
          <div className="row mt-3">
            {filteredData.map((item, index) => {
              const statusInfo = getStatusInfo(item.status);
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
                        {item.user && (
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
                        )}
                        {item.date && (
                          <div className="d-flex align-items-center gap-1">
                            <img src="/assets/calendar-3.svg" alt="calendar" />
                            <p className="dashboard-home-card-2-desc-3 m-0">
                              {item.date}
                            </p>
                          </div>
                        )}
                        {(item.time_from || item.time_to) && (
                          <div className="d-flex align-items-center gap-1">
                            <img src="/assets/clock.svg" alt="clock" />
                            <p className="dashboard-home-card-2-desc-3 m-0">
                              {item.time_from || '--:--'} - {item.time_to || '--:--'}
                            </p>
                          </div>
                        )}
                        {item.created_at && (
                          <div className="d-flex align-items-center gap-1">
                            <span className="dashboard-home-card-2-desc-3 text-muted">
                              Created: {item.created_at}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

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

export default CleanerSmartLockCheckinCheckoutMain;
