import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Person, Settings, Logout } from '@mui/icons-material';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import AddCircleOutlinedIcon from '@mui/icons-material/AddCircleOutlined';
import { Link, useNavigate } from 'react-router-dom';
import { guestContact } from '../../api/guestApi';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const GuestContactMain = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    body: ''
  });
  
  const [guestInfo, setGuestInfo] = useState({
    name: '',
    avatar: '/assets/user.png',
    created_at: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    // Get guest data from localStorage - user info is in guest_data.data
    const guestDataStr = localStorage.getItem('guest_data');
    if (guestDataStr) {
      try {
        const guestData = JSON.parse(guestDataStr);
        // User info is stored in guestData.data (from the API response structure)
        const userData = guestData?.data || {};
        setFormData(prev => ({
          ...prev,
          name: userData.name || userData.username || '',
          email: userData.email || ''
        }));
        setGuestInfo({
          name: userData.name || userData.username || 'Guest',
          avatar: userData.avatar || '/assets/user.png',
          created_at: userData.created_at || new Date().toISOString().split('T')[0]
        });
      } catch (err) {
        console.error('Error parsing guest data:', err);
      }
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Get access token from guest_data or access_token in localStorage
      const guestDataStr = localStorage.getItem('guest_data');
      const guestData = guestDataStr ? JSON.parse(guestDataStr) : null;
      const accessToken = guestData?.access_token || localStorage.getItem('access_token');
      
      if (!accessToken) {
        toast.error('Please login first', { position: 'top-center', autoClose: 3000 });
        navigate('/guest/login');
        return;
      }
      
      // Temporarily disabled check for development
      // if (!accessToken) {
      //   toast.error('Please login first', {
      //     position: "top-center",
      //     autoClose: 3000,
      //     hideProgressBar: false,
      //     closeOnClick: true,
      //     pauseOnHover: true,
      //     draggable: true,
      //   });
      //   setLoading(false);
      //   setTimeout(() => {
      //     navigate('/guest/login');
      //   }, 3000);
      //   return;
      // }

      const response = await guestContact(
        accessToken,
        formData.name,
        formData.email,
        formData.body
      );

      // Handle API errors (both {field,message} array and nested status:0)
      if (response.status === 0 && response.data && Array.isArray(response.data) && response.data.length > 0) {
        response.data.forEach(err => toast.error(err.message || err.field || 'An error occurred', { position: 'top-center', autoClose: 4000 }));
        setLoading(false);
        return;
      }
      if (response.status === 0 && response.message) {
        toast.error(response.message, { position: 'top-center', autoClose: 4000 });
        setLoading(false);
        return;
      }
      if (response.status === 1 && response.data && Array.isArray(response.data) && response.data.length > 0) {
        const first = response.data[0];
        if (first.status === 0 && first.message) {
          toast.error(first.message, { position: 'top-center', autoClose: 4000 });
          setLoading(false);
          return;
        }
      }

      if (response.status === 1) {
        toast.success(response.message || 'Message sent successfully!', {
          position: "top-center",
          autoClose: 3000,
        });
        // Reset body field only
        setFormData(prev => ({
          ...prev,
          body: ''
        }));
      } else {
        toast.error(response.message || 'Failed to send message. Please try again.', {
          position: "top-center",
          autoClose: 3000,
        });
      }
    } catch (err) {
      toast.error(err.message || 'Failed to send message. Please try again.', {
        position: "top-center",
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
    }
  };


  return (
    <section>
        <ToastContainer />
        <div className="container">
            <div className="dashboard-home-content px-3 mt-3">
                <h6 className="dashboard-routes-sub m-0">Contact us</h6>
                <Link to="/guest/list" className="btn btn-sm mt-2 mb-1 d-inline-flex align-items-center gap-1" style={{color:'#292760', fontWeight:'600'}}>
                  <span>&#8592;</span> Back to list
                </Link>
                    <div className="d-flex align-items-center gap-2 my-3">
                        <div className="service-desc mb-2 mt-2">Welcome to Customer Service</div>
                        <img src={guestInfo.avatar} className='provider-rate' alt="user" />
                        <div>
                            <h6 className='popup-title m-0'>{guestInfo.name}</h6>
                            <h6 className="dashboard-routes-sub m-0 mt-1">{guestInfo.created_at}</h6>
                        </div>
                    </div>
                    <p className='contact-desc m-0 mb-3'>Do you have questions? Feel free to reach out to us for support or more information about on next stay. Our team is ready to answer all your queries.</p>
                    
                    <form onSubmit={handleSubmit}>
                      <div className="row">
                        <div className="col-12">
                          <div className="mb-3 w-100">
                            <input
                              type="text"
                              className="form-control rounded-2 py-2 px-3 w-100"
                              placeholder="Name*"
                              name="name"
                              value={formData.name}
                              onChange={handleInputChange}
                              required
                            />
                          </div>
                        </div>
                        <div className="col-12">
                          <div className="mb-3 w-100">
                            <input
                              type="email"
                              className="form-control rounded-2 py-2 px-3 w-100"
                              placeholder="E-mail address*"
                              name="email"
                              value={formData.email}
                              onChange={handleInputChange}
                              required
                            />
                          </div>
                        </div>
                        <div className="col-12">
                          <div className="mb-3 w-100">
                            <textarea 
                              name="body" 
                              id="body" 
                              rows="6" 
                              className="form-control rounded-2 py-2 w-100" 
                              placeholder='Share your issues or queries here'
                              value={formData.body}
                              onChange={handleInputChange}
                              required
                            ></textarea>
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-12 mb-3">
                            <button type="submit" className="sec-btn rounded-2 px-5 py-2 w-100 border-0" disabled={loading}>
                              {loading ? 'Sending...' : 'Send'}
                            </button>
                          </div>
                        </div>
                      </div>
                    </form>
            </div>
        </div>
    </section>
  );
};

export default GuestContactMain;