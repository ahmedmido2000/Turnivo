import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectAccessToken } from '../../store/authSlice';
import { getTerms } from '../../api/termsApi';
import Swal from 'sweetalert2';
import CleanerHeader from './CleanerHeader';

const CleanerWorkAgreementMain = ({ onMobileMenuClick }) => {
  const [terms, setTerms] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const accessToken = useSelector(selectAccessToken);

  // Fetch terms on component mount
  useEffect(() => {
    const fetchTerms = async () => {
      try {
        setIsLoading(true);
        const response = await getTerms(accessToken);
        if (response.status === 1 && response.data) {
          setTerms(response.data[0]);
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
      fetchTerms();
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
        ) : terms ? (
          <div className="d-flex flex-column gap-2 align-items-center justify-content-center text-center p-md-5 p-4">
            <h1 className='policy-title m-0'>{terms.title}</h1>
            <div className="policy-container">
              <div
                className='policy-content'
                dangerouslySetInnerHTML={{ __html: terms.content }}
              />
            </div>
          </div>
        ) : (
          <div className="d-flex justify-content-center align-items-center p-5">
            <p>No data available</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default CleanerWorkAgreementMain;
