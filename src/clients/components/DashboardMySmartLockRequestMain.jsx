import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import { Link } from 'react-router-dom';
import { getMySmartLockRequest } from '../../api/smartLockApi';
import Swal from 'sweetalert2';
import ClientHeader from './ClientHeader';

const DashboardMySmartLockRequestMain = ({ onMobileMenuClick }) => {
  // API state
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  // Payment modal state
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentData, setPaymentData] = useState({
    card_number: '',
    expiry_date: '',
    cvv: ''
  });
  
  // Payment handlers
  const handlePaymentMethodClick = (method) => {
    setSelectedPaymentMethod(method);
  };

  const handlePaymentInputChange = (e) => {
    const { name, value } = e.target;
    setPaymentData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCompletePayment = (request) => {
    setSelectedRequest(request);
    setSelectedPaymentMethod(null);
    setPaymentData({
      card_number: '',
      expiry_date: '',
      cvv: ''
    });
    setShowPaymentModal(true);
    document.body.style.overflow = 'hidden';
  };

  const handleCloseModal = () => {
    setShowPaymentModal(false);
    document.body.style.overflow = '';
    document.body.style.paddingRight = '';
  };

  const handlePaymentSubmit = async () => {
    if (!selectedRequest) return;

    if (!selectedPaymentMethod) {
      Swal.fire({ icon: 'warning', title: 'Please select a payment method' });
      return;
    }

    if (!paymentData.card_number || !paymentData.expiry_date || !paymentData.cvv) {
      Swal.fire({ icon: 'warning', title: 'Please fill in all payment details' });
      return;
    }

    try {
      setLoading(true);
      
      const accessToken = localStorage.getItem('access_token');
      if (!accessToken) {
        Swal.fire({ icon: 'error', title: 'Authentication Required', text: 'Please log in again.' });
        return;
      }
      
      const requestData = {
        request_id: selectedRequest.id,
        property_id: selectedRequest.property_id?.id || selectedRequest.property_id,
        date: selectedRequest.date,
        time_from: selectedRequest.time_from,
        time_to: selectedRequest.time_to,
        price: parseFloat(selectedRequest.originalPrice) || parseFloat(selectedRequest.price) || 0,
        payment_method: selectedPaymentMethod,
        card_number: paymentData.card_number,
        expiry_date: paymentData.expiry_date,
        cvv: paymentData.cvv
      };

      console.log('Payment request data:', requestData);

      // Use the same createSmartLockRequest API to complete payment
      const { createSmartLockRequest } = await import('../../api/propertyApi');
      const response = await createSmartLockRequest(accessToken, requestData);
      
      console.log('Payment response:', response);
      
      if (response && response.status === 1) {
        // Close modal using state
        handleCloseModal();
        
        // Show success message
        await Swal.fire({
          icon: 'success',
          title: 'Payment Completed',
          text: response.data?.[0]?.message || 'Your payment has been completed successfully.',
        });
        
        // Refresh requests list
        fetchRequests();
      } else {
        console.log('Payment failed - response status:', response?.status);
        Swal.fire({ 
          icon: 'error', 
          title: 'Payment Failed', 
          text: response?.data?.[0]?.message || 'Payment failed. Please try again.' 
        });
      }
    } catch (err) {
      console.error('Payment error:', err);
      console.error('Error response:', err.response);
      Swal.fire({ 
        icon: 'error', 
        title: 'Error', 
        text: err.response?.data?.message || err.message || 'An error occurred during payment' 
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Fetch requests from API
  const fetchRequests = async () => {
    setLoading(true);
    
    try {
      const accessToken = localStorage.getItem('access_token');
      if (!accessToken) {
        throw new Error('No access token found. Please login again.');
      }
      
      const response = await getMySmartLockRequest(accessToken, currentPage);
      
      if (response && response.status === 1 && response.data && response.data[0]) {
        const { items, _meta } = response.data[0];
        setRequests(items || []);
        setTotalPages(_meta?.NumberOfPage || 1);
      } else {
        setRequests([]);
        setTotalPages(1);
      }
    } catch (err) {
      console.error('Error fetching smart lock requests:', err);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: err.message || 'Failed to fetch smart lock requests. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Fetch requests when component mounts or when page changes
  useEffect(() => {
    fetchRequests();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);
  
  // Cleanup modal-open class on component mount
  useEffect(() => {
    // Remove any leftover modal classes from body
    document.body.classList.remove('modal-open');
    document.body.style.overflow = '';
    document.body.style.paddingRight = '';
    
    // Remove any leftover backdrops
    const backdrops = document.querySelectorAll('.modal-backdrop');
    backdrops.forEach(backdrop => backdrop.remove());
    
    return () => {
      // Cleanup on unmount
      document.body.classList.remove('modal-open');
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    };
  }, []);
  
  // Helper function to map API data to component format
  const mapRequestToCard = (request) => {
    // Determine status based on payment_status and status fields
    let status = 'new';
    if (request.payment_status === 1) {
      if (request.status === 0) status = 'new';
      else if (request.status === 1) status = 'in-progress';
      else if (request.status === 2) status = 'finished';
    } else if (request.payment_status === 0) {
      status = 'pending-payment';
    }
    
    // Map platform to icon
    const platformName = request.property_id?.platform_id?.name?.toLowerCase() || '';
    let platformIcon = '/assets/booking.svg';
    if (platformName.includes('airbnb') || platformName.includes('bnb')) {
      platformIcon = '/assets/bnb.svg';
    }
    
    return {
      id: request.id,
      title: 'Smart Lock Request',
      subtitle: request.property_id?.name || 'Property',
      date: request.date || 'N/A',
      time: `${request.time_from || ''} - ${request.time_to || ''}`,
      price: `${request.price || 0} SAR`,
      location: request.property_id?.address || 'N/A',
      platform: request.property_id?.platform_id?.name || 'N/A',
      platformIcon: platformIcon,
      status: status,
      image: request.property_id?.image || '/assets/problem-img-2.png',
      paymentStatus: request.payment_status,
      payment_status: request.payment_status,
      // Keep original request data for modal
      property_id: request.property_id,
      time_from: request.time_from,
      time_to: request.time_to,
      originalPrice: request.price
    };
  };
  
  // Map requests to display format
  const currentItems = requests.map(mapRequestToCard);
  
  // Debug: log first item to check payment_status
  if (currentItems.length > 0) {
    console.log('First request payment_status:', currentItems[0].payment_status, 'paymentStatus:', currentItems[0].paymentStatus);
  }

  // Function to handle page change
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };
  
  // Function to render pagination numbers
  const renderPaginationNumbers = () => {
    const pages = [];
    // Render pages in descending order
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
  
  // Function to render badge based on status
  const renderStatusBadge = (status) => {
    switch(status) {
      case 'new':
        return <div className='new-badge px-2 p-1 rounded-2'>New</div>;
      case 'in-progress':
        return <div className='in-progress-badge px-2 p-1 rounded-2'>In progress</div>;
      case 'finished':
        return <div className='finished-badge px-2 p-1 rounded-2'>Finished</div>;
      case 'pending-payment':
        return <div className='canceled-badge px-2 p-1 rounded-2'>Pending Payment</div>;
      default:
        return null;
    }
  };
  
  // Function to render action buttons based on status
  const renderActionButtons = (status, request) => {
    // Check if payment is pending (payment_status could be 0, "0", or null)
    if (request.paymentStatus === 0 || request.paymentStatus === '0' || request.payment_status === 0 || request.payment_status === '0') {
      return (
        <button 
          className="btn btn-outline-primary"
          onClick={() => handleCompletePayment(request)}
        >
          Complete Payment
        </button>
      );
    }
    
    switch(status) {
      case 'new':
        return <button className="btn btn-outline-info">View Details</button>;
      case 'in-progress':
        return <button className="btn btn-outline-info">View Details</button>;
      case 'finished':
        return (
          <div className="d-flex gap-2 align-items-center">
            <button className="sec-btn rounded-2 px-4 py-2 w-50-100">
              Re-order
            </button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <section>
      <ClientHeader title="My Smart Lock Request" onMobileMenuClick={onMobileMenuClick} />
      <div className="dashboard-home-content px-3 mt-2">

        <div className="d-flex justify-content-between align-items-center gap-3 flex-wrap mb-3">
          <div className="search-input-wrapper mt-2">
            <SearchOutlinedIcon className="search-icon" />
            <input
              type="text"
              className="search-gray-input form-control"
              placeholder="Find a request..."
            />
          </div>
          <Link to='/client/smart-checkin-checkout' 
            type="submit" 
            className="sec-btn rounded-2 py-2 px-3 d-flex align-items-center gap-1 text-decoration-none"
          >
            <span>New Smart Lock Request</span>
          </Link>
        </div>
        
        {/* Loading state */}
        {loading && (
          <div className="text-center mt-4 mb-4">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        )}
        
        {/* Show message if no requests found */}
        {!loading && currentItems.length === 0 ? (
          <div className="text-center mt-4 mb-4">
            <p className="text-muted">No smart lock requests found.</p>
          </div>
        ) : !loading && (
          <>
            {/* Render current page items */}
            {currentItems.map((item) => (
              <div 
                key={item.id} 
                className="d-flex align-items-center justify-content-between p-3 gap-2 w-100 materials-cards rounded-4 mb-3"
                style={{ cursor: 'pointer' }}
              >
                <div className="d-flex w-100 align-items-start flex-column flex-md-row gap-2">
                  <img src={item.image} className='img-fluid materials-img' alt="location" />   
                  <div className='d-flex flex-column gap-2 align-items-start w-100'>
                    <div className="d-flex justify-content-between align-items-center w-100">
                      <h6 className="property-problem-title mb-0">{item.title}</h6>
                      {renderStatusBadge(item.status)}
                    </div>
                    <div className="d-flex align-items-center gap-1">
                      <img src="/assets/calendar-3.svg" alt="calendar" />
                      <p className="dashboard-home-card-2-desc-3 m-0">{item.date}</p>
                    </div>
                    <div className="d-flex align-items-center gap-1">
                      <img src="/assets/clock.svg" alt="clock" />
                      <p className="dashboard-home-card-2-desc-3 mb-0">{item.time}</p>
                    </div>
                    <h6 className="property-problem-title mb-0">{item.subtitle}</h6>
                    <div className="d-flex align-items-center gap-1">
                      <img src="/assets/location-2.svg" alt="location" />
                      <p className="dashboard-home-card-2-desc-3 m-0">{item.location}</p>
                    </div>
                    <div className="d-flex align-items-center gap-1">
                      <img src="/assets/dollar.svg" alt="price" />
                      <p className="dashboard-home-card-2-desc-3 m-0">{item.price}</p>
                    </div>
                    <div className="d-flex justify-content-between align-items-center flex-wrap w-100">
                      <div className="bnb-badge d-flex align-items-center gap-2 p-2 rounded-2">
                        <img src={item.platformIcon} alt={item.platform} />
                        <span>{item.platform}</span>
                      </div>
                      <div className="d-flex gap-2 align-items-center">
                        {renderActionButtons(item.status, item)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {/* Only show pagination if there are items */}
            {currentItems.length > 0 && totalPages > 1 && (
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

      {/* Payment Modal */}
      {selectedRequest && showPaymentModal && (
        <div 
          className="modal fade show" 
          id="paymentModal" 
          tabIndex="-1" 
          aria-labelledby="paymentModalLabel" 
          aria-modal="true"
          role="dialog"
          style={{ display: 'block' }}
          onClick={(e) => {
            if (e.target.classList.contains('modal')) {
              handleCloseModal();
            }
          }}
        >
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content" style={{ borderRadius: '16px' }}>
              <div className="modal-header border-0 pb-0">
                <h5 className="modal-title fw-bold" id="paymentModalLabel">Complete Payment</h5>
                <button type="button" className="btn-close" onClick={handleCloseModal} aria-label="Close"></button>
              </div>
              <div className="modal-body px-4">
                {/* Property Info (Read-only) */}
                <div className="mb-4">
                  <label className="form-label fw-semibold mb-3" style={{ fontSize: '15px' }}>Determine the property</label>
                  <div className="property-card-wrapper p-3 rounded-3" style={{ backgroundColor: '#f5f5f5' }}>
                    <div className="d-flex align-items-start gap-3">
                      <img 
                        src={selectedRequest.property_id?.image || selectedRequest.property_id?.data?.images?.[0] || selectedRequest.image || '/assets/home-1.avif'} 
                        alt={selectedRequest.property_id?.name || selectedRequest.property_id?.data?.title || 'Property'} 
                        style={{ 
                          width: '80px', 
                          height: '80px', 
                          objectFit: 'cover', 
                          borderRadius: '8px',
                          flexShrink: 0
                        }}
                      />
                      <div className="flex-grow-1">
                        <div className="d-flex align-items-center gap-2 mb-2">
                          <span className="badge" style={{ 
                            backgroundColor: '#FFE5D9', 
                            color: '#333',
                            fontWeight: '500',
                            fontSize: '11px',
                            padding: '4px 10px'
                          }}>
                            {selectedRequest.property_id?.type || 'department'}
                          </span>
                        </div>
                        <div className="d-flex align-items-center gap-1 mb-2">
                          <span style={{ fontSize: '14px', fontWeight: '600', color: '#333' }}>★</span>
                          <span style={{ fontSize: '13px', color: '#666' }}>
                            {selectedRequest.property_id?.name || selectedRequest.property_id?.data?.title || selectedRequest.subtitle || 'N/A'}
                          </span>
                        </div>
                        <div className="d-flex align-items-center gap-2 flex-wrap" style={{ fontSize: '12px', color: '#888' }}>
                          <span>🏢 {selectedRequest.property_id?.floors || '5'} floors</span>
                          <span>🚪 {selectedRequest.property_id?.rooms || '9'} rooms</span>
                          <span>📏 {selectedRequest.property_id?.size || '800'} m</span>
                          <span>🚿 {selectedRequest.property_id?.bathrooms || '10'} bathrooms</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Date (Read-only) */}
                <div className="mb-3">
                  <label className="form-label fw-semibold" style={{ fontSize: '14px' }}>Date</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    value={selectedRequest.date || ''} 
                    readOnly 
                    placeholder="mm/dd/yyyy"
                    style={{ 
                      backgroundColor: '#f9f9f9',
                      border: '1px solid #e0e0e0',
                      padding: '12px 16px',
                      fontSize: '14px'
                    }}
                  />
                </div>

                {/* Time (Read-only) */}
                <div className="row mb-3">
                  <div className="col-md-6">
                    <label className="form-label fw-semibold" style={{ fontSize: '14px' }}>Time From</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      value={selectedRequest.time_from || ''} 
                      readOnly 
                      placeholder="10:00 AM"
                      style={{ 
                        backgroundColor: '#f9f9f9',
                        border: '1px solid #e0e0e0',
                        padding: '12px 16px',
                        fontSize: '14px'
                      }}
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold" style={{ fontSize: '14px' }}>Time To</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      value={selectedRequest.time_to || ''} 
                      readOnly 
                      placeholder="12:00 PM"
                      style={{ 
                        backgroundColor: '#f9f9f9',
                        border: '1px solid #e0e0e0',
                        padding: '12px 16px',
                        fontSize: '14px'
                      }}
                    />
                  </div>
                </div>

                {/* Total Cost (Read-only) */}
                <div className="mb-4">
                  <label className="form-label fw-semibold" style={{ fontSize: '14px' }}>Total cost</label>
                  <div className="p-3 rounded-3" style={{ backgroundColor: '#f9f9f9', border: '1px solid #e0e0e0' }}>
                    <h4 className="m-0 fw-bold" style={{ color: '#333' }}>
                      {selectedRequest.originalPrice || selectedRequest.price || 0} $
                    </h4>
                  </div>
                </div>

                {/* Payment Method Selection */}
                <div className="mb-3">
                  <label className="form-label fw-semibold" style={{ fontSize: '14px' }}>Payment method</label>
                  <div className="d-flex gap-3 mb-3">
                    <div
                      className={`payment-card-option flex-fill ${selectedPaymentMethod === 'card1' ? 'selected' : ''}`}
                      onClick={() => handlePaymentMethodClick('card1')}
                      style={{
                        border: selectedPaymentMethod === 'card1' ? '2px solid #FF8A3C' : '1px solid #e0e0e0',
                        borderRadius: '12px',
                        padding: '15px 10px',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        backgroundColor: selectedPaymentMethod === 'card1' ? '#FFF4ED' : 'white',
                        textAlign: 'center'
                      }}
                    >
                      <img src="/assets/payment-card-img-1.png" className='img-fluid' alt="visa" style={{ maxHeight: '30px' }} />
                    </div>
                    <div
                      className={`payment-card-option flex-fill ${selectedPaymentMethod === 'card2' ? 'selected' : ''}`}
                      onClick={() => handlePaymentMethodClick('card2')}
                      style={{
                        border: selectedPaymentMethod === 'card2' ? '2px solid #FF8A3C' : '1px solid #e0e0e0',
                        borderRadius: '12px',
                        padding: '15px 10px',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        backgroundColor: selectedPaymentMethod === 'card2' ? '#FFF4ED' : 'white',
                        textAlign: 'center'
                      }}
                    >
                      <img src="/assets/payment-card-img-2.png" className='img-fluid' alt="mastercard" style={{ maxHeight: '30px' }} />
                    </div>
                    <div
                      className={`payment-card-option flex-fill ${selectedPaymentMethod === 'card3' ? 'selected' : ''}`}
                      onClick={() => handlePaymentMethodClick('card3')}
                      style={{
                        border: selectedPaymentMethod === 'card3' ? '2px solid #FF8A3C' : '1px solid #e0e0e0',
                        borderRadius: '12px',
                        padding: '15px 10px',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        backgroundColor: selectedPaymentMethod === 'card3' ? '#FFF4ED' : 'white',
                        textAlign: 'center'
                      }}
                    >
                      <img src="/assets/payment-card-img-3.svg" className='img-fluid' alt="paypal" style={{ maxHeight: '30px' }} />
                    </div>
                    <div
                      className={`payment-card-option flex-fill ${selectedPaymentMethod === 'card4' ? 'selected' : ''}`}
                      onClick={() => handlePaymentMethodClick('card4')}
                      style={{
                        border: selectedPaymentMethod === 'card4' ? '2px solid #FF8A3C' : '1px solid #e0e0e0',
                        borderRadius: '12px',
                        padding: '15px 10px',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        backgroundColor: selectedPaymentMethod === 'card4' ? '#FFF4ED' : 'white',
                        textAlign: 'center'
                      }}
                    >
                      <img src="/assets/payment-card-img-4.svg" className='img-fluid' alt="other" style={{ maxHeight: '30px' }} />
                    </div>
                  </div>
                </div>

                {/* Card Details */}
                <div className="mb-3">
                  <label className="form-label fw-semibold" style={{ fontSize: '14px' }}>Card number</label>
                  <div className="position-relative">
                    <img 
                      src="/assets/credit-card-icon.svg" 
                      alt="card" 
                      style={{
                        position: 'absolute',
                        left: '16px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        width: '20px',
                        height: 'auto',
                        zIndex: 1
                      }}
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                    <input
                      type="text"
                      className="form-control"
                      name="card_number"
                      value={paymentData.card_number}
                      onChange={handlePaymentInputChange}
                      placeholder="1234 5678 4321 5678"
                      maxLength="19"
                      style={{ 
                        paddingLeft: '45px',
                        border: '1px solid #e0e0e0',
                        padding: '12px 16px 12px 45px',
                        fontSize: '14px'
                      }}
                    />
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label fw-semibold" style={{ fontSize: '14px' }}>Completion date</label>
                    <div className="position-relative">
                      <img 
                        src="/assets/calendar-icon.svg" 
                        alt="calendar" 
                        style={{
                          position: 'absolute',
                          left: '16px',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          width: '18px',
                          height: 'auto',
                          zIndex: 1
                        }}
                        onError={(e) => { e.target.style.display = 'none'; }}
                      />
                      <input
                        type="text"
                        className="form-control"
                        name="expiry_date"
                        value={paymentData.expiry_date}
                        onChange={handlePaymentInputChange}
                        placeholder="12/28"
                        maxLength="5"
                        style={{ 
                          paddingLeft: '45px',
                          border: '1px solid #e0e0e0',
                          padding: '12px 16px 12px 45px',
                          fontSize: '14px'
                        }}
                      />
                    </div>
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label fw-semibold" style={{ fontSize: '14px' }}>Code</label>
                    <div className="position-relative">
                      <img 
                        src="/assets/lock-icon.svg" 
                        alt="cvv" 
                        style={{
                          position: 'absolute',
                          left: '16px',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          width: '18px',
                          height: 'auto',
                          zIndex: 1
                        }}
                        onError={(e) => { e.target.style.display = 'none'; }}
                      />
                      <input
                        type="text"
                        className="form-control"
                        name="cvv"
                        value={paymentData.cvv}
                        onChange={handlePaymentInputChange}
                        placeholder="CVV"
                        maxLength="4"
                        style={{ 
                          paddingLeft: '45px',
                          border: '1px solid #e0e0e0',
                          padding: '12px 16px 12px 45px',
                          fontSize: '14px'
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer border-0 pt-0 px-4 pb-4">
                <button 
                  type="button" 
                  className="btn w-100 text-white fw-semibold"
                  onClick={handlePaymentSubmit}
                  disabled={!selectedPaymentMethod || !paymentData.card_number || !paymentData.expiry_date || !paymentData.cvv || loading}
                  style={{
                    backgroundColor: '#FF8A3C',
                    border: 'none',
                    padding: '14px',
                    fontSize: '16px',
                    borderRadius: '8px'
                  }}
                >
                  {loading ? 'Processing...' : 'Submit'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Backdrop */}
      {showPaymentModal && (
        <div 
          className="modal-backdrop fade show" 
          onClick={handleCloseModal}
        ></div>
      )}
    </section>
  );
};

export default DashboardMySmartLockRequestMain;
