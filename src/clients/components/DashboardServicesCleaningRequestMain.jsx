import React, { useState, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import { getProperties } from '../../api/propertyApi';
import { getListsData, getUserCalendar, createCleaningService, getPlans } from '../../api/cleaningServiceApi';
import ClientHeader from './ClientHeader';

const DashboardServicesCleaningRequestMain = ({ onMobileMenuClick }) => {
  const scrollContainerRef = useRef(null);
  const propertyCardsRef = useRef({});
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  // Step management
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;
  
  // Data states
  const [properties, setProperties] = useState([]);
  const [listsData, setListsData] = useState(null);
  const [plans, setPlans] = useState([]);
  const [calendarEvents, setCalendarEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Selection states
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [selectedServiceType, setSelectedServiceType] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [selectedAddons, setSelectedAddons] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
  
  // Calendar states
  const [currentDate, setCurrentDate] = useState(new Date());
  const [weekDates, setWeekDates] = useState([]);
  const [viewType, setViewType] = useState('week'); // 'month', 'week', 'day'
  
  // Form data
  const [formData, setFormData] = useState({
    property_id: null,
    clean_service_type_id: null,
    plan_id: null,
    clean_service_addition_service_id: [],
    date: '',
    time_from: '',
    time_to: '',
    price: 0,
    addition_service_price: 0,
    total_price: 0
  });

  // Generate dates based on view type
  useEffect(() => {
    const dates = [];
    const baseDate = new Date(currentDate);
    
    if (viewType === 'day') {
      dates.push(baseDate);
    } else if (viewType === 'week') {
      const startOfWeek = new Date(baseDate);
      const day = startOfWeek.getDay();
      const diff = startOfWeek.getDate() - day;
      startOfWeek.setDate(diff);

      for (let i = 0; i < 7; i++) {
        const date = new Date(startOfWeek);
        date.setDate(startOfWeek.getDate() + i);
        dates.push(date);
      }
    } else if (viewType === 'month') {
      const year = baseDate.getFullYear();
      const month = baseDate.getMonth();
      const daysInMonth = new Date(year, month + 1, 0).getDate();
      
      for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(year, month, day);
        dates.push(date);
      }
    }
    
    setWeekDates(dates);
  }, [currentDate, viewType]);

  // Fetch initial data
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setIsLoading(true);
        const accessToken = localStorage.getItem('access_token');
        
        if (!accessToken) {
          Swal.fire({
            icon: 'error',
            title: 'Authentication Required',
            text: 'Please log in to continue.',
          });
          navigate('/client/login');
          return;
        }

        // Fetch properties with pagination (with error handling)
        try {
          console.log('Access Token:', accessToken);
          let allProperties = [];
          let currentPage = 1;
          let hasMorePages = true;

          while (hasMorePages) {
            console.log('Fetching properties page:', currentPage);
            const propertiesResponse = await getProperties(accessToken, currentPage);
            console.log('Properties Response:', propertiesResponse);
            if (propertiesResponse.status === 1 && propertiesResponse.data) {
              const pageData = propertiesResponse.data[0];
              const items = pageData?.items || [];
              console.log('Properties items:', items);
              allProperties = [...allProperties, ...items];

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

          console.log('All Properties:', allProperties);
          
          // Reorder properties so selected property comes first
          let orderedProperties = allProperties;
          const propertyIdParam = searchParams.get('propertyId');
          if (propertyIdParam) {
            const selectedProp = allProperties.find(p => p.id.toString() === propertyIdParam);
            if (selectedProp) {
              orderedProperties = [
                selectedProp,
                ...allProperties.filter(p => p.id.toString() !== propertyIdParam)
              ];
            }
          }
          
          setProperties(orderedProperties);

          // Auto-select property from URL parameter or first property
          if (orderedProperties.length > 0) {
            const propertyToSelect = propertyIdParam 
              ? orderedProperties.find(p => p.id.toString() === propertyIdParam)
              : orderedProperties[0];
            
            if (propertyToSelect) {
              setSelectedProperty(propertyToSelect);
              setFormData(prev => ({ ...prev, property_id: propertyToSelect.id }));
            } else {
              // Fallback to first property if specified property not found
              setSelectedProperty(orderedProperties[0]);
              setFormData(prev => ({ ...prev, property_id: orderedProperties[0].id }));
            }
          }
        } catch (propErr) {
          console.error('Error fetching properties:', propErr);
          console.error('Error details:', propErr.response || propErr.message);
          // Continue loading other data even if properties fail
        }

        // Fetch lists data
        try {
          const listsResponse = await getListsData(accessToken);
          console.log('Lists Response:', listsResponse);
          if (listsResponse.status === 1 && listsResponse.data) {
            console.log('Lists Data:', listsResponse.data[0]);
            setListsData(listsResponse.data[0]);
            
            // Auto-select first service type (Package)
            const cleanServiceTypes = listsResponse.data[0]?.CleanServiceType || [];
            console.log('Clean Service Types:', cleanServiceTypes);
            const packageType = cleanServiceTypes.find(type => type.name.toLowerCase() === 'package');
            if (packageType) {
              setSelectedServiceType(packageType);
              setFormData(prev => ({ ...prev, clean_service_type_id: packageType.id }));
            }
          }
        } catch (listsErr) {
          console.error('Error fetching lists:', listsErr);
        }

        // Fetch user calendar
        try {
          const calendarResponse = await getUserCalendar(accessToken);
          if (calendarResponse.status === 1 && calendarResponse.data) {
            const events = calendarResponse.data.flat();
            setCalendarEvents(events);
          }
        } catch (calErr) {
          console.error('Error fetching calendar:', calErr);
        }

        setIsLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setIsLoading(false);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to load data. Please try again.',
        });
      }
    };

    fetchInitialData();
  }, [navigate]);

  // Fetch plans when "Package" service type is selected
  useEffect(() => {
    const fetchPlans = async () => {
      if (selectedServiceType?.name.toLowerCase() === 'package') {
        try {
          const accessToken = localStorage.getItem('access_token');
          const plansResponse = await getPlans(accessToken);
          console.log('Plans Response:', plansResponse);
          if (plansResponse.status === 1 && plansResponse.data) {
            const plansData = plansResponse.data[0]?.items || [];
            console.log('Plans Data:', plansData);
            setPlans(plansData);
          }
        } catch (err) {
          console.error('Error fetching plans:', err);
        }
      } else {
        setPlans([]);
      }
    };

    fetchPlans();
  }, [selectedServiceType]);


  // Handlers
  const handlePropertySelect = (property) => {
    setSelectedProperty(property);
    setFormData(prev => ({ ...prev, property_id: property.id }));
  };

  const handleServiceTypeSelect = (serviceType) => {
    setSelectedServiceType(serviceType);
    setSelectedPlan(null);
    setFormData(prev => ({
      ...prev,
      clean_service_type_id: serviceType.id,
      plan_id: null,
      price: 0
    }));
  };

  const handlePlanSelect = (plan) => {
    setSelectedPlan(plan);
    setFormData(prev => ({
      ...prev,
      plan_id: plan.id,
      price: plan.price || 0,
      total_price: (plan.price || 0) + prev.addition_service_price
    }));
  };

  const handleAddonToggle = (addon) => {
    const isSelected = selectedAddons.find(a => a.id === addon.id);
    let newAddons;
    
    if (isSelected) {
      newAddons = selectedAddons.filter(a => a.id !== addon.id);
    } else {
      newAddons = [...selectedAddons, addon];
    }
    
    setSelectedAddons(newAddons);
    
    const addonIds = newAddons.map(a => a.id);
    const addonPrice = newAddons.reduce((sum, a) => sum + (a.price || 0), 0);
    
    setFormData(prev => ({
      ...prev,
      clean_service_addition_service_id: addonIds,
      addition_service_price: addonPrice,
      total_price: prev.price + addonPrice
    }));
  };

  const handleAppointmentSelect = (event) => {
    setSelectedAppointment(event);
    setFormData(prev => ({
      ...prev,
      date: event.date,
      time_from: event.time_from,
      time_to: event.time_to
    }));
  };

  const handleEmptySlotClick = (date, timeSlot) => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const dateKey = `${year}-${month}-${day}`;
    
    const hour = parseInt(timeSlot);
    const timeFrom = `${timeSlot}:00:00`;
    const timeTo = `${(hour + 2).toString().padStart(2, '0')}:00:00`;
    
    setSelectedAppointment(null);
    setFormData(prev => ({
      ...prev,
      date: dateKey,
      time_from: timeFrom,
      time_to: timeTo
    }));
    
    Swal.fire({
      icon: 'success',
      title: 'Slot Selected',
      text: `Date: ${dateKey}, Time: ${timeFrom} - ${timeTo}`,
      timer: 2000,
      showConfirmButton: false
    });
  };

  const handlePaymentMethodClick = (method) => {
    setSelectedPaymentMethod(method);
  };

  // Calendar helpers
  const getEventForSlot = (date, timeSlot) => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const dateKey = `${year}-${month}-${day}`;

    return calendarEvents.filter(event => event.date === dateKey);
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

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  const formatDateHeader = (date) => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const dayName = days[date.getDay()];
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return { dayName, dateStr: `${month}/${day}` };
  };

  const formatDateRange = () => {
    if (weekDates.length === 0) return '';
    const start = weekDates[0];
    const end = weekDates[weekDates.length - 1];
    const options = { day: 'numeric', month: 'short', year: 'numeric' };
    
    if (viewType === 'day') {
      return start.toLocaleDateString('en-GB', options);
    }
    
    return `${start.toLocaleDateString('en-GB', options)} - ${end.toLocaleDateString('en-GB', options)}`;
  };

  // Scroll functions
  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -350, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 350, behavior: 'smooth' });
    }
  };

  // Step navigation
  const handleNextStep = () => {
    // Validation
    if (currentStep === 1) {
      if (!selectedProperty) {
        Swal.fire({ icon: 'warning', title: 'Please select a property' });
        return;
      }
      if (!selectedServiceType) {
        Swal.fire({ icon: 'warning', title: 'Please select a service type' });
        return;
      }
      if (selectedServiceType.name.toLowerCase() === 'package' && !selectedPlan) {
        Swal.fire({ icon: 'warning', title: 'Please select a package' });
        return;
      }
    }
    
    if (currentStep === 2) {
      if (!formData.date) {
        Swal.fire({ icon: 'warning', title: 'Please select a date' });
        return;
      }
      if (!formData.time_from) {
        Swal.fire({ icon: 'warning', title: 'Please select a start time (Time From)' });
        return;
      }
      if (!formData.time_to) {
        Swal.fire({ icon: 'warning', title: 'Please select an end time (Time To)' });
        return;
      }
    }
    
    if (currentStep === 4) {
      handleSubmit();
      return;
    }
    
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleStepClick = (stepNumber) => {
    setCurrentStep(stepNumber);
  };

  // Form submission
  const handleSubmit = async () => {
    try {
      if (!selectedPaymentMethod) {
        Swal.fire({ icon: 'warning', title: 'Please select a payment method' });
        return;
      }

      setIsSubmitting(true);
      const accessToken = localStorage.getItem('access_token');

      // Prepare data for submission
      const submissionData = { ...formData };
      
      // Convert array of IDs to comma-separated string
      if (Array.isArray(submissionData.clean_service_addition_service_id)) {
        submissionData.clean_service_addition_service_id = submissionData.clean_service_addition_service_id.join(',');
      }

      const response = await createCleaningService(submissionData, accessToken);

      if (response.status === 1) {
        await Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: 'Cleaning service request submitted successfully.',
        });
        navigate('/client/orders');
      } else {
        throw new Error(response.message || 'Failed to submit request');
      }
    } catch (err) {
      console.error('Error submitting request:', err);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: err.message || 'Failed to submit request. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const timeSlots = [
    { label: '8:00 AM', value: '08' },
    { label: '10:00 AM', value: '10' },
    { label: '12:00 PM', value: '12' },
    { label: '2:00 PM', value: '14' },
    { label: '4:00 PM', value: '16' },
    { label: '6:00 PM', value: '18' },
    { label: '8:00 PM', value: '20' },
  ];

  if (isLoading) {
    return (
      <section>
        <div className="dashboard-main-nav px-md-3 px-1 py-1">
          <div className="d-flex justify-content-between align-items-center">
            <h2 className="mb-0 dashboard-title">Cleaning request</h2>
          </div>
        </div>
        <div className="dashboard-home-content px-3 mt-2">
          <div className="text-center mt-4 mb-4">
            <p className="text-muted">Loading...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section>
      <ClientHeader title="Cleaning Services" onMobileMenuClick={onMobileMenuClick} />
      
      <div className="dashboard-home-content px-3 mt-2">
        <h6 className="dashboard-routes-sub m-0">Cleaning request</h6>
        
        {/* Steps */}
        <div className="create-property-steps mt-4">
          <div className="steps-wrapper">
            <div 
              className={`step ${currentStep >= 1 ? 'active' : ''}`}
              onClick={() => handleStepClick(1)}
              style={{ cursor: 'pointer' }}
            >
              <div className="step-circle">
                <img src="/assets/cleaning-step-1.svg" alt="info" />
              </div>
              <span className="step-label">Property and Package</span>
            </div>

            <div 
              className={`step ${currentStep >= 2 ? 'active' : ''}`}
              onClick={() => handleStepClick(2)}
              style={{ cursor: 'pointer' }}
            >
              <div className="step-circle">
                <img src="/assets/cleaning-step-2.svg" alt="location" />
              </div>
              <span className="step-label">Service date</span>
            </div>

            <div 
              className={`step ${currentStep >= 3 ? 'active' : ''}`}
              onClick={() => handleStepClick(3)}
              style={{ cursor: 'pointer' }}
            >
              <div className="step-circle">
                <img src="/assets/cleaning-step-3.svg" alt="photos" />
              </div>
              <span className="step-label">Add-on Services</span>
            </div>

            <div 
              className={`step ${currentStep >= 4 ? 'active' : ''}`}
              onClick={() => handleStepClick(4)}
              style={{ cursor: 'pointer' }}
            >
              <div className="step-circle">
                <img src="/assets/cleaning-step-4.svg" alt="contact" />
              </div>
              <span className="step-label">Payment</span>
            </div>
          </div>

          {/* STEP 1: Property and Package Selection */}
          <div className={`step-1-container ${currentStep === 1 ? '' : 'd-none'}`}>
            <div className="login-title mb-1 mt-2">Service request for property</div>
            <div className="service-desc mb-3 mt-2">Determine the property</div>
            
            {/* Property selection with horizontal scroll */}
            <div className="position-relative mb-4">
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
                    <p className="text-muted">No properties available. Please add a property first or check your connection.</p>
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

            <div className="service-desc mb-2 mt-2">Package</div>
            <div className="row package-filter align-items-center py-2 px-0 m-0">
              {listsData?.CleanServiceType && listsData.CleanServiceType.length > 0 ? (
                listsData.CleanServiceType.map((serviceType) => (
                  <div key={serviceType.id} className="col-md-4">
                    <button 
                      className={`rounded-2 px-4 py-2 border-0 w-100 ${selectedServiceType?.id === serviceType.id ? 'sec-btn' : 'package-filter-item'}`}
                      onClick={() => handleServiceTypeSelect(serviceType)}
                    >
                      {serviceType.name}
                    </button>
                  </div>
                ))
              ) : (
                <div className="col-12">
                  <p className="text-muted text-center">Loading service types...</p>
                </div>
              )}
            </div>

            {/* Show packages if "Package" service type is selected */}
            {selectedServiceType?.name.toLowerCase() === 'package' && (
              <div className="row mt-3">
                {plans && plans.length > 0 ? (
                  plans.map((plan) => (
                    <div key={plan.id} className="col-md-4 mb-3">
                      <div 
                        className={`shadow p-3 rounded-4 bg-white h-100 d-flex flex-column gap-2 align-items-start justify-content-between ${selectedPlan?.id === plan.id ? 'border border-primary' : ''}`}
                        style={{ cursor: 'pointer' }}
                        onClick={() => handlePlanSelect(plan)}
                      >
                        <div className='d-flex flex-column gap-2'>
                          <h3 className='dashboard-home-card-2-title-2 m-0'>{plan.name}</h3>
                          <div className="d-flex gap-2 align-items-center flex-wrap">
                            <h4 className='dashboard-home-card-2-label-1-sec m-0'>${plan.price || 0}</h4>
                            <h4 className='dashboard-home-card-2-label-2 m-0'>/{plan.month_duration} month</h4>
                          </div>
                          {plan.description && (
                            <p className='package-desc m-0'>{plan.description}</p>
                          )}
                          <p className='package-desc m-0'>{plan.number_service} services included</p>
                        </div>
                        <div className="pt-3 mt-3 w-100 d-flex justify-content-center package-button-container">
                          <button 
                            className={`package-btn rounded-pill px-4 w-50-100 ${selectedPlan?.id === plan.id ? 'active' : ''}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              handlePlanSelect(plan);
                            }}
                          >
                            {selectedPlan?.id === plan.id ? 'Selected' : 'Choose Package'}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-12">
                    <p className="text-muted text-center">Loading packages...</p>
                  </div>
                )}
              </div>
            )}

            <div className="d-flex justify-content-end align-items-center mb-3 gap-2 mt-3">
              <button className="sec-btn rounded-2 px-5 py-2" onClick={handleNextStep}>
                Next
              </button>
            </div>
          </div>

          {/* STEP 2: Service Date (Calendar) */}
          <div className={`step-2-container ${currentStep === 2 ? '' : 'd-none'}`}>
            <div className="login-title mb-2 mt-2">Service Date</div>
            
            {/* Selected Date/Time Summary */}
            {(formData.date || formData.time_from || formData.time_to) && (
              <div className="selected-datetime-summary p-3 rounded-3 mb-3 mt-3 bg-light-gray">
                <h6 className="mb-2">Selected Schedule:</h6>
                <div className="d-flex gap-4 flex-wrap">
                  {formData.date && <span><strong>Date:</strong> {formData.date}</span>}
                  {formData.time_from && <span><strong>From:</strong> {formData.time_from}</span>}
                  {formData.time_to && <span><strong>To:</strong> {formData.time_to}</span>}
                </div>
              </div>
            )}

            <div className="service-desc mb-3 mt-3">Select from available slots</div>

            <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
              <div className="d-flex gap-2 p-2 rounded-2 days-filter">
                <button className="main-btn rounded-2 px-3 py-1" onClick={handleToday}>Today</button>
                <div className="days-filter-item px-3 py-1" onClick={handleBack} style={{cursor: 'pointer'}}>Back</div>
                <div className="days-filter-item px-3 py-1" onClick={handleNext} style={{cursor: 'pointer'}}>Next</div>
              </div>

              <h6 className="m-0 date-label">{formatDateRange()}</h6>

              <div className="d-flex gap-2 p-2 rounded-2 times-filter">
                <button 
                  className={`rounded-2 px-3 py-1 ${viewType === 'month' ? 'main-btn' : 'times-filter-item'}`}
                  onClick={() => setViewType('month')}
                >
                  Month
                </button>
                <div 
                  className={`px-3 py-1 ${viewType === 'week' ? 'main-btn' : 'times-filter-item'}`}
                  style={{cursor: 'pointer'}}
                  onClick={() => setViewType('week')}
                >
                  Week
                </div>
                <div 
                  className={`px-3 py-1 ${viewType === 'day' ? 'main-btn' : 'times-filter-item'}`}
                  style={{cursor: 'pointer'}}
                  onClick={() => setViewType('day')}
                >
                  Day
                </div>
              </div>
            </div>

            <div className="calendar-wrapper">
              <table className="table calendar-table text-center">
                <thead>
                  <tr>
                    <th>Time</th>
                    {weekDates.map((date, index) => {
                      const { dayName, dateStr } = formatDateHeader(date);
                      const year = date.getFullYear();
                      const month = (date.getMonth() + 1).toString().padStart(2, '0');
                      const day = date.getDate().toString().padStart(2, '0');
                      const dateKey = `${year}-${month}-${day}`;
                      const count = calendarEvents.filter(e => e.date === dateKey).length;
                      
                      return (
                        <th key={index}>
                          {dayName} {dateStr}<br />
                          <small className='fw-bold'>{count.toString().padStart(2, '0')} Available</small>
                        </th>
                      );
                    })}
                  </tr>
                </thead>

                <tbody>
                  {timeSlots.map((slot, index) => (
                    <tr key={index}>
                      <td className='table-time'>{slot.label}</td>
                      {weekDates.map((date, dateIndex) => {
                        const events = getEventForSlot(date, slot.value);
                        const year = date.getFullYear();
                        const month = (date.getMonth() + 1).toString().padStart(2, '0');
                        const day = date.getDate().toString().padStart(2, '0');
                        const dateKey = `${year}-${month}-${day}`;
                        
                        const isSelected = formData.date === dateKey && formData.time_from === `${slot.value}:00:00`;
                        
                        return (
                          <td key={dateIndex}>
                            {events.length > 0 ? (
                              <div 
                                className={`slot available ${selectedAppointment?.id === events[0].id ? 'selected' : ''}`}
                                style={{ cursor: 'pointer' }}
                                onClick={() => handleAppointmentSelect(events[0])}
                              >
                                {selectedAppointment?.id === events[0].id ? (
                                  <div className="sec-btn-sm h-100">Service Selected</div>
                                ) : (
                                  <>
                                    <strong>Available</strong><br />
                                    {events.map((evt, i) => (
                                      <small key={i}>{evt.time_from} - {evt.time_to}<br /></small>
                                    ))}
                                  </>
                                )}
                              </div>
                            ) : (
                              <div 
                                className={`slot empty ${isSelected ? 'selected' : ''}`}
                                style={{ cursor: 'pointer', minHeight: '50px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                onClick={() => handleEmptySlotClick(date, slot.value)}
                              >
                                {isSelected && <div className="third-btn-sm">Selected</div>}
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

            <div className="d-flex justify-content-end align-items-center gap-2 mt-3">
              <button className="prev-btn rounded-2 px-4 py-2" onClick={handlePrevStep}>
                Previous
              </button>
              <button className="sec-btn rounded-2 px-5 py-2" onClick={handleNextStep}>
                Next
              </button>
            </div>
          </div>

          {/* STEP 3: Add-on Services */}
          <div className={`step-3-container ${currentStep === 3 ? '' : 'd-none'}`}>
            <div className="row mt-3 w-100 g-0">
              <div className="login-title mb-2 mt-2">Service request for property</div>
              <label htmlFor="notes" className="form-label mb-1">Add-on Services</label>
              
              {listsData?.AdditionService?.map((addon) => (
                <div key={addon.id} className="col-md-2 mb-3 col-20-per">
                  <div 
                    className={`bg-light-gray p-3 rounded-3 h-100 ${selectedAddons.find(a => a.id === addon.id) ? 'active' : ''}`}
                    style={{ cursor: 'pointer' }}
                    onClick={() => handleAddonToggle(addon)}
                  >
                    <img 
                      src={addon.image} 
                      className='img-fluid w-100' 
                      alt={addon.name}
                      onError={(e) => {
                        e.target.src = '/assets/service-img.png';
                      }}
                    />
                    <div className="d-flex justify-content-between align-items-center gap-1 mt-2">
                      <h3 className='dashboard-routes-sub m-0'>{addon.name}</h3>
                      <div className='third-btn-sm p-1 rounded-2'>${addon.price}</div>
                    </div>
                  </div>
                </div>
              ))}

              <div className="d-flex justify-content-end align-items-center mb-3 gap-2">
                <button className="prev-btn rounded-2 px-4 py-2" onClick={handlePrevStep}>
                  Previous
                </button>
                <button className="sec-btn rounded-2 px-5 py-2" onClick={handleNextStep}>
                  Next
                </button>
              </div>
            </div>
          </div>

          {/* STEP 4: Payment */}
          <div className={`step-4-container ${currentStep === 4 ? '' : 'd-none'}`}>
            <div className="row mt-3 w-100 g-0">
              <div className="login-title mb-2 mt-2">Service request for property</div>
              <div className="col-md-6 mb-3">
                <label htmlFor="notes" className="form-label mb-1">Total cost</label>
                <div className='total-payments p-3 rounded-3'>
                  <div className='d-flex justify-content-between gap-4 align-items-center mb-2'>
                    <h3 className='service-desc m-0'>{selectedPlan?.title || selectedServiceType?.name || 'Service'}</h3>
                    <h4 className='service-price m-0'>${formData.price} </h4>
                  </div>
                  
                  {selectedAddons.length > 0 && (
                    <>
                      <div className='d-flex justify-content-between gap-4 align-items-center mb-2'>
                        <h3 className='service-desc m-0'>Add-on services</h3>
                        <h4 className='service-price m-0'>${formData.addition_service_price} </h4>
                      </div>
                      {selectedAddons.map((addon) => (
                        <div key={addon.id} className='d-flex justify-content-between gap-4 align-items-center mb-2 px-2'>
                          <h3 className='property-management-card-address m-0'>{addon.name}</h3>
                          <h4 className='sub-service-price m-0'>${addon.price} </h4>
                        </div>
                      ))}
                    </>
                  )}
                  
                  <div className='d-flex justify-content-between gap-4 align-items-center'>
                    <h3 className='service-desc m-0'>Total</h3>
                    <h4 className='service-total-price m-0'>${formData.total_price} </h4>
                  </div>
                </div>
              </div>
              
              <div className="col-md-6 mb-3">
                <label htmlFor="notes" className="form-label mb-1">Payment method </label>
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
                
                <div className="payment-inputs-container p-3 rounded-3 mt-2">
                  <div className="row">
                    <div className="col-12">
                      <div className="mb-3 w-100 position-relative">
                        <label htmlFor="cardNumber" className="form-label mb-1">Card number</label>
                        <div className="input-with-icon">
                          <img src="/assets/pay-card-icon-1.svg" className="input-icon" alt="" />
                          <input
                            type="text"
                            className="form-control rounded-2 py-2 px-3 ps-5 w-100"
                            id="cardNumber"
                            placeholder="1234 5678 4321 5678"
                            required
                          />
                        </div>
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div className="mb-2 w-100 position-relative">
                        <label htmlFor="expiryDate" className="form-label mb-1">Completion date</label>
                        <div className="input-with-icon">
                          <img src="/assets/pay-card-icon-2.svg" className="input-icon" alt="" />
                          <input
                            type="text"
                            className="form-control rounded-2 py-2 px-3 ps-5 w-100"
                            id="expiryDate"
                            placeholder="12/28"
                            required
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div className="col-md-6">
                      <div className="mb-2 w-100 position-relative">
                        <label htmlFor="cvv" className="form-label mb-1">Code</label>
                        <div className="input-with-icon">
                          <img src="/assets/pay-card-icon-3.svg" className="input-icon" alt="" />
                          <input
                            type="text"
                            className="form-control rounded-2 py-2 px-3 ps-5 w-100"
                            id="cvv"
                            placeholder="CVV"
                            required
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="d-flex justify-content-end align-items-center mb-3 gap-2">
                <button className="prev-btn rounded-2 px-4 py-2" onClick={handlePrevStep}>
                  Previous
                </button>
                <button 
                  className="sec-btn rounded-2 px-5 py-2" 
                  onClick={handleNextStep}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <style>{`
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
          margin: 10px 0;
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
        
        .slot.available {
          cursor: pointer;
          transition: all 0.3s ease;
        }
        
        .slot.available:hover {
          background-color: #f0f0f0;
        }
        
        .slot.available.selected {
          background-color: #d4edda;
          border: 2px solid #28a745;
        }
        
        .slot.empty {
          transition: all 0.3s ease;
        }
        
        .slot.empty:hover {
          background-color: #f8f9fa;
        }
        
        .slot.empty.selected {
          background-color: #fff3cd;
          border: 2px solid #ffc107;
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
      `}</style>
    </section>
  );
};

export default DashboardServicesCleaningRequestMain;