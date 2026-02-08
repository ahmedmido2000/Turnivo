import React, { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';

const JoinConfirmPageMain = () => {
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
        <div className="join-confirm-bg g-0 my-5">
            <div className="d-flex flex-column align-items-center gap-3 p-md-5 p-4">
                <div className="text-center">
                  <img 
                    src="/assets/logo.png" 
                    alt="Logo" 
                    className="img-fluid confirm-logo"
                  />
                </div>
                <h6 className='confirm-title m-0'>Welcome to our cleaning staff recruitment form</h6>
                <p className='confirm-desc m-0 text-center'>Welcome to our cleaners recruitment form! Please fill out the required information to join our team that specializes in providing quality and professional cleaning services.</p>
                              <Link to='/confirm-provider-steps' className="sec-btn rounded-2 px-4 py-2 text-decoration-none">
                                Confirm
                              </Link>
            </div>
        </div>
      </div>
    </div>
  );
};

export default JoinConfirmPageMain;