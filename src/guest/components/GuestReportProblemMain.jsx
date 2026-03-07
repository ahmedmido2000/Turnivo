import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Person, Settings, Logout } from '@mui/icons-material';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import AddCircleOutlinedIcon from '@mui/icons-material/AddCircleOutlined';
import { Link, useNavigate } from 'react-router-dom';
import ThumbUpOffAltOutlinedIcon from '@mui/icons-material/ThumbUpOffAltOutlined';
import ThumbDownOffAltOutlinedIcon from '@mui/icons-material/ThumbDownOffAltOutlined';
import { guestCreateReportProblem } from '../../api/guestApi';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const GuestReportProblemMain = () => {
  const navigate = useNavigate();
  
  // Get guest data from localStorage
  const guestDataStr = localStorage.getItem('guest_data');
  const guestData = guestDataStr ? JSON.parse(guestDataStr) : null;
  const tempCode = guestData?.temp_code || '';
  const propertyId = guestData?.property_id || '';

  // State for form inputs
  const [formData, setFormData] = useState({
    temp_code: tempCode,
    type: '1',
    description: '',
    property_id: propertyId
  });
  
  const [loading, setLoading] = useState(false);

  // Update temp_code and property_id when guestData changes
  React.useEffect(() => {
    if (tempCode || guestData?.property_id) {
      setFormData(prev => ({ 
        ...prev, 
        temp_code: tempCode || prev.temp_code,
        property_id: guestData?.property_id || prev.property_id
      }));
    }
  }, [tempCode, guestData?.property_id]);


  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

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

      const response = await guestCreateReportProblem(
        accessToken,
        formData.property_id,
        formData.type,
        formData.temp_code,
        formData.description
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
        toast.success(response.message || 'Problem reported successfully!', {
          position: "top-center",
          autoClose: 3000,
        });
        // Reset form
        setFormData({
          temp_code: '',
          type: '1',
          description: '',
          property_id: formData.property_id
        });
      } else {
        toast.error(response.message || 'Failed to submit problem report.', {
          position: "top-center",
          autoClose: 3000,
        });
      }
    } catch (err) {
      toast.error(err.message || 'Failed to submit problem report. Please try again.', {
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
                <div className="d-flex justify-content-between align-items-center">
                    <h6 className="dashboard-routes-sub m-0">Report a problem</h6>
                </div>
                
                
                <form onSubmit={handleSubmit}>
                <div className="row mt-3 w-100 g-0 g-lg-2">
                    {/* Code field */}
                    <div className="col-12">
                    <div className="mb-3 w-100">
                        <label className="form-label mb-1">temp code</label>
                        <input
                        type="text"
                        className="form-control rounded-2 py-2 px-3 w-100"
                        placeholder="Enter code"
                        name="temp_code"
                        value={formData.temp_code}
                        onChange={handleInputChange}
                        />
                    </div>
                    </div>
                    <div className="col-12">
                    <div className="position-relative mb-3">
                    <label className="form-label mb-1">Type of service</label>
                    <select
                      id="propertyType"
                      className="form-select custom-select-bs py-2"
                      name="type"
                      value={formData.type}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="1">Clean</option>
                      <option value="2">Maintenance</option>
                    </select>

                    {/* Bootstrap Icon */}
                    <i className="bi bi-chevron-down select-bs-icon"></i>
                  </div>
                    </div>
                    
                    {/* Problem Description */}
                    <div className="col-12">
                    <div className="mb-3 w-100">
                        <label className="form-label mb-1">Problem details</label>
                        <textarea 
                        rows='6' 
                        className='form-control rounded-2 py-2' 
                        placeholder="What's the issue ..."
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        required
                        ></textarea>
                    </div>
                    </div>
                    
                    <div className="col-md-6 mb-3">
                    <button type="submit" className="sec-btn rounded-2 px-5 py-2 w-100" disabled={loading}>
                        {loading ? 'Sending...' : 'Send a request'}
                    </button>
                    </div>
                    <div className="col-md-6 mb-3">
                    <button type="button" className="delete-btn border-0 rounded-2 px-5 py-2 w-100" onClick={() => navigate(-1)}>
                        Cancel
                    </button>
                    </div>
                </div>
                </form>
            </div>

        </div>
    </section>
  );
};

export default GuestReportProblemMain;