import React, { useState, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faBars, faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { Person, Settings, Logout } from '@mui/icons-material';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import AddCircleOutlinedIcon from '@mui/icons-material/AddCircleOutlined';
import {faCalendar} from '@fortawesome/free-regular-svg-icons'
import {faUser} from '@fortawesome/free-regular-svg-icons'
import { Link } from 'react-router-dom';
import { getUserCalendar } from '../../api/superviserTeamApi';
import { useSelector } from 'react-redux';
import ProviderHeader from './ProviderHeader';


const DashboardProviderCalendarMain = ({ onMobileMenuClick }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { token: accessToken } = useSelector((state) => state.auth);
  
  // Calendar state
  const [calendarData, setCalendarData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentWeekStart, setCurrentWeekStart] = useState(new Date());
  const [viewMode, setViewMode] = useState('week'); // 'month', 'week', 'day'

  // Fetch calendar data
  useEffect(() => {
    const fetchCalendar = async () => {
      if (!accessToken) return;
      try {
        setLoading(true);
        const response = await getUserCalendar(accessToken);
        console.log('Calendar API Response:', response);
        
        if (response.status === 1 && response.data) {
          // Handle nested array structure: data[0][0] or data[0]
          let calendarItems = [];
          if (Array.isArray(response.data[0])) {
            calendarItems = response.data[0];
          } else {
            calendarItems = response.data;
          }
          
          console.log('Calendar Items:', calendarItems);
          setCalendarData(calendarItems);
          
          // Set initial week to first available date if data exists
          if (calendarItems.length > 0) {
            const firstDate = new Date(calendarItems[0].date);
            setCurrentWeekStart(firstDate);
          }
        } else {
          setCalendarData([]);
        }
      } catch (error) {
        console.error('Failed to fetch calendar:', error);
        setCalendarData([]);
      } finally {
        setLoading(false);
      }
    };
    fetchCalendar();
  }, [accessToken]);

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
    
    // Find all matching items for this date and time
    const matchingItems = calendarData.filter(item => {
      if (item.date !== dateStr) return false;
      const fromHour = parseInt(item.time_from.split(':')[0]);
      const toHour = parseInt(item.time_to.split(':')[0]);
      
      // Check if slot falls within the time range
      return slotHour >= fromHour && slotHour < toHour;
    });
    
    // Return the first matching item (could be enhanced to show multiple)
    return matchingItems.length > 0 ? matchingItems[0] : null;
  };

  const getReservationsCount = (date) => {
    const dateStr = formatDate(date);
    const dayItems = calendarData.filter(item => item.date === dateStr);
    // Count unique users for this date
    const uniqueUsers = new Set(dayItems.map(item => item.user?.id));
    return uniqueUsers.size;
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

  const formatTimeDisplay = (time) => {
    const hour = parseInt(time.split(':')[0]);
    if (hour === 12) return '12:00 PM';
    if (hour > 12) return `${hour - 12}:00 PM`;
    return `${hour}:00 AM`;
  };
  
  // Add state to track selected order type

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

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleDropdownItemClick = (item) => {
    console.log(`Clicked on ${item}`);
    setIsDropdownOpen(false);
    // Add your navigation logic here
  };


  return (
    <section>
      <ProviderHeader title="Calendar & Availability" onMobileMenuClick={onMobileMenuClick} />
      <div className="dashboard-home-content px-3 mt-2">
        <div className="d-flex">
              <div className="d-flex package-filter align-items-center py-1 px-1 m-0 w-auto mb-2">
                  <button 
                    className={`rounded-2 border-0 px-2 py-2 sec-btn d-flex align-items-center gap-1`}
                  >
                    <FontAwesomeIcon icon={faCalendar} />
                   Calendar
                  </button>
                  <Link to='/supervisor/availability' 
                    className={`rounded-2 text-decoration-none border-0 px-2 py-2 days-filter-item d-flex align-items-center gap-1`}
                  >
                    <FontAwesomeIcon icon={faUser} />
                    Profile
                  </Link>
              </div>

        </div>
        <h6 className="dashboard-routes-sub m-0">Calendar</h6>
                        {/* Top Controls */}
            <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3 mt-2">
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
                {formatDisplayDate(weekDays[0])} - {formatDisplayDate(weekDays[6])} {weekDays[0].getFullYear()}
              </h6>

              <div className="d-flex gap-2 p-2 rounded-2 times-filter">
                <button 
                  className={viewMode === 'month' ? "main-btn rounded-2 px-3 py-1" : "times-filter-item px-3 py-1"}
                  onClick={() => setViewMode('month')}
                >
                  Month
                </button>
                <button 
                  className={viewMode === 'week' ? "main-btn rounded-2 px-3 py-1" : "times-filter-item px-3 py-1"}
                  onClick={() => setViewMode('week')}
                >
                  Week
                </button>
                <button 
                  className={viewMode === 'day' ? "main-btn rounded-2 px-3 py-1" : "times-filter-item px-3 py-1"}
                  onClick={() => setViewMode('day')}
                >
                  Day
                </button>
              </div>
            </div>

            {/* Loading State */}
            {loading ? (
              <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            ) : (
              <>
                {/* Calendar Table */}
                <div className="calendar-wrapper">
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
                          <td className='table-time'>{formatTimeDisplay(time)}</td>
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

                {calendarData.length === 0 && (
                  <div className="text-center py-3">
                    <p className="text-muted">No calendar data available.</p>
                  </div>
                )}
              </>
            )}

      </div>
    </section>
  );
};

export default DashboardProviderCalendarMain;