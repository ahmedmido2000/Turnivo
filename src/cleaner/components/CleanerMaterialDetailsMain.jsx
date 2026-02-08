import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import CleanerHeader from './CleanerHeader';
import { getMaterialRequestView, cancelMaterialRequest } from '../../api/cleanerMaterialsApi';
import { selectAccessToken } from '../../store/authSlice';

const CleanerMaterialDetailsMain = ({ onMobileMenuClick }) => {
  const [orderDetails, setOrderDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const orderId = searchParams.get('id');

  const accessToken = useSelector(selectAccessToken);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (!orderId) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Order ID is required',
        });
        navigate('/cleaner/material-requests');
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
        setIsLoading(true);
        const response = await getMaterialRequestView(accessToken, orderId);
        if (response.status === 1 && response.data && response.data.length > 0) {
          setOrderDetails(response.data[0]);
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: response.message || 'Failed to load order details',
          });
        }
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.response?.data?.message || 'Failed to load order details',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId, accessToken, navigate]);



  const handleCancelOrder = async () => {
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
        navigate('/cleaner/material-requests');
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
      <CleanerHeader title="Material Details" onMobileMenuClick={onMobileMenuClick} />

      <div className="dashboard-home-content px-3 mt-2">
        <div className="d-flex gap-2 align-items-center mt-3">
          <Link to="/cleaner/material-requests" className="btn btn-link p-0">
            ← Back to Orders
          </Link>
        </div>

        {isLoading ? (
          <div className="d-flex justify-content-center align-items-center p-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : orderDetails ? (
          <div className="mt-3">
            <div className="card-total-price">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h2 className="mb-0 dashboard-title">Order #{orderDetails.id}</h2>
                {renderStatusBadge(orderDetails.status)}
              </div>

              {/* User Info */}
              {orderDetails.user && (
                <div className="d-flex align-items-center gap-3 p-3 mb-3 rounded-3" style={{ backgroundColor: '#f8f9fa' }}>
                  <img 
                    src={orderDetails.user.avatar || '/assets/user.png'} 
                    alt="user" 
                    className="rounded-circle"
                    style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                  />
                  <div>
                    <h6 className="m-0 fw-bold">{orderDetails.user.name || 'User'}</h6>
                    <div className="d-flex align-items-center gap-1 mt-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <svg
                          key={star}
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill={star <= (orderDetails.user.rate || 0) ? "#f7941d" : "none"}
                          stroke="#f7941d"
                          strokeWidth="2"
                        >
                          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                        </svg>
                      ))}
                      <span className="text-muted ms-1" style={{ fontSize: '12px' }}>({orderDetails.user.rate || 0})</span>
                    </div>
                  </div>
                </div>
              )}

              <div className="d-flex justify-content-between w-100 align-items-center pb-2 mb-3 border-bottom">
                <div className="card-total-price-label">Order Date</div>
                <h6 className="mb-0" style={{ color: '#666' }}>{orderDetails.created_at || 'N/A'}</h6>
              </div>

              {orderDetails.material_request_items && orderDetails.material_request_items.length > 0 && (
                <>
                  <h6 className="property-management-card-title mb-3">Order Items</h6>
                  {orderDetails.material_request_items.map((item) => (
                    <div
                      key={item.id}
                      className="d-flex align-items-center justify-content-between flex-wrap p-3 gap-3 w-100 rounded-3 mb-2"
                      style={{ backgroundColor: '#f8f9fa' }}
                    >
                      <div className="d-flex align-items-center gap-3">
                        <img
                          src={item.material_id?.image || '/assets/problem-img-2.png'}
                          className="rounded-2"
                          alt={item.material_name}
                          style={{ width: '60px', height: '60px', objectFit: 'cover' }}
                        />
                        <div className="d-flex flex-column gap-1 align-items-start">
                          <h6 className="property-problem-title mb-0">{item.material_name}</h6>
                          <p className="text-muted m-0" style={{ fontSize: '13px' }}>Unit Price: ${item.material_price || 0}</p>
                          <p className="m-0" style={{ fontSize: '13px', color: '#666' }}>Quantity: <strong>{item.quantity || 1}</strong></p>
                        </div>
                      </div>
                      <div className="text-end">
                        <h5 className="m-0 fw-bold" style={{ color: '#f7941d' }}>${item.total_price || 0}</h5>
                      </div>
                    </div>
                  ))}
                </>
              )}

              <div className="d-flex justify-content-between w-100 align-items-center py-3 mt-3" style={{ borderTop: '2px solid #f7941d' }}>
                <div className="card-total-price-label fw-bold">Total Price</div>
                <h4 className="mb-0 fw-bold" style={{ color: '#f7941d' }}>${orderDetails.total_price || 0}</h4>
              </div>

              {orderDetails.status?.name === 'new' && (
                <div className="d-flex justify-content-end align-items-center mt-3">
                  <button
                    className="btn btn-outline-danger py-2 px-4"
                    onClick={handleCancelOrder}
                  >
                    Cancel Order
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="d-flex justify-content-center align-items-center p-5">
            <p>Order not found</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default CleanerMaterialDetailsMain;
