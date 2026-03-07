import React, { useRef, useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../../store/authSlice';
import { guestLogin } from '../../api/guestApi';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { decodePropertyId } from '../../utils/qrEncoder';

const GuestLoginMain = () => {
  const inputRefs = useRef([]);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  
  const [formData, setFormData] = useState({
    email: '',
    code: '',
    property_id: null
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Focus the first input when component mounts
  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  useEffect(() => {
    const propertyIdParam = searchParams.get('propertyId');
    if (propertyIdParam) {
      // Try to decode encoded token first, fallback to raw number
      const decoded = decodePropertyId(propertyIdParam);
      const parsedId = decoded ? Number(decoded) : Number(propertyIdParam);
      if (!Number.isNaN(parsedId)) {
        setFormData(prev => ({
          ...prev,
          property_id: parsedId,
        }));
      }
    }
  }, [searchParams]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  // Helper: extract and show API errors
  const showApiErrors = (response) => {
    if (response.status === 0 && response.data && Array.isArray(response.data) && response.data.length > 0) {
      // Format: { status:0, data: [{field, message}] }
      response.data.forEach(err => {
        const msg = err.message || err.field || 'An error occurred';
        toast.error(msg, { position: 'top-center', autoClose: 4000 });
      });
      return true;
    }
    if (response.status === 0 && response.message) {
      toast.error(response.message, { position: 'top-center', autoClose: 4000 });
      return true;
    }
    if (response.status === 1 && response.data && Array.isArray(response.data) && response.data.length > 0) {
      const first = response.data[0];
      if (first.status === 0 && first.message) {
        toast.error(first.message, { position: 'top-center', autoClose: 4000 });
        return true;
      }
    }
    return false;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await guestLogin(formData.email, formData.code, formData.property_id);

      if (showApiErrors(response)) {
        setLoading(false);
        return;
      }
      
      // Store access token and response data
      if (response.status === 1 && response.data && response.data[0]) {
        const loginData = response.data[0];
        if (loginData.access_token) {
          // Store the whole login data and the temp code and property_id used to login
          localStorage.setItem('guest_data', JSON.stringify({
            ...loginData,
            temp_code: formData.code,
            property_id: formData.property_id
          }));
          
          // Use Redux to handle state and storage consistently
          // Force isGuest: true to ensure the system treats them as role 6
          dispatch(setCredentials({ ...loginData, isGuest: true }));

          toast.success('Login successful!', {
            position: "top-center",
            autoClose: 2000,
          });
          setTimeout(() => {
            navigate('/guest/login-successfuly');
          }, 500);
        }
      }
    } catch (err) {
      toast.error(err.message || 'Login failed. Please check your credentials.', {
        position: "top-center",
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-vh-100 d-flex align-items-center">
      <ToastContainer />
      <div className="container p-0">
        <div className="row g-0 min-vh-100 justify-content-center">
          
          {/* Right side - Form */}
          <div className="col-lg-5 mt-3 p-3">
            <div className='d-flex align-items-center justify-content-center bg-white shadow-sm rounded-3 h-100'>
              <div className="w-100 p-4">
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
                  <h2 className="mb-3 login-title">Get your smart lock code</h2>
                  <p className="login-description">Welcome back!</p>
                </div>
                
                {/* OTP Form */}
                <form onSubmit={handleSubmit}>
                  {/* OTP Input Fields */}
                  <div className="mb-3">
                    <label htmlFor="email" className="form-label mb-1">Email Address</label>
                    <input
                      type="email"
                      className="form-control rounded-2 py-2 px-3"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="code" className="form-label mb-1">temp code</label>
                    <input
                      type="text"
                      className="form-control rounded-2 py-2 px-3"
                      id="code"
                      name="code"
                      value={formData.code}
                      onChange={handleInputChange}
                      placeholder="Enter code"
                      required
                    />
                  </div>
                  
                  {/* Login Button */}
                  <button 
                    type="submit" 
                    className="sec-btn w-100 rounded-2 py-2 text-center border-0"
                    disabled={loading}
                  >
                    {loading ? 'Signing in...' : 'sign in'}
                  </button>
                </form>
                
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GuestLoginMain;