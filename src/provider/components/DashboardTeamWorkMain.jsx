import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { getTeam, getPendingTeam, getSupervisorProviderCalendar, upgradeUser } from '../../api/superviserTeamApi';
import { reselectCleanService } from '../../api/superviserCleaningApi';
import { reselectMaintenanceService } from '../../api/superviserMaintenanceApi';
import { useSelector } from 'react-redux';
import ProviderHeader from './ProviderHeader';
import Swal from 'sweetalert2';

const DashboardTeamWorkMain = ({ onMobileMenuClick }) => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  // Check if in selection mode
  const isSelectionMode = searchParams.get('select') === 'true';
  const serviceId = searchParams.get('service_id');
  const serviceType = searchParams.get('type'); // 'cleaning' or 'maintenance'
  
  const { token: accessToken } = useSelector((state) => state.auth);
  const [teamData, setTeamData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMember, setSelectedMember] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showAvailabilityModal, setShowAvailabilityModal] = useState(false);
  const [availabilityData, setAvailabilityData] = useState([]);
  const [availabilityLoading, setAvailabilityLoading] = useState(false);
  const [currentWeekStart, setCurrentWeekStart] = useState(new Date());
  const [pendingRequestsCount, setPendingRequestsCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [isUpgrading, setIsUpgrading] = useState(false);
  const [isAssigning, setIsAssigning] = useState(false);

  // Fetch team data and pending requests count and pending requests count
  useEffect(() => {
    const fetchTeam = async () => {
      if (!accessToken) return;
      try {
        setLoading(true);
        const response = await getTeam(accessToken);
        if (response.status === 1 && response.data?.[0]?.items) {
          setTeamData(response.data[0].items);
        }
      } catch (error) {
        console.error('Failed to fetch team:', error);
      } finally {
        setLoading(false);
      }
    };

    const fetchPendingCount = async () => {
      if (!accessToken) return;
      try {
        const response = await getPendingTeam(accessToken);
        if (response.status === 1 && response.data?.[0]?.items) {
          setPendingRequestsCount(response.data[0].items.length);
        }
      } catch (error) {
        console.error('Failed to fetch pending count:', error);
      }
    };

    fetchTeam();
    fetchPendingCount();
  }, [accessToken]);

  const handleViewProfile = (member) => {
    // Use the member data directly instead of fetching from API
    setSelectedMember(member);
    setShowModal(true);
  };

  const handleViewAvailability = async (member) => {
    try {
      setAvailabilityLoading(true);
      setSelectedMember(member);
      setShowAvailabilityModal(true);
      
      const response = await getSupervisorProviderCalendar(accessToken, member.user?.id || member.id);
      if (response.status === 1 && response.data?.[0]) {
        // Handle nested array structure: data: [[ {...}, {...} ]]
        const data = Array.isArray(response.data[0]) ? response.data[0] : response.data;
        setAvailabilityData(Array.isArray(data) ? data : []);
      } else {
        setAvailabilityData([]);
      }
    } catch (error) {
      console.error('Failed to fetch availability:', error);
      setAvailabilityData([]);
    } finally {
      setAvailabilityLoading(false);
    }
  };

  // Calendar helper functions
  const getWeekDays = (startDate) => {
    const days = [];
    const start = new Date(startDate);
    start.setDate(start.getDate() - start.getDay()); // Start from Sunday
    
    for (let i = 0; i < 7; i++) {
      const day = new Date(start);
      day.setDate(start.getDate() + i);
      days.push(day);
    }
    return days;
  };

  const formatDate = (date) => {
    return date.toISOString().split('T')[0];
  };

  const getDayName = (date) => {
    return date.toLocaleDateString('en-US', { weekday: 'long' });
  };

  const formatDisplayDate = (date) => {
    return date.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit' });
  };

  const timeSlots = ['08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00'];

  const getAvailabilityForSlot = (date, timeSlot) => {
    const dateStr = formatDate(date);
    const slotHour = parseInt(timeSlot.split(':')[0]);
    
    return availabilityData.find(item => {
      if (item.date !== dateStr) return false;
      const fromHour = parseInt(item.time_from.split(':')[0]);
      const toHour = parseInt(item.time_to.split(':')[0]);
      return slotHour >= fromHour && slotHour < toHour;
    });
  };

  const getReservationsCount = (date) => {
    const dateStr = formatDate(date);
    return availabilityData.filter(item => item.date === dateStr).length;
  };

  const navigateWeek = (direction) => {
    const newStart = new Date(currentWeekStart);
    newStart.setDate(newStart.getDate() + (direction * 7));
    setCurrentWeekStart(newStart);
  };

  const goToToday = () => {
    setCurrentWeekStart(new Date());
  };

  const weekDays = getWeekDays(currentWeekStart);

  // Filter team data based on search query
  const filteredTeamData = teamData.filter((item) => {
    if (!searchQuery.trim()) return true;
    const term = searchQuery.toLowerCase();
    const fullName = `${item.first_name || ''} ${item.last_name || ''}`.toLowerCase();
    const email = (item.email || '').toLowerCase();
    const phone = (item.phone || '').toLowerCase();
    const company = (item.company || '').toLowerCase();
    return fullName.includes(term) || email.includes(term) || phone.includes(term) || company.includes(term);
  });

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Handle team member selection for reselect (assigning service to provider)
  const handleSelectMember = async (member) => {
    if (!isSelectionMode || !serviceId) return;

    const providerId = member.user?.id || member.id;
    const memberName = `${member.first_name || ''} ${member.last_name || ''}`.trim();

    const result = await Swal.fire({
      title: 'Assign Service',
      text: `Are you sure you want to assign this service to ${memberName}?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#f7941d',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Yes, assign',
      cancelButtonText: 'Cancel'
    });

    if (!result.isConfirmed) return;

    try {
      setIsAssigning(true);
      let response;

      if (serviceType === 'cleaning') {
        response = await reselectCleanService(accessToken, providerId, serviceId);
      } else if (serviceType === 'maintenance') {
        response = await reselectMaintenanceService(accessToken, providerId, serviceId);
      }

      if (response?.status === 1) {
        await Swal.fire({
          icon: 'success',
          title: 'Success',
          text: response?.message || 'Service assigned successfully!',
        });
        // Navigate back to the appropriate page
        if (serviceType === 'cleaning') {
          navigate('/supervisor/cleaning-request');
        } else {
          navigate('/supervisor/maintenance-request');
        }
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Failed',
          text: response?.message || 'Failed to assign service',
        });
      }
    } catch (error) {
      console.error('Error assigning service:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error?.message || 'Failed to assign service',
      });
    } finally {
      setIsAssigning(false);
    }
  };

  // Upgrade user function
  const handleUpgradeUser = async (userId) => {
    if (!accessToken) {
      Swal.fire({
        icon: 'error',
        title: 'Authentication Required',
        text: 'Please login to continue',
      });
      return;
    }

    const result = await Swal.fire({
      title: 'Upgrade User',
      text: 'Are you sure you want to upgrade this user?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#f7941d',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Yes, upgrade',
      cancelButtonText: 'Cancel'
    });

    if (!result.isConfirmed) return;

    try {
      setIsUpgrading(true);
      const response = await upgradeUser(accessToken, userId);

      if (response?.status === 1) {
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: response?.message || 'User upgraded successfully!',
        });
        setShowModal(false);
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Failed',
          text: response?.message || 'Failed to upgrade user',
        });
      }
    } catch (error) {
      console.error('Error upgrading user:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.response?.data?.message || 'Failed to upgrade user',
      });
    } finally {
      setIsUpgrading(false);
    }
  };




  return (
    <section>
      <ProviderHeader title={isSelectionMode ? "Select Team Member" : "Work team"} onMobileMenuClick={onMobileMenuClick} />
      <div className="dashboard-home-content px-3 mt-2">
        {/* Selection Mode Header */}
        {isSelectionMode && (
          <div className="alert alert-info d-flex align-items-center justify-content-between mb-3 rounded-3">
            <div>
              <strong>Selection Mode:</strong> Choose a team member to assign the {serviceType} service
            </div>
            <button 
              className="btn btn-outline-secondary btn-sm"
              onClick={() => navigate(-1)}
            >
              Cancel
            </button>
          </div>
        )}
        
        <div className="d-flex justify-content-between align-items-center">
        <div className="search-input-wrapper mb-3 mt-2">
          <SearchOutlinedIcon className="search-icon" />
          <input
            type="text"
            className="search-gray-input form-control"
            placeholder="Search for a worker"
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </div>
          {!isSelectionMode && (
          <div className="d-flex gap-2 align-items-center flex-wrap">
            <Link to='/supervisor/team-work-requests' className='text-decoration-none'>
                      <button
  className="main-btn rounded-2 px-4 d-flex gap-1 align-items-center py-2 w-50-100"
>
 Team  requests
 {pendingRequestsCount > 0 && (
   <span 
     style={{
       backgroundColor: '#ff4d4d',
       color: '#fff',
       borderRadius: '50px',
       padding: '2px 8px',
       fontSize: '12px',
       fontWeight: 'bold',
       minWidth: '20px',
       textAlign: 'center',
       display: 'inline-flex',
       alignItems: 'center',
       justifyContent: 'center',
       marginLeft: '4px'
     }}
   >
     {pendingRequestsCount}
   </span>
 )}
                        </button>
            </Link>
            <Link to='/supervisor/team-work-add-employee' className='text-decoration-none'>
                      <button 
            type="submit" 
            className="sec-btn rounded-2 py-2 px-3 d-flex align-items-center justify-content-center gap-2 w-50-100"
          >
            <span>Add an employee</span>
                        </button>
            </Link>
          </div>
          )}


        </div>
        <div className="row">
          {loading ? (
            <div className="col-12 text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : filteredTeamData.length > 0 ? (
            filteredTeamData.map((item) => (
              <div className="col-lg-3 col-md-6 mb-3" key={item.id}>
                <div 
                  className={`bg-light-gray p-3 rounded-3 h-100 ${isSelectionMode ? 'selection-card' : ''}`} 
                  style={{cursor: 'pointer'}}
                  onClick={() => isSelectionMode ? handleViewProfile(item) : null}
                >
                  <div className="text-center mb-2">
                    <img 
                      src={item.user?.avatar || "/assets/team-img.png"} 
                      className='rounded-circle' 
                      alt="service" 
                      style={{width: '100px', height: '100px', objectFit: 'cover'}}
                    />
                  </div>
                  <h2 className="mb-0 dashboard-title py-2 text-center">{item.first_name} {item.last_name}</h2>
                  <div className="d-flex align-items-center justify-content-center gap-1">
                    <img src="/assets/flag-2.svg" className='flag-icon' alt="flag" />
                    <h3 className='training-details-card-desc m-0'>{item.company || 'Team Member'}</h3>
                  </div>
                  {isSelectionMode ? (
                    <button
                      className="sec-btn rounded-2 px-4 py-2 w-100 mt-3 d-flex align-items-center justify-content-center gap-2"
                      onClick={(e) => { e.stopPropagation(); handleViewProfile(item); }}
                    >
                      <img src="/assets/user-icon.svg" alt="profile" className="flag-icon" />
                      <span>View Profile</span>
                    </button>
                  ) : (
                  <div className="d-flex align-items-center gap-2 flex-wrap mt-3">
                    <button
                      className="main-btn rounded-2 px-2 d-flex gap-1 align-items-center justify-content-center py-2 flex-grow-1"
                      onClick={(e) => { e.stopPropagation(); handleViewProfile(item); }}
                    >
                      <img src="/assets/user-icon.svg" className='flag-icon' alt="user" />
                      Profile
                    </button>
                    <button
                      className="main-btn rounded-2 px-2 d-flex gap-1 align-items-center justify-content-center py-2 flex-grow-1"
                      onClick={(e) => { e.stopPropagation(); handleViewAvailability(item); }}
                    >
                      <img src="/assets/calendar-tick.svg" className='flag-icon' alt="user" />
                      Availability
                    </button>
                  </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="col-12 text-center py-5">No team members found</div>
          )}
        </div>

        {/* Profile Modal */}
        {showModal && selectedMember && (
          <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} onClick={() => setShowModal(false)}>
            <div className="modal-dialog modal-dialog-centered" style={{maxWidth: '500px'}} onClick={(e) => e.stopPropagation()}>
              <div className="modal-content rounded-4 border-0 shadow">
                <div className="modal-header border-0 pb-0 pt-6 px-3">
                  <h6 className="modal-title fw-bold m-0">Profile</h6>
                  <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                </div>
                <div className="modal-body p-3">
                  {/* Profile Header */}
                  <div className="text-center mb-3 p-3 bg-light-gray rounded-3">
                    <img 
                      src={selectedMember.user?.avatar || "/assets/user.png"} 
                      alt="Avatar" 
                      className="rounded-circle border border-2 border-white shadow-sm" 
                      style={{width: '80px', height: '80px', objectFit: 'cover'}} 
                    />
                    <h6 className="mt-2 mb-1 fw-bold">{selectedMember.first_name} {selectedMember.last_name}</h6>
                    <span className="badge bg-warning text-dark rounded-pill px-3 py-1">
                      {selectedMember.company || 'Team Member'}
                    </span>
                  </div>

                  {/* Profile Details */}
                  <div className="row g-2">
                    <div className="col-6">
                      <div className="p-2 bg-light-gray rounded-3">
                        <small className="text-muted d-block" style={{fontSize: '11px'}}>Email</small>
                        <p className="mb-0 small text-truncate">{selectedMember.email || 'N/A'}</p>
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="p-2 bg-light-gray rounded-3">
                        <small className="text-muted d-block" style={{fontSize: '11px'}}>Phone</small>
                        <p className="mb-0 small">{selectedMember.phone || 'N/A'}</p>
                      </div>
                    </div>
                    {selectedMember.experience && (
                      <div className="col-6">
                        <div className="p-2 bg-light-gray rounded-3">
                          <small className="text-muted d-block" style={{fontSize: '11px'}}>Experience</small>
                          <p className="mb-0 small">{selectedMember.experience} Years</p>
                        </div>
                      </div>
                    )}
                    {selectedMember.start_date && (
                      <div className="col-6">
                        <div className="p-2 bg-light-gray rounded-3">
                          <small className="text-muted d-block" style={{fontSize: '11px'}}>Start Date</small>
                          <p className="mb-0 small">{selectedMember.start_date}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Action Button - Assign in selection mode, Upgrade otherwise */}
                  {isSelectionMode ? (
                    <button
                      className="sec-btn rounded-3 py-2 px-3 w-100 d-flex align-items-center justify-content-center gap-2 mt-3"
                      onClick={() => handleSelectMember(selectedMember)}
                      disabled={isAssigning}
                    >
                      {isAssigning ? (
                        <>
                          <span className="spinner-border spinner-border-sm" role="status"></span>
                          <span>Assigning...</span>
                        </>
                      ) : (
                        <>
                          <img src="/assets/people.svg" alt="assign" style={{width: '16px', height: '16px', filter: 'brightness(0) invert(1)'}} />
                          <span>Assign to this member</span>
                        </>
                      )}
                    </button>
                  ) : (
                    <button
                      className="sec-btn rounded-3 py-2 px-3 w-100 d-flex align-items-center justify-content-center gap-2 mt-3"
                      onClick={() => handleUpgradeUser(selectedMember.user?.id || selectedMember.id)}
                      disabled={isUpgrading}
                    >
                      {isUpgrading ? (
                        <>
                          <span className="spinner-border spinner-border-sm" role="status"></span>
                          <span>Upgrading...</span>
                        </>
                      ) : (
                        <>
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12 19V5M5 12l7-7 7 7"/>
                          </svg>
                          <span>Upgrade User</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Availability Modal */}
        {showAvailabilityModal && selectedMember && (
          <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} onClick={() => setShowAvailabilityModal(false)}>
            <div className="modal-dialog modal-dialog-centered modal-xl" onClick={(e) => e.stopPropagation()}>
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">
                    Availability - {selectedMember.first_name} {selectedMember.last_name}
                  </h5>
                  <button type="button" className="btn-close" onClick={() => setShowAvailabilityModal(false)}></button>
                </div>
                <div className="modal-body">
                  {availabilityLoading ? (
                    <div className="text-center py-5">
                      <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                      </div>
                    </div>
                  ) : (
                    <>
                      {/* Calendar Controls */}
                      <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
                        <div className="d-flex gap-2 p-2 rounded-2 days-filter">
                          <button className="main-btn rounded-2 px-3 py-1" onClick={goToToday}>Today</button>
                          <button className="days-filter-item px-3 py-1" onClick={() => navigateWeek(-1)}>
                            <FontAwesomeIcon icon={faChevronLeft} /> Back
                          </button>
                          <button className="days-filter-item px-3 py-1" onClick={() => navigateWeek(1)}>
                            Next <FontAwesomeIcon icon={faChevronRight} />
                          </button>
                        </div>
                        <h6 className="m-0 date-label">
                          {formatDisplayDate(weekDays[0])} - {formatDisplayDate(weekDays[6])}
                        </h6>
                      </div>

                      {/* Calendar Table */}
                      <div className="calendar-wrapper" style={{overflowX: 'auto'}}>
                        <table className="table calendar-table text-center">
                          <thead>
                            <tr>
                              <th>Time</th>
                              {weekDays.map((day, index) => (
                                <th key={index}>
                                  {getDayName(day)} {formatDisplayDate(day)}
                                  <br />
                                  <small className='fw-bold'>{getReservationsCount(day)} Reservation</small>
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {timeSlots.map((time, timeIndex) => (
                              <tr key={timeIndex}>
                                <td className='table-time'>{parseInt(time.split(':')[0]) > 12 ? `${parseInt(time.split(':')[0]) - 12}:00 PM` : `${time.split(':')[0]}:00 AM`}</td>
                                {weekDays.map((day, dayIndex) => {
                                  const availability = getAvailabilityForSlot(day, time);
                                  return (
                                    <td key={dayIndex}>
                                      {availability && (
                                        <div className={availability.status === 1 ? "third-btn-sm" : "sec-btn-sm h-100"}>
                                          {availability.status === 1 ? 'At work' : 'Available for work'}
                                        </div>
                                      )}
                                    </td>
                                  );
                                })}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      {availabilityData.length === 0 && (
                        <div className="text-center py-3">
                          <p className="text-muted">No availability data found for this team member.</p>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Selection Mode Styles */}
      <style>{`
        .selection-card {
          transition: all 0.3s ease;
          border: 2px solid transparent;
        }
        .selection-card:hover {
          border-color: #f7941d;
          transform: translateY(-5px);
          box-shadow: 0 4px 15px rgba(247, 148, 29, 0.2);
        }
      `}</style>
    </section>
  );
};

export default DashboardTeamWorkMain;