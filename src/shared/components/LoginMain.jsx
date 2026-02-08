import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLogin } from '../../hooks/useAuth';

const LoginMain = () => {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const loginMutation = useLogin();

  // Email validation
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      return 'Email is required';
    }
    if (!emailRegex.test(email)) {
      return 'Please enter a valid email address';
    }
    return '';
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate email
    const error = validateEmail(email);
    if (error) {
      setEmailError(error);
      return;
    }
    
    // Clear error and submit
    setEmailError('');
    loginMutation.mutate(email);
  };

  // Handle email change
  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    if (emailError) {
      setEmailError('');
    }
  };

  return (
    <div className="min-vh-100 d-flex align-items-center">
      <div className="container p-0">
        <div className="row g-0 min-vh-100">
          {/* Left side - Image */}
          <div className="col-lg-7 mt-3 p-3 d-none d-lg-block">
            <div 
              className="h-100 d-flex align-items-center justify-content-center rounded-3"
              style={{
                backgroundImage: `url('/assets/login.jpg')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundColor: '#f8f9fa'
              }}
            >
              <div className="text-center d-flex justify-content-center align-items-center p-4 w-100 h-100" style={{ backgroundColor: '#FFFFFF33', borderRadius: '10px' }}>
                <img 
                  src="/assets/logo.png" 
                  alt="Logo" 
                  height="180" 
                  className="mb-3"
                />
              </div>
            </div>
          </div>
          
          {/* Right side - Form */}
          <div className="col-lg-5 mt-3 p-3">
            <div className='d-flex align-items-start justify-content-center bg-white shadow-sm rounded-3 h-100'>
            <div className="w-100 p-4" style={{ maxWidth: '450px' }}>
              {/* Logo */}
              <div className="text-center">
                <img 
                  src="/assets/logo.png" 
                  alt="Logo" 
                  height="70" 
                  className="mb-3"
                />
              </div>
              
              {/* Title and Description */}
              <div className="text-center">
                <h2 className="mb-3 login-title">Login with ONS</h2>
                <p className="login-description">Welcome back! Please log in to continue</p>
              </div>
              
              {/* Login Form */}
              <form onSubmit={handleSubmit}>
                {/* Email Input */}
                <div className="mb-3">
                  <label htmlFor="email" className="form-label mb-1">Email Address</label>
                  <input
                    type="email"
                    className={`form-control rounded-2 py-2 px-3 ${emailError ? 'is-invalid' : ''}`}
                    id="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={handleEmailChange}
                    disabled={loginMutation.isPending}
                    required
                  />
                  {emailError && (
                    <div className="invalid-feedback d-block">
                      {emailError}
                    </div>
                  )}
                </div>
                
                
                {/* Login Button */}
                <button 
                  type="submit" 
                  className="sec-btn w-100 rounded-2 py-2 text-center text-decoration-none"
                  disabled={loginMutation.isPending}
                >
                  {loginMutation.isPending ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Sending code...
                    </>
                  ) : (
                    'Log in'
                  )}
                </button>
              </form>
              
              {/* Sign up link */}
              <div className="text-center mt-3">
                <p className="mb-0 not-have">
                  Don't have an account?{' '}
                  <Link to="/activation-code" className="text-decoration-none login-create-account">
                    Create an account
                  </Link>
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

export default LoginMain;