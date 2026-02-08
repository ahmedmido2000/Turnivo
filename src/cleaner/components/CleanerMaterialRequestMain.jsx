import React, { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import { Link, useNavigate } from 'react-router-dom';
import CleanerHeader from './CleanerHeader';
import Swal from 'sweetalert2';
import {
  getMaterials,
  getNewMaterialRequests,
  getCompleteMaterialRequests,
  getCancelledMaterialRequests,
  cancelMaterialRequest,
} from '../../api/cleanerMaterialsApi';
import { selectAccessToken } from '../../store/authSlice';
import { toggleCartItem, selectCartItems } from '../../store/cartSlice';

const CleanerMaterialRequestMain = ({ onMobileMenuClick }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // View mode: 'materials' for selecting materials, 'orders' for viewing orders
  const [viewMode, setViewMode] = useState('materials');

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 12;

  // Data states
  const [materials, setMaterials] = useState([]);
  const [ordersData, setOrdersData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Order tabs state
  const [selectedOrderFilter, setSelectedOrderFilter] = useState('new');

  // Redux state
  const accessToken = useSelector(selectAccessToken);
  const cartItems = useSelector(selectCartItems);

  const fetchMaterials = useCallback(async () => {
    if (!accessToken) {
      Swal.fire({
        icon: 'error',
        title: 'Authentication Required',
        text: 'Please login to continue',
      });
      return;
    }

    try {
      setIsLoading(true);
      const response = await getMaterials(accessToken);
      if (response.status === 1 && response.data) {
        const items = response.data?.[0]?.items || response.data || [];
        setMaterials(items);
        const total = Math.ceil(items.length / itemsPerPage) || 1;
        setTotalPages(total);
      } else {
        setMaterials([]);
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.response?.data?.message || 'Failed to load materials',
      });
      setMaterials([]);
    } finally {
      setIsLoading(false);
    }
  }, [accessToken]);

  const fetchOrders = useCallback(async () => {
    if (!accessToken) {
      Swal.fire({
        icon: 'error',
        title: 'Authentication Required',
        text: 'Please login to continue',
      });
      return;
    }

    try {
      setIsLoading(true);
      let response;

      if (selectedOrderFilter === 'new') {
        response = await getNewMaterialRequests(accessToken);
      } else if (selectedOrderFilter === 'complete') {
        response = await getCompleteMaterialRequests(accessToken);
      } else {
        response = await getCancelledMaterialRequests(accessToken);
      }

      if (response.status === 1 && response.data) {
        const items = response.data?.[0]?.items || response.data || [];
        setOrdersData(items);
        const total = Math.ceil(items.length / itemsPerPage) || 1;
        setTotalPages(total);
        if (currentPage > total) setCurrentPage(1);
      } else {
        setOrdersData([]);
        setTotalPages(1);
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.response?.data?.message || 'Failed to load orders',
      });
      setOrdersData([]);
    } finally {
      setIsLoading(false);
    }
  }, [accessToken, selectedOrderFilter, currentPage]);

  // Fetch materials
  useEffect(() => {
    if (viewMode === 'materials') {
      fetchMaterials();
    }
  }, [viewMode, fetchMaterials]);

  // Fetch orders based on selected tab
  useEffect(() => {
    if (viewMode === 'orders') {
      fetchOrders();
    }
  }, [viewMode, selectedOrderFilter, fetchOrders]);

  // Filter materials based on search
  const filteredMaterials = materials.filter((item) => {
    if (!searchQuery.trim()) return true;
    const term = searchQuery.toLowerCase();
    const title = (item.name || item.title || '').toLowerCase();
    return title.includes(term);
  });

  // Filter orders based on search
  const filteredOrders = ordersData.filter((item) => {
    if (!searchQuery.trim()) return true;
    const term = searchQuery.toLowerCase();
    const title = (item.name || item.title || '').toLowerCase();
    return title.includes(term);
  });

  // Update total pages when filtered data changes
  useEffect(() => {
    const data = viewMode === 'materials' ? filteredMaterials : filteredOrders;
    const calculatedPages = Math.ceil(data.length / itemsPerPage) || 1;
    setTotalPages(calculatedPages);
    if (currentPage > calculatedPages && calculatedPages > 0) {
      setCurrentPage(1);
    }
  }, [filteredMaterials.length, filteredOrders.length, viewMode, currentPage, filteredMaterials, filteredOrders]);

  // Get current page items
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentMaterials = filteredMaterials.slice(indexOfFirstItem, indexOfLastItem);
  const currentOrders = filteredOrders.slice(indexOfFirstItem, indexOfLastItem);



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

  const handleMaterialClick = (material) => {
    const cartItem = {
      id: material.id,
      name: material.name || material.title,
      price: parseFloat(material.price) || 0,
      image: material.image || '/assets/service-img.png',
    };
    dispatch(toggleCartItem(cartItem));
  };

  const isItemSelected = (id) => {
    return cartItems.some((item) => item.id === id);
  };

  const handleOrderClick = () => {
    if (cartItems.length === 0) {
      Swal.fire({
        icon: 'warning',
        title: 'No items selected',
        text: 'Please select at least one material to order',
      });
      return;
    }
    navigate('/cleaner/shopping-cart');
  };

  const handleCancelOrder = async (orderId) => {
    if (!accessToken) {
      Swal.fire({
        icon: 'error',
        title: 'Authentication Required',
        text: 'Please login to continue',
      });
      return;
    }

    const result = await Swal.fire({
      icon: 'warning',
      title: 'Cancel Order',
      text: 'Are you sure you want to cancel this order?',
      showCancelButton: true,
      confirmButtonText: 'Yes, cancel it',
      cancelButtonText: 'No, keep it',
    });

    if (!result.isConfirmed) return;

    try {
      const response = await cancelMaterialRequest(accessToken, orderId);
      if (response.status === 1) {
        Swal.fire({
          icon: 'success',
          title: 'Cancelled',
          text: response.message || 'Order cancelled successfully',
        });
        setSelectedOrderFilter('cancelled');
        fetchOrders();
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Failed',
          text: response.message || 'Failed to cancel order',
        });
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.response?.data?.message || 'Failed to cancel order',
      });
    }
  };

  const renderStatusBadge = (status) => {
    const key = typeof status === 'string' ? status.toLowerCase() : (status?.name || '').toLowerCase();
    switch (key) {
      case 'new':
        return <div className="new-badge px-2 p-1 rounded-2">New</div>;
      case 'complete':
      case 'completed':
        return <div className="finished-badge px-2 p-1 rounded-2">Completed</div>;
      case 'cancelled':
      case 'canceled':
        return <div className="canceled-badge px-2 p-1 rounded-2">Cancelled</div>;
      default:
        return null;
    }
  };

  return (
    <section>
      <CleanerHeader title="Materials Requests" onMobileMenuClick={onMobileMenuClick} />

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

        {/* View Mode Toggle */}
        <div className="row package-filter align-items-center py-2 px-0 m-0 mb-3">
          <div className="col-md-6">
            <button
              className={`rounded-2 border-0 px-4 py-2 w-100 ${viewMode === 'materials' ? 'sec-btn' : 'package-filter-item'}`}
              onClick={() => {
                setViewMode('materials');
                setCurrentPage(1);
                setSearchQuery('');
              }}
            >
              Select Materials
            </button>
          </div>
          <div className="col-md-6">
            <p
              className={`text-center rounded-2 py-2 m-0 ${viewMode === 'orders' ? 'sec-btn' : 'package-filter-item'}`}
              style={{ cursor: 'pointer' }}
              onClick={() => {
                setViewMode('orders');
                setCurrentPage(1);
                setSearchQuery('');
              }}
            >
              My Orders
            </p>
          </div>
        </div>

        {/* Materials Selection View */}
        {viewMode === 'materials' && (
          <>
            <div className="row mt-3 w-100 g-0 g-lg-2">
              <h6 className="property-management-card-title mb-1">Materials</h6>

              {isLoading ? (
                <div className="d-flex justify-content-center align-items-center p-5">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              ) : currentMaterials.length === 0 ? (
                <div className="d-flex justify-content-center align-items-center p-5">
                  <p>No materials available</p>
                </div>
              ) : (
                currentMaterials.map((material) => (
                  <div key={material.id} className="col-6 col-md-3 col-lg-2 mb-3">
                    <div
                      className={`material-card p-2 rounded-3 h-100 ${isItemSelected(material.id) ? 'material-card-selected' : ''}`}
                      onClick={() => handleMaterialClick(material)}
                      style={{ 
                        cursor: 'pointer',
                        border: isItemSelected(material.id) ? '2px solid #f7941d' : '2px solid transparent',
                        backgroundColor: '#f8f9fa',
                        transition: 'border-color 0.2s ease'
                      }}
                    >
                      <img
                        src={material.image || '/assets/service-img.png'}
                        className="img-fluid w-100 rounded-2"
                        alt={material.name || 'material'}
                        style={{ height: '100px', objectFit: 'cover' }}
                      />
                      <div className="d-flex justify-content-between align-items-center gap-1 mt-2">
                        <h6 className="m-0" style={{ fontSize: '12px', color: '#333' }}>{material.name || material.title}</h6>
                        <span 
                          className="px-2 py-1 rounded-2" 
                          style={{ 
                            backgroundColor: isItemSelected(material.id) ? '#f7941d' : '#e9ecef',
                            color: isItemSelected(material.id) ? '#fff' : '#f7941d',
                            fontSize: '12px',
                            fontWeight: '600'
                          }}
                        >
                          ${material.price || 0}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}

              {!isLoading && currentMaterials.length > 0 && (
                <div className="d-flex justify-content-between align-items-center mb-3 gap-2 flex-wrap">
                  <div className="d-flex align-items-center gap-2">
                    <span className="text-muted">Selected: {cartItems.length} items</span>
                  </div>
                  <button className="sec-btn rounded-2 px-5 py-2" onClick={handleOrderClick}>
                    Order
                  </button>
                </div>
              )}
            </div>

            {/* Pagination for Materials */}
            {!isLoading && totalPages > 1 && (
              <div className="d-flex justify-content-center mt-3">
                <div className="pagination-container d-flex align-items-center gap-2">
                  <button
                    className="pagination-arrow"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    <FontAwesomeIcon icon={faChevronLeft} />
                  </button>
                  {renderPaginationNumbers()}
                  <button
                    className="pagination-arrow"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    <FontAwesomeIcon icon={faChevronRight} />
                  </button>
                </div>
              </div>
            )}
          </>
        )}

        {/* Orders View */}
        {viewMode === 'orders' && (
          <>
            {/* Order Filter Tabs */}
            <div className="row package-filter align-items-center py-2 px-0 m-0 mb-3">
              <div className="col-md-4">
                <button
                  className={`rounded-2 border-0 px-4 py-2 w-100 ${selectedOrderFilter === 'new' ? 'sec-btn' : 'package-filter-item'}`}
                  onClick={() => handleOrderFilterClick('new')}
                >
                  New Orders
                </button>
              </div>
              <div className="col-md-4">
                <p
                  className={`text-center rounded-2 py-2 m-0 ${selectedOrderFilter === 'complete' ? 'sec-btn' : 'package-filter-item'}`}
                  style={{ cursor: 'pointer' }}
                  onClick={() => handleOrderFilterClick('complete')}
                >
                  Complete
                </p>
              </div>
              <div className="col-md-4">
                <p
                  className={`text-center rounded-2 py-2 m-0 ${selectedOrderFilter === 'cancelled' ? 'sec-btn' : 'package-filter-item'}`}
                  style={{ cursor: 'pointer' }}
                  onClick={() => handleOrderFilterClick('cancelled')}
                >
                  Cancelled
                </p>
              </div>
            </div>

            {isLoading ? (
                <div className="d-flex justify-content-center align-items-center p-5">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              ) : currentOrders.length === 0 ? (
                <div className="text-center mt-4 mb-4">
                  <p className="text-muted">No orders found for the selected filter.</p>
                </div>
              ) : (
                currentOrders.map((order) => (
                  <Link
                    to={`/cleaner/material-details?id=${order.id}`}
                    key={order.id}
                    className="d-flex text-decoration-none align-items-center justify-content-between p-3 gap-2 w-100 materials-cards rounded-4 mb-3"
                  >
                    <div className="d-flex w-100 align-items-start flex-column flex-md-row gap-2">
                      <img
                        src={order.image || '/assets/problem-img-2.png'}
                        className="img-fluid materials-img"
                        alt="order"
                      />
                      <div className="d-flex flex-column gap-2 align-items-start w-100">
                        <div className="d-flex justify-content-between align-items-center w-100">
                          <h6 className="property-problem-title mb-0">
                            {order.name || order.title || `Order #${order.id}`}
                          </h6>
                          {renderStatusBadge(order.status || selectedOrderFilter)}
                        </div>
                        <div className="d-flex align-items-center gap-1">
                          <img src="/assets/calendar-3.svg" alt="calendar" />
                          <p className="dashboard-home-card-2-desc-3 m-0">{order.date || order.created_at || 'N/A'}</p>
                        </div>
                        <div className="d-flex align-items-center gap-1">
                          <img src="/assets/clock.svg" alt="clock" />
                          <p className="dashboard-home-card-2-desc-3 mb-0">
                            {order.time_from && order.time_to ? `${order.time_from} - ${order.time_to}` : order.time || 'N/A'}
                          </p>
                        </div>
                        <div className="d-flex mt-2 gap-2 align-items-center w-100">
                          {selectedOrderFilter === 'new' && (
                            <button
                              className="btn btn-outline-danger py-2"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                handleCancelOrder(order.id);
                              }}
                            >
                              report problem
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </Link>
                ))
              )}

            {/* Pagination for Orders */}
            {!isLoading && totalPages > 1 && (
              <div className="d-flex justify-content-center mt-3">
                <div className="pagination-container d-flex align-items-center gap-2">
                  <button
                    className="pagination-arrow"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    <FontAwesomeIcon icon={faChevronLeft} />
                  </button>
                  {renderPaginationNumbers()}
                  <button
                    className="pagination-arrow"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
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

export default CleanerMaterialRequestMain;
