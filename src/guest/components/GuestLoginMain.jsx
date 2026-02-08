import React, { useRef, useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { guestLogin } from '../../api/guestApi';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const GuestLoginMain = () => {
  const inputRefs = useRef([]);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const [formData, setFormData] = useState({
    email: '',
     temp_code: 'TEMP123', // Temporary code for development - will be dynamic later
    property_id: 1 // You can set this dynamically based on your needs
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
      const parsedId = Number(propertyIdParam);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await guestLogin(formData.email, formData.temp_code, formData.property_id);
      
      // Check if response contains error message in data array
      if (response.status === 1 && response.data && Array.isArray(response.data) && response.data.length > 0) {
        if (response.data[0].status === 0 && response.data[0].message) {
          toast.error(response.data[0].message, {
            position: "top-center",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          });
          setLoading(false);
          return;
        }
      }
      
      // Store access token
      if (response.access_token) {
        localStorage.setItem('guest_access_token', response.access_token);
        localStorage.setItem('guest_data', JSON.stringify(response));
        toast.success('Login successful!', {
          position: "top-center",
          autoClose: 2000,
        });
        setTimeout(() => {
          navigate('/guest/login-successfuly');
        }, 500);
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
                    <label htmlFor="temp_code" className="form-label mb-1">temp code</label>
                    <input
                      type="text"
                      className="form-control rounded-2 py-2 px-3"
                      id="temp_code"
                      name="temp_code"
                      value={formData.temp_code}
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