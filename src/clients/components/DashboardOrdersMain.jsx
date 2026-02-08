import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import { Link, useNavigate } from 'react-router-dom';
import { getNewOrders, getProgressOrders, getCompletedOrders, getCanceledOrders, cancelOrder } from '../../api/cleaningServiceApi';
import Swal from 'sweetalert2';
import ClientHeader from './ClientHeader';

const DashboardOrdersMain = ({ onMobileMenuClick }) => {
  const navigate = useNavigate();

  // API state
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  
  // Search state
  const [searchTerm, setSearchTerm] = useState('');
  
  // Add state to track selected order filter
  const [selectedOrderFilter, setSelectedOrderFilter] = useState('new');
  
  // Handle card click to navigate to service details
  const handleCardClick = (orderId) => {
    navigate(`/client/service-details?id=${orderId}`);
  };
  
  // Fetch orders from API
  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const accessToken = localStorage.getItem('access_token');
      if (!accessToken) {
        throw new Error('No access token found. Please login again.');
      }
      
      let response;
      if (selectedOrderFilter === 'new') {
        response = await getNewOrders(accessToken, currentPage);
      } else if (selectedOrderFilter === 'in-progress') {
        response = await getProgressOrders(accessToken, currentPage);
      } else if (selectedOrderFilter === 'finished') {
        response = await getCompletedOrders(accessToken, currentPage);
      } else if (selectedOrderFilter === 'canceled') {
        response = await getCanceledOrders(accessToken, currentPage);
      }
      
      if (response && response.status === 1 && response.data && response.data[0]) {
        const { items, _meta } = response.data[0];
        setOrders(items || []);
        setTotalPages(_meta?.NumberOfPage || 1);
        setTotalCount(_meta?.totalCount || 0);
      } else {
        setOrders([]);
        setTotalPages(1);
      }
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError(err.message || 'Failed to fetch orders');
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: err.message || 'Failed to fetch orders. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Handle cancel order
  const handleCancelOrder = async (e, orderId) => {
    e.stopPropagation(); // Prevent card click navigation
    
    const result = await Swal.fire({
      title: 'Cancel Order?',
      text: 'Are you sure you want to cancel this order?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, cancel it!',
      cancelButtonText: 'No, keep it'
    });

    if (result.isConfirmed) {
      try {
        const accessToken = localStorage.getItem('access_token');
        if (!accessToken) {
          throw new Error('No access token found. Please login again.');
        }

        const response = await cancelOrder(orderId, accessToken);
        
        if (response && response.status === 1 && response.data?.[0]?.status === 1) {
          const message = response.data?.[0]?.message || 'Your order has been canceled successfully.';
          Swal.fire({
            icon: 'success',
            title: 'Canceled!',
            text: message,
            timer: 2000,
            showConfirmButton: false
          });
          // Refresh the orders list
          fetchOrders();
        } else {
          const errorMessage = response.data?.[0]?.message || 'Failed to cancel order';
          throw new Error(errorMessage);
        }
      } catch (err) {
        console.error('Error canceling order:', err);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: err.message || 'Failed to cancel order. Please try again.',
        });
      }
    }
  };
  
  // Fetch orders when component mounts or when filter/page changes
  useEffect(() => {
    fetchOrders();
  }, [selectedOrderFilter, currentPage]);
  
  // Helper function to map API data to component format
  const mapOrderToCard = (order) => {
    // Determine status based on the selected filter (since orders come from filter-specific endpoints)
    // This ensures the status matches the current view
    let status = selectedOrderFilter;
    
    // Fallback: if for some reason we need to determine from API data
    if (!selectedOrderFilter) {
      if (order.status?.id === 1) status = 'in-progress';
      else if (order.status?.id === 2) status = 'finished';
      else if (order.status?.name?.toLowerCase() === 'canceled' || order.status?.name?.toLowerCase() === 'cancelled') status = 'canceled';
      else status = 'new';
    }
    
    // Map platform to icon
    const platformName = order.property_id?.platform_id?.name?.toLowerCase() || '';
    let platformIcon = '/assets/booking.svg';
    if (platformName.includes('airbnb') || platformName.includes('bnb')) {
      platformIcon = '/assets/bnb.svg';
    }
    
    // Build title from service type and plan
    let title = order.clean_service_type_id?.name || 'Cleaning Service';
    if (order.plan_id?.name) {
      title += ` - ${order.plan_id.name}`;
    }
    
    return {
      id: order.id,
      title: title,
      subtitle: order.property_id?.name || 'Property',
      date: order.date || 'N/A',
      time: `${order.time_from || ''} - ${order.time_to || ''}`,
      price: `${order.total_price || 0} SAR`,
      location: order.property_id?.address || 'N/A',
      platform: order.property_id?.platform_id?.name || 'N/A',
      platformIcon: platformIcon,
      status: status,
      image: order.property_id?.image || '/assets/problem-img-2.png',
      serviceId: order.id,
      serviceType: 1,
      providerName: order.provider?.name || order.provider_id?.name || 'Service Provider',
      providerAvatar: order.provider?.avatar || order.provider_id?.avatar || '/assets/user.png'
    };
  };
  
  // Map orders to display format and filter by search term
  const currentItems = orders.map(mapOrderToCard).filter(item => {
    if (!searchTerm.trim()) return true;
    const search = searchTerm.toLowerCase();
    return (
      item.title?.toLowerCase().includes(search) ||
      item.subtitle?.toLowerCase().includes(search) ||
      item.location?.toLowerCase().includes(search) ||
      item.date?.toLowerCase().includes(search) ||
      item.platform?.toLowerCase().includes(search) ||
      item.price?.toLowerCase().includes(search)
    );
  });

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
  
  // Function to handle order filter selection
  const handleOrderFilterClick = (filter) => {
    setSelectedOrderFilter(filter);
    setCurrentPage(1); // Reset to first page when changing filter
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
      case 'canceled':
        return <div className='canceled-badge px-2 p-1 rounded-2'>Canceled</div>;
      default:
        return null;
    }
  };
  
  // Function to render action buttons based on status
  const renderActionButtons = (status, item) => {
    switch(status) {
      case 'new':
        return <button className="btn btn-outline-danger" onClick={(e) => handleCancelOrder(e, item.id)}>Cancel order</button>;
      case 'in-progress':
        return <button className="btn btn-outline-danger" onClick={(e) => handleCancelOrder(e, item.id)}>Cancel order</button>;
      case 'finished':
        return (
          <div className="d-flex gap-2 align-items-center">
            <button className="sec-btn rounded-2 px-4 py-2 w-50-100">
              Re-order
            </button>
            <Link
              to='/client/service-ratings'
              state={{
                serviceId: item.serviceId,
                serviceType: item.serviceType,
                serviceData: {
                  title: item.title,
                  date: item.date,
                  time: item.time,
                  propertyName: item.subtitle,
                  location: item.location,
                  price: item.price,
                  image: item.image,
                  providerName: item.providerName,
                  providerAvatar: item.providerAvatar
                }
              }}
              className="edit-btn d-flex align-items-center justify-content-center gap-1 text-decoration-none"
              onClick={(e) => e.stopPropagation()}
            > 
              <span className='fw-normal'>Rating</span>
            </Link>
          </div>
        );
      case 'canceled':
        return (
          <Link
            to='/client/service-ratings'
            state={{
              serviceId: item.serviceId,
              serviceType: item.serviceType,
              serviceData: {
                title: item.title,
                date: item.date,
                time: item.time,
                propertyName: item.subtitle,
                location: item.location,
                price: item.price,
                image: item.image,
                providerName: item.providerName,
                providerAvatar: item.providerAvatar
              }
            }}
            className="edit-btn d-flex align-items-center justify-content-center gap-1 text-decoration-none"
            onClick={(e) => e.stopPropagation()}
          > 
            <span className='fw-normal'>Rating</span>
          </Link>
        );
      default:
        return null;
    }
  };

  return (
    <section>
      <ClientHeader title="Cleaning Request" onMobileMenuClick={onMobileMenuClick} />
      <div className="dashboard-home-content px-3 mt-2">

        <div className="d-flex justify-content-between align-items-center gap-3 flex-wrap mb-3">
          <div className="search-input-wrapper mt-2">
            <SearchOutlinedIcon className="search-icon" />
            <input
              type="text"
              className="search-gray-input form-control"
              placeholder="Find a request..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Link to='/client/cleaning-request' 
            type="submit" 
            className="sec-btn rounded-2 py-2 px-3 d-flex align-items-center gap-1 text-decoration-none"
          >
            <span>Cleaning request</span>
          </Link>
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
              className={`text-center rounded-2 py-2 m-0 ${selectedOrderFilter === 'canceled' ? 'sec-btn' : 'package-filter-item'}`}
              onClick={() => handleOrderFilterClick('canceled')}
            >
              Canceled orders
            </p>
          </div>
        </div>
        
        {/* Loading state */}
        {loading && (
          <div className="text-center mt-4 mb-4">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        )}
        
        {/* Show message if no orders match the filter */}
        {!loading && currentItems.length === 0 ? (
          <div className="text-center mt-4 mb-4">
            <p className="text-muted">No orders found for the selected filter.</p>
          </div>
        ) : !loading && (
          <>
            {/* Render current page items */}
            {currentItems.map((item) => (
              <div 
                key={item.id} 
                className="d-flex align-items-center justify-content-between p-3 gap-2 w-100 materials-cards rounded-4 mb-3"
                onClick={() => handleCardClick(item.id)}
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
    </section>
  );
};

export default DashboardOrdersMain;