import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useActivate, useLogin } from '../../hooks/useAuth';
import { getUserEmail } from '../../utils/authStorage';

const ActivationCodeMain = () => {
  const [otpValues, setOtpValues] = useState(['', '', '', '']); // Changed to 4 digits
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef([]);
  
  const activateMutation = useActivate();
  const loginMutation = useLogin();
  const userEmail = getUserEmail();

  // Focus the first input when component mounts
  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  // Countdown timer for resend
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [countdown]);

  // Handle input change
  const handleChange = (index, e) => {
    const value = e.target.value;
    
    // Only allow numbers
    if (isNaN(value)) return;
    
    // Update the OTP values
    const newOtpValues = [...otpValues];
    newOtpValues[index] = value;
    setOtpValues(newOtpValues);
    
    // Move to the next input if a value is entered
    if (value && index < 3) { // Changed from 5 to 3
      inputRefs.current[index + 1].focus();
    }
  };

  // Handle key down for backspace
  const handleKeyDown = (index, e) => {
    // If backspace is pressed and the current input is empty, move to the previous input
    if (e.key === 'Backspace' && !otpValues[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  // Handle paste event
  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').trim();
    
    // Check if pasted data is a 4-digit number
    if (/^\d{4}$/.test(pastedData)) {
      const newOtpValues = pastedData.split('');
      setOtpValues(newOtpValues);
      
      // Focus the last input
      inputRefs.current[3].focus(); // Changed from 5 to 3
    }
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    const otp = otpValues.join('');
    
    // Validate that all fields are filled
    if (otp.length !== 4) { // Changed from 6 to 4
      return;
    }
    
    // Submit activation code
    // The mutation will handle validation and only navigate on success
    activateMutation.mutate(otp);
  };

  // Handle resend code
  const handleResend = () => {
    if (!canResend || !userEmail) return;
    
    // Reset countdown and resend flag
    setCountdown(60);
    setCanResend(false);
    
    // Clear OTP inputs
    setOtpValues(['', '', '', '']); // Changed to 4 empty strings
    inputRefs.current[0]?.focus();
    
    // Resend code by calling login API again
    loginMutation.mutate(userEmail);
  };

  return (
    <div className="min-vh-100 d-flex align-items-center">
      <div className="container p-0">
        <div className="row g-0 min-vh-100 justify-content-center">
          
          {/* Right side - Form */}
          <div className="col-lg-5 mt-3 p-3">
            <div className='d-flex align-items-center justify-content-center bg-white shadow-sm rounded-3 h-100'>
              <div className="w-100 p-md-5 p-3" style={{ maxWidth: '450px' }}>
                {/* Logo */}
                <div className="text-center">
                  <img 
                    src="/assets/logo.png" 
                    alt="Logo" 
                    height="70" 
                    className="mb-3 img-fluid"
                  />
                </div>
                
                {/* Title and Description */}
                <div className="text-center">
                  <h2 className="mb-3 login-title">Enter the activation code</h2>
                  <p className="login-description">
                    Please enter the 4-digit code sent to your email
                    {userEmail && <><br /><strong>{userEmail}</strong></>}
                  </p>
                </div>
                
                {/* OTP Form */}
                <form onSubmit={handleSubmit}>
                  {/* OTP Input Fields */}
                  <div className="d-flex justify-content-center gap-2 gap-md-3 mb-4">
                    {otpValues.map((value, index) => (
                      <input
                        key={index}
                        type="text"
                        className="form-control text-center otp-input"
                        value={value}
                        onChange={(e) => handleChange(index, e)}
                        onKeyDown={(e) => handleKeyDown(index, e)}
                        onPaste={index === 0 ? handlePaste : undefined}
                        ref={(el) => (inputRefs.current[index] = el)}
                        maxLength="1"
                        disabled={activateMutation.isPending}
                        required
                      />
                    ))}
                  </div>
                  
                  {/* Confirm Button */}
                  <button 
                    type="submit" 
                    className="sec-btn w-100 rounded-2 py-2 text-center text-decoration-none"
                    disabled={activateMutation.isPending || otpValues.join('').length !== 4}
                  >
                    {activateMutation.isPending ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Verifying...
                      </>
                    ) : (
                      'Confirm'
                    )}
                  </button>
                </form>
                
                {/* Resend code link */}
                <div className="text-center mt-3">
                  <p className="mb-0 not-have">
                    {canResend ? (
                      <button 
                        onClick={handleResend}
                        className="btn btn-link text-decoration-none login-create-account p-0"
                        disabled={loginMutation.isPending}
                      >
                        {loginMutation.isPending ? 'Sending...' : 'Resend the code'}
                      </button>
                    ) : (
                      <>Resend the code in <span className="login-create-account">{countdown}s</span></>
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivationCodeMain;