import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendar } from '@fortawesome/free-regular-svg-icons';
import { faUser } from '@fortawesome/free-regular-svg-icons';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import { getCleanerCalendar, addProviderTime } from '../../api/cleanerCalenderApi';
import { selectAccessToken } from '../../store/authSlice';
import CleanerHeader from './CleanerHeader';


const CleanerCalendarMain = ({ onMobileMenuClick }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [calendarData, setCalendarData] = useState([]);
  const [showAddTimeModal, setShowAddTimeModal] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState({ date: '', timeSlot: '' });
  const [selectedDate, setSelectedDate] = useState('');
  const [timeFrom, setTimeFrom] = useState('');
  const [timeTo, setTimeTo] = useState('');
  const [status, setStatus] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [viewType, setViewType] = useState('week'); // 'month', 'week', 'day'
  const [currentDate, setCurrentDate] = useState(new Date());
  const accessToken = useSelector(selectAccessToken);

  useEffect(() => {
    const fetchCalendar = async () => {
      try {
        setIsLoading(true);

        if (!accessToken) {
          Swal.fire({
            icon: 'error',
            title: 'Authentication Required',
            text: 'Please login to continue',
          });
          return;
        }

        const response = await getCleanerCalendar(accessToken);
        if (response.status === 1 && Array.isArray(response.data)) {
          const flat = response.data.flat().filter(Boolean);
          setCalendarData(flat);
        } else {
          setCalendarData([]);
        }
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.message || 'Failed to load calendar',
        });
        setCalendarData([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCalendar();
  }, [accessToken]);

  const uniqueDates = Array.from(new Set(calendarData.map((item) => item.date))).sort();
  
  // Generate dates based on view type and current date
  const generateDates = () => {
    const dates = [];
    const baseDate = new Date(currentDate);
    
    if (viewType === 'day') {
      // Show only one day
      dates.push(baseDate.toISOString().split('T')[0]);
    } else if (viewType === 'week') {
      // Show 7 days starting from currentDate
      for (let i = 0; i < 7; i++) {
        const date = new Date(baseDate);
        date.setDate(baseDate.getDate() + i);
        dates.push(date.toISOString().split('T')[0]);
      }
    } else if (viewType === 'month') {
      // Show entire month
      const year = baseDate.getFullYear();
      const month = baseDate.getMonth();
      const daysInMonth = new Date(year, month + 1, 0).getDate();
      
      for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(year, month, day);
        dates.push(date.toISOString().split('T')[0]);
      }
    }
    
    return dates;
  };
  
  const displayDates = generateDates();
  
  // Always generate time slots for a full day (6 AM to 10 PM in 2-hour intervals)
  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 6; hour < 22; hour += 2) {
      const from = `${hour.toString().padStart(2, '0')}:00:00`;
      const to = `${(hour + 2).toString().padStart(2, '0')}:00:00`;
      slots.push(`${from}-${to}`);
    }
    return slots;
  };
  
  // Always show all time slots, merge with existing data
  const existingSlots = calendarData.length > 0 
    ? Array.from(
        new Set(
          calendarData.map((item) => `${item.time_from || ''}-${item.time_to || ''}`).filter((slot) => slot !== '-')
        )
      )
    : [];
  
  const generatedSlots = generateTimeSlots();
  const allSlots = Array.from(new Set([...generatedSlots, ...existingSlots])).sort();
  const timeSlots = allSlots.length > 0 ? allSlots : generatedSlots;

  const getStatusBadge = (status) => {
    if (status === 1) return { className: 'third-btn-sm', label: 'At work' };
    return { className: 'sec-btn-sm h-100', label: 'Available for work' };
  };

  const getReservationsCount = (date) => calendarData.filter((item) => item.date === date).length;

  // Get date range text
  const getDateRangeText = () => {
    const dates = displayDates;
    if (dates.length === 0) return '';
    
    const formatDate = (dateStr) => {
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
    };
    
    if (dates.length === 1) {
      return formatDate(dates[0]);
    }
    
    return `${formatDate(dates[0])} - ${formatDate(dates[dates.length - 1])}`;
  };

  // Navigation handlers
  const handleToday = () => {
    setCurrentDate(new Date());
  };

  const handleBack = () => {
    const newDate = new Date(currentDate);
    if (viewType === 'day') {
      newDate.setDate(newDate.getDate() - 1);
    } else if (viewType === 'week') {
      newDate.setDate(newDate.getDate() - 7);
    } else if (viewType === 'month') {
      newDate.setMonth(newDate.getMonth() - 1);
    }
    setCurrentDate(newDate);
  };

  const handleNext = () => {
    const newDate = new Date(currentDate);
    if (viewType === 'day') {
      newDate.setDate(newDate.getDate() + 1);
    } else if (viewType === 'week') {
      newDate.setDate(newDate.getDate() + 7);
    } else if (viewType === 'month') {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    setCurrentDate(newDate);
  };

  // Handle clicking on empty cell
  const handleCellClick = (date, slot) => {
    const [from, to] = slot.split('-');
    setSelectedSlot({ date, timeSlot: slot });
    setSelectedDate(date);
    setTimeFrom(from);
    setTimeTo(to);
    setStatus(0);
    setShowAddTimeModal(true);
  };

  // Handle adding time
  const handleAddTime = async () => {
    if (!selectedDate || !timeFrom || !timeTo) {
      Swal.fire({
        icon: 'warning',
        title: 'Missing Information',
        text: 'Please fill in all fields',
      });
      return;
    }

    try {
      setIsSubmitting(true);
      const timeSlots = [{
        date: selectedDate,
        time_from: timeFrom,
        time_to: timeTo,
        status: status
      }];

      const response = await addProviderTime(accessToken, timeSlots);

      if (response.status === 1) {
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: response.message || 'Time added successfully',
          timer: 1500,
          showConfirmButton: false
        });
        setShowAddTimeModal(false);
        
        // Refresh calendar data
        const calendarResponse = await getCleanerCalendar(accessToken);
        if (calendarResponse.status === 1 && Array.isArray(calendarResponse.data)) {
          const flat = calendarResponse.data.flat().filter(Boolean);
          setCalendarData(flat);
        }
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Failed',
          text: response.message || 'Failed to add time',
        });
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.message || 'Failed to add time',
      });
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <section>
      <CleanerHeader title="Calendar & Availability" onMobileMenuClick={onMobileMenuClick} />
      <div className="dashboard-home-content px-3 mt-2">
        <div className="d-flex">
              <div className="d-flex package-filter align-items-center py-1 px-1 m-0 w-auto mb-2">
                  <button 
                    className={`rounded-2 border-0 px-2 py-2 sec-btn d-flex align-items-center gap-1`}
                  >
                    <FontAwesomeIcon icon={faCalendar} />
                   Calendar
                  </button>
                  <Link to='/cleaner/availability' 
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
                <button 
                  className="main-btn rounded-2 px-3 py-1"
                  onClick={handleToday}
                >
                  Today
                </button>
                <div 
                  className="days-filter-item px-3 py-1"
                  style={{ cursor: 'pointer' }}
                  onClick={handleBack}
                >
                  Back
                </div>
                <div 
                  className="days-filter-item px-3 py-1"
                  style={{ cursor: 'pointer' }}
                  onClick={handleNext}
                >
                  Next
                </div>
              </div>

              <h6 className="m-0 date-label">{getDateRangeText()}</h6>

              <div className="d-flex gap-2 p-2 rounded-2 times-filter">
                <button 
                  className={`rounded-2 px-3 py-1 ${viewType === 'month' ? 'main-btn' : 'times-filter-item'}`}
                  onClick={() => setViewType('month')}
                >
                  Month
                </button>
                <div 
                  className={`px-3 py-1 ${viewType === 'week' ? 'main-btn' : 'times-filter-item'}`}
                  style={{ cursor: 'pointer' }}
                  onClick={() => setViewType('week')}
                >
                  Week
                </div>
                <div 
                  className={`px-3 py-1 ${viewType === 'day' ? 'main-btn' : 'times-filter-item'}`}
                  style={{ cursor: 'pointer' }}
                  onClick={() => setViewType('day')}
                >
                  Day
                </div>
              </div>
            </div>

            {/* Calendar Table */}
            <div className="calendar-wrapper">
              {isLoading ? (
                <div className="text-center my-4">
                  <div className="spinner-border" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              ) : (
                <table className="table calendar-table text-center">
                  <thead>
                    <tr>
                      <th>Time</th>
                      {displayDates.map((date) => (
                        <th key={date}>
                          {date}
                          <br />
                          <small className="fw-bold">{getReservationsCount(date)} Reservation</small>
                        </th>
                      ))}
                    </tr>
                  </thead>

                  <tbody>
                    {timeSlots.map((slot) => {
                      const [from, to] = slot.split('-');
                      return (
                        <tr key={slot}>
                          <td className="table-time">{from}</td>
                          {displayDates.map((date) => {
                            const match = calendarData.find(
                              (item) => item.date === date && `${item.time_from}-${item.time_to}` === slot
                            );
                            if (!match) {
                              // Empty cell - clickable
                              return (
                                <td 
                                  key={`${date}-${slot}`}
                                  onClick={() => handleCellClick(date, slot)}
                                  style={{ cursor: 'pointer', background: '#f8f9fa' }}
                                  className="empty-cell"
                                  title="Click to add availability"
                                >
                                  <div className="text-muted small">+</div>
                                </td>
                              );
                            }
                            const badge = getStatusBadge(match.status);
                            return (
                              <td key={`${date}-${slot}`}>
                                <div className={badge.className}>{badge.label}</div>
                              </td>
                            );
                          })}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>

      </div>

      {/* Add Time Modal */}
      {showAddTimeModal && (
        <div 
          className="modal show d-block" 
          style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
          onClick={() => setShowAddTimeModal(false)}
        >
          <div className="modal-dialog modal-dialog-centered" onClick={(e) => e.stopPropagation()}>
            <div className="modal-content rounded-4">
              <div className="modal-header border-0">
                <h5 className="m-0 dashboard-home-card-2-title-1">Add Availability Time</h5>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={() => setShowAddTimeModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label fw-bold">Date</label>
                  <input
                    type="date"
                    className="form-control rounded-2"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label fw-bold">Time From</label>
                  <input
                    type="time"
                    className="form-control rounded-2"
                    value={timeFrom}
                    onChange={(e) => setTimeFrom(e.target.value + ':00')}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label fw-bold">Time To</label>
                  <input
                    type="time"
                    className="form-control rounded-2"
                    value={timeTo}
                    onChange={(e) => setTimeTo(e.target.value + ':00')}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label fw-bold">Status</label>
                  <select
                    className="form-select rounded-2"
                    value={status}
                    onChange={(e) => setStatus(parseInt(e.target.value))}
                  >
                    <option value={0}>Available for work</option>
                    <option value={1}>At work</option>
                  </select>
                </div>
              </div>
              <div className="modal-footer border-0">
                <button
                  type="button"
                  className="btn btn-secondary rounded-2 px-4 py-2"
                  onClick={() => setShowAddTimeModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="sec-btn rounded-2 px-4 py-2"
                  disabled={isSubmitting}
                  onClick={handleAddTime}
                >
                  {isSubmitting ? 'Adding...' : 'Add Time'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default CleanerCalendarMain;