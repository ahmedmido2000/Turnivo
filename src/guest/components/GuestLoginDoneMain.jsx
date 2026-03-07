import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const GuestLoginDoneMain = () => {
  const [guestCode, setGuestCode] = useState('');

  useEffect(() => {
    // Get guest code from local storage after login
    const guestDataStr = localStorage.getItem('guest_data');
    if (guestDataStr) {
      try {
        const loginData = JSON.parse(guestDataStr);
        // Display the temp code used during login
        if (loginData.temp_code) {
          setGuestCode(loginData.temp_code);
        }
      } catch (e) {
        console.error('Error parsing guest data', e);
      }
    }
  }, []);

  return (
    <div className="min-vh-100 d-flex align-items-center">
      <div className="container p-0">
        <div className="row g-0 justify-content-center">
          
          {/* Right side - Form */}
          <div className="col-lg-5 mt-3 p-3">
            <div className='d-flex align-items-center justify-content-center bg-white shadow-sm rounded-3 h-100'>
              <div className="w-100 p-4">
                
                {/* Title and Description */}
                <div className="text-center">
                <CheckCircleIcon className='fs-1 mb-2' style={{color:'#16B464'}} />
                  <h6 className="form-label mb-2">You are logged in</h6>
                  <p className="login-description pb-2 mb-2 border-bottom">temp code: #{guestCode || 'N/A'}</p>
                  <p className="dashboard-routes-sub pb-2 mb-0">Our team wishes you a pleasant stay</p>
                                    <Link to='/guest/list' 
                                      className="sec-btn w-100 rounded-2 py-2 text-center text-decoration-none d-block"
                                    >
                                      Continue
                                    </Link>
                </div>
                
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GuestLoginDoneMain;