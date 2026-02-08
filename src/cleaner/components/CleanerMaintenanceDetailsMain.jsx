import React, { useState, useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useSearchParams, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import CleanerHeader from './CleanerHeader';
import {
  getMaintenanceServiceDetails,
  addMaintenanceServiceBeforeImages,
  addMaintenanceServiceAfterImages,
  rejectMaintenanceService,
  changeStatusMaintenanceService,
} from '../../api/cleanerMaintenanceApi';
import { selectAccessToken } from '../../store/authSlice';

const CleanerMaintenanceDetailsMain = ({ onMobileMenuClick }) => {
  const navigate = useNavigate();
  const [beforeImages, setBeforeImages] = useState([]);
  const [afterImages, setAfterImages] = useState([]);
  const [newBeforeFiles, setNewBeforeFiles] = useState([]);
  const [newAfterFiles, setNewAfterFiles] = useState([]);
  const beforeInputRef = useRef(null);
  const afterInputRef = useRef(null);
  const [serviceDetails, setServiceDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploadingBefore, setIsUploadingBefore] = useState(false);
  const [isUploadingAfter, setIsUploadingAfter] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [rejectComment, setRejectComment] = useState('');
  const [submitComment, setSubmitComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [searchParams] = useSearchParams();
  const serviceId = searchParams.get('id');
  const accessToken = useSelector(selectAccessToken);

  // Fetch service details
  useEffect(() => {
    const fetchDetails = async () => {
      if (!serviceId || !accessToken) return;

      try {
        setIsLoading(true);
        const response = await getMaintenanceServiceDetails(accessToken, serviceId);

        if (response.status === 1 && response.data && response.data.length > 0) {
          const details = response.data[0];
          setServiceDetails(details);
          // Set existing images from API
          if (details.service_images_befor && details.service_images_befor.length > 0) {
            setBeforeImages(details.service_images_befor);
          }
          if (details.service_images_after && details.service_images_after.length > 0) {
            setAfterImages(details.service_images_after);
          }
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Service details not found',
          });
        }
      } catch (error) {
        console.error('Error fetching service details:', error);
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
  }, [serviceId, accessToken]);

  // Handle selecting before images
  const handleBeforeSelect = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    setNewBeforeFiles(prev => [...prev, ...files]);
  };

  // Handle selecting after images
  const handleAfterSelect = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    setNewAfterFiles(prev => [...prev, ...files]);
  };

  // Upload before images
  const handleBeforeUpload = async () => {
    if (newBeforeFiles.length === 0) {
      Swal.fire({
        icon: 'warning',
        title: 'No Images',
        text: 'Please select images first',
      });
      return;
    }

    if (!serviceId || !accessToken) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Service ID or access token missing',
      });
      return;
    }

    try {
      setIsUploadingBefore(true);
      const response = await addMaintenanceServiceBeforeImages(accessToken, serviceId, newBeforeFiles);

      if (response.status === 1) {
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: response.message || 'Before images uploaded successfully',
        });
        setNewBeforeFiles([]);
        // Refresh data
        const refreshResponse = await getMaintenanceServiceDetails(accessToken, serviceId);
        if (refreshResponse.status === 1 && refreshResponse.data?.[0]) {
          setBeforeImages(refreshResponse.data[0].service_images_befor || []);
        }
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Failed',
          text: response.message || 'Failed to upload before images',
        });
      }
    } catch (error) {
      console.error('Error uploading before images:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.message || 'Failed to upload before images',
      });
    } finally {
      setIsUploadingBefore(false);
    }
  };

  // Upload after images
  const handleAfterUpload = async () => {
    if (newAfterFiles.length === 0) {
      Swal.fire({
        icon: 'warning',
        title: 'No Images',
        text: 'Please select images first',
      });
      return;
    }

    if (!serviceId || !accessToken) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Service ID or access token missing',
      });
      return;
    }

    try {
      setIsUploadingAfter(true);
      const response = await addMaintenanceServiceAfterImages(accessToken, serviceId, newAfterFiles);

      if (response.status === 1) {
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: response.message || 'After images uploaded successfully',
        });
        setNewAfterFiles([]);
        // Refresh data
        const refreshResponse = await getMaintenanceServiceDetails(accessToken, serviceId);
        if (refreshResponse.status === 1 && refreshResponse.data?.[0]) {
          setAfterImages(refreshResponse.data[0].service_images_after || []);
        }
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Failed',
          text: response.message || 'Failed to upload after images',
        });
      }
    } catch (error) {
      console.error('Error uploading after images:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.message || 'Failed to upload after images',
      });
    } finally {
      setIsUploadingAfter(false);
    }
  };

  // Remove selected before file
  const removeBeforeFile = (index) => {
    setNewBeforeFiles(prev => prev.filter((_, i) => i !== index));
  };

  // Remove selected after file
  const removeAfterFile = (index) => {
    setNewAfterFiles(prev => prev.filter((_, i) => i !== index));
  };

  // Get status badge class
  const getStatusBadgeClass = (status) => {
    switch (status?.id) {
      case 0: return 'new-badge';
      case 1: return 'progress-badge';
      case 2: return 'complete-badge';
      case 3: return 'reject-badge';
      default: return 'new-badge';
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
        return 'Submit the order';
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
  // Open image in lightbox
  const openImageModal = (imageSrc) => {
    setSelectedImage(imageSrc);
  };

  // Close image modal
  const closeImageModal = () => {
    setSelectedImage(null);
  };

  // Handle reject order
  const handleRejectOrder = async () => {
    if (!rejectComment.trim()) {
      Swal.fire({
        icon: 'warning',
        title: 'Comment Required',
        text: 'Please enter a reason for rejection',
      });
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await rejectMaintenanceService(accessToken, {
        service_id: serviceId,
        comment: rejectComment.trim(),
      });

      if (response.status === 1) {
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: response.message || 'Order rejected successfully',
        });
        setShowRejectModal(false);
        setRejectComment('');
        // Refresh data
        const refreshResponse = await getMaintenanceServiceDetails(accessToken, serviceId);
        if (refreshResponse.status === 1 && refreshResponse.data?.[0]) {
          setServiceDetails(refreshResponse.data[0]);
        }
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Failed',
          text: response.message || 'Failed to reject order',
        });
      }
    } catch (error) {
      console.error('Error rejecting order:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.message || 'Failed to reject order',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle submit order
  const handleSubmitOrder = async () => {
    if (!submitComment.trim()) {
      Swal.fire({
        icon: 'warning',
        title: 'Comment Required',
        text: 'Please enter a comment',
      });
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await changeStatusMaintenanceService(accessToken, {
        service_id: serviceId,
        comment: submitComment.trim(),
      });

      if (response.status === 1) {
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: response.message || 'Order submitted successfully',
        });
        setShowSubmitModal(false);
        setSubmitComment('');
        // Refresh data
        const refreshResponse = await getMaintenanceServiceDetails(accessToken, serviceId);
        if (refreshResponse.status === 1 && refreshResponse.data?.[0]) {
          setServiceDetails(refreshResponse.data[0]);
        }
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Failed',
          text: response.message || 'Failed to submit order',
        });
      }
    } catch (error) {
      console.error('Error submitting order:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.message || 'Failed to submit order',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section>
      <CleanerHeader title="Maintenance Details" onMobileMenuClick={onMobileMenuClick} />
      <div className="dashboard-home-content px-3 mt-2">
        {isLoading ? (
          <div className="text-center mt-4">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : !serviceDetails ? (
          <div className="text-center mt-4">
            <p className="text-muted">Service details not found</p>
          </div>
        ) : (
        <div className="row">
          <div className="col-12">
            <div className=" mt-3 w-100">
              <div className="d-flex align-items-start flex-column flex-md-row gap-3 w-100">
                <div className="d-flex flex-column align-items-start gap-2 w-100">
                <div className="property-management-card mt-3 w-100">
                  <div className="d-flex align-items-start flex-column flex-md-row gap-3 w-100">
                    <img 
                      src={serviceDetails.property_id?.image || '/assets/property-management-card-img.png'} 
                      className='property-management-card-img-3' 
                      alt="Property" 
                    />
                    <div className="d-flex flex-column align-items-start gap-2 w-100">
                      <div className="d-flex justify-content-between w-100 align-items-center">
                        <h6 className="property-management-card-title m-0">
                          {serviceDetails.property_id?.name || 'Property Name'}
                        </h6>
                        <div className={`villa-badge py-1 px-3 rounded-pill`}>
                          {serviceDetails.property_id?.property_type_id?.name || 'Property'}
                        </div>
                      </div>
                      <div className="d-flex align-items-center">
                        <img src="/assets/location.svg" className='img-fluid' alt="location" />
                        <p className="property-management-card-address m-0">
                          {serviceDetails.property_id?.address || 'Address not available'}
                        </p>
                      </div>
                      <div className="d-flex gap-3 align-items-center flex-wrap">
                        <div className="d-flex align-items-center gap-1">
                          <img src="/assets/property-card-icon-1.svg" className='img-fluid' alt="location" />
                          <h6 className="property-management-card-icon-label m-0">
                            {serviceDetails.property_id?.floor || 0} floors
                          </h6>
                        </div>
                        <div className='card-border-right'>|</div>
                        <div className="d-flex align-items-center gap-1">
                          <img src="/assets/property-card-icon-2.svg" className='img-fluid' alt="location" />
                          <h6 className="property-management-card-icon-label m-0">
                            {serviceDetails.property_id?.number_room || 0} rooms
                          </h6>
                        </div>
                        <div className='card-border-right'>|</div>
                        <div className="d-flex align-items-center gap-1">
                          <img src="/assets/property-card-icon-3.svg" className='img-fluid' alt="location" />
                          <h6 className="property-management-card-icon-label m-0">
                            {serviceDetails.property_id?.area || 0} m
                          </h6>
                        </div>
                        <div className='card-border-right'>|</div>
                        <div className="d-flex align-items-center gap-1">
                          <img src="/assets/property-card-icon-4.svg" className='img-fluid' alt="location" />
                          <h6 className="property-management-card-icon-label m-0">
                            {serviceDetails.property_id?.number_bathroom || 0} bathrooms
                          </h6>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <h6 className="property-problem-title mb-2 mt-2">Maintenance details</h6>
                </div>
              </div>
            </div>
          </div>
          <div className="col-12">
                <div className="d-flex align-items-center justify-content-between p-3 gap-2 w-100 materials-cards rounded-4 mb-3">
      <div className="d-flex w-100 align-items-start flex-column flex-md-row gap-2">
        <img 
          src={serviceDetails.property_id?.image || "/assets/problem-img-2.png"} 
          className='img-fluid materials-img' 
          alt="location" 
        />   
        <div className='d-flex flex-column gap-2 align-items-start w-100'>
          <div className="d-flex justify-content-between align-items-center w-100">
            <h6 className="property-problem-title mb-0">
              {serviceDetails.maintenance_service_type_id?.name || 'Maintenance Service'}
            </h6>
            <div className={`${getStatusBadgeClass(serviceDetails.status)} px-2 p-1 rounded-2`}>
              {serviceDetails.status?.name || 'New'}
            </div>
          </div>
            <div className="d-flex align-items-center gap-1">
            <img src="/assets/location-2.svg" alt="location" />
            <p className="dashboard-home-card-2-desc-3 m-0">
              {serviceDetails.property_id?.address || 'Address not available'}
            </p>
          </div>
            <div className="bnb-badge d-flex align-items-center gap-2 p-2 rounded-2">
              <img style={{width:"20px"}} src="/assets/warning.svg" alt="importance" />
              <span>{serviceDetails.maintenance_importance_type_id?.name || 'Normal'}</span>
            </div>
           <h6 className="property-problem-title mb-0 mt-2">
             {serviceDetails.maintenance_service_type_id?.name || 'Service Type'}
           </h6>
          {serviceDetails.date && (
            <div className="d-flex align-items-center gap-1">
              <img src="/assets/calendar-3.svg" alt="calendar" />
              <p className="dashboard-home-card-2-desc-3 m-0">{serviceDetails.date}</p>
            </div>
          )}
          {(serviceDetails.time_from || serviceDetails.time_to) && (
            <div className="d-flex align-items-center gap-1">
              <img src="/assets/clock.svg" alt="clock" />
              <p className="dashboard-home-card-2-desc-3 mb-0">
                {serviceDetails.time_from || '--:--'} - {serviceDetails.time_to || '--:--'}
              </p>
            </div>
          )}
          <div className="d-flex align-items-center gap-1">
            <img src="/assets/calendar-3.svg" alt="calendar" />
            <p className="dashboard-home-card-2-desc-3 m-0">
              Created: {serviceDetails.created_at || 'N/A'}
            </p>
          </div>
        </div>
      </div>
    </div>
          </div>
            <h6 className="property-problem-title mb-2 ">Room pictures before and after</h6>
            <div className="d-flex gap-2 align-items-start flex-wrap">
                <div className='rating-stars-bg p-2 rounded-2'>
                    <h3 className='form-label mb-2'>Before cleaning</h3>
                    <div className="d-flex gap-2 align-items-center flex-wrap">
                        <div 
                          className="add-room-btn d-flex flex-column align-items-center justify-content-center gap-2" 
                          onClick={() => beforeInputRef.current.click()}
                          style={{ cursor: 'pointer' }}
                        >
                          <img src="/assets/gallery-add.svg" alt="gallery" />
                          <h6 className='table-time m-0'>Add photos</h6>
                        </div>
                        {/* Existing images from API */}
                        {beforeImages.map((img, idx) => (
                          <img 
                            key={`existing-${idx}`} 
                            src={typeof img === 'string' ? img : img.image} 
                            className='added-img' 
                            alt="before"
                            style={{ cursor: 'pointer' }}
                            onClick={() => openImageModal(typeof img === 'string' ? img : img.image)}
                          />
                        ))}
                        {/* New selected files */}
                        {newBeforeFiles.map((file, idx) => (
                          <div key={`new-${idx}`} className="position-relative">
                            <img 
                              src={URL.createObjectURL(file)} 
                              className='added-img' 
                              alt="new" 
                            />
                            <button 
                              className="btn btn-sm btn-danger position-absolute top-0 end-0 rounded-circle p-0"
                              style={{ width: '20px', height: '20px', fontSize: '10px' }}
                              onClick={() => removeBeforeFile(idx)}
                            >
                              ×
                            </button>
                          </div>
                        ))}
                    </div>
                    <input 
                      type="file" 
                      multiple 
                      accept="image/*" 
                      ref={beforeInputRef} 
                      onChange={handleBeforeSelect} 
                      style={{display: 'none'}} 
                    />
                    {newBeforeFiles.length > 0 && (
                      <button 
                        className="main-btn rounded-2 px-3 py-2 mt-2 d-flex align-items-center gap-2"
                        onClick={handleBeforeUpload}
                        disabled={isUploadingBefore}
                      >
                        {isUploadingBefore ? (
                          <>
                            <span className="spinner-border spinner-border-sm" role="status"></span>
                            Uploading...
                          </>
                        ) : (
                          <>
                            <img src="/assets/upload.svg" alt="upload" style={{ filter: 'brightness(0) invert(1)' }} />
                            Upload {newBeforeFiles.length} image(s)
                          </>
                        )}
                      </button>
                    )}
                </div>
                <div className='rating-stars-bg p-2 rounded-2'>
                    <h3 className='form-label mb-2'>After cleaning</h3>
                    <div className="d-flex gap-2 align-items-center flex-wrap">
                        <div 
                          className="add-room-btn d-flex flex-column align-items-center justify-content-center gap-2" 
                          onClick={() => afterInputRef.current.click()}
                          style={{ cursor: 'pointer' }}
                        >
                          <img src="/assets/gallery-add.svg" alt="gallery" />
                          <h6 className='table-time m-0'>Add photos</h6>
                        </div>
                        {/* Existing images from API */}
                        {afterImages.map((img, idx) => (
                          <img 
                            key={`existing-${idx}`} 
                            src={typeof img === 'string' ? img : img.image} 
                            className='added-img' 
                            alt="after"
                            style={{ cursor: 'pointer' }}
                            onClick={() => openImageModal(typeof img === 'string' ? img : img.image)}
                          />
                        ))}
                        {/* New selected files */}
                        {newAfterFiles.map((file, idx) => (
                          <div key={`new-${idx}`} className="position-relative">
                            <img 
                              src={URL.createObjectURL(file)} 
                              className='added-img' 
                              alt="new" 
                            />
                            <button 
                              className="btn btn-sm btn-danger position-absolute top-0 end-0 rounded-circle p-0"
                              style={{ width: '20px', height: '20px', fontSize: '10px' }}
                              onClick={() => removeAfterFile(idx)}
                            >
                              ×
                            </button>
                          </div>
                        ))}
                    </div>
                    <input 
                      type="file" 
                      multiple 
                      accept="image/*" 
                      ref={afterInputRef} 
                      onChange={handleAfterSelect} 
                      style={{display: 'none'}} 
                    />
                    {newAfterFiles.length > 0 && (
                      <button 
                        className="main-btn rounded-2 px-3 py-2 mt-2 d-flex align-items-center gap-2"
                        onClick={handleAfterUpload}
                        disabled={isUploadingAfter}
                      >
                        {isUploadingAfter ? (
                          <>
                            <span className="spinner-border spinner-border-sm" role="status"></span>
                            Uploading...
                          </>
                        ) : (
                          <>
                            <img src="/assets/upload.svg" alt="upload" style={{ filter: 'brightness(0) invert(1)' }} />
                            Upload {newAfterFiles.length} image(s)
                          </>
                        )}
                      </button>
                    )}
                </div>

            </div>
            <h6 className="property-problem-title my-2">Employee</h6>
            <div className="d-flex align-items-center gap-2 w-100">
              <img 
                src={serviceDetails.provider?.avatar || '/assets/user.png'} 
                className='provider-rate' 
                alt="user" 
              />
              <div>
                <h6 className='login-title m-0'>{serviceDetails.provider?.name || 'Not Assigned'}</h6>
                <h6 className="training-details-card-desc m-0 mt-1">Provider</h6>
              </div>
            </div>
            <h6 className="property-problem-title my-2">Problem description</h6>
              <div className="d-flex gap-3 align-items-center flex-wrap flex-sm-nowrap">
                <div className='training-card p-2 rounded-2'>
                    <p className='m-0 problem-desc'>
                      {serviceDetails.description || 'No description provided'}
                    </p>
                </div>
              </div>
        <div className="d-flex gap-2 align-items-center justify-content-between flex-wrap my-3">
                                      <div className="d-flex gap-2 flex-wrap">
                {shouldShowStatusButton() && (
                <button 
                  className="sec-btn rounded-2 px-md-4 py-2"
                  onClick={() => setShowSubmitModal(true)}
                >
                    {getStatusButtonText()}
                </button>
                )}
                <button 
                  className="btn btn-outline-danger py-2 px-4 rounded-2"
                  onClick={() => setShowRejectModal(true)}
                >
                  Reject order
                </button>
                <button 
                  className="btn btn-outline-warning py-2 px-4 rounded-2"
                  onClick={handleReportProblem}
                >
                  Report a Problem
                </button>
                </div>
                      <button 
            type="submit" 
            className="sec-btn rounded-2 py-2 px-3 d-flex align-items-center justify-content-center gap-2 w-50-100"
          >
            <img src="/assets/key.svg" alt="key" />
            <span>smart key ({serviceDetails.login_code || 'N/A'})</span>
                        </button>
          </div>
        </div>
        )}
      </div>

      {/* Image Lightbox Modal */}
      {selectedImage && (
        <div 
          className="image-lightbox-overlay"
          onClick={closeImageModal}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.9)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            cursor: 'pointer'
          }}
        >
          <button
            onClick={closeImageModal}
            style={{
              position: 'absolute',
              top: '20px',
              right: '20px',
              background: 'rgba(255, 255, 255, 0.2)',
              border: 'none',
              color: 'white',
              fontSize: '30px',
              width: '50px',
              height: '50px',
              borderRadius: '50%',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'background 0.3s'
            }}
            onMouseEnter={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.4)'}
            onMouseLeave={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.2)'}
          >
            ×
          </button>
          <img 
            src={selectedImage} 
            alt="Full size"
            onClick={(e) => e.stopPropagation()}
            style={{
              maxWidth: '90%',
              maxHeight: '90%',
              objectFit: 'contain',
              borderRadius: '8px',
              cursor: 'default'
            }}
          />
        </div>
      )}

      {/* Submit Order Modal */}
      {showSubmitModal && (
        <div 
          className="modal show d-block" 
          style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
          onClick={() => setShowSubmitModal(false)}
        >
          <div className="modal-dialog modal-dialog-centered" onClick={(e) => e.stopPropagation()}>
            <div className="modal-content rounded-4">
              <div className="modal-header border-0">
                <h5 className="m-0 dashboard-home-card-2-title-1">Submit Order</h5>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={() => setShowSubmitModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div>
                  <label className="dashboard-home-card-2-title-1 fw-bold">Comment</label>
                  <textarea
                    className="form-control rounded-2 py-2"
                    placeholder="Enter your comment"
                    rows="4"
                    value={submitComment}
                    onChange={(e) => setSubmitComment(e.target.value)}
                  ></textarea>
                </div>
              </div>
              <div className="modal-footer border-0">
                <button
                  type="button"
                  className="btn btn-secondary rounded-2 px-4 py-2"
                  onClick={() => setShowSubmitModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="sec-btn rounded-2 px-4 py-2"
                  disabled={isSubmitting}
                  onClick={handleSubmitOrder}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reject Order Modal */}
      {showRejectModal && (
        <div 
          className="modal show d-block" 
          style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
          onClick={() => setShowRejectModal(false)}
        >
          <div className="modal-dialog modal-dialog-centered" onClick={(e) => e.stopPropagation()}>
            <div className="modal-content rounded-4">
              <div className="modal-header border-0">
                <h5 className="m-0 dashboard-home-card-2-title-1">What issue are you facing?</h5>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={() => setShowRejectModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div>
                  <label className="dashboard-home-card-2-title-1 fw-bold">Cause of the problem</label>
                  <textarea
                    className="form-control rounded-2 py-2"
                    placeholder="Enter cause of the problem"
                    rows="4"
                    value={rejectComment}
                    onChange={(e) => setRejectComment(e.target.value)}
                  ></textarea>
                </div>
              </div>
              <div className="modal-footer border-0">
                <button
                  type="button"
                  className="btn btn-secondary rounded-2 px-4 py-2"
                  onClick={() => setShowRejectModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-danger rounded-2 px-4 py-2"
                  disabled={isSubmitting}
                  onClick={handleRejectOrder}
                >
                  {isSubmitting ? 'Submitting...' : 'Reject Order'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default CleanerMaintenanceDetailsMain;