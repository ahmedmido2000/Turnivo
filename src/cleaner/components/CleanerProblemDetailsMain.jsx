import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useSearchParams, Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import CleanerHeader from './CleanerHeader';
import { getProviderReportProblemView } from '../../api/reportProblemApi';
import { selectAccessToken } from '../../store/authSlice';

const CleanerProblemDetailsMain = ({ onMobileMenuClick }) => {
  const [problemDetails, setProblemDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const [searchParams] = useSearchParams();
  const problemId = searchParams.get('id');
  const accessToken = useSelector(selectAccessToken);

  // Fetch problem details
  useEffect(() => {
    const fetchDetails = async () => {
      if (!problemId || !accessToken) return;

      try {
        setIsLoading(true);
        const response = await getProviderReportProblemView(accessToken, problemId);

        if (response.status === 1 && response.data && response.data.length > 0) {
          setProblemDetails(response.data[0]);
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Problem details not found',
          });
        }
      } catch (error) {
        console.error('Error fetching problem details:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.message || 'Failed to load problem details',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchDetails();
  }, [problemId, accessToken]);

  // Get status badge class and text
  const getStatusInfo = (status) => {
    switch (status) {
      case 0: return { className: 'new-badge', text: 'Pending' };
      case 1: return { className: 'progress-badge', text: 'In Progress' };
      case 2: return { className: 'complete-badge', text: 'Resolved' };
      case 3: return { className: 'reject-badge', text: 'Rejected' };
      default: return { className: 'new-badge', text: 'Pending' };
    }
  };

  // Get problem type text
  const getProblemType = (type) => {
    switch (type) {
      case 1: return 'Issue with a Home Service';
      case 2: return 'Technical Issue with the App';
      default: return 'General Issue';
    }
  };

  return (
    <section>
      <CleanerHeader title="Problem Details" onMobileMenuClick={onMobileMenuClick} />
      <div className="dashboard-home-content px-3 mt-2">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h6 className="dashboard-routes-sub m-0">Problem Details</h6>
          <Link to="/cleaner/my-problems" className="sec-btn rounded-2 px-3 py-2 text-decoration-none">
            Back to My Problems
          </Link>
        </div>

        {isLoading ? (
          <div className="text-center mt-4">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : !problemDetails ? (
          <div className="text-center mt-4">
            <p className="text-muted">Problem details not found</p>
          </div>
        ) : (
          <div className="row">
            {/* Property Card */}
            <div className="col-12">
              <div className="property-management-card mt-3 w-100">
                <div className="d-flex align-items-start flex-column flex-md-row gap-3 w-100">
                  <img 
                    src={problemDetails.property_id?.image || '/assets/property-management-card-img.png'} 
                    className='property-management-card-img-3' 
                    alt="Property" 
                  />
                  <div className="d-flex flex-column align-items-start gap-2 w-100">
                    <div className="d-flex justify-content-between w-100 align-items-center">
                      <h6 className="property-management-card-title m-0">
                        {problemDetails.property_id?.name || 'Property Name'}
                      </h6>
                      <div className={`villa-badge py-1 px-3 rounded-pill`}>
                        {problemDetails.property_id?.property_type_id?.name || 'Property'}
                      </div>
                    </div>
                    <div className="d-flex align-items-center">
                      <img src="/assets/location.svg" className='img-fluid' alt="location" />
                      <p className="property-management-card-address m-0">
                        {problemDetails.property_id?.address || 'Address not available'}
                      </p>
                    </div>
                    <div className="d-flex gap-3 align-items-center flex-wrap">
                      <div className="d-flex align-items-center gap-1">
                        <img src="/assets/property-card-icon-1.svg" className='img-fluid' alt="floors" />
                        <h6 className="property-management-card-icon-label m-0">
                          {problemDetails.property_id?.floor || 0} floors
                        </h6>
                      </div>
                      <div className='card-border-right'>|</div>
                      <div className="d-flex align-items-center gap-1">
                        <img src="/assets/property-card-icon-2.svg" className='img-fluid' alt="rooms" />
                        <h6 className="property-management-card-icon-label m-0">
                          {problemDetails.property_id?.number_room || 0} rooms
                        </h6>
                      </div>
                      <div className='card-border-right'>|</div>
                      <div className="d-flex align-items-center gap-1">
                        <img src="/assets/property-card-icon-3.svg" className='img-fluid' alt="area" />
                        <h6 className="property-management-card-icon-label m-0">
                          {problemDetails.property_id?.area || 0} m²
                        </h6>
                      </div>
                      <div className='card-border-right'>|</div>
                      <div className="d-flex align-items-center gap-1">
                        <img src="/assets/property-card-icon-4.svg" className='img-fluid' alt="bathrooms" />
                        <h6 className="property-management-card-icon-label m-0">
                          {problemDetails.property_id?.number_bathroom || 0} bathrooms
                        </h6>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Problem Info Card */}
            <div className="col-12 mt-3">
              <div className="d-flex align-items-center justify-content-between p-3 gap-2 w-100 materials-cards rounded-4">
                <div className="d-flex w-100 align-items-start flex-column gap-3">
                  <div className="d-flex justify-content-between align-items-center w-100">
                    <h6 className="property-problem-title mb-0">Problem Information</h6>
                    <div className={`${getStatusInfo(problemDetails.status).className} px-3 py-1 rounded-2`}>
                      {getStatusInfo(problemDetails.status).text}
                    </div>
                  </div>
                  
                  <div className="d-flex flex-column gap-2 w-100">
                    <div className="d-flex align-items-center gap-2">
                      <span className="fw-semibold">Problem Type:</span>
                      <div className="problem-type-badge d-flex align-items-center gap-2 p-2 rounded-2">
                        <img src="/assets/warning.svg" alt="type" />
                        <span>{getProblemType(problemDetails.type)}</span>
                      </div>
                    </div>
                    
                    <div className="d-flex align-items-center gap-2">
                      <span className="fw-semibold">Reported On:</span>
                      <div className="d-flex align-items-center gap-1">
                        <img src="/assets/calendar-3.svg" alt="calendar" />
                        <span>{problemDetails.created_at || 'N/A'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Client Info */}
            <div className="col-12 mt-3">
              <h6 className="property-problem-title mb-2">Client Information</h6>
              <div className="d-flex align-items-center gap-3 p-3 materials-cards rounded-4">
                <img 
                  src={problemDetails.client?.avatar || '/assets/user.png'} 
                  className='provider-rate' 
                  alt="client" 
                />
                <div>
                  <h6 className='login-title m-0'>{problemDetails.client?.name || 'Client Name'}</h6>
                  <h6 className="training-details-card-desc m-0 mt-1">Property Owner</h6>
                </div>
              </div>
            </div>

            {/* Problem Description */}
            <div className="col-12 mt-3">
              <h6 className="property-problem-title mb-2">Problem Description</h6>
              <div className="training-card p-3 rounded-3">
                <p className='m-0 problem-desc'>
                  {problemDetails.description || 'No description provided'}
                </p>
              </div>
            </div>

            {/* Property Special Notes */}
            {problemDetails.property_id?.specail_note && (
              <div className="col-12 mt-3">
                <h6 className="property-problem-title mb-2">Property Notes</h6>
                <div className="training-card p-3 rounded-3">
                  <p className='m-0 problem-desc'>
                    {problemDetails.property_id.specail_note}
                  </p>
                </div>
              </div>
            )}

            {/* Platform Info */}
            {problemDetails.property_id?.platform_id?.name && (
              <div className="col-12 mt-3">
                <h6 className="property-problem-title mb-2">Booking Platform</h6>
                <div className="d-flex align-items-center gap-2">
                  <div className="bnb-badge d-flex align-items-center gap-2 p-2 rounded-2">
                    <img src="/assets/bnb.svg" alt="platform" />
                    <span>{problemDetails.property_id.platform_id.name}</span>
                  </div>
                  {problemDetails.property_id?.platform_link && (
                    <a 
                      href={problemDetails.property_id.platform_link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="main-btn rounded-2 px-3 py-2 text-decoration-none"
                    >
                      View Listing
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default CleanerProblemDetailsMain;
