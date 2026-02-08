import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectRoleId, selectAccessToken, selectCurrentUser } from '../../store/authSlice';
import { getNewCleanServices, getProgressCleanServices, providerCheckIn } from '../../api/cleanerCleaningApi';

/**
 * ScanHandler Component
 * 
 * This component handles redirects after scanning a QR code.
 * It checks the user's role and redirects them accordingly:
 * - Role 4 (Cleaner): Find cleaning service matching propertyId and redirect to details
 * - Role 6 (Guest): Redirect to guest/list
 * - Unauthenticated: Redirect to guest/login with propertyId
 */

const ScanHandler = () => {
  const { propertyId } = useParams();
  const navigate = useNavigate();
  const roleId = useSelector(selectRoleId);
  const accessToken = useSelector(selectAccessToken);
  const currentUser = useSelector(selectCurrentUser);
  const [statusMessage, setStatusMessage] = useState('Processing your QR code...');
  const [statusSubtitle, setStatusSubtitle] = useState('Please wait while we verify your identity');
  const [statusType, setStatusType] = useState('loading'); // loading, success, error

  // Function to find cleaning service matching propertyId for cleaner
  const findCleaningServiceByPropertyId = useCallback(async () => {
    if (!accessToken || !propertyId) {
      return null;
    }
    
    try {
      setStatusMessage('Searching for service...');
      setStatusSubtitle('Finding the matching property');
      
      // Search in new (pending) services first
      const newServicesResponse = await getNewCleanServices(accessToken);
      
      if (newServicesResponse?.status === 1 && newServicesResponse?.data?.[0]?.items) {
        const matchingService = newServicesResponse.data[0].items.find(
          service => {
            const propertyMatch = String(service.property_id?.id) === String(propertyId) || String(service.property_id) === String(propertyId);
            return propertyMatch;
          }
        );
        if (matchingService) {
          return matchingService.id;
        }
      }
      
      // Search in in-progress services
      const progressServicesResponse = await getProgressCleanServices(accessToken);
      
      if (progressServicesResponse?.status === 1 && progressServicesResponse?.data?.[0]?.items) {
        const matchingService = progressServicesResponse.data[0].items.find(
          service => {
            const propertyMatch = String(service.property_id?.id) === String(propertyId) || String(service.property_id) === String(propertyId);
            return propertyMatch;
          }
        );
        if (matchingService) {
          return matchingService.id;
        }
      }
      
      return null;
    } catch (error) {
      return null;
    }
  }, [accessToken, propertyId]);

  useEffect(() => {
    const handleRedirect = async () => {
      // If user is authenticated
      if (roleId) {
        switch (roleId) {
          case 4: {
            // Cleaner (Role ID: 4)
            // Find the cleaning service that matches propertyId
            const serviceId = await findCleaningServiceByPropertyId();
            
            if (serviceId) {
              // Fetch full service details to verify provider
              const newServicesResponse = await getNewCleanServices(accessToken);
              
              let matchingService = null;
              
              if (newServicesResponse?.status === 1 && newServicesResponse?.data?.[0]?.items) {
                matchingService = newServicesResponse.data[0].items.find(s => s.id === serviceId);
              }
              
              if (!matchingService) {
                const progressServicesResponse = await getProgressCleanServices(accessToken);
                
                if (progressServicesResponse?.status === 1 && progressServicesResponse?.data?.[0]?.items) {
                  matchingService = progressServicesResponse.data[0].items.find(s => s.id === serviceId);
                }
              }
              
              // Try both id and user_id for comparison
              const currentUserId = currentUser?.id || currentUser?.user_id;
              const providerId = matchingService?.provider?.id;
              
              const isAuthorized = matchingService && currentUserId && providerId && String(currentUserId) === String(providerId);
              
              // Check if current user is the provider of this service
              if (isAuthorized) {
                // User is the correct provider - execute check-in
                try {
                  await providerCheckIn(accessToken, serviceId);
                  
                  // Show success message
                  setStatusMessage('Check-in Successful!');
                  setStatusSubtitle('Welcome! You are checked in.');
                  setStatusType('success');
                  
                  // Wait 5 seconds then redirect to service details with fromQR flag
                  await new Promise(resolve => setTimeout(resolve, 5000));
                  navigate(`/cleaner/cleaning-details?id=${serviceId}&fromQR=true`);
                } catch (error) {
                  setStatusMessage('Check-in Failed');
                  setStatusSubtitle('An error occurred during check-in. Please try again.');
                  setStatusType('error');
                  
                  // Redirect to home after 5 seconds
                  await new Promise(resolve => setTimeout(resolve, 5000));
                  navigate('/');
                }
              } else {
                // User is not the provider - unauthorized
                setStatusMessage('Access Denied');
                setStatusSubtitle('You are not authorized for this service.');
                setStatusType('error');
                
                // Redirect to home after 5 seconds
                await new Promise(resolve => setTimeout(resolve, 5000));
                navigate('/');
              }
            } else {
              // No matching service found, redirect to cleaning requests
              setStatusMessage('Service Not Found');
              setStatusSubtitle('No service found for this property. Redirecting...');
              setStatusType('error');
              
              await new Promise(resolve => setTimeout(resolve, 5000));
              navigate('/cleaner/cleaning-requests', { 
                state: { propertyId } 
              });
            }
            break;
          }
          case 6: // Guest (Role ID: 6)
            navigate('/guest/list', { 
              state: { propertyId } 
            });
            break;
          case 3: // Client (Role ID: 3) - Redirect to property management
            navigate('/client/smart-checkin-checkout', { 
              state: { propertyId } 
            });
            break;
          case 5: // Supervisor (Role ID: 5) - Redirect to smart access
            navigate('/provider/smart-access', { 
              state: { propertyId } 
            });
            break;
          default:
            // Redirect to guest login if role is not recognized
            navigate(`/guest/login?propertyId=${propertyId}`);
        }
      } else {
        // If user is not authenticated, redirect to guest login
        navigate(`/guest/login?propertyId=${propertyId}`);
      }
    };

    handleRedirect();
  }, [roleId, propertyId, navigate, findCleaningServiceByPropertyId, accessToken, currentUser]);

  // Show loading state while redirecting
  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-gradient-light">
      <div className="text-center">
        {/* Logo */}
        {/* <div className="mb-4">
          <img 
            src="/assets/logo.png" 
            alt="Logo" 
            height="40" 
            className="img-fluid"
          />
        </div> */}

        {/* Status Icon */}
        <div className="mb-4">
          {statusType === 'loading' && (
            <div className="qr-scan-animation d-inline-block p-4 rounded-4 bg-white shadow-lg">
              <svg width="80" height="80" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 3H9V9H3V3Z" stroke="#f7941d" strokeWidth="2" fill="none"/>
                <path d="M15 3H21V9H15V3Z" stroke="#f7941d" strokeWidth="2" fill="none"/>
                <path d="M3 15H9V21H3V15Z" stroke="#f7941d" strokeWidth="2" fill="none"/>
                <path d="M15 12H21M12 15V21" stroke="#f7941d" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
          )}
          {statusType === 'success' && (
            <div className="success-animation d-inline-block p-4 rounded-4 bg-white shadow-lg">
              <svg width="80" height="80" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="10" stroke="#27ae60" strokeWidth="2" fill="none"/>
                <path d="M8 12L11 15L16 9" stroke="#27ae60" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          )}
          {statusType === 'error' && (
            <div className="error-animation d-inline-block p-4 rounded-4 bg-white shadow-lg">
              <svg width="80" height="80" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="10" stroke="#e74c3c" strokeWidth="2" fill="none"/>
                <path d="M8 8L16 16M16 8L8 16" stroke="#e74c3c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          )}
        </div>

        {/* Main Content */}
        <div className="mb-4">
          <h2 className={`dashboard-title mb-2 ${statusType === 'success' ? 'text-success' : statusType === 'error' ? 'text-danger' : ''}`}>
            {statusMessage}
          </h2>
          <p className="dashboard-routes-sub text-muted">{statusSubtitle}</p>
        </div>

        {/* Loading Spinner - Only show for loading state */}
        {statusType === 'loading' && (
          <>
            <div className="d-flex justify-content-center mb-4">
              <div className="spinner-border text-primary" role="status" style={{ width: '3rem', height: '3rem' }}>
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>

            {/* Loader Dots */}
            <div className="d-flex justify-content-center gap-2">
              <div className="loader-dot"></div>
              <div className="loader-dot"></div>
              <div className="loader-dot"></div>
            </div>
          </>
        )}

        {/* Status Badge - Show for success/error */}
        {statusType !== 'loading' && (
          <div className={`mt-4 p-3 rounded-3 ${statusType === 'success' ? 'bg-success bg-opacity-10' : 'bg-danger bg-opacity-10'}`}>
            <p className={`m-0 fw-bold ${statusType === 'success' ? 'text-success' : 'text-danger'}`}>
              {statusType === 'success' ? '✓ Redirecting...' : '✗ Redirecting...'}
            </p>
          </div>
        )}
      </div>

      <style jsx>{`
        .bg-gradient-light {
          background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
          min-height: 100vh;
        }

        .qr-scan-animation {
          animation: pulse-scan 2s ease-in-out infinite;
          transition: all 0.3s ease;
        }

        .success-animation {
          animation: pulse-success 0.6s ease-out;
        }

        .error-animation {
          animation: pulse-error 0.6s ease-out;
        }

        @keyframes pulse-scan {
          0%, 100% {
            box-shadow: 0 0 0 0 rgba(247, 148, 29, 0.7);
            transform: scale(1);
          }
          50% {
            box-shadow: 0 0 0 20px rgba(247, 148, 29, 0);
            transform: scale(1.05);
          }
        }

        @keyframes pulse-success {
          0% {
            box-shadow: 0 0 0 0 rgba(39, 174, 96, 0.7);
            transform: scale(0.8);
          }
          50% {
            box-shadow: 0 0 0 15px rgba(39, 174, 96, 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(39, 174, 96, 0);
            transform: scale(1);
          }
        }

        @keyframes pulse-error {
          0% {
            box-shadow: 0 0 0 0 rgba(231, 76, 60, 0.7);
            transform: scale(0.8);
          }
          50% {
            box-shadow: 0 0 0 15px rgba(231, 76, 60, 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(231, 76, 60, 0);
            transform: scale(1);
          }
        }

        .loader-dot {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background-color: #f7941d;
          animation: bounce 1.4s infinite ease-in-out both;
        }

        .loader-dot:nth-child(1) {
          animation-delay: -0.32s;
        }

        .loader-dot:nth-child(2) {
          animation-delay: -0.16s;
        }

        @keyframes bounce {
          0%, 80%, 100% {
            transform: scale(0);
            opacity: 0.5;
          }
          40% {
            transform: scale(1);
            opacity: 1;
          }
        }

        .dashboard-title {
          font-size: 1.8rem;
          font-weight: 700;
          color: #1a1a1a;
          margin: 0;
        }

        .dashboard-routes-sub {
          font-size: 0.95rem;
          color: #666;
          margin: 0;
        }

        .text-success {
          color: #27ae60 !important;
        }

        .text-danger {
          color: #e74c3c !important;
        }

        .bg-success {
          background-color: #27ae60 !important;
        }

        .bg-danger {
          background-color: #e74c3c !important;
        }

        .bg-opacity-10 {
          opacity: 0.1;
        }
      `}</style>
    </div>
  );
};

export default ScanHandler;
