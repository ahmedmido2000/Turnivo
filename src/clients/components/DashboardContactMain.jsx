import React, { useState, useEffect } from 'react';
import { useUserInfo, useContactForm } from '../../hooks/useContact';
import ClientHeader from './ClientHeader';

const DashboardContactMain = ({ onMobileMenuClick }) => {
  // Fetch fresh user info from API
  const { data: userInfoData, isLoading } = useUserInfo();
  const contactMutation = useContactForm();
  
  // Form state - includes mobile field
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    email: '',
    body: '',
  });

  // Initialize form with user data
  useEffect(() => {
    if (userInfoData?.data && userInfoData.data.length > 0) {
      const userData = userInfoData.data[0];
      setFormData(prev => ({
        ...prev,
        name: userData.name || '',
        mobile: userData.mobile || '',
        email: userData.email || '',
      }));
    }
  }, [userInfoData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate form - ensure all required fields are present
    if (!formData.name || !formData.mobile || !formData.email || !formData.body) {
      return;
    }
    
    // Submit contact form with all required fields: name, mobile, email, body
    contactMutation.mutate(formData, {
      onSuccess: () => {
        // Clear message body after successful submission
        setFormData(prev => ({
          ...prev,
          body: ''
        }));
      }
    });
  };

  // Get display data from API
  const userData = userInfoData?.data?.[0];
  const displayName = userData?.name || 'User';
  const displayAvatar = userData?.avatar || '/assets/user.png';
  const displayDate = userData?.created_at || new Date().toISOString().split('T')[0];

  return (
    <section>
      <ClientHeader title="Contact us" onMobileMenuClick={onMobileMenuClick} />
      <div className="dashboard-home-content px-3 mt-2">
        <h6 className="dashboard-routes-sub m-0">Contact us</h6>
        <div className="d-flex align-items-center gap-2 my-3">
          <div className="service-desc mb-2 mt-2">Welcome to Customer Service</div>
          <img src={displayAvatar} className='provider-rate' alt="user" />
          <div>
            <h6 className='popup-title m-0'>{displayName}</h6>
            <h6 className="dashboard-routes-sub m-0 mt-1">{displayDate}</h6>
          </div>
        </div>
        <p className='contact-desc m-0 mb-3'>
          Do you have questions? Feel free to reach out to us for support or more information about on next stay. Our team is ready to answer all your queries.
        </p>
        
        <form onSubmit={handleSubmit}>
          <div className="row">
            <div className="col-12">
              <div className="mb-3 w-100">
                <input
                  type="email"
                  name="email"
                  className="form-control rounded-2 py-2 px-3 w-100"
                  placeholder="E-mail address*"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  disabled={isLoading}
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
                  disabled={contactMutation.isPending}
                />
              </div>
            </div>
              <div className="col-12 mb-3">
                <button 
                  type="submit"
                  className="sec-btn rounded-2 px-5 py-2 w-100 border-0"
                  disabled={contactMutation.isPending || !formData.body}
                >
                  {contactMutation.isPending ? (
                    <>
                      <span className="spinner-border spinner-border-sm " role="status" aria-hidden="true"></span>
                      Sending...
                    </>
                  ) : (
                    'Send'
                  )}
                </button>
              </div>
          </div>
        </form>
      </div>
    </section>
  );
};

export default DashboardContactMain;