import React, { useState, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import AddCircleOutlinedIcon from '@mui/icons-material/AddCircleOutlined';
import PauseCircleFilledOutlinedIcon from '@mui/icons-material/PauseCircleFilledOutlined';
import StopCircleIcon from '@mui/icons-material/StopCircle';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import CleanerHeader from './CleanerHeader';
import { getCleanServiceDetails, addCleanServiceBeforeImages, addCleanServiceAfterImages, changeStatusCleanService } from '../../api/cleanerCleaningApi';
import { getLists } from '../../api/listsApi';

const CleanerCleaningDetailsMain = ({ onMobileMenuClick }) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [serviceDetails, setServiceDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isChangingStatus, setIsChangingStatus] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [statusComment, setStatusComment] = useState('');
  const [beforeImages, setBeforeImages] = useState([]);
  const [afterImages, setAfterImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const beforeInputRef = useRef(null);
  const afterInputRef = useRef(null);
  
  // State for countdown timer
  const [remainingSeconds, setRemainingSeconds] = useState(0);
  const [totalSeconds, setTotalSeconds] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  
  // State for task checkboxes
  const [tasks, setTasks] = useState([]);

  // Fetch ServiceList from API
  useEffect(() => {
    const fetchServiceList = async () => {
      try {
        const accessToken = localStorage.getItem('access_token');
        const serviceId = searchParams.get('id');
        
        if (!accessToken || !serviceId) return;

        const response = await getLists(accessToken);
        
        if (response.status === 1 && response.data?.ServiceList) {
          // Load saved task states from localStorage
          const savedTasks = localStorage.getItem(`tasks_${serviceId}`);
          let tasksWithState = [];
          
          if (savedTasks) {
            // If there are saved tasks, use them
            tasksWithState = JSON.parse(savedTasks);
          } else {
            // Otherwise, create new tasks from API data
            tasksWithState = response.data.ServiceList.map(task => ({
              id: task.id,
              label: task.title,
              image: task.image,
              checked: false
            }));
          }
          
          setTasks(tasksWithState);
        }
      } catch (error) {
        console.error('Error fetching service list:', error);
      }
    };

    fetchServiceList();
  }, [searchParams]);

  // Fetch service details
  useEffect(() => {
    const fetchDetails = async () => {
      try {
        setIsLoading(true);
        const id = searchParams.get('id');
        const accessToken = localStorage.getItem('access_token');

        if (!id) {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Service ID is missing',
          });
          return;
        }

        if (!accessToken) {
          Swal.fire({
            icon: 'error',
            title: 'Authentication Required',
            text: 'Please login to continue',
          });
          return;
        }

        const response = await getCleanServiceDetails(accessToken, id);

        if (response.status === 1 && response.data) {
          const detail = response.data[0];
          setServiceDetails(detail);
          // Set existing images from API
          if (detail.service_images_befor) {
            setBeforeImages(detail.service_images_befor);
          }
          if (detail.service_images_after) {
            setAfterImages(detail.service_images_after);
          }
          
          // Check if service status is complete, stop timer
          const statusName = detail.status?.name?.toLowerCase();
          if (statusName === 'complete' || statusName === 'finished') {
            setIsTimerRunning(false);
            // Load saved final time if exists
            const savedFinalTime = localStorage.getItem(`final_time_${id}`);
            if (savedFinalTime && detail.duration_time) {
              const [hours, minutes, seconds] = savedFinalTime.split(':').map(Number);
              const finalSecs = (hours * 3600) + (minutes * 60) + seconds;
              const [totalHours, totalMinutes, totalSeconds] = detail.duration_time.split(':').map(Number);
              const totalSecs = (totalHours * 3600) + (totalMinutes * 60) + totalSeconds;
              setTotalSeconds(totalSecs);
              setRemainingSeconds(totalSecs - finalSecs);
            }
          } else {
            // Initialize timer from duration_time
            if (detail.duration_time) {
              const [hours, minutes, seconds] = detail.duration_time.split(':').map(Number);
              const totalSecs = (hours * 3600) + (minutes * 60) + seconds;
              setTotalSeconds(totalSecs);
              
              // Check if timer was already started (saved in localStorage)
              const timerKey = `timer_${id}`;
              const savedTimer = localStorage.getItem(timerKey);
              
              if (savedTimer) {
                // Timer was previously started, calculate remaining time
                const { startTime, totalSeconds } = JSON.parse(savedTimer);
                const now = Date.now();
                const elapsedSeconds = Math.floor((now - startTime) / 1000);
                const remaining = totalSeconds - elapsedSeconds;
                
                if (remaining > 0) {
                  // Timer still running
                  setRemainingSeconds(remaining);
                  setIsTimerRunning(true);
                } else {
                  // Timer completed
                  setRemainingSeconds(0);
                  setIsTimerRunning(false);
                }
              } else {
                // Timer not started yet
                setRemainingSeconds(totalSecs);
                
                // Only start timer if user came from QR code scan
                const fromQR = searchParams.get('fromQR') === 'true';
                if (fromQR) {
                  // Save timer start time to localStorage
                  const timerData = {
                    startTime: Date.now(),
                    totalSeconds: totalSecs
                  };
                  localStorage.setItem(timerKey, JSON.stringify(timerData));
                  setIsTimerRunning(true);
                }
              }
            }
          }
        } else {
          setServiceDetails(null);
        }
      } catch (error) {
        console.error('Error fetching cleaning service details:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.message || 'Failed to load service details',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchDetails();
  }, [searchParams]);

  // Countdown timer effect
  useEffect(() => {
    if (!isTimerRunning || remainingSeconds <= 0) {
      return;
    }

    const interval = setInterval(() => {
      setRemainingSeconds((prev) => {
        if (prev <= 1) {
          setIsTimerRunning(false);
          
          // Clear timer from localStorage when completed
          const serviceId = searchParams.get('id');
          if (serviceId) {
            localStorage.removeItem(`timer_${serviceId}`);
          }
          
          // Timer completed
          Swal.fire({
            icon: 'success',
            title: 'Time\'s Up!',
            text: 'The allocated time for this task has ended.',
            confirmButtonText: 'OK'
          });
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isTimerRunning, remainingSeconds, searchParams]);

  // Format time for display (HH:MM:SS or MM:SS)
  const formatTimerDisplay = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Calculate progress percentage for circular progress
  const getProgressPercentage = () => {
    if (totalSeconds === 0) return 0;
    return ((totalSeconds - remainingSeconds) / totalSeconds) * 100;
  };

  const handleBeforeUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    try {
      const accessToken = localStorage.getItem('access_token');
      const serviceId = searchParams.get('id');
      
      const response = await addCleanServiceBeforeImages(accessToken, serviceId, files);
      
      if (response.status === 1) {
        // Refresh the data
        const detailsResponse = await getCleanServiceDetails(accessToken, serviceId);
        if (detailsResponse.status === 1 && detailsResponse.data) {
          setBeforeImages(detailsResponse.data[0].service_images_befor || []);
        }
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Images uploaded successfully',
          timer: 1500,
          showConfirmButton: false
        });
      }
    } catch (error) {
      console.error('Error uploading before images:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.message || 'Failed to upload images',
      });
    }
  };

  const handleAfterUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    try {
      const accessToken = localStorage.getItem('access_token');
      const serviceId = searchParams.get('id');
      
      const response = await addCleanServiceAfterImages(accessToken, serviceId, files);
      
      if (response.status === 1) {
        // Refresh the data
        const detailsResponse = await getCleanServiceDetails(accessToken, serviceId);
        if (detailsResponse.status === 1 && detailsResponse.data) {
          setAfterImages(detailsResponse.data[0].service_images_after || []);
        }
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Images uploaded successfully',
          timer: 1500,
          showConfirmButton: false
        });
      }
    } catch (error) {
      console.error('Error uploading after images:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.message || 'Failed to upload images',
      });
    }
  };

  // Function to handle task checkbox toggle
  const handleTaskToggle = (taskId) => {
    const serviceId = searchParams.get('id');
    
    setTasks(prevTasks => {
      const updatedTasks = prevTasks.map(task => 
        task.id === taskId ? { ...task, checked: !task.checked } : task
      );
      
      // Save to localStorage
      if (serviceId) {
        localStorage.setItem(`tasks_${serviceId}`, JSON.stringify(updatedTasks));
      }
      
      return updatedTasks;
    });
  };

  // Function to handle finish task (stop timer)
  const handleFinishTask = () => {
    const serviceId = searchParams.get('id');
    
    // Check if all tasks are completed
    const allTasksCompleted = tasks.length > 0 && tasks.every(task => task.checked);
    
    if (!allTasksCompleted) {
      Swal.fire({
        icon: 'warning',
        title: 'Incomplete Tasks',
        text: 'Please complete all tasks before finishing!',
        confirmButtonText: 'OK'
      });
      return;
    }
    
    // Stop the timer
    setIsTimerRunning(false);
    
    // Calculate elapsed time
    const elapsedSeconds = totalSeconds - remainingSeconds;
    const hours = Math.floor(elapsedSeconds / 3600);
    const minutes = Math.floor((elapsedSeconds % 3600) / 60);
    const seconds = elapsedSeconds % 60;
    const timeDuration = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    
    // Save final time to localStorage
    if (serviceId) {
      localStorage.setItem(`final_time_${serviceId}`, timeDuration);
      localStorage.removeItem(`timer_${serviceId}`); // Remove active timer
    }
    
    Swal.fire({
      icon: 'success',
      title: 'Task Finished!',
      text: `Time taken: ${timeDuration}`,
      confirmButtonText: 'OK'
    });
  };

  // Function to handle status change
  const handleChangeStatus = async () => {
    const accessToken = localStorage.getItem('access_token');
    const serviceId = searchParams.get('id');

    if (!accessToken || !serviceId) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Authentication required or service ID missing',
      });
      return;
    }

    if (!statusComment.trim()) {
      Swal.fire({
        icon: 'warning',
        title: 'Comment Required',
        text: 'Please enter a comment',
      });
      return;
    }

    try {
      setIsChangingStatus(true);
      
      // Prepare request data
      const requestData = {
        service_id: serviceId,
        comment: statusComment.trim(),
      };
      
      // If status is complete/finished (Close service), add additional data
      const statusName = serviceDetails?.status?.name?.toLowerCase();
      if (statusName === 'complete' || statusName === 'finished') {
        // Get completed task IDs
        const completedTaskIds = tasks.filter(task => task.checked).map(task => task.id);
        
        // Get saved time duration or calculate current
        let timeDuration = localStorage.getItem(`final_time_${serviceId}`);
        if (!timeDuration && totalSeconds > 0) {
          const elapsedSeconds = totalSeconds - remainingSeconds;
          const hours = Math.floor(elapsedSeconds / 3600);
          const minutes = Math.floor((elapsedSeconds % 3600) / 60);
          const seconds = elapsedSeconds % 60;
          timeDuration = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        }
        
        requestData.list_ids = completedTaskIds;
        requestData.time_duration = timeDuration || '00:00:00';
      }
      
      const response = await changeStatusCleanService(accessToken, requestData);

      if (response.status === 1) {
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: response.message || 'Status updated successfully',
        });
        setShowStatusModal(false);
        setStatusComment('');
        
        // Clear saved data if closing service
        if (statusName === 'complete' || statusName === 'finished') {
          localStorage.removeItem(`tasks_${serviceId}`);
          localStorage.removeItem(`final_time_${serviceId}`);
          localStorage.removeItem(`timer_${serviceId}`);
        }
        
        // Refresh data
        const detailsResponse = await getCleanServiceDetails(accessToken, serviceId);
        if (detailsResponse.status === 1 && detailsResponse.data) {
          setServiceDetails(detailsResponse.data[0]);
        }
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Failed',
          text: response.message || 'Failed to update status',
        });
      }
    } catch (error) {
      console.error('Error changing status:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.message || 'Failed to update status',
      });
    } finally {
      setIsChangingStatus(false);
    }
  };

  // Get status button text based on current status
  const getStatusButtonText = () => {
    const statusName = serviceDetails?.status?.name?.toLowerCase();
    switch (statusName) {
      case 'new':
        return 'Make it in progress';
      case 'progress':
      case 'in-progress':
      case 'inprogress':
        return 'Complete order';
      case 'complete':
      case 'finished':
        return 'Close service';
      default:
        return 'Update status';
    }
  };

  // Check if status button should be shown
  const shouldShowStatusButton = () => {
    const statusName = serviceDetails?.status?.name?.toLowerCase();
    return ['new', 'progress', 'in-progress', 'inprogress', 'complete', 'finished'].includes(statusName);
  };

  // Handle report problem navigation
  const handleReportProblem = () => {
    const propertyId = serviceDetails?.property_id?.id;
    if (propertyId) {
      navigate(`/cleaner/report-problem?propertyId=${propertyId}`);
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Property information is not available',
      });
    }
  };

  // Helper function to format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  // Helper function to format time
  const formatTime = (timeFrom, timeTo) => {
    if (!timeFrom || !timeTo) return 'N/A';
    const formatTimeString = (time) => {
      const [hours, minutes] = time.split(':');
      const hour = parseInt(hours);
      const ampm = hour >= 12 ? 'pm' : 'am';
      const hour12 = hour % 12 || 12;
      return `${hour12}:${minutes} ${ampm}`;
    };
    return `${formatTimeString(timeFrom)} - ${formatTimeString(timeTo)}`;
  };

  // Get status badge class
  const getStatusBadgeClass = (status) => {
    const statusName = status?.name?.toLowerCase();
    switch (statusName) {
      case 'new': return 'new-badge';
      case 'progress': return 'in-progress-badge';
      case 'complete': return 'finished-badge';
      case 'cancelled':
      case 'reject': return 'canceled-badge';
      default: return 'new-badge';
    }
  };

  if (isLoading) {
    return (
      <section>
        <CleanerHeader title="Cleaning Details" onMobileMenuClick={onMobileMenuClick} />
        <div className="dashboard-home-content px-3 mt-5">
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (!serviceDetails) {
    return (
      <section>
        <CleanerHeader title="Cleaning Details" onMobileMenuClick={onMobileMenuClick} />
        <div className="dashboard-home-content px-3 mt-5">
          <div className="text-center py-5">
            <p className="m-0">Service details not found.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section>
      <CleanerHeader title="Cleaning Details" onMobileMenuClick={onMobileMenuClick} />
      <div className="dashboard-home-content px-3 mt-2">
        <div className="row">
          <div className="col-12">
                            <h6 className="property-problem-title mb-2 mt-2">Cleaning details</h6>
                <div className="d-flex align-items-center justify-content-between p-3 gap-2 w-100 materials-cards rounded-4 mb-3">
      <div className="d-flex w-100 align-items-start flex-column flex-md-row gap-2">
        <img src={serviceDetails.property_id?.image || '/assets/problem-img-2.png'} className='img-fluid materials-img' alt="property" />   
        <div className='d-flex flex-column gap-2 align-items-start w-100'>
                                <div className="d-flex justify-content-between align-items-center w-100">
           <h6 className="property-problem-title mb-0 mt-2">{serviceDetails.clean_service_type_id?.name || 'Cleaning Service'}</h6>
            <div className={`${getStatusBadgeClass(serviceDetails.status)} px-2 p-1 rounded-2`}>{serviceDetails.status?.name || 'New'}</div>
          </div>
          <div className="d-flex gap-2 flex-wrap">
            {shouldShowStatusButton() && (
              <button
                className="sec-btn rounded-2 px-4 py-2 mt-2"
                disabled={isChangingStatus}
                onClick={() => {
                  setStatusComment('');
                  setShowStatusModal(true);
                }}
              >
                {isChangingStatus ? 'Updating...' : getStatusButtonText()}
              </button>
            )}
            <button
              className="btn btn-outline-danger rounded-2 px-4 py-2 mt-2"
              onClick={handleReportProblem}
            >
              Report a Problem
            </button>
          </div>
          <div className="d-flex align-items-center gap-1">
            <img src="/assets/calendar-3.svg" alt="calendar" />
            <p className="dashboard-home-card-2-desc-3 m-0">{formatDate(serviceDetails.date)}</p>
          </div>
          <div className="d-flex align-items-center gap-1">
            <img src="/assets/clock.svg" alt="clock" />
            <p className="dashboard-home-card-2-desc-3 mb-0">{formatTime(serviceDetails.time_from, serviceDetails.time_to)}</p>
          </div>
            <h6 className="property-problem-title mb-0">{serviceDetails.property_id?.name || 'Property'}</h6>
            <div className="d-flex align-items-center gap-1">
            <img src="/assets/location-2.svg" alt="location" />
            <p className="dashboard-home-card-2-desc-3 m-0">{serviceDetails.property_id?.address || 'N/A'}</p>
          </div>
            {serviceDetails.property_id?.platform_id?.name && (
            <div className="bnb-badge d-flex align-items-center gap-2 p-2 rounded-2">
              <img src="/assets/bnb.svg" alt="platform" />
              <span>{serviceDetails.property_id.platform_id.name}</span>
            </div>
            )}
        </div>
      </div>
    </div>
          </div>
            <h6 className="property-problem-title mb-2 ">Room pictures before and after</h6>
            <div className="d-flex gap-2 align-items-center flex-wrap">
                <div className='rating-stars-bg p-2 rounded-2'>
                    <h3 className='form-label mb-2'>Before cleaning</h3>
                    <div className="d-flex gap-2 align-items-center flex-wrap">
                        <div className="add-room-btn d-flex flex-column align-items-center justify-content-center gap-2" onClick={() => beforeInputRef.current.click()}>
                            <img src="/assets/gallery-add.svg" alt="gallery" />
                            <h6 className='table-time m-0'>Add room photos</h6>
                        </div>
                        {beforeImages.map((img, idx) => (
                          <img 
                            key={img.id || idx} 
                            src={img.image || (img instanceof File ? URL.createObjectURL(img) : img)} 
                            className='added-img' 
                            alt="before"
                            style={{ cursor: 'pointer' }}
                            onClick={() => setSelectedImage(img.image || (img instanceof File ? URL.createObjectURL(img) : img))}
                          />
                        ))}
                    </div>
                    <input type="file" multiple accept="image/*" ref={beforeInputRef} onChange={handleBeforeUpload} style={{display: 'none'}} />
                </div>
                <div className='rating-stars-bg p-2 rounded-2'>
                    <h3 className='form-label mb-2'>After cleaning</h3>
                    <div className="d-flex gap-2 align-items-center flex-wrap">
                        <div className="add-room-btn d-flex flex-column align-items-center justify-content-center gap-2" onClick={() => afterInputRef.current.click()}>
                            <img src="/assets/gallery-add.svg" alt="gallery" />
                            <h6 className='table-time m-0'>Add room photos</h6>
                        </div>
                        {afterImages.map((img, idx) => (
                          <img 
                            key={img.id || idx} 
                            src={img.image || (img instanceof File ? URL.createObjectURL(img) : img)} 
                            className='added-img' 
                            alt="after"
                            style={{ cursor: 'pointer' }}
                            onClick={() => setSelectedImage(img.image || (img instanceof File ? URL.createObjectURL(img) : img))}
                          />
                        ))}
                    </div>
                    <input type="file" multiple accept="image/*" ref={afterInputRef} onChange={handleAfterUpload} style={{display: 'none'}} />
                </div>

            </div>
            <h6 className="property-problem-title my-2">Employee</h6>
                                <div className="d-flex align-items-center gap-2 w-100">
                      <img src={serviceDetails.provider?.avatar || '/assets/user.png'} className='provider-rate' alt="provider" />
                      <div>
                        <h6 className='login-title m-0'>{serviceDetails.provider?.name || 'Not Assigned'}</h6>
                        <div className="d-flex align-items-center gap-1 mt-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <svg
                              key={star}
                              width="14"
                              height="14"
                              viewBox="0 0 24 24"
                              fill={star <= (serviceDetails.provider?.rate || 0) ? "#f7941d" : "none"}
                              stroke="#f7941d"
                              strokeWidth="2"
                            >
                              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                            </svg>
                          ))}
                          <span className="training-details-card-desc m-0 ms-1">({serviceDetails.provider?.rate || 0})</span>
                        </div>
                      </div>
                    </div>
                                        <h6 className="property-management-card-title mb-0 mt-4">Additional Services</h6>
                    <div className="row w-100 g-2">
                      {serviceDetails.addition_service?.length > 0 ? (
                        serviceDetails.addition_service.map((add) => (
                          <div className="col-md-2 col-12 mb-3 col-20-per px-2" key={add.id}>
                            <div className="bg-light-gray p-3 rounded-3 h-100 active">
                              <img src={add.addition_service?.image || '/assets/service-img.png'} className='img-fluid w-100' alt="service" />
                              <div className="d-flex justify-content-between align-items-center gap-1 mt-2">
                                <h3 className='dashboard-routes-sub m-0'>{add.addition_service?.name || 'Service'}</h3>
                                <div className='third-btn-sm p-1 rounded-2'>${add.addition_service?.price || 0}</div>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="col-12 mb-2">
                          <p className='dashboard-home-card-2-desc-3 m-0'>No additional services.</p>
                        </div>
                      )}
                    </div>
            <h6 className="property-problem-title my-2">Property description</h6>
              <div className="d-flex gap-3 align-items-center flex-wrap flex-sm-nowrap">
                <div className='training-card p-2 rounded-2'>
                    <p className='m-0 problem-desc'>{serviceDetails.property_id?.specail_note || 'No description available.'}</p>
                </div>
              </div>
        <div className="row g-2 mt-3">
            <div className="col-md-7 px-2 mb-3">
              <div className="tasks-card">
                <h6 className="property-problem-title mb-3">The task cannot be finalized until all menu steps have been completed.</h6>
                <div className="d-flex flex-column gap-2 align-items-start">
                    {tasks.map(task => (
                        <div 
                            key={task.id}
                            className={`d-flex gap-1 align-items-center problem-checkbox-container task-checkbox ${task.checked ? 'active' : ''}`}
                            onClick={() => handleTaskToggle(task.id)}
                        >
                            <label className="custom-checkbox">
                                <input 
                                    type="checkbox" 
                                    checked={task.checked}
                                    onChange={() => handleTaskToggle(task.id)}
                                />
                                <span className="checkmark"></span>
                            </label>
                            <label className="checkbox-label">{task.label}</label>
                        </div>
                    ))}
                </div>
              </div>
            </div>
            <div className="col-md-5 mb-3 px-2">
                <div className="tasks-card h-100">
                    <div className="d-flex gap-2 align-items-center mb-3">
                        <img src="/assets/Ellipse.svg" alt="Ellipse" />
                        <h6 className='dashboard-card-link m-0'>Executing the task</h6>
                    </div>
                    <div className="d-flex align-items-center gap-2 flex-wrap flex-md-nowrap justify-content-center">
<div className="timer-wrapper medium">
  <svg className="progress-ring" width="180" height="180">
    <circle
      className="progress-ring-bg"
      cx="90"
      cy="90"
      r="80"
    />
    <circle
      className="progress-ring-circle"
      cx="90"
      cy="90"
      r="80"
      style={{
        strokeDasharray: `${2 * Math.PI * 80}`,
        strokeDashoffset: `${2 * Math.PI * 80 * (1 - getProgressPercentage() / 100)}`
      }}
    />
  </svg>

  <div className="timer-text medium">{formatTimerDisplay(remainingSeconds)}</div>
</div>


                        <div className="d-flex flex-column gap-3 align-items-center h-100 w-100">
                            {isTimerRunning && (
                              <button
                                className="btn btn-danger rounded-pill px-4 py-2 d-flex align-items-center gap-2"
                                onClick={handleFinishTask}
                                style={{ fontSize: '0.9rem', fontWeight: '600' }}
                              >
                                <StopCircleIcon style={{ fontSize: '20px' }} />
                                Finish Task
                              </button>
                            )}
                            <div className="text-center">
                              <small className="text-muted" style={{ fontSize: '0.75rem' }}>
                                Complete all tasks before finishing
                              </small>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
        </div>
        
      </div>

      {/* Image Preview Modal */}
      {selectedImage && (
        <div 
          className="modal show d-block" 
          style={{ backgroundColor: 'rgba(0,0,0,0.8)' }} 
          onClick={() => setSelectedImage(null)}
        >
          <div className="modal-dialog modal-dialog-centered modal-lg" onClick={(e) => e.stopPropagation()}>
            <div className="modal-content bg-transparent border-0">
              <div className="modal-header border-0 pb-0">
                <button 
                  type="button" 
                  className="btn-close btn-close-white" 
                  onClick={() => setSelectedImage(null)}
                  style={{ filter: 'invert(1)' }}
                ></button>
              </div>
              <div className="modal-body text-center p-0">
                <img 
                  src={selectedImage} 
                  alt="Preview" 
                  className="img-fluid rounded-3" 
                  style={{ maxHeight: '80vh', objectFit: 'contain' }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Status Change Modal */}
      {showStatusModal && (
        <div 
          className="modal show d-block" 
          style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
          onClick={() => setShowStatusModal(false)}
        >
          <div className="modal-dialog modal-dialog-centered" onClick={(e) => e.stopPropagation()}>
            <div className="modal-content rounded-4">
              <div className="modal-header border-0">
                <h5 className="m-0 dashboard-home-card-2-title-1">{getStatusButtonText()}</h5>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={() => setShowStatusModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div>
                  <label className="dashboard-home-card-2-title-1 fw-bold">Comment</label>
                  <textarea
                    className="form-control rounded-2 py-2"
                    placeholder="Enter your comment"
                    rows="4"
                    value={statusComment}
                    onChange={(e) => setStatusComment(e.target.value)}
                  ></textarea>
                </div>
              </div>
              <div className="modal-footer border-0">
                <button
                  type="button"
                  className="btn btn-secondary rounded-2 px-4 py-2"
                  onClick={() => setShowStatusModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="sec-btn rounded-2 px-4 py-2"
                  disabled={isChangingStatus}
                  onClick={handleChangeStatus}
                >
                  {isChangingStatus ? 'Updating...' : 'Confirm'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default CleanerCleaningDetailsMain;