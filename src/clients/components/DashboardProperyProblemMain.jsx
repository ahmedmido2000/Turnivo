import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getPropertyProblems } from '../../api/cleaningServiceApi';
import Swal from 'sweetalert2';
import ClientHeader from './ClientHeader';

const DashboardProperyProblemMain = ({ onMobileMenuClick }) => {
  // API state
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch property problems
  useEffect(() => {
    const fetchProblems = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const accessToken = localStorage.getItem('access_token');
        if (!accessToken) {
          throw new Error('No access token found. Please login again.');
        }
        
        const response = await getPropertyProblems(accessToken, currentPage);
        
        if (response && response.status === 1 && response.data && response.data[0]) {
          setProblems(response.data[0].items || []);
          setPagination(response.data[0]._meta || null);
        } else {
          throw new Error('Failed to fetch property problems');
        }
      } catch (err) {
        console.error('Error fetching property problems:', err);
        setError(err.message || 'Failed to fetch property problems');
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: err.message || 'Failed to fetch property problems. Please try again.',
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchProblems();
  }, [currentPage]);

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  // Get problem type label
  const getProblemTypeLabel = (type) => {
    return type === 1 ? 'Cleaning' : type === 2 ? 'Maintenance' : 'Other';
  };

  // Get status badge class
  const getStatusBadgeClass = (status) => {
    return status === 0 ? 'pending-badge' : 'processed-badge';
  };

  // Get status label
  const getStatusLabel = (status) => {
    return status === 0 ? 'Your request is pending' : 'Your request is Processed';
  };

  return (
    <section>
      <ClientHeader title="Report a problem request" onMobileMenuClick={onMobileMenuClick} />
      <div className="dashboard-home-content px-3 mt-2">
        <h2 className="mb-0 dashboard-title">Report a problem request</h2>
        
        {/* Loading state */}
        {loading && (
          <div className="text-center mt-4 mb-4">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        )}
        
        {/* Error state */}
        {error && !loading && (
          <div className="text-center mt-4 mb-4">
            <p className="text-danger">{error}</p>
          </div>
        )}
        
        {/* Problems list */}
        {!loading && !error && (
          <div className="row">
            {problems.length === 0 ? (
              <div className="col-12 text-center mt-4">
                <p>No property problems found.</p>
              </div>
            ) : (
              problems.map((problem) => (
                <div key={problem.id} className="col-12">
                  <Link 
                    to={`/client/property-problem-details?id=${problem.id}`}
                    className="text-decoration-none"
                    style={{ color: 'inherit' }}
                  >
                    <div className="property-management-card mt-3 w-100" style={{ cursor: 'pointer' }}>
                      <div className="d-flex align-items-start flex-column flex-md-row gap-3 w-100">
                        <div className="d-flex flex-column align-items-start gap-2 w-100">
                          <div className="sec-border w-100">
                            <div className="d-flex w-100 align-items-center gap-2">
                              <img 
                                src={problem.property_id?.image || '/assets/property-management-card-img.png'} 
                                className='property-management-card-img-2' 
                                alt="Property" 
                              />
                              <div className='d-flex flex-column gap-2 align-items-start'>
                                <div className='villa-badge py-1 px-3 rounded-pill'>
                                  {problem.property_id?.property_type_id?.name || 'Property'}
                                </div>
                                <div className="d-flex align-items-center">
                                  <img src="/assets/location.svg" className='img-fluid' alt="location" />
                                  <p className="property-management-card-address m-0">
                                    {problem.property_id?.address || 'N/A'}
                                  </p>
                                </div>
                              </div>
                            </div>
                            <div className="d-flex gap-3 align-items-center justify-content-between flex-wrap w-100 py-1 px-2 rounded-1 mt-2">
                              <div className="d-flex align-items-center gap-1">
                                <img src="/assets/property-card-icon-1.svg" className='img-fluid' alt="floors" />
                                <h6 className="property-management-card-icon-label m-0">
                                  {problem.property_id?.floor || 0} floors
                                </h6>
                              </div>
                              <div className='card-border-right'>|</div>
                              <div className="d-flex align-items-center gap-1">
                                <img src="/assets/property-card-icon-2.svg" className='img-fluid' alt="rooms" />
                                <h6 className="property-management-card-icon-label m-0">
                                  {problem.property_id?.number_room || 0} rooms
                                </h6>
                              </div>
                              <div className='card-border-right'>|</div>
                              <div className="d-flex align-items-center gap-1">
                                <img src="/assets/property-card-icon-3.svg" className='img-fluid' alt="area" />
                                <h6 className="property-management-card-icon-label m-0">
                                  {problem.property_id?.area || 0} m
                                </h6>
                              </div>
                              <div className='card-border-right'>|</div>
                              <div className="d-flex align-items-center gap-1">
                                <img src="/assets/property-card-icon-4.svg" className='img-fluid' alt="bathrooms" />
                                <h6 className="property-management-card-icon-label m-0">
                                  {problem.property_id?.number_bathroom || 0} bathrooms
                                </h6>
                              </div>
                            </div>
                          </div>
                          <div className="d-flex w-100 align-items-md-center flex-column flex-md-row gap-2 w-100">
                            <img 
                              src={problem.user?.avatar || '/assets/problem-img-1.png'} 
                              className='img-fluid problem-img' 
                              alt="user" 
                            />   
                            <div className='d-flex flex-column gap-2 align-items-start'>
                              <h6 className="property-problem-title mb-0">
                                {problem.property_id?.name || 'Property Problem'}
                              </h6>
                              <div className="d-flex align-items-center gap-1">
                                <h6 className="property-management-card-title m-0">Problem ID: </h6>
                                <p className="dashboard-card-link m-0">{problem.id}</p>
                              </div>
                              <div className="d-flex align-items-center gap-1">
                                <img src="/assets/calendar-3.svg" alt="calendar" />
                                <p className="dashboard-home-card-2-desc-3 m-0">
                                  {formatDate(problem.created_at)}
                                </p>
                              </div>
                            </div>
                          </div>
                          <div className="d-flex justify-content-between align-items-center w-100">
                            <h6 className="property-management-card-title mb-1 mt-2">Problem description</h6>
                            <div className='villa-badge py-1 px-3 rounded-pill'>
                              {getProblemTypeLabel(problem.type)}
                            </div>
                          </div>
                          <p className='problem-desc bg-white p-1 w-100 m-0'>
                            {problem.description || 'No description provided'}
                          </p>
                          <div className="d-flex justify-content-end w-100 gap-2" onClick={(e) => e.preventDefault()}>
                            <Link 
                              to={`/client/maintenance?property_id=${problem.property_id?.id}`} 
                              className="main-btn rounded-2 px-3 py-2 w-50-100 text-decoration-none"
                            >
                              Request maintenance service
                            </Link>
                            <Link 
                              to={`/client/cleaning-request?property_id=${problem.property_id?.id}`} 
                              className="sec-btn rounded-2 px-4 py-2 w-50-100 text-decoration-none"
                            >
                              Request cleaning service
                            </Link>
                          </div>
                          <div className={`${getStatusBadgeClass(problem.status)} w-100 py-2 text-center`}>
                            {getStatusLabel(problem.status)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              ))
            )}
          </div>
        )}
        
      </div>
    </section>
  );
};

export default DashboardProperyProblemMain;