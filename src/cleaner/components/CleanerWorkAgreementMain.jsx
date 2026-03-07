import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectAccessToken } from '../../store/authSlice';
import { getWorkAgreement } from '../../api/termsApi';
import Swal from 'sweetalert2';
import CleanerHeader from './CleanerHeader';

const CleanerWorkAgreementMain = ({ onMobileMenuClick }) => {
  const [agreement, setAgreement] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const accessToken = useSelector(selectAccessToken);

  // Fetch agreement on component mount
  useEffect(() => {
    const fetchAgreement = async () => {
      try {
        setIsLoading(true);
        const response = await getWorkAgreement(accessToken);
        if (response.status === 1 && response.data) {
          setAgreement(response.data[0]);
        }
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.response?.data?.message || 'Failed to load work agreement',
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (accessToken) {
      fetchAgreement();
    }
  }, [accessToken]);



  return (
    <section>
      <CleanerHeader title="Work Agreement" onMobileMenuClick={onMobileMenuClick} />
      <div className="dashboard-home-content px-3 mt-2">
        {isLoading ? (
          <div className="d-flex justify-content-center align-items-center p-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : agreement ? (
          <div className="d-flex flex-column gap-2 align-items-center justify-content-center text-center p-md-5 p-4">
            <h1 className='policy-title m-0'>{agreement.title}</h1>
            <div className="policy-container">
              <div
                className='policy-content'
                dangerouslySetInnerHTML={{ __html: agreement.content || agreement.description }}
              />
            </div>
          </div>
        ) : (
          <div className="text-center mt-5 py-5">
            <div className="mb-3">
              <img src="/assets/scan-barcode.svg" alt="No data" style={{ width: '80px', opacity: 0.3 }} />
            </div>
            <h5 className="text-muted fw-normal">No work agreement available</h5>
          </div>
        )}
      </div>
    </section>
  );
};

export default CleanerWorkAgreementMain;
