import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useSearchParams, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload } from '@fortawesome/free-solid-svg-icons';
import { faBookmark as faBookmark } from '@fortawesome/free-regular-svg-icons';
import ThumbUpOffAltOutlinedIcon from '@mui/icons-material/ThumbUpOffAltOutlined';
import ThumbDownOffAltOutlinedIcon from '@mui/icons-material/ThumbDownOffAltOutlined';
import Swal from 'sweetalert2';
import CleanerHeader from './CleanerHeader';
import { getTrainingById } from '../../api/trainingApi';
import { selectAccessToken } from '../../store/authSlice';

const CleanerTrainingDetailsMain = ({ onMobileMenuClick }) => {
  const [trainingDetails, setTrainingDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const [searchParams] = useSearchParams();
  const trainingId = searchParams.get('id');
  const accessToken = useSelector(selectAccessToken);

  // Fetch training details
  useEffect(() => {
    const fetchDetails = async () => {
      if (!trainingId || !accessToken) return;

      try {
        setIsLoading(true);
        const response = await getTrainingById(accessToken, trainingId);

        if (response.status === 1 && response.data && response.data.length > 0) {
          setTrainingDetails(response.data[0]);
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Training details not found',
          });
        }
      } catch (error) {
        console.error('Error fetching training details:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.message || 'Failed to load training details',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchDetails();
  }, [trainingId, accessToken]);

  return (
    <section>
      <CleanerHeader title="Training Details" onMobileMenuClick={onMobileMenuClick} />
      <div className="dashboard-home-content px-3 mt-2">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h6 className="dashboard-routes-sub m-0">Training Details</h6>
          <Link to="/cleaner/training" className="sec-btn rounded-2 px-3 py-2 text-decoration-none">
            Back to Trainings
          </Link>
        </div>

        {isLoading ? (
          <div className="text-center mt-4">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : !trainingDetails ? (
          <div className="text-center mt-4">
            <p className="text-muted">Training details not found</p>
          </div>
        ) : (
          <div className="row g-0 g-lg-2 mt-3">
            <div className="col-12 mb-2">
              <div className="">
                <img
                  src={trainingDetails.image || "/assets/training-card-img.png"}
                  className="training-details-card-img img-fluid w-100 rounded-2"
                  alt="card-img"
                />

                <div className="card-body p-2 d-flex flex-column">
                  {/* icons */}
                  <div className="d-flex justify-content-between align-items-center">
                    <div className="d-flex align-items-center gap-3">
                      <ThumbDownOffAltOutlinedIcon />
                      <ThumbUpOffAltOutlinedIcon />
                    </div>

                    <div className="d-flex align-items-center gap-3">
                      {trainingDetails.url && (
                        <a 
                          href={trainingDetails.url.startsWith('http') ? trainingDetails.url : `https://alrajihy.com/demo/turnivo/uploads/about/${trainingDetails.url}`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-decoration-none text-dark"
                        >
                          <FontAwesomeIcon icon={faDownload} className="fs-5" />
                        </a>
                      )}
                      <FontAwesomeIcon icon={faBookmark} className="fs-5" />
                    </div>
                  </div>

                  <div className="training-card-title mb-2">
                    {trainingDetails.title || 'Training Title'}
                  </div>

                  <div 
                    className="training-details-card-desc mb-2"
                    dangerouslySetInnerHTML={{ __html: trainingDetails.content || '' }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default CleanerTrainingDetailsMain;
