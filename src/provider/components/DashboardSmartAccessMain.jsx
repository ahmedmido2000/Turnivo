import React, { useState, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faBars} from '@fortawesome/free-solid-svg-icons';
import { Person, Settings, Logout } from '@mui/icons-material';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import AddCircleOutlinedIcon from '@mui/icons-material/AddCircleOutlined';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import { getSupervisorSmartLockHistoryCheckin, getSupervisorSmartLockHistoryCheckout } from '../../api/smartLockApi';
import ProviderHeader from './ProviderHeader';

const DashboardSmartAccessMain = ({ onMobileMenuClick }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  
  // Add state to track selected filter
  const [selectedFilter, setSelectedFilter] = useState('checkin');
  const [historyData, setHistoryData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Fetch history data
  useEffect(() => {
    const fetchHistoryData = async () => {
      if (selectedFilter !== 'checkin' && selectedFilter !== 'checkout') {
        return;
      }

      try {
        setIsLoading(true);
        const accessToken = localStorage.getItem('access_token');

        if (!accessToken) {
          Swal.fire({
            icon: 'error',
            title: 'Authentication Required',
            text: 'Please login to continue',
          });
          return;
        }

        let response;
        if (selectedFilter === 'checkin') {
          response = await getSupervisorSmartLockHistoryCheckin(accessToken);
        } else {
          response = await getSupervisorSmartLockHistoryCheckout(accessToken);
        }

        if (response.status === 1 && response.data) {
          const items = response.data?.[0]?.items || [];
          setHistoryData(items);
        } else {
          setHistoryData([]);
        }
      } catch (error) {
        console.error('Error fetching history data:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.message || 'Failed to load history data',
        });
        setHistoryData([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHistoryData();
  }, [selectedFilter]);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleDropdownItemClick = (item) => {
    console.log(`Clicked on ${item}`);
    setIsDropdownOpen(false);
    // Add your navigation logic here
  };
  
  // Function to handle filter selection
  const handleFilterClick = (filter) => {
    setSelectedFilter(filter);
  };

  return (
    <section>
      <ProviderHeader title="Smart Access" onMobileMenuClick={onMobileMenuClick} />
      <div className="dashboard-home-content px-3 mt-2">
        <div className="d-flex justify-content-between align-items-center gap-2 flex-wrap mt-3">
          <h2 className="mb-0 dashboard-title">Address</h2>
          <div className="d-flex gap-2 align-items-center flex-wrap">
                      <button
  className="main-btn rounded-2 px-4 py-2 w-50-100"
  data-bs-toggle="modal"
  data-bs-target="#tempAccessModal"
>
  Temp access code
                        </button>
                      <button 
            type="submit" 
            className="sec-btn rounded-2 py-2 px-3 d-flex align-items-center justify-content-center gap-2 w-50-100"
          >
            <img src="/assets/key.svg" alt="key" />
            <span>Reqest a smart lock</span>
                        </button>
          </div>
        </div>

            <div className="d-flex gap-1 align-items-center flex-wrap flex-lg-nowrap my-3">
              <div className="row package-filter align-items-center py-2 px-0 m-0 w-100">
                <div className="col-md-2 col-20-per">
                  <button 
                    className={`rounded-2 border-0 px-2 py-2 w-100 ${selectedFilter === 'checkin' ? 'sec-btn' : 'package-filter-item'}`}
                    onClick={() => handleFilterClick('checkin')}
                  >
                    Checkin history
                  </button>
                </div>
                <div className="col-md-2 col-20-per">
                  <p 
                    className={`text-center rounded-2 py-2 m-0 ${selectedFilter === 'checkout' ? 'sec-btn' : 'package-filter-item'}`}
                    onClick={() => handleFilterClick('checkout')}
                  >
                    checkout history
                  </p>
                </div>
                <div className="col-md-2 col-20-per">
                  <p 
                    className={`text-center rounded-2 py-2 m-0 ${selectedFilter === 'welcoming' ? 'sec-btn' : 'package-filter-item'}`}
                    onClick={() => handleFilterClick('welcoming')}
                  >
                    Welcoming message
                  </p>
                </div>
                <div className="col-md-2 col-20-per">
                  <p 
                    className={`text-center rounded-2 py-2 m-0 ${selectedFilter === 'checkout-message' ? 'sec-btn' : 'package-filter-item'}`}
                    onClick={() => handleFilterClick('checkout-message')}
                  >
                    Checkout message
                  </p>
                </div>
                <div className="col-md-2 col-20-per">
                  <p 
                    className={`text-center rounded-2 py-2 m-0 ${selectedFilter === 'property-rules' ? 'sec-btn' : 'package-filter-item'}`}
                    onClick={() => handleFilterClick('property-rules')}
                  >
                    Property rules
                  </p>
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
            <div className="card p-2 rounded-4">
              {isLoading ? (
                <div className="text-center py-5">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              ) : (selectedFilter === 'checkin' || selectedFilter === 'checkout') ? (
                historyData.length > 0 ? (
                  historyData.map((item) => (
                    <div key={item.id} className='bg-light-gray p-3 mb-3 rounded-4 d-flex align-items-start gap-4 flex-wrap'>
                      <div className="bg-white p-2 rounded-2 m-0">
                        <h6 className='smart-access-title m-0'>{item.property_id?.name || 'Property'}</h6>
                      </div>
                      <div>
                        <h6 className="dashboard-home-card-2-desc-1 mb-1">
                          Code: {item.code || 'N/A'} {item.type === 1 ? '(Temp)' : '(Smart Lock)'}
                        </h6>
                        <h6 className="dashboard-home-card-2-desc-1 mb-1">
                          User: {item.user?.name || 'N/A'}
                        </h6>
                        <div className="d-flex align-items-center gap-1">
                          <div className="d-flex align-items-center gap-1">
                            <img src="/assets/dashboard-card-icon-8.svg" className='smart-icon-2' alt="icon" />
                            <p className="dashboard-home-card-2-desc-3 m-0">{item.created_at || 'N/A'}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-5">
                    <p className="text-muted">No {selectedFilter} history found</p>
                  </div>
                )
              ) : (
                <>
              <div className='bg-light-gray p-3 mb-3 rounded-4 d-flex align-items-start gap-4 flex-wrap'>
                <div className="bg-white p-2 rounded-2 m-0">
                  <h6 className='smart-access-title m-0'>Upholstery and carpet cleaning</h6>
                </div>
                                            <div>
                                <h6 className="dashboard-home-card-2-desc-1 mb-1">Temp access cod : 22333 at 12:00</h6>
                                <h6 className="dashboard-home-card-2-desc-1 mb-1">smart lock code : 22333 at 12:00</h6>
                                <div className="d-flex align-items-center gap-1">
                                    <div className="d-flex align-items-center gap-1">
                                        <img src="/assets/dashboard-card-icon-8.svg" className='smart-icon-2' alt="icon" />
                                        <p className="dashboard-home-card-2-desc-3 m-0">05 / 03 / 2025</p>
                                    </div>
                                </div>
                            </div>
              </div>
              <div className='bg-light-gray p-3 mb-3 rounded-4 d-flex align-items-start gap-4 flex-wrap'>
                <div className="bg-white p-2 rounded-2 m-0">
                  <h6 className='smart-access-title m-0'>Upholstery and carpet cleaning</h6>
                </div>
                                            <div>
                                <h6 className="dashboard-home-card-2-desc-1 mb-1">Temp access cod : 22333 at 12:00</h6>
                                <h6 className="dashboard-home-card-2-desc-1 mb-1">smart lock code : 22333 at 12:00</h6>
                                <div className="d-flex align-items-center gap-1">
                                    <div className="d-flex align-items-center gap-1">
                                        <img src="/assets/dashboard-card-icon-8.svg" className='smart-icon-2' alt="icon" />
                                        <p className="dashboard-home-card-2-desc-3 m-0">05 / 03 / 2025</p>
                                    </div>
                                </div>
                            </div>
              </div>
              <div className='bg-light-gray p-3 mb-3 rounded-4 d-flex align-items-start gap-4 flex-wrap'>
                <div className="bg-white p-2 rounded-2 m-0">
                  <h6 className='smart-access-title m-0'>Upholstery and carpet cleaning</h6>
                </div>
                                            <div>
                                <h6 className="dashboard-home-card-2-desc-1 mb-1">Temp access cod : 22333 at 12:00</h6>
                                <h6 className="dashboard-home-card-2-desc-1 mb-1">smart lock code : 22333 at 12:00</h6>
                                <div className="d-flex align-items-center gap-1">
                                    <div className="d-flex align-items-center gap-1">
                                        <img src="/assets/dashboard-card-icon-8.svg" className='smart-icon-2' alt="icon" />
                                        <p className="dashboard-home-card-2-desc-3 m-0">05 / 03 / 2025</p>
                                    </div>
                                </div>
                            </div>
              </div>
              <div className='bg-light-gray p-3 mb-3 rounded-4 d-flex align-items-start gap-4 flex-wrap'>
                <div className="bg-white p-2 rounded-2 m-0">
                  <h6 className='smart-access-title m-0'>Upholstery and carpet cleaning</h6>
                </div>
                                            <div>
                                <h6 className="dashboard-home-card-2-desc-1 mb-1">Temp access cod : 22333 at 12:00</h6>
                                <h6 className="dashboard-home-card-2-desc-1 mb-1">smart lock code : 22333 at 12:00</h6>
                                <div className="d-flex align-items-center gap-1">
                                    <div className="d-flex align-items-center gap-1">
                                        <img src="/assets/dashboard-card-icon-8.svg" className='smart-icon-2' alt="icon" />
                                        <p className="dashboard-home-card-2-desc-3 m-0">05 / 03 / 2025</p>
                                    </div>
                                </div>
                            </div>
              </div>
              <div className='bg-light-gray p-3 mb-3 rounded-4 d-flex align-items-start gap-4 flex-wrap'>
                <div className="bg-white p-2 rounded-2 m-0">
                  <h6 className='smart-access-title m-0'>Upholstery and carpet cleaning</h6>
                </div>
                                            <div>
                                <h6 className="dashboard-home-card-2-desc-1 mb-1">Temp access cod : 22333 at 12:00</h6>
                                <h6 className="dashboard-home-card-2-desc-1 mb-1">smart lock code : 22333 at 12:00</h6>
                                <div className="d-flex align-items-center gap-1">
                                    <div className="d-flex align-items-center gap-1">
                                        <img src="/assets/dashboard-card-icon-8.svg" className='smart-icon-2' alt="icon" />
                                        <p className="dashboard-home-card-2-desc-3 m-0">05 / 03 / 2025</p>
                                    </div>
                                </div>
                            </div>
              </div>
              </>
              )}
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
        <div className="">
          <label className="property-management-card-address fw-bold">
            Please enter Guest E-mail address
          </label>
          <input
            type="email"
            className="form-control rounded-2 py-2"
            placeholder="Enter email"
          />
        </div>
      </div>

      <div className="modal-footer border-0">
        <button
          type="button"
          className="sec-btn rounded-2 px-4 py-2"
        >
          Submit
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
            <span>AOSDI12LSD</span>
              <img src="/assets/scan-barcode-2.svg" alt="" />
          </div>

        </div>
        <img
          src="/assets/qr-code-2.png"
          alt="QR Code"
          className="img-fluid"
          style={{ width: '250px' }}
        />
      </div>
    </div>
  </div>
</div>
      </div>

    </section>
  );
};

export default DashboardSmartAccessMain;