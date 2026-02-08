import React, { useRef, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faArrowRightLong} from '@fortawesome/free-solid-svg-icons'
import {faCommentDots} from '@fortawesome/free-regular-svg-icons'
import { guestCheckout } from '../../api/guestApi';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const GuestListMain = () => {
  const inputRefs = useRef([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // Focus the first input when component mounts
  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const handleCheckout = async (e) => {
    e.preventDefault();
    
    const guestData = localStorage.getItem('guest_data');
    // Temporary: use default token for development if not logged in
    const accessToken = guestData ? JSON.parse(guestData).access_token : 'q3mdPlSMfSBKo4QrUSXEezb3WU59BLcS';
    
    // Temporarily disabled check for development
    // if (!accessToken) {
    //   toast.error('Please login first', {
    //     position: "top-center",
    //     autoClose: 2000,
    //   });
    //   navigate('/guest/login');
    //   return;
    // }

    setLoading(true);
    try {
      const property_id = 1; // You can set this dynamically based on guest data
      const response = await guestCheckout(accessToken, property_id);

      // Check if response contains error message in data array
      if (response.status === 1 && response.data && Array.isArray(response.data) && response.data.length > 0) {
        if (response.data[0].status === 0 && response.data[0].message) {
          toast.error(response.data[0].message, {
            position: "top-center",
            autoClose: 3000,
          });
          setLoading(false);
          return;
        }
      }

      if (response.status === 1) {
        toast.success(response.message || 'Checkout successful!', {
          position: "top-center",
          autoClose: 2000,
        });
        // Clear guest data from localStorage
        localStorage.removeItem('guest_access_token');
        localStorage.removeItem('guest_data');
        setTimeout(() => {
          navigate('/guest/login');
        }, 2000);
      } else {
        toast.error(response.message || 'Checkout failed', {
          position: "top-center",
          autoClose: 2000,
        });
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'An error occurred during checkout';
      toast.error(errorMessage, {
        position: "top-center",
        autoClose: 2000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-vh-100 py-5">
      <ToastContainer />
      <div className="container ">
        <div className="row justify-content-center">
          <div className="col-lg-3 col-md-6 mb-3">
            <Link to='/guest/my-ratings' className="text-decoration-none shadow guest-list-card bg-white d-flex flex-column align-items-start justify-content-center gap-3 h-100">
                <div className="guest-list-bg d-flex align-items-center justify-content-center">
                    <img src="/assets/medal-star.svg" alt="Ratings" />
                </div>
                    <div className="d-flex justify-content-between align-items-center w-100">
                        <h2 className="mb-0 dashboard-title">Ratings services</h2>
                        <FontAwesomeIcon icon={faArrowRightLong} />
                    </div>
            </Link>
          </div>
          <div className="col-lg-3 col-md-6 mb-3">
            <Link to='/guest/report-problem' className="text-decoration-none shadow guest-list-card bg-white d-flex flex-column align-items-start justify-content-center gap-3 h-100">
                <div className="guest-list-bg d-flex align-items-center justify-content-center">
                    <img src="/assets/broom.svg" alt="Report" />
                </div>
                    <div className="d-flex justify-content-between align-items-center w-100">
                        <h2 className="mb-0 dashboard-title">Report a problem</h2>
                        <FontAwesomeIcon icon={faArrowRightLong} />
                    </div>
            </Link>
          </div>
          <div className="col-lg-3 col-md-6 mb-3">
            <Link to='/guest/contact' className="text-decoration-none shadow guest-list-card bg-white d-flex flex-column align-items-start justify-content-center gap-3 h-100">
                <div className="guest-list-bg d-flex align-items-center justify-content-center">
                    <FontAwesomeIcon icon={faCommentDots} style={{color:'#292760'}} />
                </div>
                    <div className="d-flex justify-content-between align-items-center w-100">
                        <h2 className="mb-0 dashboard-title">Contact us</h2>
                        <FontAwesomeIcon icon={faArrowRightLong} />
                    </div>
            </Link>
          </div>
          <div className="col-lg-3 col-md-6 mb-3">
            <div
              onClick={handleCheckout}
              style={{ cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1 }}
              className="text-decoration-none shadow guest-list-card bg-white d-flex flex-column align-items-start justify-content-center gap-3 h-100"
            >
                <div className="guest-list-bg d-flex align-items-center justify-content-center">
                    <img src="/assets/logout.svg" alt="logout" />
                </div>
                <div className="d-flex justify-content-between align-items-center w-100">
                    <h2 className="mb-0 dashboard-title">{loading ? 'Processing...' : 'check out'}</h2>
                    <FontAwesomeIcon icon={faArrowRightLong} />
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GuestListMain;