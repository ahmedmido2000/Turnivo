import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { createMaterialRequest } from '../../api/cleanerMaterialsApi';
import { selectAccessToken } from '../../store/authSlice';
import {
  selectCartItems,
  selectCartTotal,
  removeFromCart,
  updateQuantity,
  clearCart,
} from '../../store/cartSlice';
import CleanerHeader from './CleanerHeader';

const CleanerShoppingCartMain = ({ onMobileMenuClick }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const accessToken = useSelector(selectAccessToken);
  const cartItems = useSelector(selectCartItems);
  const cartTotal = useSelector(selectCartTotal);

  // Calculate total quantity
  const totalQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const handleRemoveItem = (itemId) => {
    dispatch(removeFromCart(itemId));
  };

  const handleQuantityChange = (itemId, newQuantity) => {
    const qty = parseInt(newQuantity, 10);
    if (qty > 0) {
      dispatch(updateQuantity({ id: itemId, quantity: qty }));
    }
  };

  const handleOrder = async () => {
    if (cartItems.length === 0) {
      Swal.fire({
        icon: 'warning',
        title: 'Empty Cart',
        text: 'Your cart is empty. Please add items before ordering.',
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
      setIsSubmitting(true);

      // Format the data as required by the API
      const materialRequestIds = cartItems.map((item) => item.id).join(',');
      const materialQuantities = cartItems.map((item) => item.quantity).join(',');

      const requestData = {
        material_request_id: materialRequestIds,
        material_quantity: materialQuantities,
        total_price: cartTotal,
      };

      const response = await createMaterialRequest(accessToken, requestData);

      if (response.status === 1) {
        Swal.fire({
          icon: 'success',
          title: 'Order Placed',
          text: response.message || 'Your order has been placed successfully!',
        });
        dispatch(clearCart());
        navigate('/cleaner/material-requests');
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Order Failed',
          text: response.message || 'Failed to place order. Please try again.',
        });
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.response?.data?.message || 'Failed to place order. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section>
      <CleanerHeader title="My Basket" onMobileMenuClick={onMobileMenuClick} />

      <div className="dashboard-home-content px-3 mt-2">
        <div className="d-flex gap-2 align-items-center mt-3">
          <h6 className="dashboard-routes-sub m-0">Materials Request</h6>
          <Link to="/cleaner/material-requests" className="btn btn-link p-0">
            ← Back to Materials
          </Link>
        </div>

        <h6 className="property-management-card-title mb-1 mt-3">Basket ({cartItems.length} items)</h6>

        {cartItems.length === 0 ? (
          <div className="d-flex flex-column justify-content-center align-items-center p-5">
            <p className="text-muted">Your cart is empty</p>
            <Link to="/cleaner/material-requests" className="sec-btn rounded-2 px-4 py-2 mt-3">
              Browse Materials
            </Link>
          </div>
        ) : (
          <>
            {/* Cart Items */}
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="d-flex align-items-center justify-content-between flex-wrap p-3 gap-3 w-100 materials-cards rounded-4 mb-3"
              >
                <div className="d-flex align-items-center gap-2">
                  <img
                    src={item.image || '/assets/problem-img-2.png'}
                    className="img-fluid materials-img"
                    alt={item.name}
                  />
                  <div className="d-flex flex-column gap-2 align-items-start">
                    <h6 className="property-problem-title mb-0">{item.name}</h6>
                    <img
                      src="/assets/delete-icon.svg"
                      alt="delete"
                      style={{ cursor: 'pointer' }}
                      onClick={() => handleRemoveItem(item.id)}
                    />
                  </div>
                </div>
                <div className="d-flex align-items-center gap-2">
                  <h6 className="card-item-price m-0">${item.price.toFixed(2)}</h6>
                  <input
                    type="number"
                    className="form-control inp-num"
                    value={item.quantity}
                    min="1"
                    onChange={(e) => handleQuantityChange(item.id, e.target.value)}
                    style={{ width: '80px' }}
                  />
                  <h6 className="card-item-total-price m-0">
                    ${(item.price * item.quantity).toFixed(2)}
                  </h6>
                </div>
              </div>
            ))}

            {/* Order Summary */}
            <div className="card-total-price">
              <h2 className="mb-3 dashboard-title">Details</h2>
              <div className="d-flex justify-content-between w-100 align-items-center pb-1 mb-3 border-bottom">
                <div className="card-total-price-label">Items</div>
                <h2 className="mb-0 dashboard-title">{cartItems.length}</h2>
              </div>
              <div className="d-flex justify-content-between w-100 align-items-center pb-1 mb-3 border-bottom">
                <div className="card-total-price-label">Quantity</div>
                <h2 className="mb-0 dashboard-title">{totalQuantity}</h2>
              </div>
              <div className="d-flex justify-content-between w-100 align-items-center pb-1 border-bottom">
                <div className="card-total-price-label">Total</div>
                <h2 className="mb-0 dashboard-title">${cartTotal.toFixed(2)}</h2>
              </div>
            </div>

            <div className="d-flex justify-content-end align-items-center my-3 gap-2">
              <button
                className="btn btn-outline-secondary rounded-2 px-4 py-2"
                onClick={() => dispatch(clearCart())}
              >
                Clear Cart
              </button>
              <button
                className="sec-btn rounded-2 px-5 py-2"
                onClick={handleOrder}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                    Processing...
                  </>
                ) : (
                  'Order'
                )}
              </button>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default CleanerShoppingCartMain;
