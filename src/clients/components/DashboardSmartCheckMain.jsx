import React, { useState, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { QRCodeCanvas } from 'qrcode.react';
import { getPropertyById, getPropertyCalendar, getProperties, createSmartLockRequest, getContactInfo, addPropertyRule } from '../../api/propertyApi';
import { getSmartLockHistoryCheckin, getSmartLockHistoryCheckout, sendEmailToGuest } from '../../api/smartLockApi';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ClientHeader from './ClientHeader';

const DashboardSmartCheckMain = ({ onMobileMenuClick }) => {
  const scrollContainerRef = useRef(null);
  const propertyCardsRef = useRef({});
  const qrCodeRef = useRef(null);
  const navigate = useNavigate();
  
  // State for properties
  const [properties, setProperties] = useState([]);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // State for payment
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
  
  // State for rise_price from contact info
  const [risePrice, setRisePrice] = useState(0);
  
  // State for smart lock history
  const [historyTab, setHistoryTab] = useState('checkin'); // 'checkin' or 'checkout'
  const [historyData, setHistoryData] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  
  // State for message tab (property_rules, welcoming, checkout_msg)
  const [messageTab, setMessageTab] = useState(null);
  const [propertyRule, setPropertyRule] = useState('');
  const [welcomingMessage, setWelcomingMessage] = useState('');
  const [checkoutMessage, setCheckoutMessage] = useState('');
  const [submitLoading, setSubmitLoading] = useState(false);
  
  // State for temp access code
  const [tempAccessData, setTempAccessData] = useState({
    service_id: '',
    guest_email: '',
    type: ''
  });
  const [tempAccessLoading, setTempAccessLoading] = useState(false);
  
  // State for smart lock request
  const [lockRequestData, setLockRequestData] = useState({
    property_id: null,
    date: '',
    time_from: '10:00',
    time_to: '12:00',
    price: 0,
    card_number: '',
    expiry_date: '',
    cvv: ''
  });

  // Fetch properties
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setIsLoading(true);
        const accessToken = localStorage.getItem('access_token');
        
        if (!accessToken) {
          Swal.fire({
            icon: 'error',
            title: 'Authentication Required',
            text: 'Please log in to view properties.',
          });
          navigate('/client/login');
          return;
        }

        // Fetch all properties with pagination
        let allProperties = [];
        let currentPage = 1;
        let hasMorePages = true;

        while (hasMorePages) {
          const propertiesResponse = await getProperties(accessToken, currentPage);
          if (propertiesResponse.status === 1 && propertiesResponse.data) {
            const pageData = propertiesResponse.data[0];
            const items = pageData?.items || [];
            allProperties = [...allProperties, ...items];

            // Check if there are more pages
            const meta = pageData?._meta;
            if (meta && currentPage < meta.NumberOfPage) {
              currentPage++;
            } else {
              hasMorePages = false;
            }
          } else {
            hasMorePages = false;
          }
        }

        setProperties(allProperties);
        
        // Don't auto-select - let user choose first
        setIsLoading(false);
      } catch (err) {
        console.error('Error fetching properties:', err);
        setError(err.message);
        setIsLoading(false);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to load properties. Please try again.',
        });
      }
    };

    fetchProperties();
  }, [navigate]);

  // Fetch contact info to get rise_price
  useEffect(() => {
    const fetchContactInfo = async () => {
      try {
        const accessToken = localStorage.getItem('access_token');
        
        if (!accessToken) {
          return;
        }

        const contactInfoResponse = await getContactInfo(accessToken);
        if (contactInfoResponse.status === 1 && contactInfoResponse.data) {
          const settings = contactInfoResponse.data[0]?.setting;
          const price = settings?.rise_price || 0;
          setRisePrice(price);
          setLockRequestData(prev => ({ ...prev, price: price }));
        }
      } catch (err) {
        console.error('Error fetching contact info:', err);
        // Don't show error to user, just use default price
      }
    };

    fetchContactInfo();
  }, []);

  // Scroll functions
  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: -350,
        behavior: 'smooth'
      });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: 350,
        behavior: 'smooth'
      });
    }
  };

  // Handle property selection
  const handlePropertySelect = (property) => {
    setSelectedProperty(property);
    setLockRequestData(prev => ({ ...prev, property_id: property.id }));
  };

  // Fetch smart lock history
  const fetchSmartLockHistory = async () => {
    if (!selectedProperty) {
      setHistoryData([]);
      setHistoryLoading(false);
      return;
    }

    try {
      setHistoryLoading(true);
      const accessToken = localStorage.getItem('access_token');
      
      if (!accessToken) {
        setHistoryLoading(false);
        return;
      }

      let response;
      if (historyTab === 'checkin') {
        response = await getSmartLockHistoryCheckin(accessToken, selectedProperty.id);
      } else if (historyTab === 'checkout') {
        response = await getSmartLockHistoryCheckout(accessToken, selectedProperty.id);
      }
      
      if (response && response.status === 1 && response.data && response.data[0]) {
        const items = response.data[0]?.items || [];
        setHistoryData(items);
      } else {
        setHistoryData([]);
      }
    } catch (err) {
      console.error('Error fetching smart lock history:', err);
      setHistoryData([]);
    } finally {
      setHistoryLoading(false);
    }
  };

  // Fetch history when selected property or tab changes
  useEffect(() => {
    if (selectedProperty) {
      fetchSmartLockHistory();
    }
  }, [selectedProperty, historyTab]);

  // Handle history tab change
  const handleHistoryTabChange = (tab) => {
    setHistoryTab(tab);
    setMessageTab(null); // Clear message tab when switching to history
  };

  // Handle message tab change
  const handleMessageTabChange = (tab) => {
    setMessageTab(tab);
    setHistoryTab(null); // Clear history tab when switching to message
  };

  // Handle property rule submission
  const handlePropertyRuleSubmit = async () => {
    if (!propertyRule.trim()) {
      toast.error('Please enter property rule', {
        position: "top-center",
        autoClose: 2000,
      });
      return;
    }

    setSubmitLoading(true);
    try {
      const accessToken = localStorage.getItem('access_token');
      const property_id = selectedProperty?.id || 1; // Use selected property or default to 1
      
      const response = await addPropertyRule(accessToken, property_id, propertyRule);
      
      // Check if response contains error message in data array
      if (response.status === 1 && response.data && Array.isArray(response.data) && response.data.length > 0) {
        if (response.data[0].status === 0 && response.data[0].message) {
          toast.error(response.data[0].message, {
            position: "top-center",
            autoClose: 3000,
          });
          setSubmitLoading(false);
          return;
        }
      }
      
      if (response.status === 1) {
        toast.success(response.message || 'Property rule added successfully!', {
          position: "top-center",
          autoClose: 2000,
        });
        setPropertyRule(''); // Clear the textarea
      } else {
        toast.error(response.message || 'Failed to add property rule', {
          position: "top-center",
          autoClose: 2000,
        });
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'An error occurred';
      toast.error(errorMessage, {
        position: "top-center",
        autoClose: 2000,
      });
    } finally {
      setSubmitLoading(false);
    }
  };

  // Handle welcoming message submission (no API yet)
  const handleWelcomingMessageSubmit = () => {
    if (!welcomingMessage.trim()) {
      toast.error('Please enter welcoming message', {
        position: "top-center",
        autoClose: 2000,
      });
      return;
    }
    
    toast.info('Welcoming message feature coming soon!', {
      position: "top-center",
      autoClose: 2000,
    });
  };

  // Handle checkout message submission (no API yet)
  const handleCheckoutMessageSubmit = () => {
    if (!checkoutMessage.trim()) {
      toast.error('Please enter checkout message', {
        position: "top-center",
        autoClose: 2000,
      });
      return;
    }
    
    toast.info('Checkout message feature coming soon!', {
      position: "top-center",
      autoClose: 2000,
    });
  };

  // Handle temp access input changes
  const handleTempAccessInputChange = (e) => {
    const { name, value } = e.target;
    setTempAccessData(prev => ({ ...prev, [name]: value }));
  };

  // Handle temp access code submission
  const handleTempAccessSubmit = async () => {
    const { service_id, guest_email, type } = tempAccessData;
    
    if (!service_id) {
      toast.error('Please select a property', {
        position: "top-center",
        autoClose: 2000,
      });
      return;
    }
    
    if (!guest_email.trim()) {
      toast.error('Please enter guest email', {
        position: "top-center",
        autoClose: 2000,
      });
      return;
    }
    
    if (!type) {
      toast.error('Please select a service type', {
        position: "top-center",
        autoClose: 2000,
      });
      return;
    }
    
    try {
      setTempAccessLoading(true);
      const accessToken = localStorage.getItem('access_token');
      
      await sendEmailToGuest(accessToken, service_id, guest_email, type);
      
      toast.success('Email sent to guest successfully!', {
        position: "top-center",
        autoClose: 2000,
      });
      
      // Reset form and close modal
      setTempAccessData({
        service_id: '',
        guest_email: '',
        type: ''
      });
      
      // Close modal
      const modal = document.getElementById('tempAccessModal');
      const bootstrapModal = window.bootstrap?.Modal?.getInstance(modal);
      if (bootstrapModal) {
        bootstrapModal.hide();
      }
    } catch (error) {
      console.error('Error sending email to guest:', error);
      toast.error(error.response?.data?.message || 'Failed to send email. Please try again.', {
        position: "top-center",
        autoClose: 2000,
      });
    } finally {
      setTempAccessLoading(false);
    }
  };

  // Handle payment method selection
  const handlePaymentMethodClick = (method) => {
    setSelectedPaymentMethod(method);
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setLockRequestData(prev => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = async () => {
    try {
      const accessToken = localStorage.getItem('access_token');
      
      if (!accessToken) {
        Swal.fire({ icon: 'error', title: 'Authentication Required', text: 'Please log in again.' });
        navigate('/client/login');
        return;
      }
      
      if (!selectedProperty) {
        Swal.fire({ icon: 'warning', title: 'Please select a property' });
        return;
      }
      
      if (!lockRequestData.date) {
        Swal.fire({ icon: 'warning', title: 'Please enter a date' });
        return;
      }
      
      if (!lockRequestData.time_from || !lockRequestData.time_to) {
        Swal.fire({ icon: 'warning', title: 'Please enter time from and time to' });
        return;
      }

      // Prepare API request data
      const requestData = {
        property_id: selectedProperty.id,
        date: lockRequestData.date,
        time_from: lockRequestData.time_from,
        time_to: lockRequestData.time_to,
        price: lockRequestData.price
      };

      console.log('Submitting smart lock request:', requestData);
      
      // Call the API
      const response = await createSmartLockRequest(accessToken, requestData);
      
      console.log('API Response:', response);
      
      // Close the modal
      const modal = document.getElementById('smartLockModal');
      if (modal && window.bootstrap) {
        const modalInstance = window.bootstrap.Modal.getInstance(modal);
        if (modalInstance) {
          modalInstance.hide();
        }
      } else if (modal) {
        // Fallback: manually hide if bootstrap instance not found
        modal.classList.remove('show');
        modal.style.display = 'none';
        document.body.classList.remove('modal-open');
        const backdrop = document.querySelector('.modal-backdrop');
        if (backdrop) {
          backdrop.remove();
        }
      }
      
      // Show success message
      const successMessage = response.data?.[0]?.message || 'Your smart lock request has been submitted successfully.';
      await Swal.fire({
        icon: 'success',
        title: 'Request Submitted',
        text: successMessage,
      });
      
      // Reset form
      setLockRequestData({
        property_id: properties.length > 0 ? properties[0].id : null,
        date: '',
        time_from: '10:00',
        time_to: '12:00',
        price: 0,
        card_number: '',
        expiry_date: '',
        cvv: ''
      });
      setSelectedPaymentMethod(null);
      
    } catch (err) {
      console.error('Error submitting request:', err);
      
      // Check if the error response is actually a success
      if (err.response?.data?.status === 1) {
        // Close the modal
        const modal = document.getElementById('smartLockModal');
        if (modal && window.bootstrap) {
          const modalInstance = window.bootstrap.Modal.getInstance(modal);
          if (modalInstance) {
            modalInstance.hide();
          }
        } else if (modal) {
          // Fallback: manually hide if bootstrap instance not found
          modal.classList.remove('show');
          modal.style.display = 'none';
          document.body.classList.remove('modal-open');
          const backdrop = document.querySelector('.modal-backdrop');
          if (backdrop) {
            backdrop.remove();
          }
        }
        
        // Show success message
        const successMessage = err.response.data.data?.[0]?.message || 'Your smart lock request has been submitted successfully.';
        await Swal.fire({
          icon: 'success',
          title: 'Request Submitted',
          text: successMessage,
        });
        
        // Reset form
        setLockRequestData({
          property_id: properties.length > 0 ? properties[0].id : null,
          date: '',
          time_from: '10:00',
          time_to: '12:00',
          price: 0,
          card_number: '',
          expiry_date: '',
          cvv: ''
        });
        setSelectedPaymentMethod(null);
        return;
      }
      
      let errorMessage = 'Failed to submit request. Please try again.';
      
      if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.response?.data?.errors) {
        const errors = err.response.data.errors;
        errorMessage = Object.values(errors).flat().join(', ');
      }
      
      Swal.fire({
        icon: 'error',
        title: 'Error',
        html: `<pre style="text-align: left; font-size: 0.9em;">${JSON.stringify(err.response?.data || err.message, null, 2)}</pre>`,
        width: '600px'
      });
    }
  };

  // Handle initial property selection
  const handleInitialPropertySelect = (property) => {
    setSelectedProperty(property);
    setLockRequestData(prev => ({ ...prev, property_id: property.id }));
  };

  return (
    <section>
      <ToastContainer />
      <ClientHeader title="Smart checkin / checkout" onMobileMenuClick={onMobileMenuClick} />

      <div className="dashboard-home-content px-3 mt-2">
        <div className="d-flex justify-content-between align-items-center flex-wrap mt-3">
          <h2 className="mb-0 dashboard-title">Address</h2>
          <button 
            type="button" 
            className="sec-btn rounded-2 py-2 px-3 d-flex align-items-center gap-2"
            data-bs-toggle="modal"
            data-bs-target="#smartLockModal"
          >
            <img src="/assets/key.svg" alt="key" />
            <span>Request a smart lock</span>
          </button>
        </div>
        
        {/* Properties Slider */}
        {isLoading ? (
          <div className="text-center py-4">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : properties.length === 0 ? (
          <div className="text-center py-4">
            <p className="text-muted">No properties found.</p>
          </div>
        ) : (
          <div className="position-relative mt-3">
            {properties.length > 5 && (
              <button 
                className="property-nav-btn property-nav-left"
                onClick={() => {
                  const container = document.getElementById('propertiesSlider');
                  if (container) container.scrollBy({ left: -200, behavior: 'smooth' });
                }}
              >
                <FontAwesomeIcon icon={faChevronLeft} />
              </button>
            )}
            
            <div 
              id="propertiesSlider"
              className="d-flex gap-3 overflow-auto pb-2"
              style={{ scrollBehavior: 'smooth', scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {properties.map((prop) => (
                <div 
                  key={prop.id} 
                  className="text-center flex-shrink-0"
                  style={{ width: '120px', cursor: 'pointer' }}
                  onClick={() => handleInitialPropertySelect(prop)}
                >
                  <div className={`bg-light-gray smart-gray p-3 rounded-3 mb-2 ${selectedProperty?.id === prop.id ? 'active' : ''}`}>
                    <img 
                      src={prop.image || '/assets/smart-door.png'} 
                      className='img-fluid w-100' 
                      alt={prop.name}
                      style={{ height: '70px', objectFit: 'contain' }}
                      onError={(e) => { e.target.src = '/assets/smart-door.png'; }}
                    />
                  </div>
                  <h6 className='m-0 small text-truncate'>{prop.name || prop.address || 'Property'}</h6>
                </div>
              ))}
            </div>
            
            {properties.length > 5 && (
              <button 
                className="property-nav-btn property-nav-right"
                onClick={() => {
                  const container = document.getElementById('propertiesSlider');
                  if (container) container.scrollBy({ left: 200, behavior: 'smooth' });
                }}
              >
                <FontAwesomeIcon icon={faChevronRight} />
              </button>
            )}
          </div>
        )}



        <div className="row mt-3 w-100 g-0">
          <div className='col-md-2 mb-3 col-20-per'>
            <div className="d-flex align-items-start flex-column p-2 rounded-3 bg-light-gray-2">
              <h5 className='qr-title m-0 mb-1'>QR code</h5>
              {selectedProperty ? (
                <div ref={qrCodeRef} className="d-flex justify-content-center w-100">
                  <QRCodeCanvas 
                    value={`${window.location.origin}/scan-handler/${selectedProperty.id}`}
                    size={120}
                    level="H"
                    includeMargin={true}
                  />
                </div>
              ) : (
                <p className="text-muted m-0">Select a property to generate QR code</p>
              )}
            </div>
          </div>
          <div className='col-md-2 mb-3 col-20-per'></div>
          <div className='col-md-2 mb-3 col-20-per'></div>
          <div className='col-md-2 mb-3 col-20-per px-2'>
            <div className="d-flex align-items-start flex-column p-2 rounded-3 bg-light-gray active mx-auto">
              <h5 className='qr-title m-0 mb-1'>Lock battery status</h5>
              <div className="edit-btn w-100 py-2 text-center">Low</div>
            </div>
          </div>
          <div className='col-md-2 mb-3 col-20-per px-2'>
            <div className="d-flex align-items-start flex-column p-2 rounded-3 bg-light-gray active mx-auto">
              <h5 className='qr-title m-0 mb-1'>Lock status</h5>
              <div className="edit-btn w-100 py-2 text-center">Open</div>
            </div>
          </div>
        </div>
        <h5 className='qr-title m-0 mb-1'>Generate temp access code</h5>
        <button
          className="sec-btn rounded-2 px-4 py-2 w-50-100"
          data-bs-toggle="modal"
          data-bs-target="#tempAccessModal"
        >
          Temp access code
        </button>

        <div className="d-flex gap-1 align-items-center flex-wrap flex-lg-nowrap my-3">
          <div className="row package-filter align-items-center py-2 px-0 m-0 w-100">
            <div className="col-md-2 col-20-per">
              <button 
                className={`rounded-2 border-0 px-2 py-2 w-100 ${historyTab === 'checkin' && !messageTab ? 'sec-btn' : 'package-filter-item'}`}
                onClick={() => handleHistoryTabChange('checkin')}
              >
                Checkin history
              </button>
            </div>
            <div className="col-md-2 col-20-per">
              <button 
                className={`rounded-2 border-0 px-2 py-2 w-100 ${historyTab === 'checkout' && !messageTab ? 'sec-btn' : 'package-filter-item'}`}
                onClick={() => handleHistoryTabChange('checkout')}
                style={{ cursor: 'pointer' }}
              >
                checkout history
              </button>
            </div>
            <div className="col-md-2 col-20-per">
              <button 
                className={`rounded-2 border-0 px-2 py-2 w-100 ${messageTab === 'welcoming' ? 'sec-btn' : 'package-filter-item'}`}
                onClick={() => handleMessageTabChange('welcoming')}
                style={{ cursor: 'pointer' }}
              >
                Welcoming message
              </button>
            </div>
            <div className="col-md-2 col-20-per">
              <button 
                className={`rounded-2 border-0 px-2 py-2 w-100 ${messageTab === 'checkout_msg' ? 'sec-btn' : 'package-filter-item'}`}
                onClick={() => handleMessageTabChange('checkout_msg')}
                style={{ cursor: 'pointer' }}
              >
                Checkout message
              </button>
            </div>
            <div className="col-md-2 col-20-per">
              <button 
                className={`rounded-2 border-0 px-2 py-2 w-100 ${messageTab === 'property_rules' ? 'sec-btn' : 'package-filter-item'}`}
                onClick={() => handleMessageTabChange('property_rules')}
                style={{ cursor: 'pointer' }}
              >
                Property rules
              </button>
            </div>
          </div>
          <button
            className="main-btn rounded-2 px-2 py-2 d-flex gap-1 align-items-center text-nowrap w-50-100 justify-content-center"
            data-bs-toggle="modal"
            data-bs-target="#propertyQrModal"
          >
            <img src="/assets/scan-barcode.svg" alt="barcode" />
            <span>Property QR code</span>
          </button>
        </div>
        
        {historyLoading ? (
          <div className="text-center mt-4 mb-4">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : historyTab === 'checkin' || historyTab === 'checkout' ? (
          historyData.length === 0 ? (
            <div className="text-center mt-4 mb-4">
              <p className="text-muted">No {historyTab} history found for this property.</p>
            </div>
          ) : (
            <div className="card p-2 rounded-4">
              {historyData.map((item) => (
                <div key={item.id} className='bg-light-gray p-3 mb-3 rounded-4 d-flex align-items-center gap-4 flex-wrap'>
                  <div className="d-flex align-items-center gap-2 m-0">
                    <img src="/assets/dashboard-card-icon-15.svg" className='img-fluid smart-icon' alt="icon" />
                    <h6 className='smart-title m-0'>Code {item.code}</h6>
                  </div>
                  <div>
                    <h6 className="dashboard-home-card-2-desc-1">
                      {historyTab === 'checkin' ? 'Checkin' : 'Checkout'} with access code {item.code}
                    </h6>
                    <div className="d-flex align-items-center gap-1">
                      <div className="d-flex align-items-center gap-1">
                        <img src="/assets/dashboard-card-icon-8.svg" className='smart-icon-2' alt="icon" />
                        <p className="dashboard-home-card-2-desc-3 m-0">{item.created_at}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )
        ) : messageTab === 'property_rules' ? (
          <div className="card p-4 rounded-4 mt-4">
            <h5 className="dashboard-title mb-3">Property Rules</h5>
            <div className="mb-3">
              <label htmlFor="propertyRule" className="form-label mb-1">Property Rule</label>
              <textarea
                id="propertyRule"
                name="property_rule"
                rows="6"
                className="form-control rounded-2 py-2 w-100"
                placeholder="Enter property rules here..."
                value={propertyRule}
                onChange={(e) => setPropertyRule(e.target.value)}
              ></textarea>
            </div>
            <button
              onClick={handlePropertyRuleSubmit}
              disabled={submitLoading}
              className="sec-btn rounded-2 px-5 py-2 border-0"
            >
              {submitLoading ? 'Submitting...' : 'Submit Rule'}
            </button>
          </div>
        ) : messageTab === 'welcoming' ? (
          <div className="card p-4 rounded-4 mt-4">
            <h5 className="dashboard-title mb-3">Welcoming Message</h5>
            <div className="mb-3">
              <label htmlFor="welcomingMessage" className="form-label mb-1">Welcoming Message</label>
              <textarea
                id="welcomingMessage"
                name="welcoming_message"
                rows="6"
                className="form-control rounded-2 py-2 w-100"
                placeholder="Enter welcoming message here..."
                value={welcomingMessage}
                onChange={(e) => setWelcomingMessage(e.target.value)}
              ></textarea>
            </div>
            <button
              onClick={handleWelcomingMessageSubmit}
              className="sec-btn rounded-2 px-5 py-2 border-0"
            >
              Submit Message
            </button>
          </div>
        ) : messageTab === 'checkout_msg' ? (
          <div className="card p-4 rounded-4 mt-4">
            <h5 className="dashboard-title mb-3">Checkout Message</h5>
            <div className="mb-3">
              <label htmlFor="checkoutMessage" className="form-label mb-1">Checkout Message</label>
              <textarea
                id="checkoutMessage"
                name="checkout_message"
                rows="6"
                className="form-control rounded-2 py-2 w-100"
                placeholder="Enter checkout message here..."
                value={checkoutMessage}
                onChange={(e) => setCheckoutMessage(e.target.value)}
              ></textarea>
            </div>
            <button
              onClick={handleCheckoutMessageSubmit}
              className="sec-btn rounded-2 px-5 py-2 border-0"
            >
              Submit Message
            </button>
          </div>
        ) : null}
      </div>

      {/* Temp Access Modal */}
      <div
        className="modal fade"
        id="tempAccessModal"
        tabIndex="-1"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content rounded-4">
            <div className="modal-header border-0">
              <h5 className="m-0 dashboard-title">
                Generate Temporary Access Code
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
              ></button>
            </div>

            <div className="modal-body">
              {/* Property Selection */}
              <div className="mb-3">
                <label className="property-management-card-address fw-bold mb-2">
                  Select Property
                </label>
                <select
                  name="service_id"
                  className="form-select rounded-2 py-2"
                  value={tempAccessData.service_id}
                  onChange={handleTempAccessInputChange}
                >
                  <option value="">Select a property</option>
                  {properties.map((prop) => (
                    <option key={prop.id} value={prop.id}>
                      {prop.name || prop.address || `Property ${prop.id}`}
                    </option>
                  ))}
                </select>
              </div>

              {/* Guest Email */}
              <div className="mb-3">
                <label className="property-management-card-address fw-bold mb-2">
                  Guest E-mail Address
                </label>
                <input
                  type="email"
                  name="guest_email"
                  className="form-control rounded-2 py-2"
                  placeholder="Enter guest email"
                  value={tempAccessData.guest_email}
                  onChange={handleTempAccessInputChange}
                />
              </div>

              {/* Service Type */}
              <div className="mb-3">
                <label className="property-management-card-address fw-bold mb-2">
                  Service Type
                </label>
                <select
                  name="type"
                  className="form-select rounded-2 py-2"
                  value={tempAccessData.type}
                  onChange={handleTempAccessInputChange}
                >
                  <option value="">Select service type</option>
                  <option value="1">Clean</option>
                  <option value="2">Maintenance</option>
                </select>
              </div>
            </div>

            <div className="modal-footer border-0">
              <button
                type="button"
                className="sec-btn rounded-2 px-4 py-2"
                onClick={handleTempAccessSubmit}
                disabled={tempAccessLoading}
              >
                {tempAccessLoading ? 'Sending...' : 'Submit'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Property QR Code Modal */}
      <div
        className="modal fade"
        id="propertyQrModal"
        tabIndex="-1"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content rounded-4 text-center">
            <div className="modal-header border-0 mb-0 pb-0">
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
              ></button>
            </div>

            <div className="modal-body mt-0">
              <h5 className="popup-title">
                QR code
              </h5>
              <p className="dashboard-routes-sub mb-3">
                Make sure there is a direct link or information that can be used by
                users when scanning the token, such as a link to the app's login
                page or a membership ID
              </p>
              <div className="d-flex justify-content-center">
                <div className="modal-badge d-flex gap-2 align-items-center justify-content-center p-2 rounded-2">
                  <span>{selectedProperty?.name || selectedProperty?.address || 'Select Property'}</span>
                  <img src="/assets/scan-barcode-2.svg" alt="" />
                </div>
              </div>
              {selectedProperty ? (
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(
                    `🏠 PROPERTY INFORMATION\n` +
                    `━━━━━━━━━━━━━━━━━━━━━━\n\n` +
                    `📌 Name: ${selectedProperty.name || 'N/A'}\n` +
                    `🏷️ Type: ${selectedProperty.property_type_id?.name || 'N/A'}\n` +
                    `🆔 Property ID: ${selectedProperty.id}\n\n` +
                    `📍 LOCATION\n` +
                    `──────────────────────\n` +
                    `🏘️ Address: ${selectedProperty.address || 'N/A'}\n` +
                    `🌆 City: ${selectedProperty.city || 'N/A'}\n` +
                    `📮 Postal: ${selectedProperty.postal_code || 'N/A'}\n` +
                    `🗺️ Coordinates: ${selectedProperty.lat || 'N/A'}, ${selectedProperty.lng || 'N/A'}\n\n` +
                    `📐 SPECIFICATIONS\n` +
                    `──────────────────────\n` +
                    `📏 Area: ${selectedProperty.area || 0} m²\n` +
                    `🏢 Floors: ${selectedProperty.floor || 0}\n` +
                    `🚪 Rooms: ${selectedProperty.number_room || 0}\n` +
                    `🚿 Bathrooms: ${selectedProperty.number_bathroom || 0}\n\n` +
                    `👤 Co-Host: ${selectedProperty.co_host_id?.name || 'N/A'}\n` +
                    `━━━━━━━━━━━━━━━━━━━━━━\n\n` +
                    `🔐 LOGIN / ACCESS\n` +
                    `──────────────────────\n` +
                    `If you don't have an account:\n` +
                    `👉 ${window.location.origin}/client/login\n\n` +
                    `📱 Property Link:\n` +
                    `${window.location.origin}/property/${selectedProperty.id}`
                  )}`}
                  alt="QR Code"
                  className="img-fluid"
                  style={{ width: '250px' }}
                />
              ) : (
                <img
                  src="/assets/qr-code-2.png"
                  alt="QR Code"
                  className="img-fluid"
                  style={{ width: '250px' }}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Smart Lock Request Modal */}
      <div
        className="modal fade"
        id="smartLockModal"
        tabIndex="-1"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content rounded-4">
            <div className="modal-header border-0">
              <h5 className="m-0 dashboard-title">
                Request a smart lock
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
              ></button>
            </div>

            <div className="modal-body">
              {/* Determine the property */}
              <div className="mb-3">
                <label className="property-management-card-title mb-2">
                  Determine the property
                </label>
                <div className="position-relative">
                  {properties.length > 3 && (
                    <button 
                      className="property-scroll-btn property-scroll-left"
                      onClick={scrollLeft}
                      aria-label="Scroll left"
                    >
                      <FontAwesomeIcon icon={faChevronLeft} />
                    </button>
                  )}
                  
                  <div 
                    className="property-scroll-container d-flex gap-3 pb-2"
                    ref={scrollContainerRef}
                  >
                    {properties.length > 0 ? (
                      properties.map((prop) => (
                        <div 
                          key={prop.id} 
                          className="property-card-wrapper"
                          ref={(el) => {
                            if (el) propertyCardsRef.current[prop.id] = el;
                          }}
                        >
                          <div 
                            className={`calendar-card w-100 h-100 ${selectedProperty?.id === prop.id ? 'active' : ''}`} 
                            style={{ cursor: 'pointer' }}
                            onClick={() => handlePropertySelect(prop)}
                          >
                            <div className="d-flex w-100 align-items-center gap-2">
                              <img 
                                src={prop.image} 
                                className='property-management-card-img-2' 
                                alt={prop.name}
                                onError={(e) => {
                                  e.target.src = '/assets/property-management-card-img.png';
                                }}
                              />
                              <div className='d-flex flex-column gap-2 align-items-start'>
                                <div className='villa-badge py-1 px-3 rounded-pill'>
                                  {prop.property_type_id?.name || 'Property'}
                                </div>
                                <div className="d-flex align-items-center">
                                  <img src="/assets/location.svg" className='img-fluid' alt="location" />
                                  <p className="property-management-card-address m-0">{prop.address || 'N/A'}</p>
                                </div>
                              </div>
                            </div>
                            <div className="d-flex gap-1 align-items-center flex-wrap w-100 py-1 rounded-1 mt-2">
                              <div className="d-flex align-items-center gap-1">
                                <img src="/assets/property-card-icon-1.svg" className='img-fluid' alt="floors" />
                                <h6 className="property-management-card-icon-label m-0">{prop.floor || 0} floors</h6>
                              </div>
                              <div className='card-border-right'>|</div>
                              <div className="d-flex align-items-center gap-1">
                                <img src="/assets/property-card-icon-2.svg" className='img-fluid' alt="rooms" />
                                <h6 className="property-management-card-icon-label m-0">{prop.number_room || 0} rooms</h6>
                              </div>
                              <div className='card-border-right'>|</div>
                              <div className="d-flex align-items-center gap-1">
                                <img src="/assets/property-card-icon-3.svg" className='img-fluid' alt="area" />
                                <h6 className="property-management-card-icon-label m-0">{prop.area || 0} m</h6>
                              </div>
                              <div className='card-border-right'>|</div>
                              <div className="d-flex align-items-center gap-1">
                                <img src="/assets/property-card-icon-4.svg" className='img-fluid' alt="bathrooms" />
                                <h6 className="property-management-card-icon-label m-0">{prop.number_bathroom || 0} bathrooms</h6>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="col-12 text-center py-4">
                        <p className="text-muted">No properties available. Please add a property first.</p>
                      </div>
                    )}
                  </div>
                  
                  {properties.length > 3 && (
                    <button 
                      className="property-scroll-btn property-scroll-right"
                      onClick={scrollRight}
                      aria-label="Scroll right"
                    >
                      <FontAwesomeIcon icon={faChevronRight} />
                    </button>
                  )}
                </div>
              </div>

              {/* Date */}
              <div className="mb-3">
                <label className="property-management-card-title mb-2">Date</label>
                <input
                  type="date"
                  className="form-control rounded-2 py-2"
                  name="date"
                  value={lockRequestData.date}
                  onChange={handleInputChange}
                />
              </div>

              {/* Time From and Time To */}
              <div className="mb-3">
                <div className="row g-2">
                  <div className="col-md-6">
                    <label className="property-management-card-title mb-2">Time From</label>
                    <input
                      type="time"
                      className="form-control rounded-2 py-2"
                      name="time_from"
                      value={lockRequestData.time_from}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="property-management-card-title mb-2">Time To</label>
                    <input
                      type="time"
                      className="form-control rounded-2 py-2"
                      name="time_to"
                      value={lockRequestData.time_to}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </div>


              {/* Total cost */}
              <div className="mb-3">
                <label className="property-management-card-title mb-2">Total cost</label>
                <div className='hours-badge-2 d-flex py-2 px-3 rounded-3 align-items-center justify-content-center'>
                  <h2 className='m-0'>{risePrice} $</h2>
                </div>
              </div>

              {/* Payment method */}
              <div className="mb-3">
                <label className="property-management-card-title mb-2">Payment method</label>
                <div className="payment-methods d-flex gap-2 align-items-center">
                  <div 
                    className={`payment-method-card p-2 rounded-2 ${selectedPaymentMethod === 'card1' ? 'active' : ''}`}
                    onClick={() => handlePaymentMethodClick('card1')}
                  >
                    <img src="/assets/payment-card-img-1.png" className='img-fluid w-100' alt="payment" />
                  </div>
                  <div 
                    className={`payment-method-card p-2 rounded-2 ${selectedPaymentMethod === 'card2' ? 'active' : ''}`}
                    onClick={() => handlePaymentMethodClick('card2')}
                  >
                    <img src="/assets/payment-card-img-2.png" className='img-fluid w-100' alt="payment" />
                  </div>
                  <div 
                    className={`payment-method-card p-2 rounded-2 ${selectedPaymentMethod === 'card3' ? 'active' : ''}`}
                    onClick={() => handlePaymentMethodClick('card3')}
                  >
                    <img src="/assets/payment-card-img-3.svg" className='img-fluid w-100' alt="payment" />
                  </div>
                  <div 
                    className={`payment-method-card p-2 rounded-2 ${selectedPaymentMethod === 'card4' ? 'active' : ''}`}
                    onClick={() => handlePaymentMethodClick('card4')}
                  >
                    <img src="/assets/payment-card-img-4.svg" className='img-fluid w-100' alt="payment" />
                  </div>
                </div>
              </div>

              {/* Card number */}
              <div className="mb-3">
                <label className="property-management-card-title mb-2">Card number</label>
                <div className="input-with-icon">
                  <img src="/assets/pay-card-icon-1.svg" className="input-icon" alt="" />
                  <input
                    type="text"
                    className="form-control rounded-2 py-2 px-3 ps-5 w-100"
                    name="card_number"
                    value={lockRequestData.card_number}
                    onChange={handleInputChange}
                    placeholder="1234 5678 4321 5678"
                  />
                </div>
              </div>

              {/* Completion date and CVV */}
              <div className="row g-2 mb-3">
                <div className="col-6">
                  <label className="property-management-card-title mb-2">Completion date</label>
                  <div className="input-with-icon">
                    <img src="/assets/pay-card-icon-2.svg" className="input-icon" alt="" />
                    <input
                      type="text"
                      className="form-control rounded-2 py-2 px-3 ps-5 w-100"
                      name="expiry_date"
                      value={lockRequestData.expiry_date}
                      onChange={handleInputChange}
                      placeholder="12/28"
                    />
                  </div>
                </div>
                <div className="col-6">
                  <label className="property-management-card-title mb-2">Code</label>
                  <div className="input-with-icon">
                    <img src="/assets/pay-card-icon-3.svg" className="input-icon" alt="" />
                    <input
                      type="text"
                      className="form-control rounded-2 py-2 px-3 ps-5 w-100"
                      name="cvv"
                      value={lockRequestData.cvv}
                      onChange={handleInputChange}
                      placeholder="CVV"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="modal-footer border-0">
              <button
                type="button"
                className="sec-btn rounded-2 px-4 py-2"
                onClick={handleSubmit}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .property-scroll-container {
          overflow-x: auto;
          scroll-behavior: smooth;
          -webkit-overflow-scrolling: touch;
          scrollbar-width: thin;
          scrollbar-color: #ccc #f1f1f1;
        }
        
        .property-scroll-container::-webkit-scrollbar {
          height: 8px;
        }
        
        .property-scroll-container::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        
        .property-scroll-container::-webkit-scrollbar-thumb {
          background: #ccc;
          border-radius: 10px;
        }
        
        .property-scroll-container::-webkit-scrollbar-thumb:hover {
          background: #999;
        }
        
        .property-card-wrapper {
          min-width: 350px;
          max-width: 350px;
          margin:10px 0;
          flex-shrink: 0;
        }
        
        .property-scroll-btn {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          background: white;
          border: 1px solid #ddd;
          border-radius: 50%;
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 10;
          box-shadow: 0 2px 5px rgba(0,0,0,0.1);
          cursor: pointer;
          transition: all 0.3s ease;
        }
        
        .property-scroll-btn:hover {
          background: #f8f9fa;
        }
        
        .property-scroll-left {
          left: 0px;
        }
        
        .property-scroll-right {
          right: 0px;
        }

        .payment-method-card {
          cursor: pointer;
          transition: all 0.3s ease;
        }
        
        
        .input-with-icon {
          position: relative;
        }
        
        .input-icon {
          position: absolute;
          left: 10px;
          top: 50%;
          transform: translateY(-50%);
          width: 20px;
          height: 20px;
        }

        @media (max-width: 768px) {
          .property-card-wrapper {
            min-width: 280px;
            max-width: 280px;
          }
          
          .property-scroll-btn {
            width: 35px;
            height: 35px;
          }
          
          .property-scroll-left {
            left: -10px;
          }
          
          .property-scroll-right {
            right: -10px;
          }
        }
        
        /* Properties Slider Styles */
        .property-nav-btn {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          z-index: 10;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          border: 1px solid #ddd;
          background: white;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        
        .property-nav-left {
          left: -16px;
        }
        
        .property-nav-right {
          right: -16px;
        }
        
        .smart-gray.active {
          border: 2px solid #f7941d;
        }
        
        #propertiesSlider::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
};

export default DashboardSmartCheckMain;
