import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload, faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { faBookmark as faBookmark } from '@fortawesome/free-regular-svg-icons';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import { Link } from 'react-router-dom';
import ThumbUpOffAltOutlinedIcon from '@mui/icons-material/ThumbUpOffAltOutlined';
import ThumbDownOffAltOutlinedIcon from '@mui/icons-material/ThumbDownOffAltOutlined';
import Swal from 'sweetalert2';
import CleanerHeader from './CleanerHeader';
import { getTrainings } from '../../api/trainingApi';
import { selectAccessToken } from '../../store/authSlice';

const CleanerTrainingMain = ({ onMobileMenuClick }) => {
  const [trainings, setTrainings] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const accessToken = useSelector(selectAccessToken);

  // Fetch trainings
  useEffect(() => {
    const fetchData = async () => {
      if (!accessToken) return;

      try {
        setIsLoading(true);
        const response = await getTrainings(accessToken);

        if (response.status === 1 && response.data && response.data.length > 0) {
          const items = response.data[0]?.items || [];
          const meta = response.data[0]?._meta;
          setTrainings(items);
          if (meta) {
            setTotalPages(meta.NumberOfPage || 1);
          }
        } else {
          setTrainings([]);
          setTotalPages(1);
        }
      } catch (error) {
        console.error('Error fetching trainings:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.message || 'Failed to load trainings',
        });
        setTrainings([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [accessToken]);

  // Search filter
  const filteredTrainings = trainings.filter((item) => {
    if (!searchQuery.trim()) return true;
    const term = searchQuery.toLowerCase();
    const title = (item.title || '').toLowerCase();
    const content = (item.content || '').toLowerCase();
    return title.includes(term) || content.includes(term);
  });

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  // Strip HTML tags for preview
  const stripHtml = (html) => {
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  };

  return (
    <section>
      <CleanerHeader title="Training" onMobileMenuClick={onMobileMenuClick} />
      <div className="dashboard-home-content px-3 mt-2">
        <div className="d-flex justify-content-between align-items-center gap-3 flex-wrap">
          <div className="search-input-wrapper mt-2">
            <SearchOutlinedIcon className="search-icon" />
            <input
              type="text"
              className="search-gray-input form-control"
              placeholder="Find a training..."
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </div>
        </div>

        {isLoading ? (
          <div className="text-center mt-4">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : filteredTrainings.length === 0 ? (
          <div className="text-center mt-4">
            <p className="text-muted">No trainings found</p>
          </div>
        ) : (
          <div className="row g-0 g-lg-2 mt-3">
            {filteredTrainings.map((training) => (
              <div className="col-md-6 mb-2" key={training.id}>
                <Link 
                  to={`/cleaner/training-details?id=${training.id}`} 
                  className="card text-decoration-none rounded-top-4 h-100 training-card"
                >
                  <img
                    src={training.image || "/assets/training-card-img.png"}
                    className="training-card-img img-fluid w-100 rounded-top-4"
                    alt="card-img"
                  />

                  <div className="card-body p-2 d-flex flex-column">
                    <div className="training-card-title mb-2">
                      {training.title || 'Training Title'}
                    </div>

                    <div className="training-card-desc mb-2">
                      {stripHtml(training.content || '').substring(0, 150)}
                      {(training.content || '').length > 150 ? '...' : ''}
                    </div>

                    {/* icons */}
                    <div className="card-actions d-flex justify-content-between align-items-center">
                      <div className="d-flex align-items-center gap-3">
                        <ThumbDownOffAltOutlinedIcon />
                        <ThumbUpOffAltOutlinedIcon />
                      </div>

                      <div className="d-flex align-items-center gap-3">
                        <FontAwesomeIcon icon={faDownload} className="fs-5" />
                        <FontAwesomeIcon icon={faBookmark} className="fs-5" />
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="d-flex justify-content-center align-items-center gap-3 mt-4">
            <button 
              className="pagination-btn" 
              onClick={handlePrevPage}
              disabled={currentPage === 1}
            >
              <FontAwesomeIcon icon={faChevronLeft} />
            </button>
            <span className="pagination-info">
              Page {currentPage} of {totalPages}
            </span>
            <button 
              className="pagination-btn" 
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
            >
              <FontAwesomeIcon icon={faChevronRight} />
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default CleanerTrainingMain;