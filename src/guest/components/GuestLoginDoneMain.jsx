import React, { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
const GuestLoginDoneMain = () => {
  const inputRefs = useRef([]);

  // Focus the first input when component mounts
  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
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
                  <p className="login-description pb-2 mb-2 border-bottom">temp code: #3293820</p>
                  <p className="dashboard-routes-sub pb-2 mb-0">Our team wishes you a pleasant stay</p>
                                    <Link to='/guest/list' 
                                      type="submit" 
                                      className="sec-btn w-100 rounded-2 py-2 text-center text-decoration-none"
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